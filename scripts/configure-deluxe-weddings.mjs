#!/usr/bin/env node

/**
 * Configure Deluxe Weddings in Love Letters Section
 *
 * Finds the homepage story, locates the testimonials section,
 * and adds the 3 deluxe wedding UUIDs to the deluxe_weddings field.
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

// Find the homepage story
async function findHomepage() {
  console.log('🔍 Looking for homepage story...')

  try {
    // Get all stories at root level
    const response = await storyblokRequest('GET', '/stories?starts_with=&per_page=100')

    // Find home/index story
    const homepage = response.stories.find(s =>
      s.is_startpage ||
      s.slug === 'home' ||
      s.slug === 'index' ||
      s.full_slug === 'home' ||
      s.name.toLowerCase() === 'home'
    )

    if (!homepage) {
      console.error('❌ Homepage not found!')
      console.log('Available stories:', response.stories.map(s => ({ name: s.name, slug: s.slug, is_startpage: s.is_startpage })))
      return null
    }

    console.log(`✅ Found homepage: "${homepage.name}" (ID: ${homepage.id})`)

    // Fetch full story details with content
    console.log('📥 Fetching full story details...')
    const fullStory = await storyblokRequest('GET', `/stories/${homepage.id}`)

    return fullStory.story
  } catch (error) {
    console.error('❌ Error finding homepage:', error.message)
    return null
  }
}

// Update testimonials section with deluxe weddings
async function configureDeluxeWeddings(homepage) {
  console.log('\n📝 Configuring deluxe weddings in Love Letters section...')

  try {
    // Deep clone the content to avoid mutations
    const updatedContent = JSON.parse(JSON.stringify(homepage.content))

    // Find the testimonials section in the body
    let testimonialsSection = null
    let sectionIndex = -1

    if (updatedContent.body && Array.isArray(updatedContent.body)) {
      sectionIndex = updatedContent.body.findIndex(block =>
        block.component === 'testimonials_section'
      )

      if (sectionIndex !== -1) {
        testimonialsSection = updatedContent.body[sectionIndex]
      }
    }

    if (!testimonialsSection) {
      console.error('❌ testimonials_section not found in homepage body!')
      console.log('Available blocks:', updatedContent.body?.map(b => b.component) || [])
      return false
    }

    console.log(`✅ Found testimonials_section at index ${sectionIndex}`)

    // Check if deluxe_weddings is already configured
    if (testimonialsSection.deluxe_weddings && testimonialsSection.deluxe_weddings.length > 0) {
      console.log('ℹ️  deluxe_weddings already configured:')
      console.log('   Current UUIDs:', testimonialsSection.deluxe_weddings)
      console.log('\n🔄 Updating to new deluxe weddings...')
    }

    // Update the deluxe_weddings field
    testimonialsSection.deluxe_weddings = DELUXE_WEDDING_UUIDS

    // Update the story
    console.log('💾 Saving changes to homepage...')

    const updateResponse = await storyblokRequest('PUT', `/stories/${homepage.id}`, {
      story: {
        content: updatedContent
      },
      publish: 1 // Auto-publish the changes
    })

    console.log('✅ Successfully configured deluxe weddings!')
    console.log('\n📋 Updated deluxe_weddings field with:')
    DELUXE_WEDDING_UUIDS.forEach((uuid, index) => {
      const names = ['Emily & Barron', 'Anthony & Linnea', 'Joshua & Teri']
      console.log(`   ${index + 1}. ${names[index]} (${uuid})`)
    })

    return true
  } catch (error) {
    console.error('❌ Error configuring deluxe weddings:', error.message)
    return false
  }
}

// Main execution
async function main() {
  console.log('🚀 Configure Deluxe Weddings in Love Letters Section\n')
  console.log('=' .repeat(60))

  // Find homepage
  const homepage = await findHomepage()
  if (!homepage) {
    console.error('\n❌ Cannot proceed without homepage')
    process.exit(1)
  }

  // Configure deluxe weddings
  const success = await configureDeluxeWeddings(homepage)

  console.log('\n' + '=' .repeat(60))
  if (success) {
    console.log('✨ Configuration Complete!\n')
    console.log('💡 Next Steps:')
    console.log('   1. The changes have been published automatically')
    console.log('   2. Refresh your localhost to see the updates')
    console.log('   3. Test the Love Letters section:')
    console.log('      - Should show 3 wedding cards instead of testimonials')
    console.log('      - Clicking each card should open the modal gallery')
    console.log('   4. Test the Real Love Stories section:')
    console.log('      - Clicking wedding cards should open modal galleries')
    console.log('\n🔧 If you need to revert:')
    console.log('   - Go to Storyblok Visual Editor')
    console.log('   - Edit the Love Letters section')
    console.log('   - Clear the "Deluxe Weddings" field')
    console.log('   - The section will fall back to regular testimonials')
  } else {
    console.log('❌ Configuration failed')
  }
  console.log('=' .repeat(60))
}

main().catch(error => {
  console.error('\n💥 Script failed:', error)
  process.exit(1)
})
