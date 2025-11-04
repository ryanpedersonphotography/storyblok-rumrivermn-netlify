#!/usr/bin/env node

/**
 * Script to create spaces components in Storyblok using repeater pattern
 * Usage: node scripts/create-spaces-components.js
 * 
 * Creates:
 * - feature (for venue features like "Capacity: Up to 300 guests")
 * - space (for individual venues like barn, bridal, etc.)
 * - Updates spaces_section to use repeater instead of hardcoded fields
 */

const SPACE_ID = process.env.SPACE_ID || '288003424841711';
const MANAGEMENT_TOKEN = process.env.STORYBLOK_PERSONAL_ACCESS_TOKEN;

if (!MANAGEMENT_TOKEN) {
  console.error('❌ Please set STORYBLOK_PERSONAL_ACCESS_TOKEN environment variable');
  process.exit(1);
}

async function createComponent(componentData) {
  const response = await fetch(
    `https://mapi.storyblok.com/v1/spaces/${SPACE_ID}/components`,
    {
      method: 'POST',
      headers: {
        'Authorization': MANAGEMENT_TOKEN,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ component: componentData })
    }
  );
  
  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to create component: ${error}`);
  }
  
  return response.json();
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

async function createSpacesComponents() {
  try {
    console.log('🔄 Creating spaces components in Storyblok...');
    
    // Get existing components to check what exists
    const existingComponents = await getExistingComponents();
    const existingNames = existingComponents.map(c => c.name);
    
    // Create feature component (for venue features like "Capacity: Up to 300 guests")
    if (!existingNames.includes('feature')) {
      const featureComponent = {
        name: 'feature',
        display_name: 'Feature',
        schema: {
          feature_title: {
            type: 'text',
            pos: 0,
            translatable: true,
            description: 'Feature label (e.g., "Capacity", "Built", "Style")',
            display_name: 'Feature Title',
            default_value: 'Feature'
          },
          feature_blurb: {
            type: 'text',
            pos: 1,
            translatable: true,
            description: 'Feature value (e.g., "Up to 300 guests", "1920s architecture")',
            display_name: 'Feature Description',
            default_value: 'Feature description'
          }
        },
        is_root: false,
        is_nestable: true,
        all_presets: [],
        preset_id: null,
        real_name: 'feature',
        component_group_uuid: null
      };

      await createComponent(featureComponent);
      console.log('✅ Created feature component');
    } else {
      console.log('ℹ️  Feature component already exists');
    }

    // Create space component (for individual venues)
    if (!existingNames.includes('space')) {
      const spaceComponent = {
        name: 'space',
        display_name: 'Space',
        schema: {
          space_name: {
            type: 'text',
            pos: 0,
            translatable: true,
            description: 'Space name (shows on filter tab and above description)',
            display_name: 'Space Name',
            default_value: 'Venue Space'
          },
          space_photos: {
            type: 'multiasset',
            pos: 1,
            translatable: false,
            description: 'Multiple images for carousel',
            display_name: 'Space Photos',
            filetypes: ['images']
          },
          space_description: {
            type: 'textarea',
            pos: 2,
            translatable: true,
            description: 'Description of this space',
            display_name: 'Space Description',
            default_value: 'Description of this beautiful space'
          },
          space_features: {
            type: 'bloks',
            pos: 3,
            translatable: true,
            description: 'Features for this space (max 4)',
            display_name: 'Features',
            restrict_components: true,
            component_whitelist: ['feature'],
            maximum: 4
          }
        },
        is_root: false,
        is_nestable: true,
        all_presets: [],
        preset_id: null,
        real_name: 'space',
        component_group_uuid: null
      };

      await createComponent(spaceComponent);
      console.log('✅ Created space component');
    } else {
      console.log('ℹ️  Space component already exists');
    }

    // Update spaces_section component to use repeater
    const spacesSection = existingComponents.find(c => c.name === 'spaces_section');
    if (spacesSection) {
      const updatedSchema = {
        ...spacesSection.schema,
        spaces: {
          type: 'bloks',
          pos: 10, // After existing fields
          translatable: true,
          description: 'Venue spaces (exactly 4)',
          display_name: 'Spaces',
          restrict_components: true,
          component_whitelist: ['space'],
          maximum: 4,
          minimum: 4
        }
      };

      const updatedSpacesSection = {
        ...spacesSection,
        schema: updatedSchema
      };

      await updateComponent(spacesSection.id, updatedSpacesSection);
      console.log('✅ Updated spaces_section to include spaces repeater');
    } else {
      console.error('❌ spaces_section component not found. Please create it first.');
    }

    console.log('🎉 Spaces components created/updated successfully!');
    console.log('📝 Components ready:');
    console.log('   - feature (venue feature items)');
    console.log('   - space (individual venue spaces)');
    console.log('   - spaces_section (updated with spaces repeater)');
    console.log('');
    console.log('🔗 Next steps:');
    console.log('   1. Run seed-spaces-venues.js to populate with content');
    console.log('   2. Go to Storyblok admin to see the new repeater fields');
    console.log('   3. Update the Spaces component to use blok.spaces instead of hardcoded venues');
    
  } catch (error) {
    console.error('❌ Error creating components:', error.message);
    process.exit(1);
  }
}

createSpacesComponents();