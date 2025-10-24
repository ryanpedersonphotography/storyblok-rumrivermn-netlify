#!/usr/bin/env node

/**
 * Script to add hero_image_index field to real_wedding schema
 * This allows selecting a gallery photo as the hero image
 * Run with: node scripts/update-wedding-hero-field.mjs
 */

import StoryblokClient from 'storyblok-js-client';

const Storyblok = new StoryblokClient({
  oauthToken: process.env.STORYBLOK_PERSONAL_ACCESS_TOKEN || process.env.STORYBLOK_MANAGEMENT_TOKEN
});

const SPACE_ID = '288003424841711';

async function updateRealWeddingSchema() {
  console.log('🔧 Updating real_wedding schema to add hero_image_index field...\n');

  try {
    // First, get the existing component
    const response = await Storyblok.get(`spaces/${SPACE_ID}/components`);
    const realWeddingComponent = response.data.components.find(c => c.name === 'real_wedding');

    if (!realWeddingComponent) {
      console.error('❌ Could not find real_wedding component');
      process.exit(1);
    }

    console.log('📋 Found real_wedding component (ID: ' + realWeddingComponent.id + ')');

    // Add the new field to the schema
    const updatedSchema = {
      ...realWeddingComponent.schema,
      hero_image_index: {
        type: 'number',
        pos: 8.5, // Between hero_image (8) and cover_image (9)
        display_name: 'Hero Image from Gallery (Index)',
        description: 'Optional: Select which gallery photo to use as hero (0 = first photo, 1 = second photo, etc.). Leave empty to use the uploaded Hero Image instead.'
      }
    };

    // Update the component
    await Storyblok.put(`spaces/${SPACE_ID}/components/${realWeddingComponent.id}`, {
      component: {
        ...realWeddingComponent,
        schema: updatedSchema
      }
    });

    console.log('✅ Added hero_image_index field to real_wedding schema');
    console.log('\n📝 How it works:');
    console.log('  - Leave hero_image_index empty: Uses uploaded Hero Image');
    console.log('  - Set hero_image_index to 0: Uses first gallery photo as hero');
    console.log('  - Set hero_image_index to 1: Uses second gallery photo as hero');
    console.log('  - And so on...');
    console.log('\n✅ Update complete!');

  } catch (error) {
    console.error('❌ Error updating schema:', error.response?.data || error.message);
    process.exit(1);
  }
}

updateRealWeddingSchema();
