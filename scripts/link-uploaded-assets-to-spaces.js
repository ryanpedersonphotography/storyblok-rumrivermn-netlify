#!/usr/bin/env node

/**
 * Script to link the uploaded assets to the spaces
 * Usage: node scripts/link-uploaded-assets-to-spaces.js
 */

const SPACE_ID = process.env.SPACE_ID || '288003424841711';
const MANAGEMENT_TOKEN = process.env.STORYBLOK_PERSONAL_ACCESS_TOKEN;

if (!MANAGEMENT_TOKEN) {
  console.error('❌ Please set STORYBLOK_PERSONAL_ACCESS_TOKEN environment variable');
  process.exit(1);
}

async function getStory(slug) {
  const response = await fetch(
    `https://mapi.storyblok.com/v1/spaces/${SPACE_ID}/stories?with_slug=${slug}`,
    { headers: { 'Authorization': MANAGEMENT_TOKEN } }
  );
  
  const data = await response.json();
  const story = data.stories[0];
  
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
    throw new Error(`Failed to update story: ${await response.text()}`);
  }
  
  return response.json();
}

async function getAssets() {
  const response = await fetch(
    `https://mapi.storyblok.com/v1/spaces/${SPACE_ID}/assets?per_page=50`,
    { headers: { 'Authorization': MANAGEMENT_TOKEN } }
  );
  
  const data = await response.json();
  return data.assets;
}

async function linkAssetsToSpaces() {
  try {
    console.log('🔗 Linking uploaded assets to spaces...');
    
    // Get assets and story
    const assets = await getAssets();
    const homeStory = await getStory('home');
    const spacesSection = homeStory.content.body.find(block => block.component === 'spaces_section');
    
    if (!spacesSection || !spacesSection.spaces) {
      throw new Error('Spaces section not found');
    }
    
    // Find the most recent assets for each image we need
    const assetMap = {
      'barn-exterior-full-deck-view-evening.jpg': assets.find(a => a.filename.includes('barn-exterior-full-deck-view-evening.jpg')),
      '001.jpg': assets.find(a => a.filename.includes('001.jpg')),
      '015.jpg': assets.filter(a => a.filename.includes('015.jpg')), // Multiple 015.jpg files
      '020.jpg': assets.find(a => a.filename.includes('020.jpg')),
      '008.jpg': assets.find(a => a.filename.includes('008.jpg')),
      '025.jpg': assets.find(a => a.filename.includes('025.jpg')),
      '010.jpg': assets.find(a => a.filename.includes('010.jpg')),
      '040.jpg': assets.find(a => a.filename.includes('040.jpg'))
    };
    
    console.log('📋 Found assets:');
    Object.entries(assetMap).forEach(([filename, asset]) => {
      if (Array.isArray(asset)) {
        console.log(`   ${filename}: ${asset.length} copies found`);
      } else if (asset) {
        console.log(`   ${filename}: ID ${asset.id}`);
      } else {
        console.log(`   ${filename}: NOT FOUND`);
      }
    });
    
    // Update each space with proper asset references
    const updatedSpaces = spacesSection.spaces.map((space, index) => {
      console.log(`\n🏗️  Updating ${space.space_name}...`);
      
      let updatedPhotos = [];
      
      if (space.space_name === 'The Historic Barn') {
        updatedPhotos = [
          { id: assetMap['barn-exterior-full-deck-view-evening.jpg']?.id, filename: assetMap['barn-exterior-full-deck-view-evening.jpg']?.filename, focus: null, name: 'Barn Exterior', alt: 'Historic Barn exterior view' },
          { id: assetMap['001.jpg']?.id, filename: assetMap['001.jpg']?.filename, focus: null, name: 'Barn Interior', alt: 'Historic Barn interior' },
          { id: assetMap['015.jpg'][0]?.id, filename: assetMap['015.jpg'][0]?.filename, focus: null, name: 'Barn Event', alt: 'Historic Barn event space' }
        ].filter(photo => photo.id); // Remove any that failed to upload
      }
      
      else if (space.space_name === 'Bridal Suite') {
        updatedPhotos = [
          { id: assetMap['020.jpg']?.id, filename: assetMap['020.jpg']?.filename, focus: null, name: 'Bridal Suite', alt: 'Bridal Suite preparation area' },
          { id: assetMap['015.jpg'][1]?.id, filename: assetMap['015.jpg'][1]?.filename, focus: null, name: 'Bridal Area', alt: 'Bridal Suite details' }
        ].filter(photo => photo.id);
      }
      
      else if (space.space_name === "Groom's Quarters") {
        updatedPhotos = [
          { id: assetMap['008.jpg']?.id, filename: assetMap['008.jpg']?.filename, focus: null, name: "Groom's Quarters", alt: "Groom's preparation space" },
          { id: assetMap['025.jpg']?.id, filename: assetMap['025.jpg']?.filename, focus: null, name: 'Groom Area', alt: "Groom's Quarters details" }
        ].filter(photo => photo.id);
      }
      
      else if (space.space_name === 'Garden Pavilion') {
        updatedPhotos = [
          { id: assetMap['010.jpg']?.id, filename: assetMap['010.jpg']?.filename, focus: null, name: 'Garden Pavilion', alt: 'Garden Pavilion ceremony space' },
          { id: assetMap['040.jpg']?.id, filename: assetMap['040.jpg']?.filename, focus: null, name: 'Pavilion Ceremony', alt: 'Garden Pavilion in use' }
        ].filter(photo => photo.id);
      }
      
      console.log(`   📸 Updated with ${updatedPhotos.length} photos`);
      
      return {
        ...space,
        space_photos: updatedPhotos
      };
    });
    
    // Update the story
    const updatedSpacesSection = {
      ...spacesSection,
      spaces: updatedSpaces
    };
    
    const updatedBody = homeStory.content.body.map(block => 
      block.component === 'spaces_section' ? updatedSpacesSection : block
    );
    
    console.log('\n📝 Updating story with asset references...');
    await updateStory(homeStory.id, {
      ...homeStory,
      content: { ...homeStory.content, body: updatedBody }
    });
    
    console.log('✅ Story updated and published\n');
    console.log('🎉 Assets successfully linked to spaces!\n');
    console.log('📝 Summary:');
    updatedSpaces.forEach((space, index) => {
      console.log(`   ${index + 1}. ${space.space_name}: ${space.space_photos.length} photos linked`);
    });
    console.log('\n🔗 Next steps:');
    console.log('   1. Check the Visual Editor - images should now be visible');
    console.log('   2. Test the frontend - images should display properly');
    console.log('   3. Clean up duplicate assets in Storyblok admin if needed');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

linkAssetsToSpaces();