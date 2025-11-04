#!/usr/bin/env node

/**
 * Script to remove old hardcoded venue fields from spaces_section component
 * Usage: node scripts/cleanup-old-venue-fields.js
 * 
 * Removes: barn, bridal, groom, pavilion fields
 * Keeps: spaces repeater and other valid fields
 */

const SPACE_ID = process.env.SPACE_ID || '288003424841711';
const MANAGEMENT_TOKEN = process.env.STORYBLOK_PERSONAL_ACCESS_TOKEN;

if (!MANAGEMENT_TOKEN) {
  console.error('❌ Please set STORYBLOK_PERSONAL_ACCESS_TOKEN environment variable');
  process.exit(1);
}

async function getExistingComponents() {
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
  return data.components;
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

async function cleanupOldVenueFields() {
  try {
    console.log('🔄 Cleaning up old venue fields from spaces_section...');
    
    // Get existing components
    const existingComponents = await getExistingComponents();
    const spacesSection = existingComponents.find(c => c.name === 'spaces_section');
    
    if (!spacesSection) {
      throw new Error('spaces_section component not found');
    }
    
    console.log('📍 Found spaces_section component');
    console.log('🗂️  Current schema fields:', Object.keys(spacesSection.schema));
    
    // Remove the old venue fields while keeping everything else
    const { barn, bridal, groom, pavilion, ...cleanSchema } = spacesSection.schema;
    
    const fieldsToRemove = ['barn', 'bridal', 'groom', 'pavilion'];
    const removedFields = fieldsToRemove.filter(field => spacesSection.schema[field]);
    
    if (removedFields.length === 0) {
      console.log('ℹ️  No old venue fields found to remove');
      return;
    }
    
    console.log('🗑️  Removing fields:', removedFields);
    
    // Update the component with cleaned schema
    const updatedSpacesSection = {
      ...spacesSection,
      schema: cleanSchema
    };
    
    await updateComponent(spacesSection.id, updatedSpacesSection);
    
    console.log('✅ Successfully removed old venue fields');
    console.log('🗂️  Remaining schema fields:', Object.keys(cleanSchema));
    console.log('');
    console.log('🎉 Cleanup completed successfully!');
    console.log('');
    console.log('📝 Removed fields:');
    removedFields.forEach(field => console.log(`   - ${field}`));
    console.log('');
    console.log('✅ Kept fields:');
    Object.keys(cleanSchema).forEach(field => console.log(`   - ${field}`));
    console.log('');
    console.log('🔗 Next steps:');
    console.log('   1. Test the Visual Editor to confirm old fields are gone');
    console.log('   2. Verify spaces repeater still works correctly');
    console.log('   3. The frontend will automatically use the new spaces repeater');
    
  } catch (error) {
    console.error('❌ Error cleaning up fields:', error.message);
    process.exit(1);
  }
}

cleanupOldVenueFields();