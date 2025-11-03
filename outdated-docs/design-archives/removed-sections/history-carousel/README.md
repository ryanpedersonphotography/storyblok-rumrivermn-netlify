# History Carousel Section - Archived

## Removal Date
2025-10-30

## Reason for Removal
Section removed from `/clean` route as requested. The "Journey Through Time" carousel was part of the initial migration but deemed unnecessary for the clean semantic implementation.

## Archived Files

### Component
- **HistoryCarousel.tsx** - React component with client-side carousel navigation

### Stylesheets
- **history-carousel.css** - Clean semantic CSS implementation (zero `!important`)
- **history-carousel-styles.css** - Original hotfix CSS implementation

## Section Details

**Section Name:** Journey Through Time / History Carousel

**Purpose:** Timeline carousel showing venue history from 2010-2024

**Features:**
- 4 timeline slides
- Previous/Next navigation buttons
- Autoplay toggle
- Dot indicators
- Client-side state management with React hooks

**Slides:**
1. 2010 - The Beginning
2. 2015 - Expansion & Growth
3. 2018 - Award Recognition
4. 2024 - A Decade of Love

## Technical Implementation

### CSS Properties
- Embla-style carousel viewport/container
- Smooth slide transitions
- Navigation button overlays
- Autoplay controls
- Responsive breakpoints (1024px, 768px, 480px)
- Dark mode support

### React Hooks Used
- `useState` for current slide index
- `useState` for autoplay state

### Icons Used
- `ChevronLeftIcon` - Previous slide
- `ChevronRightIcon` - Next slide
- `PlayIcon` - Start autoplay
- `PauseIcon` - Pause autoplay

## Restoration Instructions

If you need to restore this section:

1. Copy the component back:
   ```bash
   cp docs/design-archives/removed-sections/history-carousel/HistoryCarousel.tsx src/components/clean/
   ```

2. Copy the CSS back:
   ```bash
   cp docs/design-archives/removed-sections/history-carousel/history-carousel.css src/styles/semantic/
   ```

3. Add CSS import to `src/app/clean/layout.tsx`:
   ```tsx
   import '@/styles/semantic/history-carousel.css';
   ```

4. Add component to `src/app/clean/page.tsx`:
   ```tsx
   import HistoryCarousel from '@/components/clean/HistoryCarousel';

   // In the return statement, add where needed:
   <HistoryCarousel />
   ```

## Related Sections
- Testimonials (similar card-based layout)
- Gallery (similar grid system)

## Notes
- This was a fully functional, production-ready section
- All code was mechanically transformed from hotfix
- Zero `!important` declarations in semantic CSS
- Full dark mode support implemented
- All responsive breakpoints tested
