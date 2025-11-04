#!/usr/bin/env node

/**
 * Script to seed venues content into the spaces_section repeater
 * Usage: node scripts/seed-spaces-venues.js
 * 
 * Populates the spaces repeater with 4 venue spaces:
 * - The Historic Barn
 * - Bridal Suite  
 * - Groom's Quarters
 * - Garden Pavilion
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

function generateUID() {
  return `uid-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

function createFeature(title, blurb) {
  return {
    _uid: generateUID(),
    component: 'feature',
    feature_title: title,
    feature_blurb: blurb
  };
}

function createSpace(name, description, photos, features) {
  return {
    _uid: generateUID(),
    component: 'space',
    space_name: name,
    space_description: description,
    space_photos: photos, // Array of image paths
    space_features: features.map(([title, blurb]) => createFeature(title, blurb))
  };
}

async function seedSpacesVenues() {
  try {
    console.log('🔄 Seeding venues into spaces_section...');
    
    // Get the existing home story
    const homeStory = await getStory('home');
    if (!homeStory) {
      throw new Error('Home story not found');
    }
    
    console.log(`📖 Found home story: ${homeStory.name} (ID: ${homeStory.id})`);
    
    // Find the spaces_section in the story
    const spacesSection = homeStory.content.body.find(block => block.component === 'spaces_section');
    if (!spacesSection) {
      throw new Error('spaces_section not found in home story. Please add it first.');
    }
    
    console.log('📍 Found spaces_section, populating with venue data...');
    
    // Create the venue spaces data
    const venueSpaces = [
      createSpace(
        'The Historic Barn',
        'Our crown jewel, this beautifully restored barn features soaring ceilings, original timber beams, and modern amenities seamlessly integrated into its historic charm.',
        [
          '/images/barn-exterior-full-deck-view-evening.jpg',
          '/images/real-weddings/anthony-and-linnea/photos/001.jpg',
          '/images/real-weddings/kyle-carrie/photos/015.jpg'
        ],
        [
          ['Capacity', 'Up to 300 guests'],
          ['Built', '1920s architecture'],
          ['Features', 'Climate controlled'],
          ['Style', 'Rustic elegance']
        ]
      ),
      createSpace(
        'Bridal Suite',
        'A luxurious private space for the bride and bridal party to prepare for the big day.',
        [
          '/images/real-weddings/emily-and-barron-nixon/photos/020.jpg',
          '/images/real-weddings/mattea-courtney-photo-gallery/photos/015.jpg'
        ],
        [
          ['Capacity', 'Up to 8 people'],
          ['Amenities', 'Full mirror, seating'],
          ['Natural Light', 'Large windows'],
          ['Privacy', 'Separate entrance']
        ]
      ),
      createSpace(
        'Groom\'s Quarters',
        'A comfortable retreat for the groom and groomsmen.',
        [
          '/images/real-weddings/joshua-and-teri/photos/008.jpg',
          '/images/real-weddings/anthony-and-linnea/photos/025.jpg'
        ],
        [
          ['Capacity', 'Up to 6 people'],
          ['Atmosphere', 'Relaxed and private'],
          ['Amenities', 'Comfortable seating'],
          ['Access', 'Separate entrance']
        ]
      ),
      createSpace(
        'Garden Pavilion',
        'An enchanting outdoor space perfect for ceremonies or cocktail hours.',
        [
          '/images/real-weddings/loria-and-jason-rolstad-agape/photos/010.jpg',
          '/images/real-weddings/kyle-carrie/photos/040.jpg'
        ],
        [
          ['Setting', 'Outdoor garden'],
          ['Use', 'Ceremonies, cocktails'],
          ['Atmosphere', 'Natural beauty'],
          ['Capacity', 'Up to 200 guests']
        ]
      )
    ];
    
    // Update the spaces_section with the new repeater data
    const updatedSpacesSection = {
      ...spacesSection,
      spaces: venueSpaces
    };
    
    // Update the story content
    const updatedBody = homeStory.content.body.map(block => 
      block.component === 'spaces_section' ? updatedSpacesSection : block
    );
    
    const updatedContent = {
      ...homeStory.content,
      body: updatedBody
    };
    
    // Save the updated story
    const result = await updateStory(homeStory.id, {
      ...homeStory,
      content: updatedContent
    });
    
    console.log('✅ Seeded venues into spaces_section');
    console.log('✅ Story published automatically');
    console.log('');
    console.log('🎉 Venue spaces seeded successfully!');
    console.log('');
    console.log('📝 Venues added:');
    console.log('   - The Historic Barn (4 features, 3 photos)');
    console.log('   - Bridal Suite (4 features, 2 photos)');
    console.log('   - Groom\'s Quarters (4 features, 2 photos)');
    console.log('   - Garden Pavilion (4 features, 2 photos)');
    console.log('');
    console.log('🔗 Next steps:');
    console.log('   1. Update Spaces.tsx component to use blok.spaces instead of hardcoded venues');
    console.log('   2. Test the Visual Editor to see the new repeater fields');
    console.log('   3. Clean up old barn/bridal/groom/pavilion fields (optional)');
    
  } catch (error) {
    console.error('❌ Error seeding venues:', error.message);
    process.exit(1);
  }
}

seedSpacesVenues();