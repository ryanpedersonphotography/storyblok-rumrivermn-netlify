# Love Stories Gallery - Storyblok Schema Setup

## Parent Block: `love_stories_gallery`

### Schema Configuration

**Block Name (Technical)**: `love_stories_gallery`
**Display Name**: `Love Stories Gallery`

### Fields

1. **Script Accent** (`script_accent`)
   - Type: `Text`
   - Default Value: `Real Love Stories`
   - Description: `Script-style accent text above the title`

2. **Title** (`title`)
   - Type: `Text`
   - Default Value: `Weddings at the Barn`
   - Description: `Main section title`

3. **Description** (`description`)
   - Type: `Textarea`
   - Default Value: `Every celebration tells a unique story of love, laughter, and happily ever after.`
   - Description: `Lead description text below the title`

4. **Galleries** (`galleries`)
   - Type: `Blocks`
   - Restrict to blocks: `gallery_item`
   - Description: `Wedding gallery items`
   - Minimum: 1
   - Maximum: 20 (optional, or leave unlimited)

---

## Nested Block: `gallery_item`

### Schema Configuration

**Block Name (Technical)**: `gallery_item`
**Display Name**: `Gallery Item`

### Fields

1. **Link** (`href`)
   - Type: `Text`
   - Default Value: `/real-weddings/`
   - Description: `Link to wedding gallery page (e.g., /real-weddings/couple-name)`

2. **Image** (`image`)
   - Type: `Asset`
   - File Types: `Images only`
   - Description: `Wedding photo for gallery thumbnail`
   - Required: `Yes`

3. **Couple Names** (`couple_names`)
   - Type: `Text`
   - Default Value: `Couple Names`
   - Description: `Names of the couple (e.g., "Anthony & Linnea")`
   - Required: `Yes`

4. **Season** (`season`)
   - Type: `Text`
   - Default Value: `Summer 2024`
   - Description: `Season and year (e.g., "Summer 2024")`

5. **Photo Count** (`photo_count`)
   - Type: `Number`
   - Default Value: `0`
   - Description: `Number of photos in the gallery`

6. **Venue** (`venue`)
   - Type: `Text`
   - Default Value: `Rum River Barn`
   - Description: `Venue name`

---

## Setup Instructions

### Step 1: Create Parent Block

1. Navigate to **Storyblok** → **Block Library**
2. Click **+ New Block**
3. Enter Block Name: `love_stories_gallery`
4. Enter Display Name: `Love Stories Gallery`
5. Add fields as specified above
6. Save block

### Step 2: Create Nested Block

1. Still in **Block Library**
2. Click **+ New Block**
3. Enter Block Name: `gallery_item`
4. Enter Display Name: `Gallery Item`
5. Add fields as specified above
6. Save block

### Step 3: Link Blocks

1. Go back to `love_stories_gallery` block
2. Find the `galleries` field
3. In **Restrict to blocks**, select `gallery_item`
4. Save

### Step 4: Add to Home Story

1. Navigate to **Content** → **Home**
2. Click in the `body` field
3. Click **+ Add Block**
4. Select **Love Stories Gallery**
5. Add gallery items:
   - Click **+ Add Block** in `galleries` field
   - Select **Gallery Item**
   - Fill in wedding details
   - Upload wedding photo
   - Repeat for each wedding

### Step 5: Test in Visual Editor

1. Ensure dev server is running: `npm run dev`
2. In Storyblok, click **Visual Editor** button
3. Change URL to: `http://localhost:9999/home-live`
4. Verify:
   - Blue outline appears when clicking gallery section
   - Blue outline appears when clicking individual gallery items
   - Text changes update immediately
   - Image changes update immediately

---

## Sample Gallery Items (for testing)

```
Gallery Item 1:
- href: /real-weddings/anthony-and-linnea
- couple_names: Anthony & Linnea
- season: Summer 2024
- photo_count: 114
- venue: Rum River Barn
- image: Upload from /wedding-photos/anthony-and-linnea/015.jpg

Gallery Item 2:
- href: /real-weddings/loria-and-jason-rolstad-agape
- couple_names: Loria & Jason Rolstad
- season: Summer 2024
- photo_count: 96
- venue: Rum River Barn
- image: Upload from /wedding-photos/loria-and-jason-rolstad-agape/025.jpg

Gallery Item 3:
- href: /real-weddings/mattea-courtney-photo-gallery
- couple_names: Mattea Courtney
- season: Summer 2024
- photo_count: 89
- venue: Rum River Barn
- image: Upload from /wedding-photos/mattea-courtney-photo-gallery/012.jpg
```

---

## Component Mapping

**Registered in**: `/src/lib/storyblok.ts`

```typescript
import LoveStoriesGalleryEditor from '@/components/storyblok/LoveStoriesGalleryEditor'

storyblokInit({
  components: {
    love_stories_gallery: LoveStoriesGalleryEditor,
  },
})
```

---

## Visual Editor Testing Checklist

- [ ] Parent block (`love_stories_gallery`) renders in Visual Editor
- [ ] Blue outline appears when clicking gallery section
- [ ] Section header fields (script_accent, title, description) editable
- [ ] Changes to section header update immediately
- [ ] Nested gallery items render correctly
- [ ] Blue outline appears when clicking individual gallery items
- [ ] Gallery item fields editable (couple_names, season, photo_count, etc.)
- [ ] Image upload works and updates immediately
- [ ] Link field (`href`) updates correctly
- [ ] No console errors about missing components
- [ ] Bridge loaded message in console

---

## Next Steps After Schema Creation

1. **Test Component**: Access `/home-live` and verify Visual Editor functionality
2. **Upload Real Photos**: Upload wedding photos from `/wedding-photos/` directories
3. **Validate Design**: Ensure gallery matches original design (grid layout, hover effects, etc.)
4. **Commit Changes**: Once tested, commit component with Visual Editor verification

---

## Troubleshooting

**Problem**: Component not appearing in Visual Editor
**Solution**: Verify block name in Storyblok matches component mapping (`love_stories_gallery`)

**Problem**: Nested items not editable
**Solution**: Ensure `{...storyblokEditable(gallery)}` is on each gallery item in component

**Problem**: Images not displaying
**Solution**: Check image URL format - handle both `gallery.image?.filename` and string formats

**Problem**: Blue outline not appearing
**Solution**: Verify `{...storyblokEditable(blok)}` is on parent section element
