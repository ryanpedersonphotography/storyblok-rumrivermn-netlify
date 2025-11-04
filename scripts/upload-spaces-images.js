#!/usr/bin/env node

/**
 * Script to upload images to Storyblok and update spaces with actual asset references
 * Usage: node scripts/upload-spaces-images.js
 * 
 * Uploads images from public folder and updates the spaces repeater with actual Storyblok assets
 */

const fs = require('fs');
const path = require('path');

const SPACE_ID = process.env.SPACE_ID || '288003424841711';
const MANAGEMENT_TOKEN = process.env.STORYBLOK_PERSONAL_ACCESS_TOKEN;

if (!MANAGEMENT_TOKEN) {
  console.error('❌ Please set STORYBLOK_PERSONAL_ACCESS_TOKEN environment variable');
  process.exit(1);
}

async function uploadImageToStoryblok(imagePath, filename) {
  try {
    console.log(`📤 Uploading ${filename}...`);
    
    // Check if file exists
    if (!fs.existsSync(imagePath)) {
      console.log(`⚠️  File not found: ${imagePath}, skipping...`);
      return null;
    }
    
    // Read file as buffer
    const fileBuffer = fs.readFileSync(imagePath);
    const fileSize = fs.statSync(imagePath).size;
    
    console.log(`📊 File size: ${(fileSize / 1024 / 1024).toFixed(2)} MB`);
    
    // Get signed upload URL
    const signedResponse = await fetch(`https://mapi.storyblok.com/v1/spaces/${SPACE_ID}/assets`, {
      method: 'POST',
      headers: {
        'Authorization': MANAGEMENT_TOKEN,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        filename: filename,
        size: fileSize,
        content_type: 'image/jpeg'
      })
    });
    
    if (!signedResponse.ok) {
      throw new Error(`Failed to get signed URL: ${await signedResponse.text()}`);
    }
    
    const signedData = await signedResponse.json();
    console.log(`🔗 Got signed URL for ${filename}`);
    
    // Upload to S3 using form data
    const FormData = require('form-data');
    const form = new FormData();
    
    // Add all the signed fields first
    Object.entries(signedData.fields || {}).forEach(([key, value]) => {
      form.append(key, value);
    });
    
    // Add the file last
    form.append('file', fileBuffer, filename);
    
    const uploadResponse = await fetch(signedData.post_url, {
      method: 'POST',
      body: form
    });
    
    if (!uploadResponse.ok) {
      throw new Error(`Upload failed: ${uploadResponse.status} ${await uploadResponse.text()}`);
    }
    
    console.log(`✅ Uploaded ${filename} to S3`);
    
    // Finish the upload
    const finishResponse = await fetch(`https://mapi.storyblok.com/v1/spaces/${SPACE_ID}/assets/${signedData.id}/finish_upload`, {
      method: 'POST',
      headers: {
        'Authorization': MANAGEMENT_TOKEN,
        'Content-Type': 'application/json',
      }
    });
    
    if (!finishResponse.ok) {
      throw new Error(`Failed to finish upload: ${await finishResponse.text()}`);
    }
    
    const finishedAsset = await finishResponse.json();
    console.log(`✅ Asset finalized: ${finishedAsset.filename}`);
    
    return finishedAsset;
    
  } catch (error) {
    console.error(`❌ Failed to upload ${filename}:`, error.message);
    return null;
  }
}

async function getStory(slug) {
  const response = await fetch(
    `https://mapi.storyblok.com/v1/spaces/${SPACE_ID}/stories?with_slug=${slug}`,
    {
      headers: { 'Authorization': MANAGEMENT_TOKEN }
    }
  );
  
  if (!response.ok) {
    throw new Error(`Failed to fetch story: ${await response.text()}`);
  }
  
  const data = await response.json();
  const story = data.stories[0];
  
  if (!story) {
    throw new Error(`Story with slug "${slug}" not found`);
  }
  
  // Fetch full story details
  const fullResponse = await fetch(
    `https://mapi.storyblok.com/v1/spaces/${SPACE_ID}/stories/${story.id}`,
    {
      headers: { 'Authorization': MANAGEMENT_TOKEN }
    }
  );
  
  if (!fullResponse.ok) {
    throw new Error(`Failed to fetch full story: ${await fullResponse.text()}`);
  }
  
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

async function uploadSpacesImages() {
  try {
    console.log('🚀 Uploading spaces images to Storyblok...');
    
    // Get the home story
    const homeStory = await getStory('home');
    const spacesSection = homeStory.content.body.find(block => block.component === 'spaces_section');
    
    if (!spacesSection || !spacesSection.spaces) {
      throw new Error('Spaces section or spaces data not found in home story');
    }
    
    console.log(`📖 Found ${spacesSection.spaces.length} spaces to process`);
    
    // Process each space
    const updatedSpaces = await Promise.all(spacesSection.spaces.map(async (space, spaceIndex) => {
      console.log(`\n🏗️  Processing space: ${space.space_name}`);
      
      if (!space.space_photos || !Array.isArray(space.space_photos)) {
        console.log(`⚠️  No photos found for ${space.space_name}`);
        return space;
      }
      
      // Upload each photo for this space
      const updatedPhotos = await Promise.all(space.space_photos.map(async (photo, photoIndex) => {
        if (typeof photo === 'string') {
          // It's a path, upload it
          const imagePath = path.join('./public', photo);
          const filename = path.basename(photo);
          
          const uploadedAsset = await uploadImageToStoryblok(imagePath, filename);
          
          if (uploadedAsset) {
            return {
              id: uploadedAsset.id,
              filename: uploadedAsset.filename,
              focus: null,
              name: uploadedAsset.name || filename,
              title: uploadedAsset.title || space.space_name,
              alt: uploadedAsset.alt || `${space.space_name} photo ${photoIndex + 1}`
            };
          } else {
            // Keep original if upload failed
            return photo;
          }
        } else if (photo && typeof photo === 'object' && photo.filename) {
          // Already a Storyblok asset, keep as is
          console.log(`ℹ️  Photo already uploaded: ${photo.filename}`);
          return photo;
        } else {
          console.log(`⚠️  Invalid photo format for ${space.space_name}, photo ${photoIndex + 1}`);
          return photo;
        }
      }));
      
      return {
        ...space,
        space_photos: updatedPhotos
      };
    }));
    
    // Update the story with the new asset references
    const updatedSpacesSection = {
      ...spacesSection,
      spaces: updatedSpaces
    };
    
    const updatedBody = homeStory.content.body.map(block => 
      block.component === 'spaces_section' ? updatedSpacesSection : block
    );
    
    const updatedContent = {
      ...homeStory.content,
      body: updatedBody
    };
    
    console.log('\n📝 Updating story with new asset references...');
    await updateStory(homeStory.id, {
      ...homeStory,
      content: updatedContent
    });
    
    console.log('✅ Story updated and published');
    console.log('');
    console.log('🎉 Spaces images uploaded successfully!');
    console.log('');
    console.log('📝 Summary:');
    updatedSpaces.forEach((space, index) => {
      const photoCount = space.space_photos ? space.space_photos.length : 0;
      console.log(`   ${index + 1}. ${space.space_name}: ${photoCount} photos`);
    });
    console.log('');
    console.log('🔗 Next steps:');
    console.log('   1. Check Storyblok admin to see the uploaded assets');
    console.log('   2. Test the Visual Editor with the new image assets');
    console.log('   3. Verify images display correctly on the frontend');
    
  } catch (error) {
    console.error('❌ Error uploading images:', error.message);
    process.exit(1);
  }
}

uploadSpacesImages();