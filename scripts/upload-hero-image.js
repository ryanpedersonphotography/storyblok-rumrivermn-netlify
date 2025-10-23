#!/usr/bin/env node

/**
 * Script to upload hero background image to Storyblok
 * Usage: node scripts/upload-hero-image.js
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

async function uploadImageDirectly(filePath, filename) {
  try {
    console.log(`📤 Uploading ${filename} directly...`);
    
    // Read file as buffer
    const fileBuffer = fs.readFileSync(filePath);
    const fileSize = fs.statSync(filePath).size;
    
    console.log(`📊 File size: ${(fileSize / 1024 / 1024).toFixed(2)} MB`);
    
    // First get a signed upload URL
    const signedResponse = await makeRequest(`/spaces/${SPACE_ID}/assets/signed`, {
      method: 'POST',
      body: JSON.stringify({
        filename: filename,
        size: fileSize,
        content_type: 'image/jpeg'
      })
    });
    
    console.log(`🔗 Got signed URL`);
    
    // Upload file to signed URL
    const uploadResponse = await fetch(signedResponse.upload_url, {
      method: 'POST',
      body: fileBuffer,
      headers: {
        'Content-Type': 'image/jpeg'
      }
    });
    
    if (!uploadResponse.ok) {
      throw new Error(`Upload to signed URL failed: ${uploadResponse.status}`);
    }
    
    console.log(`✅ File uploaded to signed URL`);
    
    // Finalize the asset
    const finalizeResponse = await makeRequest(`/spaces/${SPACE_ID}/assets/${signedResponse.id}/finish_upload`, {
      method: 'POST'
    });
    
    console.log(`✅ Asset finalized: ${finalizeResponse.filename}`);
    return finalizeResponse;
    
  } catch (error) {
    console.error(`❌ Upload failed:`, error.message);
    throw error;
  }
}

async function main() {
  console.log('🚀 Uploading hero background image...');
  console.log(`📍 Space ID: ${SPACE_ID}`);
  
  try {
    const heroImagePath = './public/hotfix-assets/barn-exterior-full-deck-view-evening.jpg';
    
    if (!fs.existsSync(heroImagePath)) {
      throw new Error(`Image file not found: ${heroImagePath}`);
    }
    
    const heroAsset = await uploadImageDirectly(heroImagePath, 'barn-exterior-full-deck-view-evening.jpg');
    
    console.log('\n🎉 Hero image uploaded successfully!');
    console.log(`📸 Asset ID: ${heroAsset.id}`);
    console.log(`🔗 URL: ${heroAsset.filename}`);
    console.log('\n📋 Next steps:');
    console.log('1. Go to Storyblok admin → Stories → Home');
    console.log('2. Click "Section 1: Hero" → Background Image');
    console.log('3. Select the uploaded barn-exterior-full-deck-view-evening.jpg');
    console.log('4. Save and publish the story');
    
  } catch (error) {
    console.error('\n❌ Script failed:', error.message);
    process.exit(1);
  }
}

main();