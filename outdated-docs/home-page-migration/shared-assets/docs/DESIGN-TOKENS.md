# Design Tokens - Romantic Wedding Barn Theme

## Overview
Complete design system tokens extracted from the hotfix-site.css implementation. These tokens define the entire visual language of the romantic wedding barn theme.

## Color Palette

### Primary Brand Colors

#### Browns & Earth Tones
- **Warm Walnut** (`#6B4E3D`) - Primary brand color, used for headers and main text
- **Deep Brown** (`#4A3426`) - Darker brown for backgrounds and depth
- **Text Dark** (`#2C2416`) - Dark brown for body text
- **Dark Chocolate** (`#1F1A11`) - Deepest brown for accents

#### Rose & Pink Tones
- **Dusty Rose** (`#9D6B7B`) - Secondary brand color, romantic accent
- **Dusty Rose Dark** (`#8A5D6C`) - Darker variant for hover states
- **Blush Pink** (`#F4E4E1`) - Light background color

#### Gold & Champagne
- **Champagne Gold** (`#E4C896`) - Primary accent color
- **Accent Gold** (`#D4A574`) - Alternative gold for highlights

#### Supporting Colors
- **Sage Green** (`#7A8B7F`) - Natural accent color
- **Cream Pearl** (`#FFFCF8`) - Primary light background
- **Warm Cream** (`#FBF8F4`) - Secondary light background

### Semantic Color Usage

```css
/* Primary Actions & Headers */
color: var(--color-warm-walnut);
background: var(--color-dusty-rose);

/* Accent Elements */
color: var(--color-champagne-gold);
border-color: var(--color-accent-gold);

/* Backgrounds */
background: var(--color-cream-pearl);
background: var(--color-blush-pink);

/* Text Hierarchy */
color: var(--color-text-primary);    /* Headers */
color: var(--color-text-secondary);  /* Body text */
color: var(--color-text-muted);      /* Supporting text */
```

## Typography System

### Font Families
- **Script**: `'Dancing Script', cursive` - Used for romantic accents
- **Serif**: `'Playfair Display', serif` - Used for elegant headlines
- **Sans-serif**: `'Montserrat', sans-serif` - Used for body text and UI

### Font Scale
```css
--font-size-xs: 0.75rem;      /* 12px - Small labels */
--font-size-sm: 0.875rem;     /* 14px - UI text */
--font-size-base: 1rem;       /* 16px - Body text */
--font-size-lg: 1.125rem;     /* 18px - Large body */
--font-size-xl: 1.25rem;      /* 20px - Subheadings */
--font-size-2xl: 1.5rem;      /* 24px - Small headers */
--font-size-3xl: 1.75rem;     /* 28px - Script accents */
--font-size-4xl: 2rem;        /* 32px - Section titles */
--font-size-5xl: 2.5rem;      /* 40px - Large titles */
--font-size-6xl: 3rem;        /* 48px - Hero titles */
--font-size-hero: clamp(3rem, 8vw, 5.5rem); /* Responsive hero */
```

### Typography Usage Examples
```css
/* Hero Titles */
font-family: var(--font-serif);
font-size: var(--font-size-hero);
font-weight: var(--font-weight-regular);
line-height: var(--line-height-tight);

/* Script Accents */
font-family: var(--font-script);
font-size: var(--font-size-3xl);
color: var(--color-champagne-gold);

/* Body Text */
font-family: var(--font-sans);
font-size: var(--font-size-base);
line-height: var(--line-height-relaxed);
```

## Gradient System

### Hero Overlays
```css
--gradient-hero: linear-gradient(135deg, 
  rgba(44, 36, 22, 0.85) 0%, 
  rgba(107, 78, 61, 0.75) 50%,
  rgba(58, 74, 60, 0.80) 100%);
```

### Background Gradients
```css
--gradient-alternating: linear-gradient(135deg, 
  rgba(74, 52, 38, 1) 0%, 
  rgba(45, 58, 47, 1) 100%);

--gradient-form: linear-gradient(135deg, 
  #4A3426 0%, 
  #6B4E3D 100%);
```

### Accent Gradients
```css
--gradient-gold: linear-gradient(135deg, 
  #E4C896 0%, 
  #9D6B7B 100%);

--gradient-underline: linear-gradient(90deg, 
  #9D6B7B 0%, 
  #E4C896 100%);
```

## Spacing System

### Consistent Scale
```css
--padding-xs: 0.5rem;    /* 8px */
--padding-sm: 0.75rem;   /* 12px */
--padding-md: 1rem;      /* 16px */
--padding-lg: 1.5rem;    /* 24px */
--padding-xl: 2rem;      /* 32px */
--padding-2xl: 3rem;     /* 48px */
--padding-3xl: 4rem;     /* 64px */
--padding-4xl: 5rem;     /* 80px */
--padding-5xl: 6rem;     /* 96px */
```

### Usage Guidelines
- Use consistent spacing multiples of 8px
- Section padding: `--padding-4xl` to `--padding-5xl`
- Card padding: `--padding-lg` to `--padding-2xl`
- Button padding: `--padding-sm` to `--padding-lg`

## Shadow System

