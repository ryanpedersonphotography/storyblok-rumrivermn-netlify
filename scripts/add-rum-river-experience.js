#!/usr/bin/env node

const StoryblokClient = require('storyblok-js-client').default;

// Initialize Storyblok Management API client
const Storyblok = new StoryblokClient({
  oauthToken: process.env.STORYBLOK_PERSONAL_ACCESS_TOKEN
});

async function addRumRiverExperience() {
  try {
    // Get space ID from environment or use the space ID from your Storyblok space
    const spaceId = process.env.SPACE_ID;

    if (!spaceId) {
      console.error('SPACE_ID environment variable is required');
      process.exit(1);
    }

    console.log('Fetching home story...');

    // First, get the story list to find the home story ID
    const listResponse = await Storyblok.get(`spaces/${spaceId}/stories`, {
      with_slug: 'home'
    });

    if (!listResponse.data.stories || listResponse.data.stories.length === 0) {
      console.error('Home story not found');
      process.exit(1);
    }

    const homeStoryId = listResponse.data.stories[0].id;
    console.log('Found home story ID:', homeStoryId);

    // Now fetch the full story with content
    const homeResponse = await Storyblok.get(`spaces/${spaceId}/stories/${homeStoryId}`);
    const homeStory = homeResponse.data.story;
    console.log('Found home story:', homeStory.slug);
    console.log('Story has content:', !!homeStory.content);

    // Find the love stories gallery section index
    if (!homeStory.content || !homeStory.content.body) {
      console.error('Story content or body is missing');
      process.exit(1);
    }

    // Check if rum_river_experience already exists
    const existingIndex = homeStory.content.body.findIndex(block =>
      block.component === 'rum_river_experience'
    );

    if (existingIndex !== -1) {
      console.log('⚠️ Rum River Experience section already exists at index:', existingIndex);
      console.log('Skipping addition to avoid duplicates');
      return;
    }

    const loveStoriesIndex = homeStory.content.body.findIndex(block =>
      block.component === 'love_stories_gallery'
    );

    if (loveStoriesIndex === -1) {
      console.error('Love Stories Gallery section not found in home story');
      process.exit(1);
    }

    console.log('Found Love Stories Gallery section at index:', loveStoriesIndex);

    // Create the rum river experience block
    const rumRiverExperienceBlock = {
      _uid: Date.now().toString(), // Generate a unique ID
      component: 'rum_river_experience',
      subtitle: 'The Rum River Experience',
      title: 'More Than a Venue',
      description: "At Rum River Barn, we believe your wedding day should be more than just beautiful—it should be unforgettable. Nestled along the banks of the historic Rum River, our venue offers a unique blend of rustic charm and natural elegance that creates the perfect backdrop for your love story.",
      features: [
        {
          _uid: (Date.now() + 1).toString(),
          icon: '🌿',
          title: 'Natural Beauty',
          description: 'Surrounded by pristine woodlands and the scenic Rum River'
        },
        {
          _uid: (Date.now() + 2).toString(),
          icon: '✨',
          title: 'Authentic Charm',
          description: 'Rustic elegance that captures the spirit of Minnesota'
        },
        {
          _uid: (Date.now() + 3).toString(),
          icon: '❤️',
          title: 'Personal Touch',
          description: 'Dedicated team committed to bringing your vision to life'
        },
        {
          _uid: (Date.now() + 4).toString(),
          icon: '🎉',
          title: 'Complete Experience',
          description: 'Everything you need for an unforgettable celebration'
        }
      ],
      image: {
        filename: 'https://a.storyblok.com/f/296659/1920x1280/c5c8e1e5c0/placeholder-barn.jpg',
        alt: 'Rum River Barn Experience'
      }
    };

    // Insert the rum river experience section BEFORE the love stories gallery
    const updatedBody = [...homeStory.content.body];
    updatedBody.splice(loveStoriesIndex, 0, rumRiverExperienceBlock);

    console.log('Updating story with Rum River Experience section...');

    // Update the story
    const updateResponse = await Storyblok.put(`spaces/${spaceId}/stories/${homeStory.id}`, {
      story: {
        ...homeStory,
        content: {
          ...homeStory.content,
          body: updatedBody
        }
      }
    });

    console.log('Story updated successfully!');
    console.log('Story ID:', updateResponse.data.story.id);

    // Try to publish the story
    try {
      console.log('Now attempting to publish...');
      const publishResponse = await Storyblok.post(`spaces/${spaceId}/stories/${homeStory.id}/publish`);
      console.log('✅ Successfully published the story!');
      console.log('Published at:', publishResponse.data.story?.published_at);
    } catch (publishError) {
      console.warn('⚠️ Story updated but publish failed:', publishError.message);
      console.log('You can manually publish the story in Storyblok CMS');
      // Don't exit, the main update was successful
    }

    console.log('✅ Rum River Experience section successfully added to home page!');
    console.log('Position: Before Love Stories Gallery (Weddings at the Barn)');

  } catch (error) {
    console.error('❌ Error adding Rum River Experience section:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
    }
    process.exit(1);
  }
}

// Run the script
addRumRiverExperience();
