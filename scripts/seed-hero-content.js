#!/usr/bin/env node

/**
 * Script to upload hero image and create Home page with seeded content
 * Usage: node scripts/seed-hero-content.js
 */

// Read environment variables from .env.local manually
const fs = require('fs');
const path = require('path');
const envPath = '.env.local';
const envContent = fs.readFileSync(envPath, 'utf8');
const envLines = envContent.split('\n');

const env = {};
envLines.forEach(line => {
  const [key, value] = line.split('=');
  if (key && value) {
    env[key.trim()] = value.trim();
  }
});

const SPACE_ID = env.SPACE_ID;
const MANAGEMENT_TOKEN = env.STORYBLOK_MANAGEMENT_TOKEN;

if (!SPACE_ID || !MANAGEMENT_TOKEN) {
  console.error('❌ Missing required environment variables');
  process.exit(1);
}

const API_BASE = 'https://mapi.storyblok.com/v1';

async function makeRequest(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  const config = {
    headers: {
      'Authorization': MANAGEMENT_TOKEN,
      'Content-Type': 'application/json',
    },
    ...options
  };

  console.log(`📡 ${options.method || 'GET'} ${endpoint}`);
  
  const response = await fetch(url, config);
  
  if (!response.ok) {
    const error = await response.text();
    throw new Error(`API Error (${response.status}): ${error}`);
  }
  
  return response.json();
}

async function uploadAsset(filePath, filename) {
  try {
    console.log(`📤 Uploading ${filename}...`);
    
    // Create form data
    const FormData = require('form-data');
    const form = new FormData();
    
    const fileStream = fs.createReadStream(filePath);
    form.append('file', fileStream, filename);
    
    const response = await fetch(`${API_BASE}/spaces/${SPACE_ID}/assets`, {
      method: 'POST',
      headers: {
        'Authorization': MANAGEMENT_TOKEN,
        ...form.getHeaders()
      },
      body: form
    });
    
    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Upload failed (${response.status}): ${error}`);
    }
    
    const result = await response.json();
    console.log(`✅ Uploaded: ${result.filename}`);
    return result;
    
  } catch (error) {
    console.error(`❌ Upload failed:`, error.message);
    throw error;
  }
}

async function createOrUpdateStory(storyData) {
  try {
    // Check if Home story already exists
    const stories = await makeRequest(`/spaces/${SPACE_ID}/stories?search=Home`);
    const existingStory = stories.stories.find(s => s.slug === 'home');
    
    if (existingStory) {
      console.log(`📝 Updating existing Home page...`);
      const result = await makeRequest(`/spaces/${SPACE_ID}/stories/${existingStory.id}`, {
        method: 'PUT',
        body: JSON.stringify({ story: storyData })
      });
      console.log(`✅ Updated Home page`);
      return result;
    } else {
      console.log(`🆕 Creating new Home page...`);
      const result = await makeRequest(`/spaces/${SPACE_ID}/stories`, {
        method: 'POST',
        body: JSON.stringify({ story: storyData })
      });
      console.log(`✅ Created Home page`);
      return result;
    }
  } catch (error) {
    console.error(`❌ Error with Home page:`, error.message);
    throw error;
  }
}

async function main() {
  console.log('🚀 Uploading hero image and creating Home page...');
  console.log(`📍 Space ID: ${SPACE_ID}`);
  
  try {
    // Upload hero background image
    const heroImagePath = './public/hotfix-assets/barn-exterior-full-deck-view-evening.jpg';
    const heroAsset = await uploadAsset(heroImagePath, 'barn-exterior-full-deck-view-evening.jpg');
    
    // Create Home page with hero section
    const homeStoryData = {
      name: 'Home',
      slug: 'home',
      content: {
        component: 'page',
        body: [
          {
            component: 'home_hero_section',
            kicker: 'Where Dreams Begin',
            title: 'Rum River',
            title_accent: 'Wedding Barn',
            description: "Nestled along Minnesota's scenic Rum River, our historic barn offers the perfect blend of rustic charm and modern elegance for your once-in-a-lifetime celebration.",
            primary_cta_text: 'Schedule Your Visit',
            scroll_text: 'Discover Your Perfect Day',
            bg_image: {
              id: heroAsset.id,
              filename: heroAsset.filename,
              name: heroAsset.name,
              alt: 'Rum River Wedding Barn exterior view at evening'
            }
          }
        ]
      },
      is_startpage: true,
      published: true
    };
    
    await createOrUpdateStory(homeStoryData);
    
    console.log('\n🎉 Hero content seeded successfully!');
    console.log('\n📋 What\'s ready:');
    console.log('✅ Home page created with hero section');
    console.log('✅ Hero background image uploaded');
    console.log('✅ All default content seeded');
    console.log('\n🌐 Check your Storyblok admin to see the editable hero section!');
    
  } catch (error) {
    console.error('\n❌ Script failed:', error.message);
    process.exit(1);
  }
}

main();