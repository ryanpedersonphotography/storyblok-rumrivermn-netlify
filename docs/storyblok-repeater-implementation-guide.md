# Storyblok Repeater Implementation Guide

## Overview
This guide documents the complete process of converting hardcoded content to Storyblok repeater fields, including component creation, content seeding, image uploads, and frontend integration.

## Case Study: Spaces Section Implementation
**Goal**: Convert hardcoded venue data (barn, bridal, groom, pavilion) to a dynamic repeater structure.

### 1. Component Schema Creation

#### Key Components Created:
- **`feature`**: Individual feature items (title + description)
- **`space`**: Individual venue spaces with photos, description, and features
- **Updated `spaces_section`**: Added `spaces` repeater field

#### Schema Pattern:
```javascript
// Feature Component
{
  feature_title: { type: 'text', translatable: true },
  feature_blurb: { type: 'text', translatable: true }
}

// Space Component  
{
  space_name: { type: 'text', translatable: true },
  space_photos: { type: 'multiasset', filetypes: ['images'] },
  space_description: { type: 'textarea', translatable: true },
  space_features: { 
    type: 'bloks', 
    component_whitelist: ['feature'],
    maximum: 4 
  }
}

// Spaces Section (updated)
{
  spaces: {
    type: 'bloks',
    component_whitelist: ['space'],
    maximum: 4,
    minimum: 4
  }
}
```

### 2. Content Seeding Strategy

#### Approach:
1. **Get existing story** via Management API
2. **Find target section** by component name
3. **Generate content** with proper UID structure
4. **Update and publish** story

#### Key Patterns:
```javascript
// UID Generation
function generateUID() {
  return `uid-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// Component Creation
function createFeature(title, blurb) {
  return {
    _uid: generateUID(),
    component: 'feature',
    feature_title: title,
    feature_blurb: blurb
  };
}
```

### 3. Image Upload Implementation

#### 3-Step Upload Process:
1. **Sign Asset**: Get upload URL and fields
2. **Upload to S3**: Use FormData with signed fields
3. **Finish Upload**: Validate and create asset record

#### Critical Implementation Details:
```javascript
// Must use axios with form.getHeaders() for S3 upload
const form = new FormData();
for (const [k, v] of Object.entries(signed.fields || {})) {
  form.append(k, v);
}
form.append('file', fs.createReadStream(filepath), path.basename(filepath));

await axios.post(signed.post_url, form, {
  headers: form.getHeaders(),
  maxContentLength: Infinity,
  maxBodyLength: Infinity,
  timeout: 300000,
  validateStatus: (s) => s >= 200 && s < 400,
});
```

#### Rate Limiting Strategy:
- 1-2 second delays between uploads
- Exponential backoff for retries
- Handle 429 errors gracefully

### 4. Frontend Component Updates

#### Key Changes:
1. **Interface Updates**: Match new schema structure
2. **Data Access**: Change from `blok.barn` to `blok.spaces[index]`
3. **Fallback Strategy**: Provide defaults for smooth transition
4. **Image Handling**: Support both Storyblok assets and local paths

#### Pattern:
```javascript
// Old structure
interface VenueStoryblok {
  title?: string;
  images?: string[];
  features?: { label: string; value: string }[];
}

// New structure  
interface SpaceStoryblok {
  space_name?: string;
  space_photos?: Array<{ filename?: string; alt?: string }>;
  space_features?: FeatureStoryblok[];
}
```

### 5. Asset Linking Strategy

#### When finish_upload fails:
1. **Check asset existence** in Storyblok admin
2. **Map uploaded assets** to content structure
3. **Update story** with proper asset references
4. **Handle duplicates** appropriately

## Scripts Created

### Component Management:
- `scripts/create-spaces-components.js` - Creates repeater schema
- `scripts/cleanup-old-venue-fields.js` - Removes deprecated fields

### Content Management:
- `scripts/seed-spaces-venues.js` - Populates repeater with content

### Asset Management:
- `scripts/bulk-upload-storyblok-assets.mjs` - Future reference (full featured)
- `scripts/upload-spaces-images-proper.js` - Project-specific uploader
- `scripts/link-uploaded-assets-to-spaces.js` - Links assets to content

## Best Practices Learned

### 1. Schema Design
- **Use consistent naming**: `space_name`, `space_photos`, `space_features`
- **Set limits**: `maximum: 4` prevents content bloat
- **Component whitelist**: Restrict nested components for cleaner UI

### 2. Content Migration
- **Preserve backward compatibility** during transition
- **Auto-generate UIDs** for all nested components
- **Publish immediately** for client testing

### 3. Image Management
- **Upload first, link later** approach works well
- **Handle upload failures gracefully** - assets may exist despite errors
- **Use descriptive alt text** and metadata

### 4. Frontend Integration
- **Graceful fallbacks** prevent crashes during migration
- **Type safety** with proper interfaces
- **Debug logging** helps troubleshoot content issues

## Environment Requirements

### Required Variables:
```bash
SPACE_ID=your_space_id
STORYBLOK_PERSONAL_ACCESS_TOKEN=your_token
```

### Dependencies:
```bash
npm install axios form-data
```

## Troubleshooting

### Common Issues:

1. **Rate Limiting**: Add delays between requests
2. **finish_upload Failures**: Check if assets exist anyway
3. **S3 Upload 412 Error**: Use axios with form.getHeaders()
4. **Empty Repeaters**: Check component whitelist restrictions
5. **Visual Editor Issues**: Ensure `'use client'` and proper storyblokEditable

### Debug Commands:
```bash
# Check component schema
curl -H "Authorization: $TOKEN" "https://mapi.storyblok.com/v1/spaces/$SPACE_ID/components" | jq '.components[] | select(.name == "spaces_section")'

# Check uploaded assets
curl -H "Authorization: $TOKEN" "https://mapi.storyblok.com/v1/spaces/$SPACE_ID/assets?per_page=50"

# Check story content
curl -H "Authorization: $TOKEN" "https://mapi.storyblok.com/v1/spaces/$SPACE_ID/stories?with_slug=home"
```

## Performance Notes

- **Batch operations** where possible
- **Use concurrency limits** for uploads (3-5 concurrent max)
- **Cache component lookups** to avoid repeated API calls
- **Optimize image sizes** before upload

## Future Improvements

1. **Asset deduplication** script
2. **Bulk content migration** tools  
3. **Automated rollback** capabilities
4. **Performance monitoring** for large datasets
5. **Content validation** before publish

---

*Created: November 2024*
*Project: Rum River Barn Website*
*Status: Successfully Implemented*