#!/usr/bin/env node

const StoryblokClient = require('storyblok-js-client').default;

// Initialize Storyblok Management API client
const Storyblok = new StoryblokClient({
  oauthToken: process.env.STORYBLOK_PERSONAL_ACCESS_TOKEN
});

async function updateRumRiverExperienceImage() {
  try {
    const spaceId = process.env.SPACE_ID;

    if (!spaceId) {
      console.error('SPACE_ID environment variable is required');
      process.exit(1);
    }

    console.log('Fetching home story...');

    const listResponse = await Storyblok.get(`spaces/${spaceId}/stories`, {
      with_slug: 'home'
    });

    if (!listResponse.data.stories || listResponse.data.stories.length === 0) {
      console.error('Home story not found');
      process.exit(1);
    }

    const homeStoryId = listResponse.data.stories[0].id;
    console.log('Found home story ID:', homeStoryId);

    const homeResponse = await Storyblok.get(`spaces/${spaceId}/stories/${homeStoryId}`);
    const homeStory = homeResponse.data.story;

    if (!homeStory.content || !homeStory.content.body) {
      console.error('Story content or body is missing');
      process.exit(1);
    }

    // Find the rum_river_experience block
    const experienceIndex = homeStory.content.body.findIndex(block =>
      block.component === 'rum_river_experience'
    );

    if (experienceIndex === -1) {
      console.error('Rum River Experience section not found in home story');
      process.exit(1);
    }

    console.log('Found Rum River Experience section at index:', experienceIndex);

    // Update the block with new image
    const updatedBody = [...homeStory.content.body];
    const experienceBlock = updatedBody[experienceIndex];

    experienceBlock.image = {
      filename: 'https://images.ctfassets.net/qqjgd2e69j47/3q98p75VUiiBiTC5g8CIwr/e98b7c0f292754187fd889300705524e/wedding-celebration.jpg',
      alt: 'Wedding celebration at Rum River Barn'
    };

    console.log('Updating story with new image...');

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

    try {
      console.log('Now attempting to publish...');
      const publishResponse = await Storyblok.post(`spaces/${spaceId}/stories/${homeStory.id}/publish`);
      console.log('✅ Successfully published the story!');
      console.log('Published at:', publishResponse.data.story?.published_at);
    } catch (publishError) {
      console.warn('⚠️ Story updated but publish failed:', publishError.message);
      console.log('You can manually publish the story in Storyblok CMS');
    }

    console.log('✅ Rum River Experience image successfully updated!');

  } catch (error) {
    console.error('❌ Error updating Rum River Experience image:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
    }
    process.exit(1);
  }
}

updateRumRiverExperienceImage();
