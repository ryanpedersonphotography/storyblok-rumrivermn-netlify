# History Carousel Section Migration Guide

## Overview
Interactive timeline carousel showcasing the 100+ year history of Rum River Barn with Embla carousel functionality.

## Files Included
- `code/ModernHistoryCarousel.tsx` - Complete React component with Embla carousel
- `docs/README.md` - This migration guide

## Key Features
- **Embla Carousel**: Auto-playing carousel with navigation controls
- **Historical Timeline**: 6 slides covering 1914 to present day
- **Interactive Controls**: Play/pause, navigation arrows, dot indicators
- **Auto-play**: 5-second intervals with stop on interaction
- **Responsive Design**: Mobile-optimized layout
- **Progress Indicators**: Current slide counter and dot navigation

## External Dependencies
```json
{
  "embla-carousel-react": "^8.x",
  "embla-carousel-autoplay": "^8.x",
  "lucide-react": "^0.x"
}
```

## Historical Timeline Data
The component includes 6 historical slides:

### 1914 - Norwegian Settlers Arrive
- **Title**: "Norwegian Settlers Arrive"
- **Description**: "Sigvart and Helga Selmer, Norwegian immigrants, settled the land and built their first one-room house."
- **Image**: Unsplash placeholder (homestead)

### 1932 - Discovery of the Giant White Pine
- **Title**: "Discovery of the Giant White Pine"
- **Description**: "Sigvart and his sons found a massive white pine that took seven horses to pull to the farm."
- **Image**: Unsplash placeholder (forest)

### 1942-1952 - White Barn Construction
- **Title**: "White Barn Construction"
- **Description**: "The iconic White Barn was built using lumber from the giant white pine, dried for 20 years."
- **Image**: Unsplash placeholder (barn construction)

### 1959-2003 - Harold Selmer's Farming Legacy
- **Title**: "Harold Selmer's Farming Legacy"
- **Description**: "Harold transformed the farm into a successful dairy operation, maintaining family traditions."
- **Image**: Unsplash placeholder (dairy farm)

### 2006 - First Wedding Event
- **Title**: "First Wedding Event"
- **Description**: "Rum River Barn hosted its first wedding, marking the beginning of a new era as an event venue."
- **Image**: Unsplash placeholder (wedding)

### Today - Minnesota's Premier Barn Venue
- **Title**: "Minnesota's Premier Barn Venue"
- **Description**: "Operating as Minnesota's premier country and barn event venue for over 18 years."
- **Image**: Unsplash placeholder (modern venue)

## Component Structure
```tsx
export function ModernHistoryCarousel() {
  // State management for carousel
  const [isPlaying, setIsPlaying] = useState(true);
  const [selectedIndex, setSelectedIndex] = useState(0);
  
  // Embla carousel setup with autoplay
  const autoplay = Autoplay({ delay: 5000 });
  const [emblaRef, emblaApi] = useEmblaCarousel(config, [autoplay]);
  
  // Navigation functions
  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);
  const scrollTo = useCallback((index) => emblaApi?.scrollTo(index), [emblaApi]);
  
  // Auto-play toggle
  const toggleAutoplay = useCallback(() => { /* ... */ }, [emblaApi]);
}
```

## Styling Classes
The component uses inline Tailwind classes:
- **Background**: `bg-gradient-to-b from-[#FFFCF8] to-[#F8F5F1]`
- **Colors**: Romantic wedding palette (walnut brown, champagne gold, dusty rose)
- **Typography**: Dancing Script, Montserrat, consistent with site theme
- **Layout**: Responsive with aspect ratio preservation

## Interactive Features
1. **Auto-play Controls**: Play/pause button with icon toggle
2. **Navigation Arrows**: Previous/next with hover effects
3. **Dot Indicators**: Click to jump to specific slides
4. **Slide Counter**: "X of Y" indicator
5. **Responsive Touch**: Mobile swipe gestures supported

## Images Used
All images are currently Unsplash placeholders:
- Homestead: `photo-1566478989037-eec170784d0b`
- Forest: `photo-1441974231531-c6227db76b6e`
- Barn: `photo-1500937386664-56d1dfef3854`
- Farm: `photo-1500595046743-cd271d694d30`
- Wedding: `photo-1519167758481-83f29ba5fe86`
- Modern: `photo-1519741497674-611481863552`

## Carousel Configuration
```tsx
const emblaConfig = {
  loop: true,           // Infinite loop
  align: "center",      // Center alignment
  skipSnaps: false,     // Don't skip snap points
  dragFree: false,      // Snap to slides
}

const autoplayConfig = {
  delay: 5000,          // 5 second intervals
  stopOnInteraction: false,  // Continue after user interaction
  playOnInit: true,     // Start playing immediately
}
```

## Colors Used
- **Background Gradient**: #FFFCF8 to #F8F5F1 (cream tones)
- **Primary Text**: #6B4E3D (warm walnut)
- **Accent Text**: #9D6B7B (dusty rose)
- **Accent Elements**: #E4C896 (champagne gold)
- **Button Hover**: #9D6B7B (dusty rose)

## Migration Notes
1. **Dependencies**: Requires Embla Carousel packages
2. **Images**: Replace Unsplash URLs with actual historical photos
3. **Data**: Historical content should become CMS-managed
4. **Responsive**: Already mobile-optimized with Tailwind
5. **Accessibility**: Includes proper ARIA labels and alt text

## Payload CMS Integration
Convert to history carousel block with:
- **Collection**: "Historical Events" or "Timeline Items"
- **Fields Per Item**:
  - Year/date range
  - Title
  - Description
  - Featured image
  - Display order
- **Component Settings**:
  - Auto-play enabled/disabled
  - Slide timing interval
  - Show/hide controls
  - Background gradient options

## Performance Considerations
- Lazy loading for images
- Optimized carousel with `skipSnaps: false`
- Efficient state management with useCallback hooks
- Responsive image sizing with aspect ratios