#!/usr/bin/env node

/**
 * Bulk upload images to Storyblok (2025 best practice) - FOR FUTURE REFERENCE
 * Requirements: Node 18+ (or 20+), bash/zsh, npm.
 * 
 * This script is provided for future use and follows 2025 best practices:
 * - Uses Management API "signed upload → S3 multipart POST → finish_upload" flow
 * - Throttles to plan's rate limits with exponential backoff
 * - Sets metadata (alt/title/tags/privacy) right after each upload
 * - Mirrors local folder structure to Storyblok Asset Folders
 * 
 * Usage:
 *   export STORYBLOK_PAT="YOUR_PERSONAL_ACCESS_TOKEN"
 *   export STORYBLOK_SPACE_ID="123456"
 *   node bulk-upload-storyblok-assets.mjs /absolute/path/to/images \
 *     --concurrency=3 --private=false --tags="weddings,hero" \
 *     --defaultAlt="Photo" --rootAssetFolder="Uploads 2025"
 */

import fs from 'fs'
import path from 'path'
import axios from 'axios'
import FormData from 'form-data'
import { glob } from 'glob'
import mime from 'mime-types'
import pLimit from 'p-limit'

const SPACE_ID = process.env.STORYBLOK_SPACE_ID
const PAT = process.env.STORYBLOK_PAT || process.env.STORYBLOK_PERSONAL_ACCESS_TOKEN
if (!SPACE_ID || !PAT) {
  console.error('Missing STORYBLOK_SPACE_ID or STORYBLOK_PAT in env.')
  process.exit(1)
}

const args = process.argv.slice(2)
if (!args[0]) {
  console.error('Pass a source directory as the first argument.')
  process.exit(1)
}

const SRC_DIR = path.resolve(args[0])
const opt = parseOpts(args.slice(1))
const {
  concurrency = 3,
  private: makePrivate = false,
  tags = '',
  defaultAlt = '',
  rootAssetFolder = '',
  dryRun = false,
} = opt

const TAGS = tags
  ? tags.split(',').map(s => s.trim()).filter(Boolean)
  : []

const SB = axios.create({
  baseURL: 'https://mapi.storyblok.com/v1',
  headers: { Authorization: PAT, 'Content-Type': 'application/json' },
  timeout: 60_000,
})

// Simple exponential backoff for 429/5xx
async function withRetry(fn, { tries = 5, label = 'req' } = {}) {
  let attempt = 0, delay = 500
  while (true) {
    try {
      return await fn()
    } catch (err) {
      const status = err?.response?.status
      const retriable = status === 429 || (status >= 500 && status < 600)
      attempt++
      if (!retriable || attempt >= tries) {
        throw err
      }
      await sleep(delay)
      delay = Math.min(delay * 2, 8000)
    }
  }
}

function sleep(ms){ return new Promise(r => setTimeout(r, ms)) }

function parseOpts(kvs) {
  const o = {}
  for (const kv of kvs) {
    const m = kv.match(/^--([^=]+)=(.*)$/)
    if (m) {
      const k = m[1]
      let v = m[2]
      if (v === 'true') v = true
      if (v === 'false') v = false
      if (/^\d+$/.test(v)) v = Number(v)
      o[k] = v
    } else if (kv === '--dry-run') {
      o.dryRun = true
    }
  }
  return o
}

// --- Asset Folders helpers ---------------------------------------------------
async function ensureRootFolderId(name) {
  if (!name) return null
  const existing = await withRetry(() =>
    SB.get(`/spaces/${SPACE_ID}/asset_folders`)
  )
  const found = existing.data.asset_folders?.find(f => f.name === name)
  if (found) return found.id
  if (dryRun) {
    console.log(`[dry-run] Would create asset folder: ${name}`)
    return null
  }
  const res = await withRetry(() =>
    SB.post(`/spaces/${SPACE_ID}/asset_folders`, {
      asset_folder: { name }
    })
  )
  return res.data.asset_folder.id
}

const folderCache = new Map() // key: "ParentID|name" => id

async function ensureNestedFolderId(parts, rootId) {
  let parentId = rootId ?? null
  for (const segment of parts) {
    const key = `${parentId ?? 'root'}|${segment}`
    if (folderCache.has(key)) {
      parentId = folderCache.get(key)
      continue
    }
    // fetch children each loop to avoid race if others created it
    const list = await withRetry(() =>
      SB.get(`/spaces/${SPACE_ID}/asset_folders`)
    )
    const match = list.data.asset_folders?.find(f => f.name === segment && f.parent_id === parentId)
    if (match) {
      folderCache.set(key, match.id)
      parentId = match.id
      continue
    }
    if (dryRun) {
      console.log(`[dry-run] Would create nested folder "${segment}" under ${parentId ?? 'root'}`)
      parentId = null // unknown id in dry-run chain
      continue
    }
    const res = await withRetry(() =>
      SB.post(`/spaces/${SPACE_ID}/asset_folders`, {
        asset_folder: { name: segment, parent_id: parentId }
      })
    )
    const id = res.data.asset_folder.id
    folderCache.set(key, id)
    parentId = id
  }
  return parentId
}

