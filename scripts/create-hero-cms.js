#!/usr/bin/env node

/**
 * Script to create home_hero_section component via Storyblok Management API
 * Usage: node scripts/create-hero-cms.js
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
  console.error('❌ Missing required environment variables:');
  console.error('   SPACE_ID:', SPACE_ID ? '✓' : '✗');
  console.error('   STORYBLOK_MANAGEMENT_TOKEN:', MANAGEMENT_TOKEN ? '✓' : '✗');
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

async function createOrUpdateComponent(componentData) {
  try {
    // First, try to get existing components
    const existingComponents = await makeRequest(`/spaces/${SPACE_ID}/components`);
    const existingComponent = existingComponents.components.find(c => c.name === componentData.name);
    
    if (existingComponent) {
      console.log(`📝 Component "${componentData.name}" already exists, updating...`);
      const result = await makeRequest(`/spaces/${SPACE_ID}/components/${existingComponent.id}`, {
        method: 'PUT',
        body: JSON.stringify({ component: componentData })
      });
      console.log(`✅ Updated component: ${componentData.name}`);
      return result;
    } else {
      console.log(`🆕 Creating new component: ${componentData.name}`);
      const result = await makeRequest(`/spaces/${SPACE_ID}/components`, {
        method: 'POST',
        body: JSON.stringify({ component: componentData })
      });
      console.log(`✅ Created component: ${componentData.name}`);
      return result;
    }
  } catch (error) {
    console.error(`❌ Error with component "${componentData.name}":`, error.message);
    throw error;
  }
}

async function main() {
  console.log('🚀 Creating Storyblok CMS components for home hero section...');
  console.log(`📍 Space ID: ${SPACE_ID}`);
  
  try {
    // Load component definition from JSON file
    const fs = require('fs');
    const componentJson = fs.readFileSync('.storyblok/home_hero_section.json', 'utf8');
    const heroSectionComponent = JSON.parse(componentJson);

    // Create the component
    await createOrUpdateComponent(heroSectionComponent);
    
    console.log('\n🎉 Hero CMS component setup complete!');
    console.log('\n📋 Next steps:');
    console.log('1. Go to Storyblok admin to see the new "Section 1: Hero" component');
    console.log('2. Upload the hero background image');
    console.log('3. Create a Home page and add the hero section');
    
  } catch (error) {
    console.error('\n❌ Script failed:', error.message);
    process.exit(1);
  }
}

main();