#!/usr/bin/env node

/**
 * Simple script to upload just 1 hero image per space
 * Usage: node scripts/upload-spaces-hero-images.js
 */

const fs = require('fs');
const path = require('path');
const FormData = require('form-data');
const axios = require('axios');

const SPACE_ID = process.env.SPACE_ID || '288003424841711';
const MANAGEMENT_TOKEN = process.env.STORYBLOK_PERSONAL_ACCESS_TOKEN;

if (!MANAGEMENT_TOKEN) {
  console.error('❌ Please set STORYBLOK_PERSONAL_ACCESS_TOKEN environment variable');
  process.exit(1);
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function signAsset(filename) {
  const response = await fetch(`https://mapi.storyblok.com/v1/spaces/${SPACE_ID}/assets`, {
    method: 'POST',
    headers: { 'Authorization': MANAGEMENT_TOKEN, 'Content-Type': 'application/json' },
    body: JSON.stringify({ filename })
  });
  
  if (!response.ok) throw new Error(`Sign failed: ${await response.text()}`);
  return response.json();
}

async function uploadToS3(signed, filepath) {
  const form = new FormData();
  for (const [k, v] of Object.entries(signed.fields || {})) {
    form.append(k, v);
  }
  form.append('file', fs.createReadStream(filepath), path.basename(filepath));

  await axios.post(signed.post_url, form, {
    headers: form.getHeaders(),
    maxContentLength: Infinity,
    maxBodyLength: Infinity,
    timeout: 300000,
    validateStatus: (s) => s >= 200 && s < 400,
  });
}

async function finishUpload(assetId) {
  const response = await fetch(`https://mapi.storyblok.com/v1/spaces/${SPACE_ID}/assets/${assetId}/finish_upload`, {
    method: 'POST',
    headers: { 'Authorization': MANAGEMENT_TOKEN, 'Content-Type': 'application/json' }
  });
  
  if (!response.ok) throw new Error(`Finish failed: ${await response.text()}`);
  return response.json();
}

async function uploadSingleImage(imagePath, spaceName) {
  const filename = path.basename(imagePath);
  console.log(`📤 Uploading ${filename} for ${spaceName}...`);
  
  try {
    const signed = await signAsset(filename);
    console.log(`🔗 Signed`);
    
    await uploadToS3(signed, imagePath);
    console.log(`☁️  S3 uploaded`);
    
    await sleep(2000); // Wait for S3
    
    const asset = await finishUpload(signed.id);
    console.log(`✅ Finalized: ${asset.filename}`);
    
    return {
      id: asset.id,
      filename: asset.filename,
      focus: null,
      name: asset.name || filename,
      title: spaceName,
      alt: `${spaceName} photo`
    };
    
  } catch (error) {
    console.error(`❌ Failed ${filename}:`, error.message);
    return null;
  }
}

async function uploadHeroImages() {
  try {
    console.log('🚀 Uploading 1 hero image per space...\n');
    
    // Just the key hero images
    const heroImages = [
      { space: 'The Historic Barn', image: './public/images/barn-exterior-full-deck-view-evening.jpg' },
      { space: 'Bridal Suite', image: './public/images/real-weddings/emily-and-barron-nixon/photos/020.jpg' },
      { space: "Groom's Quarters", image: './public/images/real-weddings/joshua-and-teri/photos/008.jpg' },
      { space: 'Garden Pavilion', image: './public/images/real-weddings/loria-and-jason-rolstad-agape/photos/010.jpg' }
    ];
    
    const uploadedAssets = [];
    
    for (const { space, image } of heroImages) {
      if (fs.existsSync(image)) {
        const asset = await uploadSingleImage(image, space);
        if (asset) {
          uploadedAssets.push({ space, asset });
        }
        await sleep(3000); // Rate limit protection
      } else {
        console.log(`⚠️  File not found: ${image}`);
      }
    }
    
    console.log('\n🎉 Hero images uploaded!');
    console.log('📝 Uploaded assets:');
    uploadedAssets.forEach(({ space, asset }) => {
      console.log(`   ${space}: ${asset.filename}`);
    });
    console.log('\n💡 You can now manually assign these in Storyblok admin');
    console.log('   Go to Stories → Home → Spaces section → Each space → Space Photos');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

uploadHeroImages();