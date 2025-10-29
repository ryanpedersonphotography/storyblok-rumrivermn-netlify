#!/usr/bin/env node

const StoryblokClient = require('storyblok-js-client').default;

// Initialize Storyblok Management API client
const Storyblok = new StoryblokClient({
  oauthToken: process.env.STORYBLOK_PERSONAL_ACCESS_TOKEN
});

async function addPricingToHome() {
  try {
    // Get space ID from environment
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
    
    // Check if story has content
    if (!homeStory.content || !homeStory.content.body) {
      console.error('Story content or body is missing');
      process.exit(1);
    }
    
    // Find the footer section index to insert pricing just before it
    const footerIndex = homeStory.content.body.findIndex(block => 
      block.component === 'footer_section'
    );
    
    if (footerIndex === -1) {
      console.error('Footer section not found in home story');
      console.log('Available components:');
      homeStory.content.body.forEach((block, index) => {
        console.log(`${index}: ${block.component}`);
      });
      process.exit(1);
    }
    
    console.log('Found footer section at index:', footerIndex);
    
    // Check if pricing section already exists
    const existingPricingIndex = homeStory.content.body.findIndex(block => 
      block.component === 'pricing_section'
    );
    
    if (existingPricingIndex !== -1) {
      console.log('Pricing section already exists at index:', existingPricingIndex);
      console.log('Removing existing pricing section and adding new one...');
    }
    
    // Create the pricing section block
    const pricingBlock = {
      _uid: Date.now().toString(), // Generate a unique ID
      component: 'pricing_section',
      script_accent: 'Investment in Forever',
      title: 'Wedding Packages & Pricing',
      hero_line: 'Saturdays from $6,200 • Fridays/Sundays from $5,500 • Weekdays from $4,500',
      description: 'Transparent pricing with no hidden fees. Every package includes tables, chairs, setup, teardown, and on-site coordination.'
    };
    
    // Create updated body array
    let updatedBody = [...homeStory.content.body];
    
    // Remove existing pricing section if it exists
    if (existingPricingIndex !== -1) {
      updatedBody.splice(existingPricingIndex, 1);
      // Adjust footer index if needed
      const newFooterIndex = updatedBody.findIndex(block => 
        block.component === 'footer_section'
      );
      // Insert pricing section just before footer
      updatedBody.splice(newFooterIndex, 0, pricingBlock);
    } else {
      // Insert pricing section just before footer
      updatedBody.splice(footerIndex, 0, pricingBlock);
    }
    
    console.log('Updating story with pricing section...');
    console.log('Total sections after update:', updatedBody.length);
    
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
    
    console.log('✅ Pricing section successfully added to home page!');
    console.log('🎯 The pricing section is now positioned just above the footer');
    
    // Log the final structure
    console.log('\nFinal page structure:');
    updatedBody.forEach((block, index) => {
      const marker = block.component === 'pricing_section' ? ' 📍 NEW!' : '';
      console.log(`${index + 1}. ${block.component}${marker}`);
    });
    
  } catch (error) {
    console.error('❌ Error adding pricing section:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
    }
    process.exit(1);
  }
}

// Run the script
addPricingToHome();