#!/usr/bin/env node

const StoryblokClient = require('storyblok-js-client').default;

// Initialize Storyblok Management API client
const Storyblok = new StoryblokClient({
  oauthToken: process.env.STORYBLOK_PERSONAL_ACCESS_TOKEN
});

async function publishHome() {
  try {
    const spaceId = process.env.SPACE_ID;
    
    if (!spaceId) {
      console.error('SPACE_ID environment variable is required');
      process.exit(1);
    }

    console.log('Publishing home story...');
    
    // Get the story list to find the home story ID
    const listResponse = await Storyblok.get(`spaces/${spaceId}/stories`, {
      with_slug: 'home'
    });
    
    if (!listResponse.data.stories || listResponse.data.stories.length === 0) {
      console.error('Home story not found');
      process.exit(1);
    }
    
    const homeStoryId = listResponse.data.stories[0].id;
    console.log('Found home story ID:', homeStoryId);
    
    // Publish the story using the correct GET endpoint
    console.log('Publishing story via Management API...');
    const publishResponse = await Storyblok.get(`spaces/${spaceId}/stories/${homeStoryId}/publish`);
    
    console.log('✅ Successfully published the home story!');
    console.log('Publish response:', publishResponse.status);
    
    // Verify the story is published by fetching it again
    const verifyResponse = await Storyblok.get(`spaces/${spaceId}/stories/${homeStoryId}`);
    const verifyStory = verifyResponse.data.story;
    
    console.log('\n=== VERIFICATION ===');
    console.log('Story published:', verifyStory.published);
    console.log('Unpublished changes:', verifyStory.unpublished_changes);
    console.log('Published at:', verifyStory.published_at);
    
    if (verifyStory.published && !verifyStory.unpublished_changes) {
      console.log('🎉 Home story is now live with the spaces section!');
    } else {
      console.log('⚠️ Story may still have unpublished changes');
    }
    
  } catch (error) {
    console.error('❌ Error publishing home story:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
  }
}

publishHome();