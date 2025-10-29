#!/usr/bin/env node

const StoryblokClient = require('storyblok-js-client').default;

// Initialize Storyblok Management API client
const Storyblok = new StoryblokClient({
  oauthToken: process.env.STORYBLOK_PERSONAL_ACCESS_TOKEN
});

async function addFAQAccordion() {
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

    // Check if faq_accordion already exists
    const existingIndex = homeStory.content.body.findIndex(block =>
      block.component === 'faq_accordion'
    );

    if (existingIndex !== -1) {
      console.log('⚠️ FAQ Accordion section already exists at index:', existingIndex);
      console.log('Skipping addition to avoid duplicates');
      return;
    }

    // Find the footer section to add FAQ before it
    const footerIndex = homeStory.content.body.findIndex(block =>
      block.component === 'footer_section'
    );

    if (footerIndex === -1) {
      console.error('Footer section not found in home story');
      process.exit(1);
    }

    console.log('Found Footer section at index:', footerIndex);

    // Create the FAQ accordion block
    const faqAccordionBlock = {
      _uid: Date.now().toString(),
      component: 'faq_accordion',
      subtitle: 'Questions?',
      title: 'Frequently Asked Questions',
      faq_items: [
        {
          _uid: (Date.now() + 1).toString(),
          question: 'Can we bring our own vendors?',
          answer: 'Absolutely! We believe in giving you complete creative freedom for your wedding day. You\'re welcome to work with any caterer, photographer, florist, DJ, or other vendors you choose.'
        },
        {
          _uid: (Date.now() + 2).toString(),
          question: 'What\'s included with the venue rental?',
          answer: 'Your rental includes exclusive use of our historic barn, bridal suite, groom\'s quarters, outdoor ceremony sites, and tables and chairs for up to 200 guests. We also provide parking, setup time, and day-of coordination assistance.'
        },
        {
          _uid: (Date.now() + 3).toString(),
          question: 'Do you have indoor and outdoor options?',
          answer: 'Yes! Our property offers multiple ceremony sites including our beautiful garden pavilion, riverside clearing, and the barn itself. This gives you backup options regardless of weather.'
        },
        {
          _uid: (Date.now() + 4).toString(),
          question: 'Is there lodging nearby for guests?',
          answer: 'We have partnerships with several nearby hotels and bed & breakfasts that offer group rates. We\'re also happy to provide a list of recommended accommodations in the area for your out-of-town guests.'
        }
      ]
    };

    // Insert the FAQ accordion section BEFORE the footer
    const updatedBody = [...homeStory.content.body];
    updatedBody.splice(footerIndex, 0, faqAccordionBlock);

    console.log('Updating story with FAQ Accordion section...');

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

    console.log('✅ FAQ Accordion section successfully added to home page!');
    console.log('Position: Before Footer section');

  } catch (error) {
    console.error('❌ Error adding FAQ Accordion section:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
    }
    process.exit(1);
  }
}

addFAQAccordion();
