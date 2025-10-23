#!/usr/bin/env node

/**
 * Script to seed alternating blocks content into the home story
 * Usage: node scripts/seed-alternating-blocks.js
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
  
  // Fetch full story details including content
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
        publish: 1  // Auto-publish the changes
      })
    }
  );
  
  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to update story: ${error}`);
  }
  
  return response.json();
}

async function seedAlternatingBlocks() {
  try {
    console.log('🔄 Adding alternating blocks to home story...');
    
    // Get the existing home story
    const homeStory = await getStory('home');
    if (!homeStory) {
      throw new Error('Home story not found');
    }
    
    console.log(`📖 Found home story: ${homeStory.name} (ID: ${homeStory.id})`);
    console.log('📋 Full story structure:', JSON.stringify(homeStory, null, 2));
    
    // Create the alternating blocks content
    const alternatingBlocksContent = {
      _uid: `alternating-blocks-${Date.now()}`,
      component: 'alternating_blocks_section',
      script_accent: 'Your Perfect Venue',
      title: 'Why Choose Rum River Barn',
      description: 'Discover what makes our venue the perfect setting for your unforgettable celebration',
      blocks: [
        {
          _uid: `block-01-${Date.now()}`,
          component: 'alternating_block_item',
          number: '01',
          title: 'A Picturesque Location For Your Special Event',
          lead: 'Near Milaca, Saint Paul, St Cloud, and Brainerd MN',
          content: [
            {
              _uid: `para-01-1-${Date.now()}`,
              component: 'paragraph',
              text: 'When it comes to special occasions such as weddings, birthday parties, or other events, it is important to have the perfect setting. You want to ensure that your event is at a location that people will remember.'
            },
            {
              _uid: `para-01-2-${Date.now()}`,
              component: 'paragraph',
              text: 'Here at Rum River Barn, we understand the importance of your special occasion. We are different from other special event venues because we allow you to pretty much run the show. When you choose us, you do not have to worry about us saying no.'
            },
            {
              _uid: `para-01-3-${Date.now()}`,
              component: 'paragraph',
              text: 'Our goal is to help you have your perfect day. We tend to book up fast, so don\'t wait—call us today at <strong>612-801-0546</strong>!'
            }
          ],
          image: '', // Will be uploaded separately
          image_alt: 'Special event venue with beautiful ceiling beams',
          is_reverse: false
        },
        {
          _uid: `block-02-${Date.now()}`,
          component: 'alternating_block_item',
          number: '02',
          title: 'Rum River Barn & Vineyard',
          lead: 'Milaca, St. Cloud, Saint Paul, and Brainerd MN',
          content: [
            {
              _uid: `para-02-1-${Date.now()}`,
              component: 'paragraph',
              text: 'Nestled within 400 acres of pure country and rustic charm, this is the perfect barn wedding venue in Minnesota. On a peaceful hillside overlooking grape vineyards, mile-long manicured old oak forests, and white pines next to a whispering brook, we offer Minnesota\'s premier barn wedding venue and country special events venue for your custom special event.'
            },
            {
              _uid: `para-02-2-${Date.now()}`,
              component: 'paragraph',
              text: 'Enjoy the serenity, peacefulness, and amazing beauty which has been carved out of the forests and developed for the past 100 years.'
            }
          ],
          image: '', // Will be uploaded separately
          image_alt: 'Rum River Barn and Vineyard with natural wildflowers',
          is_reverse: true
        }
      ]
    };
    
    // Add the alternating blocks to the story body
    const updatedContent = {
      ...homeStory.content,
      body: [
        ...(homeStory.content.body || []),
        alternatingBlocksContent
      ]
    };
    
    // Update the story
    const result = await updateStory(homeStory.id, {
      ...homeStory,
      content: updatedContent
    });
    
    console.log('✅ Added alternating blocks to home story');
    console.log('✅ Story published automatically');
    console.log('');
    console.log('🎉 Alternating blocks content seeded successfully!');
    console.log('');
    console.log('📝 Content added:');
    console.log('   - Section: "Why Choose Rum River Barn"');
    console.log('   - Block 01: "A Picturesque Location"');
    console.log('   - Block 02: "Rum River Barn & Vineyard"');
    console.log('');
    console.log('🔗 Next steps:');
    console.log('   1. Upload images in Storyblok admin for each block');
    console.log('   2. Test the /beta-cms route to see CMS content');
    console.log('   3. Enable FEATURE_CMS_IMAGES=1 when ready');
    
  } catch (error) {
    console.error('❌ Error seeding content:', error.message);
    process.exit(1);
  }
}

seedAlternatingBlocks();