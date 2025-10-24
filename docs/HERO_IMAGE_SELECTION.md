# Hero Image Selection from Gallery

## Overview

Wedding pages can now use any photo from the gallery as the hero image, instead of requiring a separate uploaded hero image.

## How It Works

### In Storyblok CMS

When editing a Real Wedding in Storyblok, you'll see a new field:

**"Hero Image from Gallery (Index)"**

- **Leave empty**: Uses the uploaded "Hero Image" field (default behavior)
- **Set to 0**: Uses the first photo from the gallery
- **Set to 1**: Uses the second photo from the gallery
- **Set to 2**: Uses the third photo from the gallery
- And so on...

### Example

If you have a wedding with these gallery photos:
1. Photo 001.jpg (ceremony shot)
2. Photo 002.jpg (couple portrait)
3. Photo 003.jpg (venue exterior)

Setting `hero_image_index` to `1` will use Photo 002.jpg (couple portrait) as the hero background.

## Implementation Details

### Schema Change

Added field to `real_wedding` component:
```javascript
hero_image_index: {
  type: 'number',
  display_name: 'Hero Image from Gallery (Index)',
  description: 'Optional: Select which gallery photo to use as hero...'
}
```

### Component Logic

In [RealWeddingEditor.tsx](../src/components/storyblok/RealWeddingEditor.tsx:54-73):

```typescript
let heroImage = ''
if (
  typeof blok.hero_image_index === 'number' &&
  blok.hero_image_index >= 0 &&
  blok.gallery_photos &&
  blok.gallery_photos[blok.hero_image_index]
) {
  // Use gallery photo at specified index
  heroImage = blok.gallery_photos[blok.hero_image_index].filename
} else {
  // Fall back to uploaded hero_image
  heroImage = blok.hero_image?.filename || ''
}
```

## Backward Compatibility

All existing weddings continue to work without changes:
- Existing weddings have `hero_image_index` unset (null/undefined)
- They automatically fall back to the uploaded `hero_image` field
- No migration needed for the 18 already imported weddings

## Benefits

1. **No duplicate uploads**: Don't need to upload the same image twice
2. **Flexibility**: Easily change which gallery photo is featured
3. **Consistency**: Hero image is always from the actual wedding
4. **Storage**: Saves space by not duplicating images

## Files Modified

- `scripts/update-wedding-hero-field.mjs` - Schema update script
- `src/components/storyblok/RealWeddingEditor.tsx` - Component logic
- `src/components/storyblok/LoveStoriesGalleryEditor.tsx` - Gallery thumbnails

## Testing

1. Visit Storyblok and edit any wedding
2. Find "Hero Image from Gallery (Index)" field
3. Enter a number (0, 1, 2, etc.)
4. Save and view the wedding page
5. The hero should now show the selected gallery photo

## Notes

- Index is zero-based (0 = first photo, 1 = second photo, etc.)
- If index is out of range, falls back to uploaded hero_image
- If both are missing, hero background will be empty
- The `cover_image` field remains separate (used for thumbnails)
