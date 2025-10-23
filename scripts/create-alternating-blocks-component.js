#!/usr/bin/env node

/**
 * Script to create alternating blocks component in Storyblok
 * Usage: node scripts/create-alternating-blocks-component.js
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

async function createAlternatingBlocksComponent() {
  try {
    console.log('🔄 Creating alternating blocks component in Storyblok...');
    
    // Create the alternating blocks section component
    const alternatingBlocksComponent = {
      name: 'alternating_blocks_section',
      display_name: 'Alternating Blocks Section',
      schema: {
        script_accent: {
          type: 'text',
          pos: 0,
          translatable: true,
          description: 'Script accent text (e.g., "Your Perfect Venue")',
          display_name: 'Script Accent',
          default_value: 'Your Perfect Venue'
        },
        title: {
          type: 'text',
          pos: 1,
          translatable: true,
          description: 'Main section title',
          display_name: 'Section Title',
          default_value: 'Why Choose Rum River Barn'
        },
        description: {
          type: 'textarea',
          pos: 2,
          translatable: true,
          description: 'Section description',
          display_name: 'Description',
          default_value: 'Discover what makes our venue the perfect setting for your unforgettable celebration'
        },
        blocks: {
          type: 'bloks',
          pos: 3,
          translatable: true,
          description: 'Alternating content blocks',
          display_name: 'Blocks',
          restrict_components: true,
          component_whitelist: ['alternating_block_item']
        }
      },
      is_root: false,
      is_nestable: true,
      all_presets: [],
      preset_id: null,
      real_name: 'alternating_blocks_section',
      component_group_uuid: null
    };

    const result1 = await createComponent(alternatingBlocksComponent);
    console.log('✅ Created alternating blocks section component');

    // Create the block item component
    const blockItemComponent = {
      name: 'alternating_block_item',
      display_name: 'Alternating Block Item',
      schema: {
        number: {
          type: 'text',
          pos: 0,
          translatable: false,
          description: 'Block number (e.g., "01", "02")',
          display_name: 'Number',
          default_value: '01'
        },
        title: {
          type: 'text',
          pos: 1,
          translatable: true,
          description: 'Block title',
          display_name: 'Title',
          default_value: 'Block Title'
        },
        lead: {
          type: 'text',
          pos: 2,
          translatable: true,
          description: 'Lead text (subtitle)',
          display_name: 'Lead Text',
          default_value: 'Lead text goes here'
        },
        content: {
          type: 'bloks',
          pos: 3,
          translatable: true,
          description: 'Block content paragraphs',
          display_name: 'Content',
          restrict_components: true,
          component_whitelist: ['paragraph']
        },
        image: {
          type: 'asset',
          pos: 4,
          translatable: false,
          description: 'Block image',
          display_name: 'Image',
          filetypes: ['images']
        },
        image_alt: {
          type: 'text',
          pos: 5,
          translatable: true,
          description: 'Image alt text for accessibility',
          display_name: 'Image Alt Text',
          default_value: 'Venue image'
        },
        is_reverse: {
          type: 'boolean',
          pos: 6,
          translatable: false,
          description: 'Reverse layout (image left, content right)',
          display_name: 'Reverse Layout',
          default_value: false
        }
      },
      is_root: false,
      is_nestable: true,
      all_presets: [],
      preset_id: null,
      real_name: 'alternating_block_item',
      component_group_uuid: null
    };

    const result2 = await createComponent(blockItemComponent);
    console.log('✅ Created alternating block item component');

    // Create paragraph component if it doesn't exist
    const paragraphComponent = {
      name: 'paragraph',
      display_name: 'Paragraph',
      schema: {
        text: {
          type: 'richtext',
          pos: 0,
          translatable: true,
          description: 'Paragraph text content',
          display_name: 'Text',
          toolbar: ['bold', 'italic', 'underline', 'link']
        }
      },
      is_root: false,
      is_nestable: true,
      all_presets: [],
      preset_id: null,
      real_name: 'paragraph',
      component_group_uuid: null
    };

    try {
      const result3 = await createComponent(paragraphComponent);
      console.log('✅ Created paragraph component');
    } catch (error) {
      if (error.message.includes('already exists')) {
        console.log('ℹ️  Paragraph component already exists');
      } else {
        throw error;
      }
    }

    console.log('🎉 Alternating blocks components created successfully!');
    console.log('📝 Components created:');
    console.log('   - alternating_blocks_section');
    console.log('   - alternating_block_item');
    console.log('   - paragraph');
    console.log('');
    console.log('🔗 Next steps:');
    console.log('   1. Go to Storyblok admin');
    console.log('   2. Edit the "home" story');
    console.log('   3. Add "Alternating Blocks Section" component to the body');
    console.log('   4. Configure with venue content');
    
  } catch (error) {
    console.error('❌ Error creating components:', error.message);
    process.exit(1);
  }
}

createAlternatingBlocksComponent();