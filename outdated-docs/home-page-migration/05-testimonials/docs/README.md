# Testimonials Section Migration Guide

## Overview
Social proof testimonials section with customer reviews, star ratings, and avatar photos on glassmorphism cards.

## Files Included
- `code/testimonials-section.tsx` - React component with testimonial data
- `styles/testimonials-styles.css` - Complete CSS styling

## Key Features
- Blush pink background matching love stories section (#F4E4E1)
- Glassmorphism cards with backdrop blur
- 5-star rating system with SVG icons
- Customer avatar photos from Unsplash
- Smooth hover animations with multiple effects
- Responsive grid layout

## Testimonials Data Structure
Each testimonial includes:
- `quote` - Customer testimonial text
- `customerName` - Couple's names
- `avatarImage` - Customer photo URL (Unsplash)
- `galleryLink` - Link to gallery (currently `/gallery`)
- `ctaText` - Call-to-action text

## Testimonials Included
1. **Sarah & Michael Johnson**
   - Quote: "From our first tour to our last dance..."
   - Avatar: Unsplash photo (wedding couple)

2. **Emma & James Wilson**
   - Quote: "We wanted rustic elegance..."
   - Avatar: Unsplash photo (elegant couple)

3. **Amanda & Chris Thompson**
   - Quote: "The team went above and beyond..."
   - Avatar: Unsplash photo (winter wedding)

## CSS Classes
- `.hotfix-social-proof` - Main section container
- `.hotfix-social-proof-content` - Content wrapper
- `.hotfix-social-proof-header` - Section header
- `.hotfix-script-accent` - Script accent text ("Love Letters")
- `.hotfix-social-section-title` - Main section title
- `.hotfix-social-lead` - Lead description
- `.hotfix-testimonials-grid` - Grid container
- `.hotfix-testimonial-card` - Individual testimonial card
- `.hotfix-card-underline` - Animated underline effect
- `.hotfix-star-rating` - Star rating container
- `.hotfix-star` - Individual star icon
- `.hotfix-couple-avatar` - Avatar container
- `.hotfix-avatar-image` - Avatar image
- `.hotfix-avatar-overlay` - Hover overlay effect
- `.hotfix-couple-name` - Customer name text
- `.hotfix-wedding-gallery-cta` - CTA text

## Interactive Effects
1. **Card Hover**: translateY(-8px) with enhanced shadow
2. **Underline Animation**: Champagne gold line expands from 0 to 100% width
3. **Star Scale**: Each star scales to 1.1x on hover
4. **Avatar Zoom**: Image scales to 1.1x with radial overlay
5. **CTA Fade In**: Gallery CTA fades in with translateY animation

## External Dependencies
- **Unsplash Images**: All avatar photos are from Unsplash
- **SVG Icons**: Inline star rating icons
- **Backdrop Filter**: CSS backdrop-blur for glassmorphism

## Image URLs Used
1. `https://images.unsplash.com/photo-1606216794074-735e91aa2c92` (Sarah & Michael)
2. `https://images.unsplash.com/photo-1519741497674-611481863552` (Emma & James)  
3. `https://images.unsplash.com/photo-1522673607200-164d1b6ce486` (Amanda & Chris)

## Colors Used
- Background: #F4E4E1 (blush pink)
- Card: rgba(255, 255, 255, 0.85) with backdrop blur
- Text: #6B4E3D (warm walnut)
- Accent: #9D6B7B (dusty rose)
- Stars/Underline: #E4C896 (champagne gold)

## Typography
- Script accent: Dancing Script
- Section title: Playfair Display
- Quote: Playfair Display (italic)
- Customer names: Playfair Display (600 weight)
- CTA: Default font (500 weight)

## Grid Layout
- Desktop: auto-fit with min 350px columns
- Responsive: Single column on mobile
- Gap: 2.5rem (desktop), 2rem (mobile)
- Max width: 1200px

## Migration Notes
1. Download Unsplash images and host locally or use Payload media
2. All testimonial links currently point to `/gallery`
3. Star rating uses inline SVG - could be componentized
4. Glassmorphism effects require modern browser support
5. Complex hover animations with cubic-bezier easing

## Payload CMS Integration
Convert to testimonials block with:
- Section header fields (accent, title, description)
- Collection relationship to "Testimonials" with fields:
  - Quote text (rich text)
  - Customer name
  - Avatar image upload
  - Star rating (1-5)
  - Gallery link/slug
  - CTA text
- Grid layout options
- Card styling variants