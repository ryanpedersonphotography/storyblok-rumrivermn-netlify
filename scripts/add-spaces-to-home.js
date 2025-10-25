#!/usr/bin/env node

const StoryblokClient = require('storyblok-js-client').default;

// Initialize Storyblok Management API client
const Storyblok = new StoryblokClient({
  oauthToken: process.env.STORYBLOK_PERSONAL_ACCESS_TOKEN
});

async function addSpacesToHome() {
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
    
    // Find the hero section index
    if (!homeStory.content || !homeStory.content.body) {
      console.error('Story content or body is missing');
      process.exit(1);
    }
    
    const heroIndex = homeStory.content.body.findIndex(block => 
      block.component === 'home_hero_section'
    );
    
    if (heroIndex === -1) {
      console.error('Hero section not found in home story');
      process.exit(1);
    }
    
    console.log('Found hero section at index:', heroIndex);
    
    // Create the spaces section block
    const spacesBlock = {
      _uid: Date.now().toString(), // Generate a unique ID
      component: 'spaces_section',
      script_accent: 'Your Perfect Setting',
      title: 'Discover Our Spaces',
      description: 'Every corner tells a story, every space creates memories'
    };
    
    // Insert the spaces section after the hero
    const updatedBody = [...homeStory.content.body];
    updatedBody.splice(heroIndex + 1, 0, spacesBlock);
    
    console.log('Updating story with spaces section...');
    
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
    
    console.log('✅ Spaces section successfully added to home page!');
    
  } catch (error) {
    console.error('❌ Error adding spaces section:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
    }
    process.exit(1);
  }
}

// Run the script
addSpacesToHome();