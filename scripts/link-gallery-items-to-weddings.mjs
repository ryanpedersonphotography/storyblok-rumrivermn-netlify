#!/usr/bin/env node

/**
 * Auto-link Gallery Items to Wedding Stories
 *
 * Finds matching real_wedding stories for each gallery_item in
 * Real Love Stories section and links them automatically.
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

// Normalize name for matching
function normalizeName(name) {
  return name
    .toLowerCase()
    .replace(/[&]/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

// Find matching wedding story by name
function findMatchingWedding(galleryItemName, weddingStories) {
  const normalizedGalleryName = normalizeName(galleryItemName)

  // Try exact slug match first
  let match = weddingStories.find(w => w.slug === normalizedGalleryName)
  if (match) return match

  // Try name match
  match = weddingStories.find(w =>
    normalizeName(w.name) === normalizedGalleryName
  )
  if (match) return match

  // Try partial match (for cases like "Emily & Barron Nixon" vs "Emily & Barron")
  match = weddingStories.find(w => {
    const normalizedWeddingName = normalizeName(w.name)
    return normalizedGalleryName.includes(normalizedWeddingName) ||
           normalizedWeddingName.includes(normalizedGalleryName)
  })
  if (match) return match

  return null
}

async function linkGalleryItems() {
  console.log('🔍 Fetching all real_wedding stories...')

  // 1. Fetch all real_wedding stories
  const allStoriesResponse = await storyblokRequest('GET', '/stories?per_page=100')
  const weddingStories = allStoriesResponse.stories.filter(s =>
    s.full_slug && s.full_slug.startsWith('real-weddings/')
  )

  console.log(`✅ Found ${weddingStories.length} wedding stories\n`)

  // 2. Fetch homepage
  console.log('🏠 Fetching homepage...')
  const storiesResponse = await storyblokRequest('GET', '/stories?starts_with=&per_page=100')
  const homepage = storiesResponse.stories.find(s => s.is_startpage || s.slug === 'home')

  if (!homepage) {
    console.error('❌ Homepage not found!')
    return false
  }

  console.log(`✅ Found homepage (ID: ${homepage.id})\n`)

  // 3. Get full homepage story
  const fullStoryResponse = await storyblokRequest('GET', `/stories/${homepage.id}`)
  const homepageStory = fullStoryResponse.story

  // 4. Find love_stories_gallery block
  const loveStoriesBlock = homepageStory.content.body?.find(
    b => b.component === 'love_stories_gallery'
  )

  if (!loveStoriesBlock) {
    console.error('❌ love_stories_gallery block not found!')
    return false
  }

  console.log(`✅ Found love_stories_gallery with ${loveStoriesBlock.galleries?.length || 0} items\n`)
  console.log('🔗 Linking gallery items to wedding stories...\n')

  // 5. Link each gallery item to matching wedding
  let linkedCount = 0
  const updatedGalleries = (loveStoriesBlock.galleries || []).map((gallery, index) => {
    const galleryName = gallery.couple_names

    // Find matching wedding
    const matchingWedding = findMatchingWedding(galleryName, weddingStories)

    if (matchingWedding) {
      console.log(`${index + 1}. "${galleryName}"`)
      console.log(`   ✅ Matched to: "${matchingWedding.name}" (${matchingWedding.slug})`)
      console.log(`   UUID: ${matchingWedding.uuid}`)
      console.log('')

      linkedCount++

      return {
        ...gallery,
        wedding_story: matchingWedding.uuid
      }
    } else {
      console.log(`${index + 1}. "${galleryName}"`)
      console.log(`   ⚠️  No matching wedding story found`)
      console.log('')

      return gallery
    }
  })

  // 6. Update homepage with linked galleries
  console.log(`\n💾 Updating homepage with ${linkedCount} linked galleries...`)

  const updatedContent = {
    ...homepageStory.content,
    body: homepageStory.content.body.map(block => {
      if (block.component === 'love_stories_gallery') {
        return {
          ...block,
          galleries: updatedGalleries
        }
      }
      return block
    })
  }

  await storyblokRequest('PUT', `/stories/${homepage.id}`, {
    story: {
      content: updatedContent
    },
    publish: 1
  })

  console.log('✅ Homepage updated and published!')

  return { linkedCount, totalCount: loveStoriesBlock.galleries?.length || 0 }
}

async function main() {
  console.log('🚀 Auto-linking Gallery Items to Wedding Stories\n')
  console.log('=' .repeat(80) + '\n')

  try {
    const result = await linkGalleryItems()

    if (!result) {
      console.log('\n❌ Linking failed')
      return
    }

    console.log('\n' + '=' .repeat(80))
    console.log('✨ Linking Complete!\n')
    console.log(`📊 Summary:`)
    console.log(`   - Gallery items linked: ${result.linkedCount}/${result.totalCount}`)
    console.log(`   - Items without match: ${result.totalCount - result.linkedCount}`)

    if (result.linkedCount > 0) {
      console.log('\n💡 Next Steps:')
      console.log('   1. Wait 1-2 minutes for Storyblok CDN cache to clear')
      console.log('   2. Refresh https://localhost:9999')
      console.log('   3. Click wedding cards in "Real Love Stories" section')
      console.log('   4. Modal should open with photos from the linked wedding')
      console.log('\n🔍 Debugging:')
      console.log('   - Check browser console for [LoveStoriesGalleryEditor] logs')
      console.log('   - If modal doesn\'t open, check that wedding has gallery_photos')
    }

    console.log('=' .repeat(80))
  } catch (error) {
    console.error('\n💥 Script failed:', error)
    process.exit(1)
  }
}

main()
