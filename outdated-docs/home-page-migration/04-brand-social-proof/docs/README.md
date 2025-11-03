# Brand Social Proof Section Migration Guide

## Overview
Brand logos and testimonial quote section with sophisticated gradient background and decorative effects.

## Files Included
- `code/brand-social-proof.tsx` - React component with brand data
- `styles/brand-social-proof-styles.css` - Complete CSS styling

## Key Features
- Gradient background (sage green to deep brown)
- 4 brand logos in horizontal layout
- Highlighted testimonial quote with italic accents
- Complex decorative effects (beveled edges, star pattern)
- Sophisticated hover animations

## Brand Logos Included
1. **THE KNOT** - Wedding planning platform
2. **WEDDINGWIRE** - Wedding vendor directory
3. **MARTHA STEWART** - Lifestyle brand
4. **MINNESOTA BRIDE** - Local wedding magazine

## Testimonial Quote
> "Rum River Barn isn't just a venue—it's **where dreams come to life**. Their commitment to saying 'yes' to every couple's vision sets them apart as **Minnesota's most accommodating wedding destination**."

*Highlighted phrases use accent gold color with italic styling*

## CSS Classes
- `.hotfix-brand-quote-section` - Main section container
- `.hotfix-brand-quote-content` - Content wrapper
- `.hotfix-brand-logos` - Logo container (flexbox)
- `.hotfix-brand-logo` - Individual brand logo text
- `.hotfix-brand-quote-text` - Main testimonial quote
- `.hotfix-highlight` - Highlighted quote spans

## Visual Effects

### Background System
1. **Gradient**: Sage green (#7A8B7F) to deep brown (#4A3426)
2. **Star Pattern**: SVG pattern overlay with subtle white dots
3. **Beveled Edges**: Top and bottom decorative borders with glassmorphism

### Interactive Elements
- **Logo Hover**: Color change to champagne gold with lift effect
- **Highlight Hover**: Text glow and color shift effects
- **Smooth Transitions**: 0.3s ease timing for all interactions

### Decorative Details
- **Top Bevel**: 12px height with gradient and backdrop blur
- **Bottom Bevel**: Matching decorative border 
- **Star Pattern**: Repeating SVG background with low opacity
- **Box Shadows**: Multi-layer shadow system for depth

## Colors Used
- Background: Linear gradient #7A8B7F to #4A3426
- Text: White (#FFFFFF)
- Logo Hover: Champagne Gold (#E4C896)
- Highlight Base: Accent Gold (#D4A574)
- Highlight Hover: Champagne Gold (#E4C896)

## Typography
- Brand Logos: Montserrat, 500 weight, uppercase, 2px letter-spacing
- Quote Text: Playfair Display, 400 weight, 32px (2rem)
- Highlights: Italic, 500 weight

## Layout & Responsive
- **Desktop**: Horizontal logo flex with 60px gaps
- **Tablet**: Reduced gaps (40px), smaller text (28px)
- **Mobile**: Reduced gaps (30px), smaller logos (12px)
- **Small Mobile**: Vertical logo stack, 20px quote size

## Complex CSS Features
1. **Backdrop Blur**: Advanced glassmorphism effects
2. **SVG Patterns**: Inline data URLs for decorative backgrounds
3. **Multi-layer Shadows**: Complex box-shadow combinations
4. **Pseudo-element Positioning**: Beveled edges with precise positioning
5. **Transform Effects**: Hover lifts and text shadow animations

## Migration Notes
1. Brand logos are text-only (no actual logo images)
2. Quote text has manual highlighted spans
3. Complex decorative effects may need modern browser support
4. SVG patterns are inline data URLs
5. Advanced CSS features (backdrop-filter) require fallbacks

## Payload CMS Integration
Convert to brand social proof block with:
- **Brand Collection**: 
  - Brand name
  - Logo image upload (replace text)
  - URL/link (optional)
  - Display order
- **Quote Fields**:
  - Quote text (rich text with highlight formatting)
  - Attribution (optional)
- **Styling Options**:
  - Background gradient controls
  - Logo layout (horizontal/grid)
  - Decorative effects toggle