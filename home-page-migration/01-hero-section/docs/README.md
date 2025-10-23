# Hero Section Migration Guide

## Overview
The hero section is a full-viewport romantic wedding barn hero with overlay, call-to-action button, and scroll indicator.

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

## Payload CMS Integration
Convert to a Hero block with these fields:
- Kicker text (script accent)
- Main title 
- Title accent (highlighted portion)
- Description text
- CTA button text & link
- Background image upload