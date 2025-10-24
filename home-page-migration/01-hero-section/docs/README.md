# Hero Section Migration Guide ✅ COMPLETE

## Implementation Status
✅ **COMPLETE** - Implemented as `/src/components/storyblok/HeroEditor.tsx` with Visual Editor support

## Overview
The hero section is a full-viewport romantic wedding barn hero with overlay, call-to-action button, and scroll indicator. Implemented with Visual Editor support for live content editing.

## Files Included
- `code/hero-section.tsx` - React component code
- `styles/hero-styles.css` - Complete CSS styling
- `images/barn-exterior-full-deck-view-evening.jpg` - Background image

## Key Features
- Full viewport height (100vh)
- Background image with gradient overlay
- Script accent "Where Dreams Begin" in Dancing Script font
- Split title "Rum River" + "Wedding Barn" with gold accent
- Romantic description text
- Single CTA button with hover effects
- Scroll indicator with bounce animation

## CSS Classes
- `.hotfix-hero-romantic` - Main hero container
- `.hotfix-hero-content` - Content wrapper
- `.hotfix-hero-kicker` - Script accent text
- `.hotfix-hero-title` - Main title
- `.hotfix-hero-title-accent` - Gold accent span
- `.hotfix-hero-description` - Description text
- `.hotfix-hero-buttons` - Button container
- `.hotfix-btn-romantic-secondary` - CTA button
- `.hotfix-hero-scroll` - Scroll indicator

## Colors Used
- Champagne Gold: #E4C896
- Warm Walnut: #6B4E3D  
- Cream Pearl: #FFFCF8
- Dusty Rose: #9D6B7B

## Fonts Required
- Dancing Script (script accent)
- Playfair Display (main title)
- Montserrat (button text)

## Migration Notes
1. Background image path: `/images/venue/barn-exterior-full-deck-view-evening.jpg`
2. CTA links to `/contact` page
3. All styles use `!important` for specificity
4. Responsive design included for mobile
5. Accessibility focus states included

## ✅ Storyblok Integration (COMPLETE)

### Storyblok Schema
**Block Name**: `hero-section`

**Fields**:
- `kicker` (text) - Script accent text (e.g., "Where Dreams Begin")
- `title` (text) - Main title (e.g., "Rum River")
- `title_accent` (text) - Highlighted portion (e.g., "Wedding Barn")
- `description` (textarea) - Hero description text
- `primary_cta_text` (text) - CTA button text (e.g., "Schedule Your Visit")
- `scroll_text` (text) - Scroll indicator text (e.g., "Discover Your Perfect Day")
- `bg_image` (asset) - Background image upload

### Implementation Details
**Component**: `/src/components/storyblok/HeroEditor.tsx`

**Key Features**:
- Uses `'use client'` directive for Visual Editor
- Wraps section with `{...storyblokEditable(blok)}`
- Accesses content via `blok.field_name` with `||` fallbacks
- Handles image as both string and asset object
- CSS variable for background: `style['--hero-bg']`

**Visual Editor Testing**:
- ✅ Blue outline appears on click
- ✅ All fields editable in real-time
- ✅ Image updates immediately
- ✅ Tested on `/home-live` route

**Registered in**: `/src/lib/storyblok.ts`
```typescript
'hero-section': HeroEditor
```