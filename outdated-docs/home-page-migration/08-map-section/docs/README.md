# Map Section Migration Guide

## Overview
Interactive location section with split-screen design featuring venue details and embedded Google Maps.

## Files Included
- `code/map-section.tsx` - React component with location data and Google Maps
- `styles/map-section-styles.css` - Complete CSS styling

## Key Features
- **Split-Screen Layout**: Information panel (left) + interactive map (right)
- **Google Maps Integration**: Embedded iframe with custom overlay
- **Location Details**: 4 information cards with icons and descriptions
- **Action Buttons**: Floating buttons for directions and full map view
- **Responsive Design**: Stacks vertically on mobile devices
- **Gradient Overlays**: Sophisticated visual effects

## Location Information Cards

### 1. Address
- **Icon**: Location pin (Heroicons)
- **Content**: 42618 78th Street, Hillman, MN 56338

### 2. Easy Access From
- **Icon**: Question mark circle (Heroicons)
- **Content**: 
  - 45 min from Minneapolis
  - 30 min from St. Cloud  
  - 1 hour from Brainerd

### 3. Nearest Airport
- **Icon**: Globe/radar (Heroicons)
- **Content**: Minneapolis-St. Paul International, 55 miles (1 hour drive)

### 4. Accommodations
- **Icon**: Building/hotel (Heroicons)
- **Content**: Partner hotels in Princeton & Milaca, Group rates available

## Google Maps Integration

### Embedded Map
```html
<iframe
  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2817.8985775673544!2d-93.7851842!3d45.8936111!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x52b39b1c5c5c5c5c%3A0x5c5c5c5c5c5c5c5c!2s42618%2078th%20St%2C%20Hillman%2C%20MN%2056338!5e0!3m2!1sen!2sus!4v1704067200000!5m2!1sen!2sus"
  loading="lazy"
  referrerPolicy="no-referrer-when-downgrade"
  title="Rum River Barn Location"
/>
```

### Action Buttons
1. **Get Directions**: Links to Google Maps directions
2. **Full Map**: Opens full Google Maps view

## CSS Classes
- `.hotfix-map-section` - Main section container
- `.hotfix-map-container` - Split-screen grid container
- `.hotfix-map-info` - Left information panel
- `.hotfix-map-header` - Header section
- `.hotfix-script-accent` - Script accent text
- `.hotfix-map-title` - Main section title
- `.hotfix-map-lead` - Description text
- `.hotfix-location-details` - Container for location cards
- `.hotfix-location-item` - Individual location card
- `.hotfix-location-icon` - Icon container with gradient
- `.hotfix-location-text` - Text content area
- `.hotfix-map-embed` - Right map container
- `.hotfix-map-overlay` - Floating action buttons
- `.hotfix-map-action-btn` - Individual action button

## Visual Design

### Layout Structure
- **Desktop**: 50/50 split screen (information | map)
- **Tablet**: Single column stack
- **Mobile**: Optimized single column with smaller map

### Color Scheme
- **Left Panel**: Cream pearl background (#FFFCF8)
- **Text**: Warm walnut (#6B4E3D)
- **Accents**: Dusty rose (#9D6B7B)
- **Icons**: Gradient (champagne gold to dusty rose)
- **Map Background**: Sage green (#7A8B7F)

### Interactive Elements
1. **Icon Hover**: Scale(1.1) with enhanced shadow
2. **Button Hover**: Color change to champagne gold + lift effect
3. **Shimmer Effect**: Buttons have shimmer animation on hover
4. **Map Overlay**: Gradient overlay for visual depth

## Location Data Structure
```typescript
const locationDetails = [
  {
    icon: <LocationIcon />,
    title: "Address",
    content: <>42618 78th Street<br />Hillman, MN 56338</>
  },
  // ... other location items
];
```

## External Links
- **Directions**: `https://www.google.com/maps/dir//42618+78th+Street,+Hillman,+MN+56338`
- **Full Map**: `https://www.google.com/maps/place/42618+78th+St,+Hillman,+MN+56338`

## Responsive Behavior
- **Desktop (1024px+)**: Side-by-side layout
- **Tablet (768px-1024px)**: Stacked with adjusted padding
- **Mobile (<768px)**: Compact stacked layout with smaller map (400px height)

## Advanced CSS Features
1. **Grid Layout**: CSS Grid for split-screen design
2. **Backdrop Filter**: Glassmorphism on action buttons
3. **Gradient Overlays**: Multiple gradient layers for depth
4. **Transform Effects**: Scale and translate animations
5. **Shimmer Animation**: CSS-only shimmer effect on buttons

## Icons Used (Heroicons)
All icons are inline SVG from Heroicons outline set:
- Location pin (map-pin)
- Question mark circle (question-mark-circle)
- Globe/radar (radio)
- Building (building-office)
- Arrow expand (arrows-pointing-out)

## Migration Notes
1. **Google Maps**: Requires Google Maps API key for production use
2. **Heroicons**: Uses inline SVG icons, no external dependencies
3. **Responsive Images**: No images needed, uses embedded map
4. **Performance**: Map uses lazy loading
5. **Accessibility**: Proper iframe title and alt text included

## Payload CMS Integration
Convert to location/map block with:
- **Venue Information**:
  - Address fields
  - Distance information
  - Airport details
  - Accommodation info
- **Map Configuration**:
  - Google Maps embed URL
  - Map center coordinates
  - Zoom level
  - Custom styling options
- **Action Buttons**:
  - Button text customization
  - Link URLs
  - Show/hide toggles
- **Content Management**:
  - Header text (accent, title, description)
  - Location card content
  - Icon selection/upload

## Technical Considerations
- Map embed URL may need updating for production
- Consider GDPR compliance for embedded Google services
- Action buttons open in new tabs for better UX
- Responsive design maintains usability across all devices