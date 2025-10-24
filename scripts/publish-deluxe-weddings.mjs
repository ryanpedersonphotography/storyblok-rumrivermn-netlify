#!/usr/bin/env node

/**
 * Publish Deluxe Wedding Stories
 *
 * The seed script created weddings but didn't publish them.
 * This script publishes them so they're available via the CDN API.
 */

import https from 'https'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Load environment variables
const envPath = path.join(__dirname, '..', '.env.local')
const envContent = fs.readFileSync(envPath, 'utf-8')
const envVars = {}
envContent.split('\n').forEach(line => {
  const match = line.match(/^([^#=]+)=(.*)$/)
  if (match) {
    envVars[match[1].trim()] = match[2].trim()
  }
})

const SPACE_ID = envVars.SPACE_ID
const MANAGEMENT_TOKEN = envVars.STORYBLOK_PERSONAL_ACCESS_TOKEN

// Deluxe wedding UUIDs from seed script
const DELUXE_WEDDING_UUIDS = [
  '3b753b9d-fc6f-4a35-943e-a3dd92af1362', // Emily & Barron
  '1e90cd07-3aa1-4171-b34e-7240358c5cab', // Anthony & Linnea
  '130e7770-6f64-4603-b499-4e945dfe3c65'  // Joshua & Teri
]

// Helper to make Storyblok API requests
function storyblokRequest(method, endpoint, data = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'mapi.storyblok.com',
      path: `/v1/spaces/${SPACE_ID}${endpoint}`,
      method: method,
      headers: {
        'Authorization': MANAGEMENT_TOKEN,
        'Content-Type': 'application/json'
      }
    }

    const req = https.request(options, (res) => {
      let body = ''
      res.on('data', chunk => body += chunk)
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          try {
            resolve(JSON.parse(body))
          } catch (e) {
            resolve(body)
          }
        } else {
          reject(new Error(`API Error ${res.statusCode}: ${body}`))
        }
      })
    })

    req.on('error', reject)
    if (data) {
      req.write(JSON.stringify(data))
    }
    req.end()
  })
}

async function publishWedding(uuid, name) {
  console.log(`\n📝 Publishing ${name}...`)

  try {
    // First get the story to find its ID
    const listResponse = await storyblokRequest('GET', `/stories?find_by=uuid&by_uuids=${uuid}`)

    if (!listResponse.stories || listResponse.stories.length === 0) {
      console.error(`❌ Story not found: ${name}`)
      return false
    }

    const storyId = listResponse.stories[0].id
    console.log(`✅ Found story (ID: ${storyId})`)

    // Fetch the full story with all fields
    const fullStoryResponse = await storyblokRequest('GET', `/stories/${storyId}`)
    const story = fullStoryResponse.story

    console.log(`   Slug: ${story.slug}`)
    console.log(`   Full Slug: ${story.full_slug}`)

    // Add missing required fields to content
    const updatedContent = {
      ...story.content,
      slug: story.content.slug || story.slug,
      hero_image: story.content.hero_image || story.content.gallery_photos?.[0] || '',
      cover_image: story.content.cover_image || story.content.gallery_photos?.[0] || ''
    }

    // Publish the story
    await storyblokRequest('PUT', `/stories/${storyId}`, {
      story: {
        name: story.name,
        slug: story.slug,
        content: updatedContent,
        parent_id: story.parent_id || 0
      },
      publish: 1
    })

    console.log(`✅ Published: ${name}`)
    return true
  } catch (error) {
    console.error(`❌ Error publishing ${name}:`, error.message)
    return false
  }
}

async function main() {
  console.log('🚀 Publishing Deluxe Wedding Stories\n')
  console.log('=' .repeat(80))

  const names = ['Emily & Barron', 'Anthony & Linnea', 'Joshua & Teri']

  let publishedCount = 0
  for (let i = 0; i < DELUXE_WEDDING_UUIDS.length; i++) {
    const success = await publishWedding(DELUXE_WEDDING_UUIDS[i], names[i])
    if (success) publishedCount++

    // Small delay between requests
    await new Promise(resolve => setTimeout(resolve, 500))
  }

  console.log('\n' + '=' .repeat(80))
  console.log(`✨ Published ${publishedCount}/${DELUXE_WEDDING_UUIDS.length} stories`)
  console.log('\n💡 Next Steps:')
  console.log('   1. Refresh your localhost')
  console.log('   2. Love Letters section should now show the 3 deluxe weddings')
  console.log('   3. Clicking cards should open modal galleries')
  console.log('=' .repeat(80))
}

main().catch(error => {
  console.error('\n💥 Script failed:', error)
  process.exit(1)
})
