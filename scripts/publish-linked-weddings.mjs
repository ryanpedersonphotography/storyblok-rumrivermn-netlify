#!/usr/bin/env node

/**
 * Publish Linked Wedding Stories
 *
 * Publishes the 6 wedding stories that are linked from Real Love Stories gallery items
 * so they're available via the CDN API.
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

// Wedding UUIDs from the linking script
const WEDDING_UUIDS = [
  { uuid: '7b3f869a-328c-4506-a183-83a5fd94dbad', name: 'Anthony & Linnea' },
  { uuid: '040bdac5-9a54-44d5-9fa6-2f6582016fd6', name: 'Loria & Jason Rolstad' },
  { uuid: '54ea4602-bbed-4e75-8045-9d03532d5ccd', name: 'Mattea Courtney' },
  { uuid: '015c7247-8366-4904-9f56-9affd31d6351', name: 'Kyle Carrie' },
  { uuid: '22818b83-5dea-4799-a7b6-a4f314b692d6', name: 'Emily & Barron Nixon' },
  { uuid: '60743bdb-ec71-4c51-94fd-05aa249e08f9', name: 'Joshua & Teri' }
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
  console.log(`\n📝 Publishing "${name}"...`)
  console.log(`   UUID: ${uuid}`)

  try {
    // Get story by UUID
    const listResponse = await storyblokRequest('GET', `/stories?find_by=uuid&by_uuids=${uuid}`)

    if (!listResponse.stories || listResponse.stories.length === 0) {
      console.error(`❌ Story not found: ${name}`)
      return { success: false, reason: 'not_found' }
    }

    const storyId = listResponse.stories[0].id
    console.log(`   Story ID: ${storyId}`)

    // Fetch full story
    const fullStoryResponse = await storyblokRequest('GET', `/stories/${storyId}`)
    const story = fullStoryResponse.story

    console.log(`   Slug: ${story.slug}`)
    console.log(`   Has Content: ${!!story.content}`)
    console.log(`   Component: ${story.content?.component || 'N/A'}`)

    // Check if it has gallery_photos
    const photoCount = story.content?.gallery_photos?.length || 0
    console.log(`   Gallery Photos: ${photoCount}`)

    if (photoCount === 0) {
      console.warn(`   ⚠️  No gallery_photos - modal won't work for this wedding`)
    }

    // Add missing required fields if needed
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

    console.log(`   ✅ Published successfully`)
    return { success: true, photoCount }
  } catch (error) {
    console.error(`   ❌ Error: ${error.message}`)
    return { success: false, reason: error.message }
  }
}

async function main() {
  console.log('🚀 Publishing Linked Wedding Stories\n')
  console.log('=' .repeat(80))

  const results = []

  for (const wedding of WEDDING_UUIDS) {
    const result = await publishWedding(wedding.uuid, wedding.name)
    results.push({ ...wedding, ...result })

    // Small delay between requests
    await new Promise(resolve => setTimeout(resolve, 500))
  }

  console.log('\n' + '=' .repeat(80))
  console.log('✨ Publishing Complete!\n')

  const published = results.filter(r => r.success)
  const failed = results.filter(r => !r.success)
  const withPhotos = published.filter(r => r.photoCount > 0)
  const withoutPhotos = published.filter(r => r.photoCount === 0)

  console.log('📊 Summary:')
  console.log(`   - Successfully published: ${published.length}/${WEDDING_UUIDS.length}`)
  console.log(`   - Failed: ${failed.length}`)
  console.log(`   - With gallery photos: ${withPhotos.length}`)
  console.log(`   - Without gallery photos: ${withoutPhotos.length}`)

  if (withoutPhotos.length > 0) {
    console.log('\n⚠️  Weddings without gallery_photos (modal won\'t open):')
    withoutPhotos.forEach(w => console.log(`   - ${w.name}`))
  }

  if (failed.length > 0) {
    console.log('\n❌ Failed to publish:')
    failed.forEach(w => console.log(`   - ${w.name}: ${w.reason}`))
  }

  console.log('\n💡 Next Steps:')
  console.log('   1. Wait 1-2 minutes for Storyblok CDN cache to clear')
  console.log('   2. Refresh https://localhost:9999')
  console.log('   3. Real Love Stories gallery should now show cards')
  console.log('   4. Click cards with photos → Modal should open')
  console.log('   5. Cards without photos → Card shows but modal won\'t open')

  console.log('=' .repeat(80))
}

main().catch(error => {
  console.error('\n💥 Script failed:', error)
  process.exit(1)
})
