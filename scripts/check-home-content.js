#!/usr/bin/env node

const StoryblokClient = require('storyblok-js-client').default;

// Initialize Storyblok Management API client
const Storyblok = new StoryblokClient({
  oauthToken: process.env.STORYBLOK_PERSONAL_ACCESS_TOKEN
});

async function checkHomeContent() {
  try {
    const spaceId = process.env.SPACE_ID;
    
    if (!spaceId) {
      console.error('SPACE_ID environment variable is required');
      process.exit(1);
    }

    console.log('Fetching home story content...');
    
    // Get the story list to find the home story ID
    const listResponse = await Storyblok.get(`spaces/${spaceId}/stories`, {
      with_slug: 'home'
    });
    
    if (!listResponse.data.stories || listResponse.data.stories.length === 0) {
      console.error('Home story not found');
      process.exit(1);
    }
    
    const homeStoryId = listResponse.data.stories[0].id;
    
    // Fetch the full story with content
    const homeResponse = await Storyblok.get(`spaces/${spaceId}/stories/${homeStoryId}`);
    const homeStory = homeResponse.data.story;
    
    console.log('\n=== HOME STORY CONTENT ===');
    console.log('Story ID:', homeStory.id);
    console.log('Published:', homeStory.published);
    console.log('Unpublished changes:', homeStory.unpublished_changes);
    console.log('\nContent blocks:');
    
    if (homeStory.content && homeStory.content.body) {
      homeStory.content.body.forEach((block, index) => {
        console.log(`${index + 1}. ${block.component} (${block._uid})`);
        if (block.component === 'spaces_section') {
          console.log('   📍 SPACES SECTION FOUND!');
          console.log('   Title:', block.title || 'Default title');
          console.log('   Script accent:', block.script_accent || 'Default accent');
        }
      });
    } else {
      console.log('No content body found');
    }
    
  } catch (error) {
    console.error('❌ Error checking home content:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
    }
  }
}

checkHomeContent();