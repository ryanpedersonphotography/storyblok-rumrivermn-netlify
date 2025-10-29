#!/usr/bin/env node

const StoryblokClient = require('storyblok-js-client').default;

// Initialize Storyblok Management API client
const Storyblok = new StoryblokClient({
  oauthToken: process.env.STORYBLOK_PERSONAL_ACCESS_TOKEN
});

async function updateHistoryTitle() {
  try {
    const spaceId = process.env.SPACE_ID;
    
    if (!spaceId) {
      console.error('SPACE_ID environment variable is required');
      process.exit(1);
    }

    console.log('Fetching home story...');
    
    // Get the home story
    const listResponse = await Storyblok.get(`spaces/${spaceId}/stories`, {
      with_slug: 'home'
    });
    
    if (!listResponse.data.stories || listResponse.data.stories.length === 0) {
      console.error('Home story not found');
      process.exit(1);
    }
    
    const homeStoryId = listResponse.data.stories[0].id;
    console.log('Found home story ID:', homeStoryId);
    
    // Fetch the full story
    const homeResponse = await Storyblok.get(`spaces/${spaceId}/stories/${homeStoryId}`);
    const homeStory = homeResponse.data.story;
    
    if (!homeStory.content || !homeStory.content.body) {
      console.error('Story content or body is missing');
      process.exit(1);
    }
    
    // Find the history carousel section
    const historyIndex = homeStory.content.body.findIndex(block => 
      block.component === 'history_carousel'
    );
    
    if (historyIndex === -1) {
      console.error('History carousel section not found');
      console.log('Available components:');
      homeStory.content.body.forEach((block, index) => {
        console.log(`${index}: ${block.component}`);
      });
      process.exit(1);
    }
    
    console.log('Found history carousel at index:', historyIndex);
    
    // Update the history carousel title
    const updatedBody = [...homeStory.content.body];
    updatedBody[historyIndex] = {
      ...updatedBody[historyIndex],
      section_title: 'Journey Through Our History'
    };
    
    console.log('Updating history carousel title...');
    
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
    
    // Publish the changes
    try {
      console.log('Publishing the updated story...');
      const publishResponse = await Storyblok.post(`spaces/${spaceId}/stories/${homeStory.id}/publish`);
      console.log('✅ Successfully published the story!');
      console.log('Published at:', publishResponse.data.story?.published_at);
    } catch (publishError) {
      console.warn('⚠️ Story updated but publish failed:', publishError.message);
      console.log('You can manually publish the story in Storyblok CMS');
    }
    
    console.log('✅ History carousel title updated to "Journey Through Our History"!');
    
  } catch (error) {
    console.error('❌ Error updating history title:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
    }
    process.exit(1);
  }
}

// Run the script
updateHistoryTitle();