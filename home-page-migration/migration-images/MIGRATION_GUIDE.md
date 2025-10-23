# Image Migration Guide for AI Assistant

## 🎯 Purpose
This guide helps AI assistants understand how to properly place migrated images into the new site structure based on their content, usage patterns, and technical requirements.

## 📁 Migration Folder Structure

### 1. **venue/** (38 files) - Primary Venue Marketing Images
**Target Location:** `/public/images/venue/`
**Usage Context:** Main marketing materials, hero sections, gallery displays
**Code References:** 
- CSS backgrounds in `CohesiveDesign.css`
- Sanity content migration data
- Component props in React components

**Placement Priority:** HIGH
**Files Include:**
- `barn-exterior-*` - Exterior barn shots for hero/gallery
- `barn-interior-*` - Interior shots for venue details
- `details-*` - Architectural details and rustic elements
- `property-*` - Landscape and vineyard shots

### 2. **weddings/by-couple/** (19 folders) - Wedding Portfolio Photos
**Target Location:** `/public/wedding-photos/[couple-name]/`
**Usage Context:** Real wedding showcases, portfolio galleries
**Code References:** 
- `src/data/realWeddings.js` - Data structure expects this path
- Wedding blog components reference these paths

**Placement Priority:** HIGH
**Naming Convention:** Numbered sequentially (001.jpg, 002.jpg, etc.)
**Current Couples:** anthony-and-linnea, emily-and-barron-nixon, erin-kate, etc.

### 3. **blog-images/** (19 folders) - Blog-Specific Images
**Target Location:** `/public/real-wedding-blogs/[couple-name]/`
**Usage Context:** Blog post thumbnails and featured images
**Code References:** Blog components expect these specific paths

**Placement Priority:** MEDIUM
**Files Include:**
- `[couple]-wedding-ceremony.jpg`
- `[couple]-wedding-portrait.jpg` 
- `[couple]-wedding-reception.jpg`

### 4. **bridal-suite/** (7 files) - Bridal Preparation Area
**Target Location:** `/public/images/bridal-suite/`
**Usage Context:** Venue feature showcases, detail pages
**Placement Priority:** MEDIUM

### 5. **reception/** (5 files) - Reception Venue Details
**Target Location:** `/public/images/reception/`
**Usage Context:** Venue feature showcases, detail pages
**Placement Priority:** MEDIUM

### 6. **historical/** (6 files) - Property History Images
**Target Location:** `/public/images/historical/`
**Usage Context:** History/about sections, storytelling content
**Placement Priority:** LOW
**Content:** Property development, family history, farming heritage

### 7. **legacy/** (1500+ files) - Archive Images
**Target Location:** Consider archival or selective migration
**Usage Context:** Historical reference, potential future use
**Placement Priority:** LOW
**Organization:** By year (2014-2024) with monthly subfolders

## 🔍 Image Usage Patterns

### Hero/Background Images
- Large venue exteriors (`barn-exterior-full-*`)
- Property landscapes (`property-vineyard-*`)
- Golden hour shots for emotional impact

### Gallery/Portfolio Images
- Wedding photos organized by couple
- Sequential numbering for easy navigation
- High-resolution versions preferred

### Detail/Feature Images
- Architectural elements (`details-*`)
- Rustic charm elements (tractors, wheels, signs)
- Interior design features

## 📋 Quality Assessment Criteria

### HIGH PRIORITY (Migrate First)
- ✅ Referenced in current code
- ✅ High resolution (>1200px width)
- ✅ Recent/current branding
- ✅ Professional photography
- ✅ Key marketing images

### MEDIUM PRIORITY (Selective Migration)
- ⚠️ Older but good quality
- ⚠️ Supporting/detail images
- ⚠️ Backup/alternative angles

### LOW PRIORITY (Archive/Optional)
- ❌ Low resolution (<800px)
- ❌ Outdated branding
- ❌ Duplicate/similar images
- ❌ Poor lighting/composition

## 🚀 Automated Placement Recommendations

### Step 1: Code Reference Check
Before placing any image, check if it's referenced in:
- `src/CohesiveDesign.css`
- `SANITY_CONTENT_MIGRATION_DATA.js`
- `src/data/realWeddings.js`
- Any `.jsx` component files

### Step 2: Path Analysis
- Images with `/venue/` in original path → `venue/` folder
- Images with `/wedding-photos/` → `weddings/by-couple/`
- Images with `/real-wedding-blogs/` → `blog-images/`

### Step 3: Content Analysis
Use filename patterns to determine placement:
- `barn-*` → venue/
- `property-*` → venue/
- `details-*` → venue/
- `[couple-name]-*` → weddings/ or blog-images/
- `dsc_*` → bridal-suite/ or reception/
- Numbered files (001.jpg) → wedding-photos/

### Step 4: Quality Gate
Before final placement:
- Verify image dimensions (min 800px recommended)
- Check file size (optimize if >2MB)
- Ensure proper format (JPG for photos, PNG for graphics)
- Validate file naming conventions

## 🎨 Optimization Guidelines

### Web Performance
- Convert large images to WebP format
- Create responsive versions (320px, 768px, 1200px, 1920px)
- Compress without losing visual quality
- Add lazy loading attributes

### SEO Considerations
- Use descriptive filenames
- Add proper alt text based on content
- Maintain consistent naming patterns
- Include venue/location keywords where appropriate

## 🔧 Integration Notes

### React Component Integration
```jsx
// Venue images
<img src="/images/venue/barn-exterior-full-view-landscape.jpg" alt="Rum River Barn exterior" />

// Wedding photos
<img src="/wedding-photos/anthony-and-linnea/001.jpg" alt="Anthony and Linnea wedding" />

// Blog images
<img src="/real-wedding-blogs/anthony-and-linnea/anthony-linnea-wedding-portrait.jpg" alt="Portrait" />
```

### CSS Background Images
```css
background-image: url('/images/venue/barn-exterior-full-deck-view-evening.jpg');
```

### Sanity CMS Integration
- Map image paths to Sanity asset references
- Maintain original path structure for backward compatibility
- Create asset collections by category

## ⚠️ Critical Considerations

1. **Maintain Path Consistency:** Existing code expects specific paths
2. **Preserve Image Quality:** Don't over-compress hero/marketing images
3. **Check Dependencies:** Some images may be referenced in multiple places
4. **Backup Strategy:** Keep originals before any optimization/conversion
5. **Performance Impact:** Balance quality vs. load times for web delivery

## 📊 Migration Priority Matrix

| Category | Files | Priority | Complexity | Timeline |
|----------|-------|----------|------------|----------|
| venue/ | 38 | HIGH | Low | Day 1 |
| weddings/by-couple/ | ~800 | HIGH | Medium | Day 1-2 |
| blog-images/ | ~60 | MEDIUM | Low | Day 2 |
| bridal-suite/ | 7 | MEDIUM | Low | Day 2 |
| reception/ | 5 | MEDIUM | Low | Day 2 |
| historical/ | 6 | LOW | Low | Day 3 |
| legacy/ | 1500+ | LOW | High | Week 2+ |

## 🎯 Success Metrics

- [ ] All code references point to correct image paths
- [ ] No broken image links in the application
- [ ] Page load times under 3 seconds
- [ ] Images display correctly across all device sizes
- [ ] SEO-friendly image structure maintained
- [ ] Proper fallbacks for missing images