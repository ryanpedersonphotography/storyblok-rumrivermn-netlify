#!/usr/bin/env node

/**
 * Script to create Storyblok component schemas for the blog system
 * Run with: node scripts/create-blog-schemas.mjs
 */

import StoryblokClient from 'storyblok-js-client';

const Storyblok = new StoryblokClient({
  oauthToken: process.env.STORYBLOK_PERSONAL_ACCESS_TOKEN || process.env.STORYBLOK_MANAGEMENT_TOKEN
});

const SPACE_ID = '288003424841711';

// Helper to create a component
async function createComponent(componentData) {
  try {
    const response = await Storyblok.post(`spaces/${SPACE_ID}/components/`, {
      component: componentData
    });
    console.log(`✅ Created component: ${componentData.name}`);
    return response.data;
  } catch (error) {
    if (error.response?.status === 422 && error.response?.data?.error?.includes('already been taken')) {
      console.log(`⚠️  Component already exists: ${componentData.name}`);
      return null;
    }
    console.error(`❌ Error creating ${componentData.name}:`, error.response?.data || error.message);
    throw error;
  }
}

// 1. Vendor Info Nested Blok
const vendorInfoSchema = {
  name: 'vendor_info',
  display_name: 'Vendor Information',
  is_root: false,
  is_nestable: true,
  schema: {
    name: {
      type: 'text',
      pos: 0,
      display_name: 'Vendor Name'
    },
    website: {
      type: 'text',
      pos: 1,
      display_name: 'Website URL'
    },
    phone: {
      type: 'text',
      pos: 2,
      display_name: 'Phone Number'
    },
    description: {
      type: 'textarea',
      pos: 3,
      display_name: 'Description'
    }
  }
};

// 2. Real Wedding Content Type
const realWeddingSchema = {
  name: 'real_wedding',
  display_name: 'Real Wedding',
  is_root: true,
  is_nestable: false,
  schema: {
    title: {
      type: 'text',
      pos: 0,
      display_name: 'Couple Names',
      required: true
    },
    slug: {
      type: 'text',
      pos: 1,
      display_name: 'URL Slug',
      required: true
    },
    bride_name: {
      type: 'text',
      pos: 2,
      display_name: 'Bride Name'
    },
    groom_name: {
      type: 'text',
      pos: 3,
      display_name: 'Groom Name'
    },
    wedding_date: {
      type: 'text',
      pos: 4,
      display_name: 'Wedding Date'
    },
    location: {
      type: 'text',
      pos: 5,
      display_name: 'Location',
      default_value: 'Rum River Barn • Hillman, Minnesota'
    },
    intro: {
      type: 'richtext',
      pos: 6,
      display_name: 'Wedding Description'
    },
    guest_count: {
      type: 'number',
      pos: 7,
      display_name: 'Guest Count'
    },
    hero_image: {
      type: 'asset',
      pos: 8,
      display_name: 'Hero Image',
      required: true,
      filetypes: ['images']
    },
    cover_image: {
      type: 'asset',
      pos: 9,
      display_name: 'Cover/Thumbnail Image',
      required: true,
      filetypes: ['images']
    },
    gallery_photos: {
      type: 'multiasset',
      pos: 10,
      display_name: 'Gallery Photos',
      filetypes: ['images']
    },
    photo_vendor: {
      type: 'bloks',
      pos: 11,
      display_name: 'Photographer',
      restrict_components: true,
      component_whitelist: ['vendor_info'],
      maximum: 1
    },
    dj_vendor: {
      type: 'bloks',
      pos: 12,
      display_name: 'DJ/Entertainment',
      restrict_components: true,
      component_whitelist: ['vendor_info'],
      maximum: 1
    },
    flowers_vendor: {
      type: 'bloks',
      pos: 13,
      display_name: 'Florist',
      restrict_components: true,
      component_whitelist: ['vendor_info'],
      maximum: 1
    },
    catering_vendor: {
      type: 'bloks',
      pos: 14,
      display_name: 'Caterer',
      restrict_components: true,
      component_whitelist: ['vendor_info'],
      maximum: 1
    },
    is_published: {
      type: 'boolean',
      pos: 15,
      display_name: 'Published',
      default_value: true
    },
    is_featured: {
      type: 'boolean',
      pos: 16,
      display_name: 'Featured on Home Page'
    },
    meta_title: {
      type: 'text',
      pos: 17,
      display_name: 'Meta Title (SEO)'
    },
    meta_description: {
      type: 'textarea',
      pos: 18,
      display_name: 'Meta Description (SEO)'
    },
    og_image: {
      type: 'asset',
      pos: 19,
      display_name: 'Social Share Image',
      filetypes: ['images']
    }
  }
};

