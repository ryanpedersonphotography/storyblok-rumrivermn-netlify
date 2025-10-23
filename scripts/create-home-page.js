#!/usr/bin/env node

/**
 * Script to create Home page with hero section (without image upload)
 * Usage: node scripts/create-home-page.js
 */

// Read environment variables from .env.local manually
const fs = require('fs');
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
  console.log('🚀 Creating Home page with hero section...');
  console.log(`📍 Space ID: ${SPACE_ID}`);
  
  try {
    // Create Home page with hero section (image will be added manually)
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
            bg_image: null // Will be set manually in admin
          }
        ]
      },
      // is_startpage: true // Removed - requires parent folder
    };
    
    await createOrUpdateStory(homeStoryData);
    
    console.log('\n🎉 Home page created successfully!');
    console.log('\n📋 What\'s ready:');
    console.log('✅ Home page with "Section 1: Hero" component');
    console.log('✅ All text content seeded with defaults');
    console.log('📤 Background image: Upload manually in Storyblok admin');
    console.log('\n🌐 Next steps:');
    console.log('1. Go to Storyblok admin → Stories → Home');
    console.log('2. Click on "Section 1: Hero"');
    console.log('3. Upload barn-exterior-full-deck-view-evening.jpg to Background Image field');
    console.log('4. Edit any text content as needed');
    console.log('5. Publish the story');
    
  } catch (error) {
    console.error('\n❌ Script failed:', error.message);
    process.exit(1);
  }
}

main();