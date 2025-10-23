# Love Stories Gallery Section Migration Guide

## Overview
Dynamic photo gallery showcasing real weddings with sophisticated overlays and interactive effects.

## Files Included
- `code/love-stories-gallery.tsx` - React component with wedding data
- `styles/love-stories-gallery-styles.css` - Complete CSS styling

## Key Features
- Blush pink background (#F4E4E1)
- Dynamic grid layout (4 columns with spanning items)
- 6 real wedding galleries with metadata
- Glassmorphism effects with backdrop blur
- Shimmer hover animations
- Sophisticated overlay system

## Gallery Data Structure
Each wedding includes:
- `href` - Link to wedding gallery page
- `imageSrc` - Wedding photo path
- `coupleNames` - Couple's names (Dancing Script font)
- `season` - Wedding season
- `photoCount` - Number of photos
- `venue` - Always "Rum River Barn"

## Wedding Galleries Included
1. **Anthony & Linnea** - 114 Photos, Summer 2024
2. **Loria & Jason Rolstad** - 96 Photos, Summer 2024
3. **Mattea Courtney** - 89 Photos, Summer 2024
4. **Kyle Carrie** - 57 Photos, Summer 2024
5. **Emily & Barron Nixon** - 36 Photos, Summer 2024
6. **Joshua & Teri** - 36 Photos, Summer 2024

## CSS Classes
- `.hotfix-love-stories-gallery` - Main section container
- `.hotfix-love-stories-content` - Content wrapper
- `.hotfix-love-stories-header` - Section header
- `.hotfix-script-accent` - Script accent text
- `.hotfix-love-section-title` - Main section title
- `.hotfix-love-lead` - Lead description
- `.hotfix-wedding-gallery` - Grid container
- `.hotfix-gallery-item` - Individual gallery item
- `.hotfix-gallery-overlay` - Hover overlay
- `.hotfix-gallery-couple-names` - Couple names text
- `.hotfix-gallery-season` - Season/year text
- `.hotfix-gallery-details` - Photo count and venue

## Grid Layout
- Desktop: 4-column grid
- Item 1: spans 2x2 (featured)
- Item 6: spans 2x1 (wide)
- Items 2-5: standard 1x1
- Tablet: 1-column responsive
- Mobile: Single column stack

## Image Paths Required
Local wedding photos in these directories:
- `/wedding-photos/anthony-and-linnea/015.jpg`
- `/wedding-photos/loria-and-jason-rolstad-agape/025.jpg`
- `/wedding-photos/mattea-courtney-photo-gallery/012.jpg`
- `/wedding-photos/kyle-carrie/018.jpg`
- `/real-wedding-blogs/emily-and-barron-nixon/emily-barron-wedding-reception.jpg`
- `/wedding-photos/joshua-and-teri/010.jpg`

## Interactive Effects
1. **Hover Transform**: translateY(-8px) with enhanced shadows
2. **Image Scale**: 1.1x zoom on hover
3. **Shimmer Effect**: Left-to-right shimmer on hover
4. **Overlay Fade**: Gradient overlay appears on hover
5. **Glassmorphism**: Backdrop blur and transparency effects

## Colors Used
- Background: #F4E4E1 (blush pink)
- Text: #6B4E3D (warm walnut)
- Accent: #9D6B7B (dusty rose)
- Season: #E4C896 (champagne gold)
- Overlay: Multi-stop gradient with backdrop blur

## Typography
- Script accent: Dancing Script
- Section title: Playfair Display
- Couple names: Dancing Script
- Season: Playfair Display
- Details: Montserrat

## Migration Notes
1. All wedding photos need to be migrated to Payload media
2. Gallery links point to `/real-weddings/[slug]` pages
3. `data-discover="true"` attribute for analytics
4. Grid uses CSS Grid with complex spanning logic
5. Sophisticated hover animations with multiple effects

## Payload CMS Integration
Convert to gallery block with:
- Section header fields (accent, title, description)
- Collection relationship to "Weddings" or "Galleries"
- Wedding fields:
  - Featured image
  - Couple names
  - Season/year
  - Photo count
  - Gallery slug/link
  - Grid span options (1x1, 2x1, 2x2)