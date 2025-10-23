# Animation & Interaction Guide

## Overview
Complete documentation of all animations, interactions, and JavaScript elements used in the romantic wedding barn theme migration.

## Keyframe Animations

### 1. Hero Section Animations
```css
@keyframes hotfixFadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes hotfixBounce {
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-10px);
  }
  60% {
    transform: translateY(-5px);
  }
}
```

**Usage:**
- `hotfixFadeInUp`: Hero content entrance animation (1.2s ease-out)
- `hotfixBounce`: Scroll indicator bounce effect (2s infinite)

### 2. Form Background Animation
```css
@keyframes hotfix-rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
```

**Usage:**
- Applied to form section background decoration
- Duration: 30s linear infinite
- Creates subtle rotating gradient effect

## Interactive Hover Effects

### Button Transforms
- **Primary Buttons**: `translateY(-2px)` + enhanced shadow
- **Secondary Buttons**: `translateY(-2px)` + color change
- **Icon Buttons**: `scale(1.1)` + shadow enhancement

### Image Effects
- **Gallery Cards**: `translateY(-8px)` + `scale(1.05)` on image
- **Carousel Cards**: `translateY(-8px)` + shadow enhancement
- **Feature Images**: `scale(1.02)` transform

### Shimmer Animations
- **Gallery Items**: Left-to-right shimmer sweep (0.8s)
- **Buttons**: Diagonal shimmer effect (0.6s)
- **Cards**: Light sweep across surface

## JavaScript Interactions

### 1. Navbar Scroll Detection
```typescript
useEffect(() => {
  const handleScroll = () => {
    setIsScrolled(window.scrollY > 50)
  }
  window.addEventListener('scroll', handleScroll)
  return () => window.removeEventListener('scroll', handleScroll)
}, [])
```

**Features:**
- Dynamic class toggling based on scroll position
- Transparent to white background transition
- Text color and shadow adjustments

### 2. Carousel Navigation
```typescript
const [emblaRef, emblaApi] = useEmblaCarousel({
  loop: true,
  align: "center",
  skipSnaps: false,
  dragFree: false,
}, [autoplay])
```

**Features:**
- Embla carousel with autoplay
- Touch/drag navigation
- Indicator dots with active states
- Previous/next arrow controls
- Responsive breakpoint adjustments

### 3. Mobile Menu Toggle
```typescript
const [isMenuOpen, setIsMenuOpen] = useState(false)
```

**Features:**
- Full-screen overlay menu
- Backdrop blur effects
- Smooth opacity transitions
- Click-outside-to-close functionality

### 4. Form Field Focus Management
**Automatic focus states:**
- Gold border color (`#D4A574`)
- Enhanced box shadow glow
- Background opacity change
- Smooth transitions (0.3s ease)

## Transition Specifications

### Standard Durations
- **Hover effects**: 0.3s ease
- **Button interactions**: 0.4s cubic-bezier(0.4, 0, 0.2, 1)
- **Image transforms**: 0.4s ease
- **Shimmer effects**: 0.6s - 0.8s ease
- **Page transitions**: 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94)

### Easing Functions
- **Standard**: `ease` (most common)
- **Buttons**: `cubic-bezier(0.4, 0, 0.2, 1)` (material design)
- **Smooth**: `cubic-bezier(0.25, 0.46, 0.45, 0.94)` (refined easing)
- **Linear**: `linear` (background animations only)

## Glassmorphism Effects

### Implementation
```css
.hotfix-glass {
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  background: rgba(255, 255, 255, 0.95);
  border: 1px solid rgba(255, 255, 255, 0.2);
}
```

**Used in:**
- Form containers
- Navigation overlays
- Card elements
- Action buttons

## Performance Considerations

### Hardware Acceleration
```css
.hotfix-gpu-accelerated {
  transform: translateZ(0);
  will-change: transform;
  backface-visibility: hidden;
  perspective: 1000px;
}
```

### Reduced Motion Support
```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

## Animation States by Section

### 00-navbar
- ✅ Scroll-based background transition
- ✅ Logo color changes
- ✅ Link underline animations
- ✅ Mobile menu overlay

### 01-hero-section
- ✅ Fade-in content animation
- ✅ Scroll indicator bounce
- ✅ Button shimmer effects
- ✅ Background parallax (CSS only)

### 02-alternating-blocks
- ✅ Image hover transforms
- ✅ Text content fades
- ✅ Staggered entrance effects

### 03-love-stories-gallery
- ✅ Card hover lifts
- ✅ Image scale effects
- ✅ Shimmer sweep animations
- ✅ Overlay transitions

### 04-brand-social-proof
- ✅ Logo hover effects
- ✅ Quote highlight animations
- ✅ Gradient background effects

### 05-testimonials
- ✅ Card hover states
- ✅ Avatar overlay effects
- ✅ Rating star animations
- ✅ Underline width animations

### 06-history-carousel
- ✅ Embla carousel controls
- ✅ Autoplay functionality
- ✅ Navigation button hovers
- ✅ Indicator animations

### 07-schedule-form
- ✅ Rotating background decoration
- ✅ Field focus states
- ✅ Button shimmer effects
- ✅ Glassmorphic container

### 08-map-section
- ✅ Action button hovers
- ✅ Icon scale effects
- ✅ Shimmer button animations
- ✅ Location card hovers

## Implementation Checklist

### CSS Animations ✅
- [x] All keyframe animations included
- [x] Hover state transitions
- [x] Transform effects
- [x] Glassmorphism styling
- [x] Responsive behavior

### JavaScript Interactions ✅
- [x] Scroll detection
- [x] Carousel navigation
- [x] Mobile menu toggle
- [x] Form state management
- [x] Event listeners

### Performance ✅
- [x] Hardware acceleration
- [x] Reduced motion support
- [x] Efficient event handling
- [x] Optimized selectors

### Accessibility ✅
- [x] Motion preferences respected
- [x] Focus states defined
- [x] ARIA labels included
- [x] Keyboard navigation

## Migration Notes

1. **Embla Carousel**: Requires `npm install embla-carousel-react embla-carousel-autoplay`
2. **Backdrop Filter**: May need vendor prefixes for older browsers
3. **Custom Properties**: Ensure CSS variables are properly defined
4. **Event Listeners**: Clean up on component unmount
5. **Touch Gestures**: Test on mobile devices for proper interaction

## Browser Support

- **Modern browsers**: Full support (Chrome 88+, Firefox 85+, Safari 14+)
- **Backdrop blur**: Requires modern browser support
- **CSS transforms**: Universal support
- **JavaScript features**: ES6+ required for carousel functionality