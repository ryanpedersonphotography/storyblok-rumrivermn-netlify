#!/usr/bin/env node

/**
 * Script to upload hero background image to Storyblok using correct 3-step process
 * Usage: node scripts/upload-hero-image-fixed.js
 */

// Read environment variables from .env.local manually
const fs = require('fs');
const FormData = require('form-data');
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

async function uploadHeroImage(filePath, filename) {
  try {
    console.log(`📤 Starting 3-step upload for ${filename}...`);
    
    // Step 1: Request signed upload
    console.log('🔑 Step 1: Requesting signed upload...');
    const signedResponse = await makeRequest(`/spaces/${SPACE_ID}/assets/`, {
      method: 'POST',
      body: JSON.stringify({
        filename: filename,
        asset_folder_id: null,
        validate_upload: 1
      })
    });
    
    console.log(`✅ Got signed upload response`);
    console.log(`📍 Upload URL: ${signedResponse.post_url}`);
    console.log(`🔧 Fields:`, Object.keys(signedResponse.fields));
    
    // Step 2: Upload to S3 using multipart form data
    console.log('📦 Step 2: Uploading to S3...');
    const form = new FormData();
    
    // Add all the required fields from the signed response
    Object.keys(signedResponse.fields).forEach(key => {
      form.append(key, signedResponse.fields[key]);
    });
    
    // Add the file itself
    form.append('file', fs.createReadStream(filePath));
    
    const uploadResponse = await fetch(signedResponse.post_url, {
      method: 'POST',
      body: form,
      headers: form.getHeaders()
    });
    
    if (!uploadResponse.ok) {
      const errorText = await uploadResponse.text();
      throw new Error(`S3 Upload failed (${uploadResponse.status}): ${errorText}`);
    }
    
    console.log(`✅ Successfully uploaded to S3`);
    
    // Step 3: Finish upload (validate)
    console.log('🏁 Step 3: Finishing upload...');
    const finishResponse = await fetch(`${API_BASE}/spaces/${SPACE_ID}/assets/finish_upload?id=${signedResponse.id}`, {
      method: 'GET',
      headers: {
        'Authorization': MANAGEMENT_TOKEN
      }
    });
    
    if (!finishResponse.ok) {
      const error = await finishResponse.text();
      throw new Error(`Finish upload failed (${finishResponse.status}): ${error}`);
    }
    
    const finalAsset = await finishResponse.json();
    console.log(`✅ Upload completed and validated`);
    
    return finalAsset;
    
  } catch (error) {
    console.error(`❌ Upload failed:`, error.message);
    throw error;
  }
}

async function main() {
  console.log('🚀 Uploading hero background image to Storyblok...');
  console.log(`📍 Space ID: ${SPACE_ID}`);
  
  try {
    const heroImagePath = './public/hotfix-assets/barn-exterior-full-deck-view-evening.jpg';
    
    if (!fs.existsSync(heroImagePath)) {
      throw new Error(`Image file not found: ${heroImagePath}`);
    }
    
    const fileSize = fs.statSync(heroImagePath).size;
    console.log(`📊 File size: ${(fileSize / 1024 / 1024).toFixed(2)} MB`);
    
    const heroAsset = await uploadHeroImage(heroImagePath, 'barn-exterior-full-deck-view-evening.jpg');
    
    console.log('\n🎉 Hero image uploaded successfully!');
    console.log(`📸 Asset ID: ${heroAsset.id}`);
    console.log(`🔗 CDN URL: ${heroAsset.filename}`);
    console.log(`📛 Alt text: ${heroAsset.alt || 'Not set'}`);
    
    console.log('\n📋 Next steps:');
    console.log('1. Go to Storyblok admin → Stories → Home');
    console.log('2. Click "Section 1: Hero" → Background Image field');
    console.log('3. The uploaded image should appear in the asset picker');
    console.log('4. Select it and save/publish the story');
    console.log('\n🔧 Or run the update script to link it automatically...');
    
  } catch (error) {
    console.error('\n❌ Script failed:', error.message);
    process.exit(1);
  }
}

main();