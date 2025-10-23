# Code Reference Patterns for Image Migration

## 🔍 Current Code References Analysis

### CSS Background Images (src/CohesiveDesign.css)
```css
/* Primary hero background */
background: linear-gradient(135deg, rgba(107, 78, 61, 0.9) 0%, rgba(58, 74, 60, 0.8) 100%), 
            url('/images/venue/barn-exterior-full-deck-view-evening.jpg') center/cover;

/* Feature section backgrounds */
background-image: url('/images/venue/barn-interior-ceiling-beams-lighting.jpg');
background-image: url('/images/venue/property-vineyard-rows-landscape.jpg');
background-image: url('/images/venue/details-swing-rustic-romance.jpg');
background-image: url('/images/venue/barn-exterior-deck-swing-golden-hour.jpg');
```

**Migration Action:** These paths must be maintained exactly as-is. Files MUST be placed in `/public/images/venue/` with exact filenames.

### Sanity Content Migration Data (SANITY_CONTENT_MIGRATION_DATA.js)
```javascript
// Hero section image
image: '/images/venue/barn-interior-exposed-beams-chandeliers.jpg'

// Gallery images
{
  image: '/images/venue/barn-interior-ceiling-beams-lighting.jpg',
  image: '/images/venue/details-swing-rustic-romance.jpg',
  image: '/images/2015/12/wedding-5.jpg',
  image: '/images/venue/barn-exterior-deck-swing-golden-hour.jpg',
  image: '/images/venue/barn-interior-exposed-beams-chandeliers.jpg',
}

// Page images
image: '/images/venue/barn-exterior-entrance-lighting-view.jpg'
image: '/images/venue/barn-interior-ceiling-beams-lighting.jpg'
```

**Migration Action:** Critical paths that must be preserved. Note the mix of `/images/venue/` and `/images/2015/12/` paths.

### Wedding Data Structure (src/data/realWeddings.js)
```javascript
{
  "heroImage": "/wedding-photos/anthony-and-linnea/001.jpg",
  "coverImage": "/wedding-photos/anthony-and-linnea/015.jpg",
  "gallery": [
    {
      "src": "/wedding-photos/anthony-and-linnea/001.jpg",
      "alt": "Anthony and Linnea wedding ceremony"
    },
    {
      "src": "/wedding-photos/anthony-and-linnea/002.jpg", 
      "alt": "Wedding reception celebration"
    }
    // ... continues with sequential numbering
  ]
}
```

**Migration Action:** Wedding photos MUST maintain `/wedding-photos/[couple-name]/###.jpg` pattern.

### Component Image References
```jsx
// FeatureBlocksStandalone.jsx - Placeholder references
<img src="image.jpg" alt="Historic barn interior" width="800" height="500" />
<img src="image.jpg" alt="Vineyard ceremony site" width="800" height="500" />

// Data objects with image paths
{
  image: "/images/barn-interior.jpg",
  image: "/images/vineyard-ceremony.jpg", 
  image: "/images/enchanted-forest.jpg"
}
```

**Migration Action:** These appear to be placeholders that need to be updated to actual venue image paths.

## 📋 Critical Path Dependencies

### Must Preserve Exactly
1. **CSS Background Images** - Any change breaks styling
   ```
   /images/venue/barn-exterior-full-deck-view-evening.jpg
   /images/venue/barn-interior-ceiling-beams-lighting.jpg
   /images/venue/property-vineyard-rows-landscape.jpg
   /images/venue/details-swing-rustic-romance.jpg
   /images/venue/barn-exterior-deck-swing-golden-hour.jpg
   ```

2. **Sanity Migration Data Paths** - Used for CMS content
   ```
   /images/venue/barn-interior-exposed-beams-chandeliers.jpg
   /images/venue/barn-exterior-entrance-lighting-view.jpg
   /images/2015/12/wedding-5.jpg (legacy path)
   ```

3. **Wedding Photo Structure** - Data components depend on this
   ```
   /wedding-photos/{couple-name}/{###.jpg}
   ```

### Needs Path Updates
1. **Component Placeholders** - Currently using generic paths
   ```
   Current: "/images/barn-interior.jpg"
   Update to: "/images/venue/barn-interior-exposed-beams-chandeliers.jpg"
   ```

## 🔧 Migration Validation Checklist

### Pre-Migration Validation
- [ ] Check all CSS files for image references
- [ ] Scan JS/JSX files for hardcoded image paths  
- [ ] Review data files for image path arrays
- [ ] Identify placeholder vs. real paths

### Post-Migration Validation
- [ ] Verify CSS backgrounds load correctly
- [ ] Test Sanity content migration data paths
- [ ] Validate wedding gallery functionality
- [ ] Check for 404 errors in browser dev tools
- [ ] Test responsive image loading

### Critical Files to Test
1. **Homepage hero section** - CSS background image
2. **Wedding galleries** - realWeddings.js data structure
3. **Venue feature pages** - Sanity content images
4. **Blog post images** - Real wedding blog components

## 🚨 Breaking Change Risks

### HIGH RISK - Will Break Site
- Changing paths in `CohesiveDesign.css`
- Modifying wedding photo folder structure
- Altering Sanity migration data paths

### MEDIUM RISK - May Cause Issues  
- Moving legacy year-based images (some may be referenced)
- Changing file extensions (JPG to WebP without fallbacks)
- Renaming venue image files

### LOW RISK - Safe to Modify
- Blog image organization (separate from main galleries)
- Legacy archive images (not actively referenced)
- Bridal suite/reception images (not heavily integrated)

## 🔄 Recommended Update Sequence

### Phase 1: Direct Migrations (No Code Changes)
1. Venue images → `/public/images/venue/` (exact paths)
2. Wedding photos → `/public/wedding-photos/` (exact structure)
3. Blog images → `/public/real-wedding-blogs/` (exact structure)

### Phase 2: Component Updates (Requires Code Changes)
1. Update placeholder image paths in components
2. Add proper alt text and responsive attributes
3. Implement lazy loading for performance

### Phase 3: Optimization (Post-Migration)
1. Generate WebP versions with JPG fallbacks
2. Create responsive image sets
3. Implement image optimization pipeline

## 📊 Path Pattern Summary

| Pattern | Usage | Critical | Example |
|---------|-------|----------|---------|
| `/images/venue/` | CSS backgrounds, Sanity CMS | YES | `barn-exterior-full-deck-view-evening.jpg` |
| `/wedding-photos/{couple}/` | Gallery data structure | YES | `anthony-and-linnea/001.jpg` |
| `/real-wedding-blogs/{couple}/` | Blog components | MEDIUM | `erin-kate-wedding-portrait.jpg` |
| `/images/{year}/` | Legacy content | LOW | `2015/12/wedding-5.jpg` |
| `/images/{category}/` | Feature content | MEDIUM | `bridal-suite/dsc_1766-large.jpeg` |