### Brand-Specific Shadows
```css
--shadow-romantic: 0 10px 30px rgba(157, 107, 123, 0.3);
--shadow-gold: 0 8px 25px rgba(228, 200, 150, 0.4);
--shadow-walnut: 0 8px 32px rgba(107, 78, 61, 0.1);
--shadow-form: 0 20px 60px rgba(0, 0, 0, 0.3);
```

### Shadow Usage
- **Cards**: `--shadow-walnut` for subtle elevation
- **Buttons**: `--shadow-romantic` for primary actions
- **Forms**: `--shadow-form` for important containers
- **Hovers**: `--shadow-gold` for accent interactions

## Border Radius

### Consistent Rounding
```css
--radius-sm: 0.125rem;    /* 2px - Subtle rounding */
--radius-md: 0.375rem;    /* 6px - Default buttons */
--radius-lg: 0.5rem;      /* 8px - Cards */
--radius-xl: 0.75rem;     /* 12px - Large cards */
--radius-2xl: 1rem;       /* 16px - Hero elements */
--radius-3xl: 1.25rem;    /* 20px - Special containers */
--radius-full: 9999px;    /* Full rounded - Pills/circles */
```

## Animation Tokens

### Duration Scale
```css
--duration-fast: 0.15s;      /* Quick interactions */
--duration-normal: 0.3s;     /* Standard transitions */
--duration-slow: 0.4s;       /* Button interactions */
--duration-slower: 0.6s;     /* Shimmer effects */
--duration-slowest: 0.8s;    /* Gallery animations */
--duration-entrance: 1.2s;   /* Page entrance */
--duration-rotation: 30s;    /* Background rotation */
```

### Easing Functions
```css
--ease-linear: linear;                               /* Consistent motion */
--ease-material: cubic-bezier(0.4, 0, 0.2, 1);     /* Material design */
--ease-bounce: cubic-bezier(0.25, 0.46, 0.45, 0.94); /* Smooth bounce */
```

## Glassmorphism System

### Glass Effects
```css
--color-glass-white: rgba(255, 255, 255, 0.95);
--color-glass-light: rgba(255, 255, 255, 0.85);
--color-glass-border: rgba(255, 255, 255, 0.2);
```

### Implementation
```css
.glass-effect {
  background: var(--color-glass-white);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid var(--color-glass-border);
}
```

## Container System

### Content Widths
```css
--content-narrow: 600px;     /* Text content */
--content-medium: 800px;     /* Forms */
--content-wide: 1200px;      /* Main sections */
--content-full: 1400px;      /* Full layouts */
```

## Implementation Guidelines

### 🔥 **CRITICAL: PERFECT DESIGN FIDELITY REQUIRED**
- **Priority**: Visual accuracy over performance optimization
- **Advanced Effects**: Include ALL complex CSS (glassmorphism, shimmer, multi-layer gradients)
- **External Assets**: Replace ALL Unsplash URLs with migration-images photos
- **Font Strategy**: Use next/font for self-hosted fonts (not CSS @import)

### CSS Custom Properties Usage
```css
/* ✅ Good - Use semantic tokens */
.hero-title {
  color: var(--color-text-primary);
  font-size: var(--font-size-hero);
  font-family: var(--font-serif);
}

/* ❌ Avoid - Direct hex values */
.hero-title {
  color: #6B4E3D;
  font-size: 3rem;
}
```

### Font Loading Strategy (Updated)
```typescript
// IMPLEMENTATION: Use next/font instead of CSS @import
import { Dancing_Script, Playfair_Display, Montserrat } from 'next/font/google'

const dancingScript = Dancing_Script({ 
  subsets: ['latin'],
  variable: '--font-script',
  display: 'swap'
})

const playfairDisplay = Playfair_Display({ 
  subsets: ['latin'],
  variable: '--font-serif',
  display: 'swap'  
})

const montserrat = Montserrat({
  subsets: ['latin'], 
  variable: '--font-sans',
  display: 'swap'
})
```

### Responsive Design
```css
/* Mobile-first approach with tokens */
.section-padding {
  padding: var(--padding-2xl) var(--padding-md);
}

@media (min-width: 768px) {
  .section-padding {
    padding: var(--padding-4xl) var(--padding-xl);
  }
}
```

### Component Integration
```css
/* Button using design tokens */
.romantic-button {
  background: var(--gradient-gold);
  color: var(--color-text-light);
  padding: var(--padding-sm) var(--padding-lg);
  border-radius: var(--radius-full);
  box-shadow: var(--shadow-romantic);
  font-family: var(--font-sans);
  font-weight: var(--font-weight-medium);
  transition: all var(--duration-normal) var(--ease-material);
}

.romantic-button:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-gold);
}
```

## Token Categories Summary

- **Colors**: 14 unique hex values + semantic mappings
- **Typography**: 3 font families + 11 size scales
- **Spacing**: 9-step scale for padding/margins
- **Shadows**: 8 brand-specific shadow definitions
- **Animations**: 7 duration scales + 3 easing functions
- **Gradients**: 8 pre-defined gradient combinations
- **Borders**: 7 radius scales for consistent rounding

## Migration Benefits

1. **Consistency**: All components use same color/spacing values
2. **Maintainability**: Change tokens to update entire theme
3. **Scalability**: Easy to add new variants or themes
4. **Performance**: CSS custom properties are efficient
5. **Developer Experience**: Semantic naming improves readability