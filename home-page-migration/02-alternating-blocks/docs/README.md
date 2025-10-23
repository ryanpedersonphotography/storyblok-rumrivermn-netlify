# Alternating Blocks Section Migration Guide

## Overview
Two-column alternating layout blocks showcasing venue features with images on alternating sides.

## Files Included
- `code/alternating-blocks.tsx` - React component code
- `styles/alternating-blocks-styles.css` - Complete CSS styling

## Key Features
- Dark gradient background (warm walnut to sage green)
- Section header with script accent and title
- Two alternating blocks (normal + reverse layout)
- Numbered blocks (01, 02) with champagne gold accent
- High-quality venue images with hover effects
- Full responsive design

## CSS Classes
- `.hotfix-alternating-blocks` - Main section container
- `.hotfix-content-wrapper` - Content wrapper with max-width
- `.hotfix-section-header` - Header section
- `.hotfix-script-accent` - Script font accent text
- `.hotfix-section-title` - Main section title
- `.hotfix-lead` - Lead description text
- `.hotfix-blocks-container` - Container for all blocks
- `.hotfix-block-item` - Individual block item
- `.hotfix-block-item.reverse` - Reversed layout block
- `.hotfix-block-content` - Content side of block
- `.hotfix-block-image` - Image side of block
- `.hotfix-number` - Block number (01, 02)
- `.hotfix-block-lead` - Block lead text

## Block Content

### Block 01 - A Picturesque Location
- Number: 01
- Title: "A Picturesque Location For Your Special Event"
- Lead: "Near Milaca, Saint Paul, St Cloud, and Brainerd MN"
- Content: Venue flexibility and booking information
- Image: `barn-interior-ceiling-beams-lighting.jpg`

### Block 02 - Rum River Barn & Vineyard
- Number: 02  
- Title: "Rum River Barn & Vineyard"
- Lead: "Milaca, St. Cloud, Saint Paul, and Brainerd MN"
- Content: 400 acres description with natural features
- Image: `property-field-wildflowers-natural.jpg`
- Layout: Reverse (image left, content right)

## External Images Used
Currently references external images from rum-river-final.netlify.app:
1. `barn-interior-ceiling-beams-lighting.jpg`
2. `property-field-wildflowers-natural.jpg`

## Colors Used
- Background: Linear gradient from #4A3426 to #2D3A2F
- Text: White with 90% opacity variants
- Accent: Champagne Gold (#E4C896)
- Number: Champagne Gold with 50% opacity

## Typography
- Script accent: Dancing Script
- Titles: Playfair Display
- Body text: Default system fonts

## Migration Notes
1. Download and host the external images locally
2. Images are currently external URLs - need to be migrated to Payload media
3. Phone number: 612-801-0546 (hardcoded)
4. Layout uses CSS Grid with reverse direction for alternating
5. Hover effects on images with scale and shadow

## Payload CMS Integration
Convert to alternating blocks component with:
- Section header fields (accent, title, description)
- Repeatable block items with:
  - Block number
  - Title
  - Lead text
  - Content paragraphs
  - Image upload
  - Layout option (normal/reverse)