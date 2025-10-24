#!/usr/bin/env node

/**
 * Add wedding_story link and override fields to gallery_item component
 *
 * This allows Real Love Stories gallery cards to:
 * 1. Link to real_wedding blog posts
 * 2. Pull photos from linked weddings for modal gallery
 * 3. Override display fields for card/modal customization
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

async function addFieldsToGalleryItem() {
  console.log('🔍 Fetching gallery_item component...')

  try {
    const response = await storyblokRequest('GET', '/components')
    const galleryItemComponent = response.components.find(c => c.name === 'gallery_item')

    if (!galleryItemComponent) {
      console.error('❌ gallery_item component not found!')
      return false
    }

    console.log(`✅ Found gallery_item component (ID: ${galleryItemComponent.id})`)
    console.log('\n📋 Current Schema Fields:')
    Object.keys(galleryItemComponent.schema || {}).forEach(fieldName => {
      const field = galleryItemComponent.schema[fieldName]
      console.log(`   - ${fieldName}: ${field.type}${field.required ? ' (Required)' : ''}`)
    })

    // Check if wedding_story field already exists
    if (galleryItemComponent.schema?.wedding_story) {
      console.log('\n✅ wedding_story field already exists')
      console.log('ℹ️  Checking if override fields exist...')

      const hasAllFields = [
        'wedding_story',
        'card_cover_image',
        'card_title',
        'card_subtitle',
        'card_location',
        'modal_hero_image',
        'modal_title',
        'modal_date',
        'modal_location'
      ].every(field => galleryItemComponent.schema[field])

      if (hasAllFields) {
        console.log('✅ All fields already exist. No changes needed.')
        return true
      } else {
        console.log('➕ Adding missing override fields...')
      }
    } else {
      console.log('\n➕ Adding wedding_story and override fields to gallery_item schema...')
    }

    const updatedSchema = {
      ...galleryItemComponent.schema,
      // Link to real_wedding story (REQUIRED)
      wedding_story: {
        type: 'option',
        display_name: 'Wedding Story',
        description: 'Link to the real_wedding blog post to pull photos and data from',
        use_uuid: true,
        source: 'internal_stories',
        filter_content_type: ['real_wedding'],
        required: false // Start as optional for backward compatibility
      },
      // Card display overrides (optional)
      card_cover_image: {
        type: 'asset',
        display_name: 'Card Cover Image (Override)',
        description: 'Custom cover image for the card (different aspect ratio than modal hero). If not set, pulls from linked wedding.',
        filetypes: ['images']
      },
      card_title: {
        type: 'text',
        display_name: 'Card Title (Override)',
        description: 'Override the couple names on the card. If not set, pulls from linked wedding.'
      },
      card_subtitle: {
        type: 'text',
        display_name: 'Card Subtitle (Override)',
        description: 'Override the date/season on the card. If not set, pulls from linked wedding.'
      },
      card_location: {
        type: 'text',
        display_name: 'Card Location (Override)',
        description: 'Override the venue/location on the card. If not set, pulls from linked wedding.'
      },
      // Modal display overrides (optional)
      modal_hero_image: {
        type: 'asset',
        display_name: 'Modal Hero Image (Override)',
        description: 'Custom hero image for modal header. If not set, pulls from linked wedding.',
        filetypes: ['images']
      },
      modal_title: {
        type: 'text',
        display_name: 'Modal Title (Override)',
        description: 'Override the couple names in modal. If not set, pulls from linked wedding.'
      },
      modal_date: {
        type: 'text',
        display_name: 'Modal Date (Override)',
        description: 'Override the wedding date in modal. If not set, pulls from linked wedding.'
      },
      modal_location: {
        type: 'text',
        display_name: 'Modal Location (Override)',
        description: 'Override the location in modal. If not set, pulls from linked wedding.'
      }
    }

    await storyblokRequest('PUT', `/components/${galleryItemComponent.id}`, {
      component: {
        ...galleryItemComponent,
        schema: updatedSchema
      }
    })

    console.log('✅ Successfully updated gallery_item schema')
    console.log('\n📋 New Schema Fields:')
    Object.keys(updatedSchema).forEach(fieldName => {
      const field = updatedSchema[fieldName]
      console.log(`   - ${fieldName}: ${field.type}${field.required ? ' (Required)' : ''}`)
    })

    return true
  } catch (error) {
    console.error('❌ Error updating schema:', error.message)
    return false
  }
}

async function main() {
  console.log('🚀 Adding wedding_story and override fields to gallery_item\n')
  console.log('=' .repeat(80))

  const success = await addFieldsToGalleryItem()

  console.log('\n' + '=' .repeat(80))
  if (success) {
    console.log('✨ Schema Update Complete!\n')
    console.log('💡 Next Steps:')
    console.log('   1. Refresh Storyblok Visual Editor')
    console.log('   2. Edit the "Real Love Stories" section on your homepage')
    console.log('   3. For each gallery_item:')
    console.log('      - Select a real_wedding from the "Wedding Story" dropdown')
    console.log('      - Optionally set override fields (card_*, modal_*)')
    console.log('   4. Update LoveStoriesGalleryEditor.tsx to fetch and display weddings')
    console.log('   5. Test the modal galleries')
    console.log('\n📝 Field Behavior:')
    console.log('   - wedding_story: Link to real_wedding blog post (pulls gallery_photos)')
    console.log('   - card_* fields: Override card display (or pull from wedding)')
    console.log('   - modal_* fields: Override modal display (or pull from wedding)')
    console.log('   - All overrides are optional - graceful fallback to wedding data')
  } else {
    console.log('❌ Schema update failed')
  }
  console.log('=' .repeat(80))
}

main().catch(error => {
  console.error('\n💥 Script failed:', error)
  process.exit(1)
})
