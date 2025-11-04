#!/usr/bin/env node

/**
 * Script to upload spaces images using the proven 3-step method
 * Usage: node scripts/upload-spaces-images-proper.js
 * 
 * Uses: signAsset -> uploadToS3 -> finishUpload -> updateSpacesContent
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

// Rate limiting and retry logic
async function withRetry(fn, { tries = 5, label = 'req' } = {}) {
  let attempt = 0, delay = 500;
  while (true) {
    try {
      return await fn();
    } catch (err) {
      const status = err?.response?.status || err?.status;
      const retriable = status === 429 || (status >= 500 && status < 600);
      attempt++;
      if (!retriable || attempt >= tries) {
        throw err;
      }
      console.log(`⏳ Retrying ${label} (attempt ${attempt + 1}/${tries}) after ${delay}ms...`);
      await sleep(delay);
      delay = Math.min(delay * 2, 8000);
    }
  }
}

function sleep(ms) { 
  return new Promise(r => setTimeout(r, ms)); 
}

// 3-step upload process from bulk-upload script
async function signAsset(filename) {
  const response = await fetch(`https://mapi.storyblok.com/v1/spaces/${SPACE_ID}/assets`, {
    method: 'POST',
    headers: {
      'Authorization': MANAGEMENT_TOKEN,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ filename })
  });
  
  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to sign asset: ${error}`);
  }
  
  const data = await response.json();
  return data; // { id, post_url, fields: { key, policy, ... } }
}

async function uploadToS3(signed, filepath) {
  const form = new FormData();
  
  // Add all signed fields first
  for (const [k, v] of Object.entries(signed.fields || {})) {
    form.append(k, v);
  }
  
  // Add file stream last
  const fileStream = fs.createReadStream(filepath);
  form.append('file', fileStream, path.basename(filepath));

  await axios.post(signed.post_url, form, {
    headers: form.getHeaders(),
    maxContentLength: Infinity,
    maxBodyLength: Infinity,
    timeout: 300000,
    validateStatus: (s) => s >= 200 && s < 400, // S3 can return 204/201
  });
}

async function finishUpload(assetId) {
  const response = await fetch(`https://mapi.storyblok.com/v1/spaces/${SPACE_ID}/assets/${assetId}/finish_upload`, {
    method: 'POST',
    headers: {
      'Authorization': MANAGEMENT_TOKEN,
      'Content-Type': 'application/json',
    }
  });
  
  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to finish upload: ${error}`);
  }
  
  const data = await response.json();
  return data;
}

async function updateMetadata(assetId, { alt, title }) {
  const body = { asset: {} };
  if (alt) body.asset.alt = alt;
  if (title) body.asset.title = title;
  
  if (Object.keys(body.asset).length === 0) return;
  
  const response = await fetch(`https://mapi.storyblok.com/v1/spaces/${SPACE_ID}/assets/${assetId}`, {
    method: 'PUT',
    headers: {
      'Authorization': MANAGEMENT_TOKEN,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body)
  });
  
  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to update metadata: ${error}`);
  }
}

async function uploadSingleImage(imagePath, spaceName, photoIndex) {
  const filename = path.basename(imagePath);
  console.log(`📤 Uploading ${filename} for ${spaceName}...`);
  
  try {
    // Step 1: Sign the asset
    const signed = await withRetry(() => signAsset(filename), { label: `sign ${filename}` });
    console.log(`🔗 Signed ${filename}`);
    
    // Step 2: Upload to S3
    await withRetry(() => uploadToS3(signed, imagePath), { label: `S3 upload ${filename}` });
    console.log(`☁️  Uploaded ${filename} to S3`);
    
    // Wait a moment for S3 to process
    await sleep(2000);
    
    // Step 3: Finish upload
    const asset = await withRetry(() => finishUpload(signed.id), { label: `finish ${filename}` });
    console.log(`✅ Finalized ${filename}`);
    
    // Step 4: Update metadata
    await withRetry(() => updateMetadata(asset.id, {
      alt: `${spaceName} photo ${photoIndex + 1}`,
      title: `${spaceName} - ${filename}`
    }), { label: `metadata ${filename}` });
    
    return {
      id: asset.id,
      filename: asset.filename,
      focus: null,
      name: asset.name || filename,
      title: `${spaceName} - ${filename}`,
      alt: `${spaceName} photo ${photoIndex + 1}`
    };
    
  } catch (error) {
    console.error(`❌ Failed to upload ${filename}:`, error.message);
    return null;
  }
}

async function getStory(slug) {
  const response = await fetch(
    `https://mapi.storyblok.com/v1/spaces/${SPACE_ID}/stories?with_slug=${slug}`,
    { headers: { 'Authorization': MANAGEMENT_TOKEN } }
  );
  
  if (!response.ok) {
    throw new Error(`Failed to fetch story: ${await response.text()}`);
  }
  
  const data = await response.json();
  const story = data.stories[0];
  
  // Fetch full story details
  const fullResponse = await fetch(
    `https://mapi.storyblok.com/v1/spaces/${SPACE_ID}/stories/${story.id}`,
    { headers: { 'Authorization': MANAGEMENT_TOKEN } }
  );
  
  const fullData = await fullResponse.json();
  return fullData.story;
}

async function updateStory(storyId, storyData) {
  const response = await fetch(
    `https://mapi.storyblok.com/v1/spaces/${SPACE_ID}/stories/${storyId}`,
    {
      method: 'PUT',
      headers: {
        'Authorization': MANAGEMENT_TOKEN,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        story: storyData,
        publish: 1
      })
    }
  );
  
  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to update story: ${error}`);
  }
  
  return response.json();
}

async function uploadSpacesImagesProperly() {
  try {
    console.log('🚀 Uploading spaces images using proper 3-step method...');
    
    // Get the home story
    const homeStory = await getStory('home');
    const spacesSection = homeStory.content.body.find(block => block.component === 'spaces_section');
    
    if (!spacesSection || !spacesSection.spaces) {
      throw new Error('Spaces section or spaces data not found');
    }
    
    console.log(`📖 Found ${spacesSection.spaces.length} spaces to process\n`);
    
    // Process each space with rate limiting
    const updatedSpaces = [];
    
    for (let spaceIndex = 0; spaceIndex < spacesSection.spaces.length; spaceIndex++) {
      const space = spacesSection.spaces[spaceIndex];
      console.log(`🏗️  Processing space ${spaceIndex + 1}/${spacesSection.spaces.length}: ${space.space_name}`);
      
      if (!space.space_photos || !Array.isArray(space.space_photos)) {
        console.log(`⚠️  No photos for ${space.space_name}`);
        updatedSpaces.push(space);
        continue;
      }
      
      const updatedPhotos = [];
      
      // Process each photo with delay to avoid rate limits
      for (let photoIndex = 0; photoIndex < space.space_photos.length; photoIndex++) {
        const photo = space.space_photos[photoIndex];
        
        if (typeof photo === 'string') {
          // It's a local path, upload it
          const imagePath = path.join('./public', photo);
          
          if (fs.existsSync(imagePath)) {
            const uploadedAsset = await uploadSingleImage(imagePath, space.space_name, photoIndex);
            
            if (uploadedAsset) {
              updatedPhotos.push(uploadedAsset);
            } else {
              // Keep original path if upload failed
              updatedPhotos.push(photo);
            }
          } else {
            console.log(`⚠️  File not found: ${imagePath}`);
            updatedPhotos.push(photo);
          }
        } else {
          // Already an uploaded asset
          updatedPhotos.push(photo);
        }
        
        // Add delay between uploads to respect rate limits
        if (photoIndex < space.space_photos.length - 1) {
          await sleep(1000); // 1 second delay
        }
      }
      
      updatedSpaces.push({
        ...space,
        space_photos: updatedPhotos
      });
      
      // Add delay between spaces
      if (spaceIndex < spacesSection.spaces.length - 1) {
        await sleep(2000); // 2 second delay between spaces
      }
    }
    
    // Update the story
    console.log('\n📝 Updating story with new asset references...');
    const updatedSpacesSection = {
      ...spacesSection,
      spaces: updatedSpaces
    };
    
    const updatedBody = homeStory.content.body.map(block => 
      block.component === 'spaces_section' ? updatedSpacesSection : block
    );
    
    await updateStory(homeStory.id, {
      ...homeStory,
      content: { ...homeStory.content, body: updatedBody }
    });
    
    console.log('✅ Story updated and published\n');
    console.log('🎉 Spaces images uploaded successfully!\n');
    console.log('📝 Summary:');
    updatedSpaces.forEach((space, index) => {
      const photoCount = space.space_photos ? space.space_photos.length : 0;
      console.log(`   ${index + 1}. ${space.space_name}: ${photoCount} photos`);
    });
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

uploadSpacesImagesProperly();