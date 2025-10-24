#!/usr/bin/env node

/**
 * Add deluxe_weddings field to testimonials_section component
 *
 * This allows the Love Letters section to display deluxe weddings
 * instead of regular testimonials.
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

async function addDeluxeWeddingsField() {
  console.log('🔍 Fetching testimonials_section component...')

  try {
    const response = await storyblokRequest('GET', '/components')
    const testimonialsComponent = response.components.find(c => c.name === 'testimonials_section')

    if (!testimonialsComponent) {
      console.error('❌ testimonials_section component not found!')
      return false
    }

    console.log(`✅ Found component (ID: ${testimonialsComponent.id})`)

    const hasDeluxeWeddingsField = testimonialsComponent.schema?.deluxe_weddings

    if (hasDeluxeWeddingsField) {
      console.log('✅ deluxe_weddings field already exists')
      return true
    }

    console.log('➕ Adding deluxe_weddings field to testimonials_section schema...')

    const updatedSchema = {
      ...testimonialsComponent.schema,
      deluxe_weddings: {
        type: 'options',
        display_name: 'Deluxe Weddings',
        description: 'Select deluxe weddings to display instead of regular testimonials. Leave empty to show regular testimonials.',
        options: [],
        use_uuid: true,
        restrict_type: 'real_wedding',
        restrict_content_types: true,
        source: 'internal_stories'
      }
    }

    await storyblokRequest('PUT', `/components/${testimonialsComponent.id}`, {
      component: {
        ...testimonialsComponent,
        schema: updatedSchema
      }
    })

    console.log('✅ Successfully added deluxe_weddings field')
    return true
  } catch (error) {
    console.error('❌ Error updating schema:', error.message)
    return false
  }
}

async function main() {
  console.log('🚀 Adding deluxe_weddings field to testimonials_section\n')
  console.log('=' .repeat(60))

  const success = await addDeluxeWeddingsField()

  console.log('\n' + '=' .repeat(60))
  if (success) {
    console.log('✨ Field added successfully!')
    console.log('\n💡 Next Steps:')
    console.log('   1. Refresh Storyblok Visual Editor')
    console.log('   2. Edit the "Love Letters" (Testimonials) section on your homepage')
    console.log('   3. You should now see a "Deluxe Weddings" field')
    console.log('   4. Add the 3 deluxe wedding stories to this field')
    console.log('   5. Save and test the modal galleries')
  } else {
    console.log('❌ Failed to add field')
  }
  console.log('=' .repeat(60))
}

main().catch(error => {
  console.error('\n💥 Script failed:', error)
  process.exit(1)
})
