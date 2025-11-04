# Complete Hotfix CSS Code Cleanup - October 31, 2024

## Overview
This archive contains ALL files from the `src` directory that contain hotfix-related CSS classes, imports, or references. These files need to be cleaned to remove all hotfix code interference.

## Files Requiring Cleanup

### CSS Files with Hotfix References:
- `styles/components/map.css`
- `styles/components/section.css` 
- `styles/components/schedule-form.css`
- `styles/semantic/hero.css`
- `styles/semantic/faq.css`
- `styles/semantic/testimonials.css`

### Storyblok Editor Components (Heavy Hotfix Usage):
- `components/storyblok/LoveStoriesGalleryEditor.tsx`
- `components/storyblok/TestimonialsEditor.tsx`
- `components/storyblok/ScheduleFormEditor.tsx`
- `components/storyblok/AlternatingBlocksEditor.tsx`
- `components/storyblok/BrandSocialProofEditor.tsx`
- `components/storyblok/HistoryCarouselEditor.tsx`
- `components/storyblok/FooterEditor.tsx`
- `components/storyblok/HeroEditor.tsx`
- `components/storyblok/RealWeddingEditor.tsx`
- `components/storyblok/MapSectionEditor.tsx`
- `components/storyblok/client/StoryblokBridge.tsx`

### Clean Components:
- `components/sections/AlternatingBlocks.tsx`
- `components/clean/Hero.tsx`
- `components/clean/Footer.tsx`

## Types of Hotfix Code Found:

### 1. CSS Class Names:
- `hotfix-hero-*` classes
- `hotfix-footer-*` classes
- `hotfix-alternating-blocks-*` classes
- `hotfix-testimonials-*` classes
- `hotfix-social-proof-*` classes
- `hotfix-schedule-*` classes
- `hotfix-map-*` classes
- `hotfix-brand-*` classes
- `hotfix-icon` classes

### 2. CSS Comments and References:
- Comments referencing hotfix implementations
- CSS rules targeting hotfix classes

### 3. Asset References:
- `/hotfix-assets/` image paths
- Hotfix-specific image references

## Cleanup Actions Required:

1. **Remove all hotfix CSS classes** from JSX/TSX files
2. **Replace hotfix asset paths** with clean equivalents
3. **Remove hotfix CSS rules** from stylesheets
4. **Update component styling** to use clean architecture classes
5. **Update comments** to remove hotfix references

## Impact Assessment:
- **HIGH IMPACT**: Storyblok Editor components will need extensive refactoring
- **MEDIUM IMPACT**: CSS files need hotfix rule removal
- **LOW IMPACT**: Clean components only need minor reference updates

## Recommendation:
Since Storyblok Editor components have extensive hotfix dependencies, consider:
1. Keeping editors functional with hotfix classes for now
2. Focusing cleanup on active clean architecture components
3. Gradually migrating editor components to clean architecture

---
*Archived: October 31, 2024*
*Cleanup Target: Complete removal of hotfix interference from clean architecture*