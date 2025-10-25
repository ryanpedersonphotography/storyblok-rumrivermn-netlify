#!/usr/bin/env node

const StoryblokClient = require('storyblok-js-client').default;

// Initialize Storyblok Management API client
const Storyblok = new StoryblokClient({
  oauthToken: process.env.STORYBLOK_PERSONAL_ACCESS_TOKEN
});

async function cleanAndPublishHome() {
  try {
    const spaceId = process.env.SPACE_ID;
    
    if (!spaceId) {
      console.error('SPACE_ID environment variable is required');
      process.exit(1);
    }

    console.log('Cleaning up duplicate spaces sections...');
    
    // Get the story list to find the home story ID
    const listResponse = await Storyblok.get(`spaces/${spaceId}/stories`, {
      with_slug: 'home'
    });
    
    const homeStoryId = listResponse.data.stories[0].id;
    
    // Fetch the full story with content
    const homeResponse = await Storyblok.get(`spaces/${spaceId}/stories/${homeStoryId}`);
    const homeStory = homeResponse.data.story;
    
    console.log('Current story has', homeStory.content.body.length, 'blocks');
    
    // Remove duplicate spaces_section blocks (keep only the first one)
    let spacesFound = 0;
    const cleanedBody = homeStory.content.body.filter(block => {
      if (block.component === 'spaces_section') {
        spacesFound++;
        return spacesFound === 1; // Keep only the first spaces section
      }
      return true;
    });
    
    console.log(`Removed ${spacesFound - 1} duplicate spaces sections`);
    console.log('Cleaned story will have', cleanedBody.length, 'blocks');
    
    // Update the story with cleaned content
    const updateResponse = await Storyblok.put(`spaces/${spaceId}/stories/${homeStory.id}`, {
      story: {
        ...homeStory,
        content: {
          ...homeStory.content,
          body: cleanedBody
        }
      }
    });
    
    console.log('Story updated successfully!');
    
    // Now publish the story using the correct Management API endpoint
    try {
      console.log('Publishing story...');
      // Use the correct Management API publish endpoint
      const publishUrl = `spaces/${spaceId}/stories/${homeStory.id}/publish`;
      const publishResponse = await Storyblok.post(publishUrl, {});
      
      console.log('✅ Successfully published the home story!');
      console.log('Published at:', new Date().toISOString());
    } catch (publishError) {
      console.warn('⚠️ Story updated but auto-publish failed:', publishError.message);
      console.log('Please manually publish in Storyblok CMS or check the publish endpoint');
    }
    
    console.log('✅ Home page cleaned and ready!');
    
  } catch (error) {
    console.error('❌ Error cleaning home story:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
  }
}

cleanAndPublishHome();