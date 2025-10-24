#!/usr/bin/env node

/**
 * Seed Deluxe Weddings Script
 *
 * Creates 3 placeholder deluxe wedding stories in Storyblok with:
 * - Generated couple names, dates, and locations
 * - Photos from existing real-weddings directories
 * - is_deluxe flag set to true
 * - Optional testimonial text
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

if (!SPACE_ID || !MANAGEMENT_TOKEN) {
  console.error('❌ Missing SPACE_ID or STORYBLOK_PERSONAL_ACCESS_TOKEN in .env.local')
  process.exit(1)
}

console.log(`✅ Using Space ID: ${SPACE_ID}`)

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

// Check if is_deluxe field exists in real_wedding component
async function checkAndAddDeluxeField() {
  console.log('\n🔍 Checking real_wedding component schema...')

  try {
    const response = await storyblokRequest('GET', '/components')
    const realWeddingComponent = response.components.find(c => c.name === 'real_wedding')

    if (!realWeddingComponent) {
      console.error('❌ real_wedding component not found!')
      return false
    }

    const hasDeluxeField = realWeddingComponent.schema?.is_deluxe

    if (hasDeluxeField) {
      console.log('✅ is_deluxe field already exists')
      return true
    }

    console.log('➕ Adding is_deluxe field to real_wedding schema...')

    const updatedSchema = {
      ...realWeddingComponent.schema,
      is_deluxe: {
        type: 'boolean',
        display_name: 'Is Deluxe Wedding',
        description: 'Mark as true for weddings with enhanced content (videos, testimonials, etc.)',
        default_value: false
      }
    }

    await storyblokRequest('PUT', `/components/${realWeddingComponent.id}`, {
      component: {
        ...realWeddingComponent,
        schema: updatedSchema
      }
    })

    console.log('✅ Successfully added is_deluxe field')
    return true
  } catch (error) {
    console.error('❌ Error updating schema:', error.message)
    return false
  }
}

// Get existing photos from real-weddings directory
function getWeddingPhotos(weddingFolder) {
  const photosPath = path.join(__dirname, '..', 'public', 'images', 'real-weddings', weddingFolder, 'photos')

  if (!fs.existsSync(photosPath)) {
    console.warn(`⚠️  Photos directory not found: ${photosPath}`)
    return []
  }

  const files = fs.readdirSync(photosPath)
    .filter(f => /\.(jpg|jpeg|png)$/i.test(f))
    .slice(0, 12) // Take first 12 photos

  return files.map(filename => ({
    filename: `/images/real-weddings/${weddingFolder}/photos/${filename}`,
    alt: `Wedding photo from ${weddingFolder.replace(/-/g, ' ')}`
  }))
}

// Placeholder weddings data
const placeholderWeddings = [
  {
    folder: 'emily-and-barron-nixon',
    title: 'Emily & Barron',
    wedding_date: 'June 15, 2024',
    location: 'Rum River Barn',
    intro: {
      type: 'doc',
      content: [{
        type: 'paragraph',
        content: [{
          type: 'text',
          text: 'Emily and Barron\'s summer wedding at Rum River Barn was a beautiful celebration of love and joy. The rustic elegance of the barn provided the perfect backdrop for their special day, with golden hour light streaming through the windows as they exchanged vows surrounded by family and friends.'
        }]
      }]
    },
    testimonial_text: 'Rum River Barn exceeded all our expectations! The venue was absolutely stunning, and the staff made our wedding day seamless and magical. We couldn\'t have asked for a more perfect setting to celebrate our love story. - Emily & Barron'
  },
  {
    folder: 'anthony-and-linnea',
    title: 'Anthony & Linnea',
    wedding_date: 'September 22, 2024',
    location: 'Rum River Barn',
    intro: {
      type: 'doc',
      content: [{
        type: 'paragraph',
        content: [{
          type: 'text',
          text: 'Anthony and Linnea\'s fall wedding was a romantic celebration filled with warm autumn colors and heartfelt moments. The natural beauty of Rum River Barn in September created a stunning atmosphere for their vows, with vibrant foliage and crisp air adding to the magic of their special day.'
        }]
      }]
    },
    testimonial_text: 'From the first tour to the last dance, Rum River Barn was everything we dreamed of and more. The rustic charm combined with modern amenities made it perfect for our guests. Our wedding day was truly unforgettable! - Anthony & Linnea'
  },
  {
    folder: 'joshua-and-teri',
    title: 'Joshua & Teri',
    wedding_date: 'May 8, 2024',
    location: 'Rum River Barn',
    intro: {
      type: 'doc',
      content: [{
        type: 'paragraph',
        content: [{
          type: 'text',
          text: 'Joshua and Teri\'s spring wedding at Rum River Barn was a joyful celebration of new beginnings. The fresh blooms and gentle spring breeze created a romantic ambiance as they promised forever to each other. Their day was filled with laughter, happy tears, and unforgettable moments shared with loved ones.'
        }]
      }]
    },
    testimonial_text: 'We fell in love with Rum River Barn the moment we saw it, and it was the perfect choice for our wedding. The team went above and beyond to make sure every detail was perfect. Our guests are still raving about what an amazing venue it was! - Joshua & Teri'
  }
]

// Create a wedding story
async function createWeddingStory(weddingData) {
  console.log(`\n📝 Creating wedding story: ${weddingData.title}...`)

  const photos = getWeddingPhotos(weddingData.folder)

  if (photos.length === 0) {
    console.warn(`⚠️  No photos found for ${weddingData.folder}, using placeholder`)
  }

  const storyData = {
    story: {
      name: weddingData.title,
      slug: weddingData.folder,
      content: {
        component: 'real_wedding',
        title: weddingData.title,
        wedding_date: weddingData.wedding_date,
        location: weddingData.location,
        intro: weddingData.intro,
        gallery_photos: photos,
        is_deluxe: true,
        testimonial_text: weddingData.testimonial_text,
        hero_image_index: 0
      },
      parent_id: 0, // Root level
      is_startpage: false
    }
  }

  try {
    const response = await storyblokRequest('POST', '/stories', storyData)
    console.log(`✅ Created: ${weddingData.title} (ID: ${response.story.id})`)
    return response.story
  } catch (error) {
    // Check if story already exists
    if (error.message.includes('has already been taken')) {
      console.log(`ℹ️  Story already exists: ${weddingData.title}`)

      // Try to get and update existing story
      try {
        const existingStory = await storyblokRequest('GET', `/stories?with_slug=${weddingData.folder}`)
        if (existingStory.stories && existingStory.stories.length > 0) {
          const storyId = existingStory.stories[0].id
          console.log(`🔄 Updating existing story (ID: ${storyId})...`)

          const updateResponse = await storyblokRequest('PUT', `/stories/${storyId}`, {
            story: {
              content: storyData.story.content
            }
          })

          console.log(`✅ Updated: ${weddingData.title}`)
          return updateResponse.story
        }
      } catch (updateError) {
        console.error(`❌ Error updating story: ${updateError.message}`)
      }
    } else {
      console.error(`❌ Error creating story: ${error.message}`)
    }
    return null
  }
}

// Main execution
async function main() {
  console.log('🚀 Starting Deluxe Weddings Seeding Script\n')
  console.log('=' .repeat(60))

  // Step 1: Check and add is_deluxe field
  const schemaReady = await checkAndAddDeluxeField()
  if (!schemaReady) {
    console.error('\n❌ Failed to prepare schema. Exiting.')
    process.exit(1)
  }

  // Step 2: Create wedding stories
  console.log('\n📚 Creating wedding stories...')
  console.log('=' .repeat(60))

  const createdStories = []
  for (const wedding of placeholderWeddings) {
    const story = await createWeddingStory(wedding)
    if (story) {
      createdStories.push(story)
    }
    // Small delay between requests to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 500))
  }

  // Summary
  console.log('\n' + '=' .repeat(60))
  console.log('✨ Seeding Complete!\n')
  console.log(`📊 Summary:`)
  console.log(`   - Stories created/updated: ${createdStories.length}`)
  console.log(`   - Stories with photos: ${createdStories.filter(s => s.content.gallery_photos?.length > 0).length}`)

  if (createdStories.length > 0) {
    console.log('\n📋 Created Stories:')
    createdStories.forEach(story => {
      console.log(`   - ${story.name} (${story.content.gallery_photos?.length || 0} photos)`)
      console.log(`     UUID: ${story.uuid}`)
    })

    console.log('\n💡 Next Steps:')
    console.log('   1. Go to Storyblok Visual Editor')
    console.log('   2. Edit the "Love Letters" (Testimonials) section')
    console.log('   3. Add these wedding UUIDs to the deluxe_weddings field:')
    createdStories.forEach(story => {
      console.log(`      - ${story.uuid}`)
    })
    console.log('   4. Test the modal galleries on both sections')
  }

  console.log('\n' + '=' .repeat(60))
}

main().catch(error => {
  console.error('\n💥 Script failed:', error)
  process.exit(1)
})
