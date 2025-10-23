#!/usr/bin/env node

/**
 * Script to update Storyblok component schemas via Management API
 * Usage: node scripts/update-components.js
 */

const SPACE_ID = '287999131965922';
const MANAGEMENT_TOKEN = process.env.STORYBLOK_MANAGEMENT_TOKEN;

if (!MANAGEMENT_TOKEN) {
  console.error('❌ Please set STORYBLOK_MANAGEMENT_TOKEN environment variable');
  process.exit(1);
}

async function updateComponent(componentId, componentData) {
  const response = await fetch(
    `https://mapi.storyblok.com/v1/spaces/${SPACE_ID}/components/${componentId}`,
    {
      method: 'PUT',
      headers: {
        'Authorization': MANAGEMENT_TOKEN,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ component: componentData })
    }
  );
  
  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to update component: ${error}`);
  }
  
  return response.json();
}

async function addImageFieldsToComponents() {
  try {
    console.log('🔄 Updating Storyblok components with image fields...');
    
    // Get existing components first
    const response = await fetch(
      `https://mapi.storyblok.com/v1/spaces/${SPACE_ID}/components`,
      {
        headers: { 'Authorization': MANAGEMENT_TOKEN }
      }
    );
    
    if (!response.ok) {
      throw new Error(`Failed to fetch components: ${await response.text()}`);
    }
    
    const data = await response.json();
    const components = data.components;
    
    // Find teaser component and add image field
    const teaserComponent = components.find(c => c.name === 'teaser');
    if (teaserComponent) {
      teaserComponent.schema.image = {
        type: 'asset',
        pos: 1,
        translatable: false,
        description: 'Hero image for the teaser',
        display_name: 'Hero Image',
        filetypes: ['images']
      };
      
      teaserComponent.schema.description = {
        type: 'textarea',
        pos: 2,
        translatable: true,
        description: 'Description text below the headline',
        display_name: 'Description'
      };
      
      await updateComponent(teaserComponent.id, teaserComponent);
      console.log('✅ Updated teaser component with image and description fields');
    }
    
    // Find feature component and add icon field
    const featureComponent = components.find(c => c.name === 'feature');
    if (featureComponent) {
      featureComponent.schema.icon = {
        type: 'asset',
        pos: 1,
        translatable: false,
        description: 'Icon for the feature',
        display_name: 'Icon',
        filetypes: ['images']
      };
      
      featureComponent.schema.description = {
        type: 'textarea',
        pos: 2,
        translatable: true,
        description: 'Description of the feature',
        display_name: 'Description'
      };
      
      await updateComponent(featureComponent.id, featureComponent);
      console.log('✅ Updated feature component with icon and description fields');
    }
    
    console.log('🎉 Component schemas updated successfully!');
    console.log('📝 You can now add images and descriptions in Storyblok');
    
  } catch (error) {
    console.error('❌ Error updating components:', error.message);
    process.exit(1);
  }
}

addImageFieldsToComponents();