// --- Upload flow: sign -> S3 POST -> finish_upload -> update metadata --------
async function signAsset(filename, asset_folder_id = null) {
  const payload = { filename }
  if (asset_folder_id != null) payload.asset_folder_id = asset_folder_id
  const { data } = await withRetry(() =>
    SB.post(`/spaces/${SPACE_ID}/assets`, payload)
  )
  // Expect data = { id, post_url, fields: { key, policy, ... } }
  return data
}

async function uploadToS3(signed, filepath) {
  const form = new FormData()
  for (const [k, v] of Object.entries(signed.fields || {})) {
    form.append(k, v)
  }
  const fileStream = fs.createReadStream(filepath)
  form.append('file', fileStream, path.basename(filepath))

  await withRetry(() =>
    axios.post(signed.post_url, form, {
      headers: form.getHeaders(),
      maxContentLength: Infinity,
      maxBodyLength: Infinity,
      timeout: 300_000,
      validateStatus: (s) => s >= 200 && s < 400, // S3 can return 204/201
    })
  )
}

async function finishUpload(assetId) {
  // Validates the upload and creates the final asset record
  const { data } = await withRetry(() =>
    SB.post(`/spaces/${SPACE_ID}/assets/${assetId}/finish_upload`)
  )
  return data
}

async function updateMetadata(assetId, { alt, title, is_private, tags }) {
  const body = { asset: {} }
  if (typeof alt === 'string' && alt) body.asset.alt = alt
  if (typeof title === 'string' && title) body.asset.title = title
  if (typeof is_private === 'boolean') body.asset.is_private = is_private ? 1 : 0
  if (tags && tags.length) body.asset.tags = tags

  if (Object.keys(body.asset).length === 0) return
  await withRetry(() =>
    SB.put(`/spaces/${SPACE_ID}/assets/${assetId}`, body)
  )
}

function altFromFilename(fp, fallback = '') {
  const base = path.basename(fp, path.extname(fp))
  return (base.replace(/[_-]+/g, ' ').trim() || fallback).slice(0, 140)
}

function titleFromFilename(fp) {
  return path.basename(fp)
}

// --- Main --------------------------------------------------------------------
console.log('🚀 Storyblok Bulk Asset Upload (2025 Best Practice)')
console.log('📁 Source directory:', SRC_DIR)
console.log('🎯 Target space:', SPACE_ID)
console.log('⚡ Concurrency:', concurrency)
console.log()

const allFiles = await glob('**/*.{jpg,jpeg,png,webp,heic,heif,gif,svg,mp4,mov,pdf}', {
  cwd: SRC_DIR,
  dot: false,
  nodir: true,
  absolute: true,
})

if (!allFiles.length) {
  console.log('No matching files found.')
  process.exit(0)
}

const rootId = await ensureRootFolderId(rootAssetFolder)
const limit = pLimit(Number(concurrency))

let ok = 0, fail = 0
console.log(`Uploading ${allFiles.length} files with concurrency=${concurrency} ...`)

await Promise.all(allFiles.map(fp => limit(async () => {
  const rel = path.relative(SRC_DIR, fp)
  const subDirs = path.dirname(rel) === '.' ? [] : path.dirname(rel).split(path.sep)
  let folderId = null
  if (rootId || subDirs.length) {
    folderId = await ensureNestedFolderId(
      rootId ? [/* root created above */].concat(subDirs) : subDirs,
      rootId ?? null
    )
  }

  const filename = path.basename(fp)
  try {
    if (dryRun) {
      console.log(`[dry-run] Would sign & upload: ${rel} -> folderId=${folderId ?? 'root'}`)
      ok++
      return
    }
    const signed = await signAsset(filename, folderId ?? undefined)
    await uploadToS3(signed, fp)
    await finishUpload(signed.id)
    await updateMetadata(signed.id, {
      alt: altFromFilename(fp, defaultAlt),
      title: titleFromFilename(fp),
      is_private: !!makePrivate,
      tags: TAGS,
    })
    ok++
    console.log(`✔ ${rel}`)
  } catch (e) {
    fail++
    const status = e?.response?.status
    const msg = e?.response?.data || e.message
    console.error(`✖ ${rel} [${status ?? 'ERR'}]`, msg)
  }
})))

console.log(`Done. Success: ${ok}, Failed: ${fail}`)
if (fail > 0) process.exit(1)