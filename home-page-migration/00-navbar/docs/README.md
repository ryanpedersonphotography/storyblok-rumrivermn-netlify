# Navbar Section Migration Guide

## Overview
Fixed-position navigation bar with transparent-to-white scroll effect, mobile overlay menu, and sophisticated visual transitions for the romantic wedding barn theme.

## Files Included
- `code/navbar-component.tsx` - React component with scroll detection and mobile menu
- `styles/navbar-styles.css` - Complete navbar styling with scroll effects

## Key Features
- **Transparent Overlay**: Starts transparent over hero, becomes white on scroll
- **Glassmorphic Effects**: Backdrop blur and translucent backgrounds
- **Responsive Design**: Desktop navigation + full-screen mobile overlay
- **Scroll Detection**: Dynamic styling based on scroll position
- **Gradient Effects**: Logo icon and link underlines with brand colors
- **Text Shadows**: Enhanced readability over hero background
- **Mobile Menu**: Full-screen overlay with blur effect

## Visual Design

### Initial State (Transparent)
- **Background**: `transparent` with no backdrop filter
- **Text Color**: White with text shadows for hero overlay
- **Logo**: White text with gradient icon background
- **Border**: Transparent bottom border

### Scrolled State (White)
- **Background**: `rgba(255, 255, 255, 0.95)` with `backdrop-filter: blur(15px)`
- **Text Color**: Warm walnut (`#6B4E3D`)
- **Shadow**: Subtle box shadow `0 4px 20px rgba(107, 78, 61, 0.08)`
- **Border**: Light bottom border `rgba(107, 78, 61, 0.1)`

## Logo Design
- **Icon**: Gradient background (`#9D6B7B` to `#6B4E3D`) with "RR" initials
- **Text**: "Rum River Barn" in Montserrat font
- **Hover**: Changes to dusty rose color
- **Size**: 2rem icon, 1.125rem text

## Navigation Links
- **Typography**: Montserrat, 500 weight, 0.875rem
- **Hover Effect**: Dusty rose color with gradient underline animation
- **Underline**: Animated from 0 to 100% width on hover
- **Active State**: Dusty rose color with full underline

## Mobile Menu
- **Trigger**: Hamburger button (hidden on desktop 900px+)
- **Overlay**: Full-screen with cream background and blur
- **Animation**: Opacity and visibility transitions
- **Close**: X button in top-right corner
- **Links**: Larger text (1.5rem) centered vertically

## CSS Classes
- `.hotfix-navbar` - Main navbar container (fixed position)
- `.hotfix-navbar-container` - Inner container (max-width 1400px)
- `.hotfix-navbar-logo` - Logo link with icon and text
- `.hotfix-navbar-logo-icon` - Gradient background icon
- `.hotfix-navbar-nav` - Desktop navigation links container
- `.hotfix-navbar-link` - Individual navigation links
- `.hotfix-navbar-mobile-btn` - Mobile hamburger button
- `.hotfix-navbar-mobile-menu` - Full-screen mobile overlay
- `.hotfix-navbar-mobile-close` - Mobile menu close button
- `.hotfix-navbar-cta` - Call-to-action button styling

## Color Scheme
- **Warm Walnut**: `#6B4E3D` (scrolled text)
- **Dusty Rose**: `#9D6B7B` (hover states, active links)
- **Champagne Gold**: `#E4C896` (gradient accents)
- **White**: `#FFFFFF` (transparent state text)
- **Cream Pearl**: `#FFFCF8` (mobile menu background)

## Interactive Effects
1. **Scroll Detection**: Toggles `.scrolled` class at 50px scroll
2. **Link Hover**: Gradient underline animation (0.3s ease)
3. **Logo Hover**: Color change to dusty rose
4. **Mobile Toggle**: Opacity/visibility transition (0.3s)
5. **Button Hover**: Background and border color changes

## Responsive Breakpoints
- **< 900px**: Mobile menu button visible, desktop nav hidden
- **900px - 1024px**: Desktop nav with reduced gaps (1.25rem)
- **1024px - 1200px**: Medium gaps (1.5rem)
- **1200px+**: Full spacing (2rem gaps)

## Typography Hierarchy
- **Logo Text**: Montserrat 600, 1.125rem, -0.02em letter-spacing
- **Nav Links**: Montserrat 500, 0.875rem, 0.01em letter-spacing
- **Mobile Links**: Montserrat 400, 1.5rem
- **CTA Button**: Montserrat 500, 0.875rem

## Implementation Notes

### Client Component Features
- Scroll position detection with `useEffect` and `window.addEventListener`
- Mobile menu state management with `useState`
- Dynamic class application based on scroll position

### Server Component Alternative
- Static version available (`NavbarStatic`) for SSR environments
- No JavaScript dependencies for basic navigation
- Mobile menu requires client-side JavaScript for functionality

### Integration with Home Page
- Fixed positioning allows hero section to render underneath
- Z-index of 1000 ensures navbar stays above all content
- Transparent initial state designed specifically for hero backgrounds

## Performance Considerations
- Scroll listener uses efficient event handling
- CSS transitions handle visual effects (hardware accelerated)
- Mobile menu overlay uses transform/opacity for smooth animations
- Backdrop blur may impact performance on older devices

## Accessibility Features
- Proper ARIA labels for mobile menu buttons
- Keyboard navigation support for all links
- Focus states inherit hover styling
- Semantic navigation structure with proper heading hierarchy

## Payload CMS Integration
Convert to navigation block with:
- **Logo Configuration**:
  - Logo text (editable)
  - Logo icon/image upload
  - Logo link destination
- **Navigation Items**:
  - Dynamic menu item management
  - Link text and URLs
  - Show/hide toggles
- **CTA Button**:
  - Button text and destination
  - Show/hide toggle
  - Color scheme selection
- **Styling Options**:
  - Scroll effect enable/disable
  - Mobile breakpoint settings
  - Color customization

## Migration Notes
1. **Scroll Effect**: Requires client-side JavaScript for dynamic behavior
2. **Mobile Menu**: Full-screen overlay approach for better UX
3. **Logo Icon**: Uses CSS gradient, can be replaced with image
4. **Font Loading**: Ensure Montserrat font is loaded for proper rendering
5. **Z-Index**: Fixed at 1000, may need adjustment for other fixed elements