// 3. Musings Blog Content Type
const musingsBlogSchema = {
  name: 'musings_blog',
  display_name: 'Musings Blog Post',
  is_root: true,
  is_nestable: false,
  schema: {
    title: {
      type: 'text',
      pos: 0,
      display_name: 'Title',
      required: true
    },
    slug: {
      type: 'text',
      pos: 1,
      display_name: 'URL Slug',
      required: true
    },
    content: {
      type: 'richtext',
      pos: 2,
      display_name: 'Content',
      required: true
    },
    featured_image: {
      type: 'asset',
      pos: 3,
      display_name: 'Featured Image',
      filetypes: ['images']
    },
    published_date: {
      type: 'datetime',
      pos: 4,
      display_name: 'Published Date'
    },
    meta_title: {
      type: 'text',
      pos: 5,
      display_name: 'Meta Title (SEO)'
    },
    meta_description: {
      type: 'textarea',
      pos: 6,
      display_name: 'Meta Description (SEO)'
    },
    og_image: {
      type: 'asset',
      pos: 7,
      display_name: 'Social Share Image',
      filetypes: ['images']
    }
  }
};

// 4. Love Letter Content Type
const loveLetterSchema = {
  name: 'love_letter',
  display_name: 'Love Letter',
  is_root: true,
  is_nestable: false,
  schema: {
    title: {
      type: 'text',
      pos: 0,
      display_name: 'Couple Names',
      required: true
    },
    slug: {
      type: 'text',
      pos: 1,
      display_name: 'URL Slug',
      required: true
    },
    wedding_date: {
      type: 'text',
      pos: 2,
      display_name: 'Wedding Date'
    },
    testimonial_text: {
      type: 'richtext',
      pos: 3,
      display_name: 'Love Letter Content',
      required: true
    },
    couple_photo: {
      type: 'asset',
      pos: 4,
      display_name: 'Couple Photo',
      filetypes: ['images']
    },
    related_wedding: {
      type: 'option',
      pos: 5,
      display_name: 'Related Real Wedding',
      source: 'internal_stories',
      filter_content_type: ['real_wedding']
    },
    published_date: {
      type: 'datetime',
      pos: 6,
      display_name: 'Published Date'
    },
    meta_title: {
      type: 'text',
      pos: 7,
      display_name: 'Meta Title (SEO)'
    },
    meta_description: {
      type: 'textarea',
      pos: 8,
      display_name: 'Meta Description (SEO)'
    },
    og_image: {
      type: 'asset',
      pos: 9,
      display_name: 'Social Share Image',
      filetypes: ['images']
    }
  }
};

// 5. Featured Weddings Section
const featuredWeddingsSectionSchema = {
  name: 'featured_weddings_section',
  display_name: 'Featured Weddings Section',
  is_root: false,
  is_nestable: true,
  schema: {
    script_accent: {
      type: 'text',
      pos: 0,
      display_name: 'Script Accent',
      default_value: 'Love Stories'
    },
    section_title: {
      type: 'text',
      pos: 1,
      display_name: 'Section Title',
      default_value: 'Real Weddings at the Barn'
    },
    section_description: {
      type: 'text',
      pos: 2,
      display_name: 'Section Description'
    },
    featured_weddings: {
      type: 'options',
      pos: 3,
      display_name: 'Featured Weddings (exactly 6)',
      source: 'internal_stories',
      filter_content_type: ['real_wedding'],
      minimum: 6,
      maximum: 6
    },
    cta_text: {
      type: 'text',
      pos: 4,
      display_name: 'CTA Button Text',
      default_value: 'View All Weddings'
    },
    cta_url: {
      type: 'text',
      pos: 5,
      display_name: 'CTA Button URL',
      default_value: '/real-weddings'
    }
  }
};

// Main execution
async function main() {
  console.log('🚀 Creating Storyblok blog system schemas...\n');

  try {
    // Create components in order (vendor_info first since it's referenced by real_wedding)
    await createComponent(vendorInfoSchema);
    await createComponent(realWeddingSchema);
    await createComponent(musingsBlogSchema);
    await createComponent(loveLetterSchema);
    await createComponent(featuredWeddingsSectionSchema);

    console.log('\n✅ All schemas created successfully!');
    console.log('\n📝 Next steps:');
    console.log('  1. Run the wedding migration script');
    console.log('  2. Create the React components');
    console.log('  3. Add routes for the blog pages');
  } catch (error) {
    console.error('\n❌ Schema creation failed:', error);
    process.exit(1);
  }
}

main();
