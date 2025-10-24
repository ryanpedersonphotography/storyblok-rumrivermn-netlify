#!/usr/bin/env node

/**
 * Migration script to import wedding data from JSON files into Storyblok
 * Run with: node scripts/migrate-weddings-to-storyblok.mjs
 */

import StoryblokClient from 'storyblok-js-client';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const Storyblok = new StoryblokClient({
  oauthToken: process.env.STORYBLOK_PERSONAL_ACCESS_TOKEN || process.env.STORYBLOK_MANAGEMENT_TOKEN
});

const SPACE_ID = '288003424841711';
const WEDDINGS_FOLDER_PATH = path.join(__dirname, '..', 'public', 'images', 'real-weddings');

// Helper to get all photo files from a wedding directory
function getWeddingPhotos(weddingSlug) {
  const photosDir = path.join(WEDDINGS_FOLDER_PATH, weddingSlug, 'photos');

  if (!fs.existsSync(photosDir)) {
    console.warn(`⚠️  Photos directory not found for ${weddingSlug}`);
    return [];
  }

  const files = fs.readdirSync(photosDir);
  const photoFiles = files
    .filter(file => /\.(jpg|jpeg|png)$/i.test(file))
    .sort(); // Sort numerically/alphabetically

  return photoFiles.map(file => `/images/real-weddings/${weddingSlug}/photos/${file}`);
}

// Helper to create a wedding story in Storyblok
async function createWeddingStory(weddingData, photos) {
  const storyData = {
    name: weddingData.coupleName || weddingData.slug,
    slug: weddingData.slug,
    parent_id: null, // Will be set to real-weddings folder ID if it exists
    content: {
      component: 'real_wedding',
      title: weddingData.coupleName || weddingData.slug,
      slug: weddingData.slug,
      bride_name: weddingData.brideName || '',
      groom_name: weddingData.groomName || '',
      wedding_date: weddingData.date || '',
      location: weddingData.location || 'Rum River Barn • Hillman, Minnesota',
      intro: weddingData.intro || '',
      guest_count: null,
      hero_image: {
        filename: weddingData.heroImage || photos[0] || '',
        alt: `${weddingData.coupleName} wedding hero image`
      },
      cover_image: {
        filename: weddingData.coverImage || photos[1] || photos[0] || '',
        alt: `${weddingData.coupleName} wedding cover image`
      },
      gallery_photos: photos.map(photo => ({
        filename: photo,
        alt: `${weddingData.coupleName} wedding photo`
      })),
      photo_vendor: weddingData.photographer ? [{
        component: 'vendor_info',
        name: weddingData.photographer,
        website: '',
        phone: '',
        description: ''
      }] : [],
      dj_vendor: [],
      flowers_vendor: [],
      catering_vendor: [],
      is_published: true,
      is_featured: false,
      meta_title: `${weddingData.coupleName} | Real Weddings | Rum River Barn`,
      meta_description: weddingData.intro || `View beautiful wedding photos from ${weddingData.coupleName} at Rum River Barn in Minnesota.`,
      og_image: {
        filename: weddingData.heroImage || photos[0] || '',
        alt: `${weddingData.coupleName} wedding`
      }
    }
  };

  try {
    // First, check if real-weddings folder exists, if not create it
    let folderId = null;
    try {
      const folders = await Storyblok.get(`spaces/${SPACE_ID}/stories`, {
        folder_only: 1,
        by_slugs: 'real-weddings'
      });

      if (folders.data.stories && folders.data.stories.length > 0) {
        folderId = folders.data.stories[0].id;
      }
    } catch (error) {
      console.log('📁 Creating real-weddings folder...');
    }

    // If folder doesn't exist, create it
    if (!folderId) {
      try {
        const folderResponse = await Storyblok.post(`spaces/${SPACE_ID}/stories`, {
          story: {
            name: 'Real Weddings',
            slug: 'real-weddings',
            is_folder: true
          }
        });
        folderId = folderResponse.data.story.id;
        console.log('✅ Created real-weddings folder');
      } catch (error) {
        console.error('❌ Error creating folder:', error.response?.data || error.message);
      }
    }

    // Set parent folder ID
    if (folderId) {
      storyData.parent_id = folderId;
    }

    // Create the story
    const response = await Storyblok.post(`spaces/${SPACE_ID}/stories`, {
      story: storyData,
      publish: 1 // Publish immediately
    });

    console.log(`✅ Migrated: ${weddingData.coupleName} (${photos.length} photos)`);
    return response.data.story;
  } catch (error) {
    if (error.response?.status === 422 && error.response?.data?.slug?.[0]?.includes('has already been taken')) {
      console.log(`⚠️  Already exists: ${weddingData.coupleName} - skipping`);
      return null;
    }
    console.error(`❌ Error creating ${weddingData.coupleName}:`, error.response?.data || error.message);
    throw error;
  }
}

// Main migration function
async function migrateAllWeddings() {
  console.log('🚀 Starting wedding migration to Storyblok...\n');

  const weddingDirs = fs.readdirSync(WEDDINGS_FOLDER_PATH)
    .filter(file => {
      const fullPath = path.join(WEDDINGS_FOLDER_PATH, file);
      return fs.statSync(fullPath).isDirectory() && file !== '.DS_Store';
    });

  console.log(`📊 Found ${weddingDirs.length} weddings to migrate\n`);

  const results = {
    success: 0,
    skipped: 0,
    failed: 0,
    errors: []
  };

  for (const weddingDir of weddingDirs) {
    try {
      // Read wedding-info.json
      const jsonPath = path.join(WEDDINGS_FOLDER_PATH, weddingDir, 'wedding-info.json');

      if (!fs.existsSync(jsonPath)) {
        console.warn(`⚠️  No wedding-info.json found for ${weddingDir} - skipping`);
        results.skipped++;
        continue;
      }

      const weddingData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

      // Get all photos
      const photos = getWeddingPhotos(weddingDir);

      if (photos.length === 0) {
        console.warn(`⚠️  No photos found for ${weddingDir} - skipping`);
        results.skipped++;
        continue;
      }

      // Create story in Storyblok
      const story = await createWeddingStory(weddingData, photos);

      if (story) {
        results.success++;
      } else {
        results.skipped++;
      }

      // Small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 500));

    } catch (error) {
      console.error(`❌ Failed to migrate ${weddingDir}:`, error.message);
      results.failed++;
      results.errors.push({ wedding: weddingDir, error: error.message });
    }
  }

  // Print summary
  console.log('\n' + '='.repeat(60));
  console.log('📊 MIGRATION SUMMARY');
  console.log('='.repeat(60));
  console.log(`✅ Successfully migrated: ${results.success}`);
  console.log(`⚠️  Skipped (already exist): ${results.skipped}`);
  console.log(`❌ Failed: ${results.failed}`);
  console.log('='.repeat(60));

  if (results.errors.length > 0) {
    console.log('\n❌ Errors:');
    results.errors.forEach(err => {
      console.log(`  - ${err.wedding}: ${err.error}`);
    });
  }

  console.log('\n✅ Migration complete!');
  console.log('\n📝 Next steps:');
  console.log('  1. Go to Storyblok and verify the weddings were created');
  console.log('  2. Add "Featured Weddings Section" to your home page');
  console.log('  3. Select 6 weddings to feature');
  console.log('  4. Publish the home page');
}

// Run migration
migrateAllWeddings().catch(error => {
  console.error('\n❌ Migration failed:', error);
  process.exit(1);
});
