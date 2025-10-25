# 🎨 Rum River Barn - Design System
**The Single Source of Truth**

> **This document is the gold standard for all design decisions.**
> Every color, size, spacing value, and design pattern must be documented here.
> When in doubt, reference this document. If it's not here, it shouldn't be used.

**Last Updated**: 2025-01-25
**Version**: 1.0.0
**Status**: 🟢 Active

---

## 📋 Table of Contents

1. [Design Principles](#design-principles)
2. [Color System](#color-system)
3. [Typography](#typography)
4. [Spacing System](#spacing-system)
5. [Layout & Grid](#layout--grid)
6. [Shadows & Depth](#shadows--depth)
7. [Border Radius](#border-radius)
8. [Animation](#animation)
9. [Component Patterns](#component-patterns)
10. [Responsive Design](#responsive-design)
11. [Usage Guidelines](#usage-guidelines)

---

## 🎯 Design Principles

### Core Values

1. **Romantic Elegance** - Warm, inviting, and timeless
2. **Natural Beauty** - Earth tones inspired by the barn and river setting
3. **Clarity** - Information is easy to find and understand
4. **Consistency** - Predictable patterns throughout the experience
5. **Accessibility** - Readable, navigable, and inclusive for all

### Visual Identity

- **Style**: Romantic wedding barn with rustic elegance
- **Mood**: Warm, welcoming, natural, timeless
- **Target Audience**: Couples planning intimate weddings

---

## 🎨 Color System

### Primary Brand Colors

These are the core colors that define the Rum River Barn brand.

#### Warm Walnut `#6B4E3D`
**Token**: `--color-warm-walnut`
**RGB**: rgb(107, 78, 61)
**Usage**: Primary text, headings, main brand color
**Accessibility**: WCAG AA on light backgrounds

```css
/* Use for */
- Main headings
- Body text on light backgrounds
- Primary brand elements
- Navigation text (scrolled state)
```

#### Dusty Rose `#9D6B7B`
**Token**: `--color-dusty-rose`
**RGB**: rgb(157, 107, 123)
**Usage**: Secondary brand color, accents, interactive elements
**Accessibility**: WCAG AA on light backgrounds

```css
/* Use for */
- Script accent text
- Links and hover states
- Decorative elements
- Secondary buttons
- Icon accents
```

#### Champagne Gold `#E4C896`
**Token**: `--color-champagne-gold`
**RGB**: rgb(228, 200, 150)
**Usage**: Accent color, highlights, special elements
**Accessibility**: Best on dark backgrounds

```css
/* Use for */
- Call-to-action highlights
- Hero text accents
- Badge backgrounds
- Underline accents
- Hover states on dark backgrounds
```

### Background Colors

#### Cream Pearl `#FFFCF8`
**Token**: `--color-cream-pearl`
**RGB**: rgb(255, 252, 248)
**Usage**: Primary light background
**Notes**: Warmer than pure white, more inviting

```css
/* Use for */
- Main page background
- Card backgrounds
- Section backgrounds (light)
- Hero text on dark overlays
```

#### Blush Pink `#F4E4E1`
**Token**: `--color-blush-pink`
**RGB**: rgb(244, 228, 225)
**Usage**: Secondary light background
**Notes**: Adds subtle warmth and variation

```css
/* Use for */
- Alternating section backgrounds
- Card highlights
- Soft dividers
- Love Stories Gallery section
- FAQ section
```

#### Deep Brown `#4A3426`
**Token**: `--color-deep-brown`
**RGB**: rgb(74, 52, 38)
**Usage**: Dark backgrounds, depth
**Notes**: Darker variant for contrast

```css
/* Use for */
- Footer background
- Dark section backgrounds
- Overlay backgrounds
- Navigation hover states
```

### Supporting Colors

#### Sage Green `#7A8B7F`
**Token**: `--color-sage-green`
**RGB**: rgb(122, 139, 127)
**Usage**: Tertiary accent, natural elements

```css
/* Use for */
- Gradient overlays
- Border accents
- Navigation hover effects
- Environmental details
```

#### Text Dark `#2C2416`
**Token**: `--color-text-dark`
**RGB**: rgb(44, 36, 22)
**Usage**: Darkest text for maximum contrast

### Semantic Color Mappings

These tokens map to specific use cases:

```css
/* Primary Actions */
--color-primary: var(--color-warm-walnut)
--color-primary-hover: var(--color-deep-brown)
--color-primary-light: var(--color-cream-pearl)

/* Secondary Actions */
--color-secondary: var(--color-dusty-rose)
--color-secondary-hover: var(--color-dusty-rose-dark)
--color-secondary-light: var(--color-blush-pink)

/* Accents */
--color-accent: var(--color-champagne-gold)
--color-accent-alt: var(--color-accent-gold)
--color-accent-green: var(--color-sage-green)

/* Text Colors */
--color-text-primary: var(--color-warm-walnut)    /* Main headings, emphasis */
--color-text-secondary: var(--color-text-dark)    /* Body text */
--color-text-light: var(--color-white)            /* Text on dark backgrounds */
--color-text-muted: var(--color-sage-green)       /* Subtle text */

/* Backgrounds */
--color-bg-primary: var(--color-cream-pearl)      /* Main background */
--color-bg-secondary: var(--color-blush-pink)     /* Alternate sections */
--color-bg-dark: var(--color-deep-brown)          /* Dark sections */
```

### Color Usage Rules

**DO:**
✅ Use semantic tokens (--color-text-primary) instead of base colors
✅ Ensure sufficient contrast (WCAG AA minimum)
✅ Use warm-walnut for primary text
✅ Use champagne-gold sparingly for highlights
✅ Test colors on both light and dark backgrounds

**DON'T:**
❌ Use pure black (#000000) - use text-dark instead
❌ Use pure white for backgrounds - use cream-pearl
❌ Mix color systems (stick to the palette)
❌ Use colors not in this document

---

## ✍️ Typography

### Font Families

#### Playfair Display (Serif)
**Token**: `--font-serif`
**Usage**: Headings, titles, emphasis
**Weights Available**: 400, 500, 600, 700
**Character**: Elegant, traditional, romantic

```css
/* Use for */
- Main page titles (h1)
- Section titles (h2)
- Large headings
- Pull quotes
- Emphasis text
```

#### Dancing Script (Cursive)
**Token**: `--font-script`
**Usage**: Script accents, decorative text
**Weights Available**: 400, 500, 600, 700
**Character**: Handwritten, personal, romantic

```css
/* Use for */
- Script accent text (above titles)
- Decorative callouts
- Romantic emphasis
- Section kickers
```

**⚠️ DO NOT use for**: Body text, navigation, forms (readability)

#### Montserrat (Sans-serif)
**Token**: `--font-sans`
**Usage**: Body text, UI elements, navigation
**Weights Available**: 300, 400, 500, 600, 700
**Character**: Clean, modern, readable

```css
/* Use for */
- All body text
- Navigation links
- Buttons
- Form labels and inputs
- Feature descriptions
- General UI text
```

### Font Size Scale

All font sizes use a modular scale for consistency:

| Token | Size | Pixels | Use Case |
|-------|------|--------|----------|
| `--font-size-xs` | 0.75rem | 12px | Small labels, captions |
| `--font-size-sm` | 0.875rem | 14px | Small buttons, metadata |
| `--font-size-base` | 1rem | 16px | **Body text (default)** |
| `--font-size-lg` | 1.125rem | 18px | Lead paragraphs, large body |
| `--font-size-xl` | 1.25rem | 20px | Subheadings, emphasis |
| `--font-size-2xl` | 1.5rem | 24px | Small headings (h4) |
| `--font-size-3xl` | 1.75rem | 28px | **Script accents** |
| `--font-size-4xl` | 2rem | 32px | Medium headings (h3) |
| `--font-size-5xl` | 2.5rem | 40px | Large headings (h2) |
| `--font-size-6xl` | 3rem | 48px | **Section titles (h1)** |
| `--font-size-hero` | clamp(3rem, 8vw, 5.5rem) | 48-88px | **Hero titles** |

### Typography Hierarchy

#### H1 - Main Page Titles / Hero
```css
font-family: var(--font-serif);
font-size: var(--font-size-hero);  /* Responsive */
font-weight: var(--font-weight-regular);  /* 400 */
line-height: var(--line-height-tight);  /* 1.2 */
color: var(--color-text-primary);
```

#### H2 - Section Titles
```css
font-family: var(--font-serif);
font-size: var(--font-size-6xl);  /* 3rem / 48px */
font-weight: var(--font-weight-regular);  /* 400 */
line-height: var(--line-height-tight);  /* 1.2 */
color: var(--color-text-primary);
margin-bottom: var(--margin-lg);  /* 1.5rem */
```

#### H3 - Subsection Titles
```css
font-family: var(--font-serif);
font-size: var(--font-size-4xl);  /* 2rem / 32px */
font-weight: var(--font-weight-regular);  /* 400 */
line-height: var(--line-height-tight);
color: var(--color-text-primary);
```

#### Script Accent (Above Titles)
```css
font-family: var(--font-script);
font-size: var(--font-size-3xl);  /* 1.75rem / 28px */
font-weight: var(--font-weight-regular);  /* 400 */
color: var(--color-secondary);  /* Dusty rose */
margin-bottom: var(--margin-md);
```

#### Body Text
```css
font-family: var(--font-sans);
font-size: var(--font-size-base);  /* 1rem / 16px */
font-weight: var(--font-weight-regular);  /* 400 */
line-height: var(--line-height-loose);  /* 1.7 */
color: var(--color-text-secondary);
```

#### Lead Paragraph
```css
font-family: var(--font-sans);
font-size: var(--font-size-xl);  /* 1.25rem / 20px */
font-weight: var(--font-weight-light);  /* 300 */
line-height: var(--line-height-loose);  /* 1.7 */
color: var(--color-text-secondary);
max-width: 600px;  /* Optimal reading width */
```

### Font Weights

| Token | Value | Use Case |
|-------|-------|----------|
| `--font-weight-light` | 300 | Lead paragraphs, subtle text |
| `--font-weight-regular` | 400 | **Default** - body text, headings |
| `--font-weight-medium` | 500 | Navigation, subtle emphasis |
| `--font-weight-semibold` | 600 | Buttons, strong emphasis |
| `--font-weight-bold` | 700 | ⚠️ Use sparingly - special emphasis only |

**Standard Weights:**
- **Headings**: Use `400` (regular) for elegant look
- **Body text**: Use `400` (regular)
- **Navigation**: Use `500` (medium)
- **Buttons**: Use `500-600` (medium-semibold)

### Line Heights

| Token | Value | Use Case |
|-------|-------|----------|
| `--line-height-tight` | 1.2 | Headings, titles |
| `--line-height-normal` | 1.5 | Compact text |
| `--line-height-relaxed` | 1.6 | Forms, UI elements |
| `--line-height-loose` | 1.7 | **Body text (default)** |

**Rule**: Larger text = tighter line-height, smaller text = looser line-height

### Letter Spacing

| Token | Value | Use Case |
|-------|-------|----------|
| `--letter-spacing-tight` | -0.02em | Large headings (hero) |
| `--letter-spacing-normal` | 0em | Body text (default) |
| `--letter-spacing-wide` | 0.01em | Small emphasis |
| `--letter-spacing-wider` | 0.05em | Buttons, labels |
| `--letter-spacing-widest` | 0.08em | All-caps buttons |
| `--letter-spacing-ultra` | 0.1em | Brand logos, special text |

### Typography Usage Rules

**DO:**
✅ Use `--font-serif` for all headings
✅ Use `--font-sans` for all body text
✅ Use `--font-script` for accents only
✅ Use `400` weight for all main headings
✅ Maintain consistent line-height (1.7 for body)

**DON'T:**
❌ Mix font families in the same element
❌ Use font weights not in the system (e.g., 800)
❌ Use Dancing Script for body text
❌ Use pixel-based letter spacing (use em-based)
❌ Use font sizes not in the scale

---

## 📏 Spacing System

### The 8px Base Unit System

All spacing uses an 8px base unit (0.5rem) for consistency:

| Token | Size | Pixels | Use Case |
|-------|------|--------|----------|
| `--padding-xs` | 0.5rem | 8px | Tight spacing, badges |
| `--padding-sm` | 0.75rem | 12px | Small buttons, compact UI |
| `--padding-md` | 1rem | 16px | **Default padding** |
| `--padding-lg` | 1.5rem | 24px | Medium spacing |
| `--padding-xl` | 2rem | 32px | Large spacing, cards |
| `--padding-2xl` | 3rem | 48px | Section internal padding |
| `--padding-3xl` | 4rem | 64px | Large containers |
| `--padding-4xl` | 5rem | 80px | Section spacing (tablet) |
| `--padding-5xl` | 6rem | 96px | Section spacing (desktop) |

**Same scale applies to**:
- `--margin-*` (margins)
- `--gap-*` (flexbox/grid gaps)

### Section Padding (Responsive)

Consistent spacing for all page sections:

```css
/* Desktop (≥1024px) */
--section-padding-desktop: 100px 0;

/* Tablet (@768px) */
--section-padding-tablet: 80px 0;

/* Mobile (@480px) */
--section-padding-mobile: 60px 0;
```

**Usage**:
```css
.section {
  padding: 100px 0;  /* Desktop */
}

@media (max-width: 768px) {
  .section {
    padding: 80px 0;  /* Tablet */
  }
}

@media (max-width: 480px) {
  .section {
    padding: 60px 0;  /* Mobile */
  }
}
```

### Common Spacing Patterns

#### Section Header
```css
margin-bottom: 4rem;  /* 64px - var(--margin-4xl) when tokenized */
```

#### Between Content Blocks
```css
gap: 2rem;  /* 32px - var(--gap-xl) */
```

#### Card Padding
```css
padding: 2.5rem;  /* 40px */
```

#### Button Padding
```css
padding: 0.875rem 2.5rem;  /* 14px 40px */
```

### Spacing Rules

**DO:**
✅ Use spacing tokens for all padding/margin
✅ Use multiples of 8px (0.5rem)
✅ Be consistent with section padding
✅ Use the same spacing for similar elements

**DON'T:**
❌ Use random spacing values (e.g., 23px, 37px)
❌ Mix spacing scales
❌ Use different section padding per section

---

## 📐 Layout & Grid

### Container Widths

| Token | Width | Use Case |
|-------|-------|----------|
| `--content-narrow` | 600px | Lead paragraphs, centered text |
| `--content-medium` | 800px | Forms, moderate content |
| `--content-wide` | 1200px | **Standard max-width** |
| `--content-full` | 1400px | Extra-wide layouts |

### Standard Container Pattern

```css
.section-container {
  max-width: var(--content-wide);  /* 1200px */
  margin: 0 auto;
  padding: 0 var(--padding-xl);  /* 2rem / 32px */
}
```

### Full-Width Breakout

For sections that need to escape container constraints:

```css
.full-width-section {
  width: 100vw;
  max-width: none;
  margin-left: calc(-50vw + 50%);
  margin-right: calc(-50vw + 50%);
}
```

### Grid Patterns

#### Two-Column Layout
```css
display: grid;
grid-template-columns: 1fr 1fr;
gap: var(--gap-2xl);  /* 3rem / 48px */
align-items: center;
```

#### Three-Column Layout
```css
display: grid;
grid-template-columns: repeat(3, 1fr);
gap: var(--gap-xl);  /* 2rem / 32px */
```

#### Auto-Fit Cards
```css
display: grid;
grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
gap: var(--gap-xl);
```

### Responsive Breakpoints

| Breakpoint | Width | Usage |
|------------|-------|-------|
| Mobile | 480px | Small phones |
| Tablet | 768px | **Primary mobile breakpoint** |
| Laptop | 1024px | Standard desktop |
| Desktop | 1280px | Large screens |

**Standard Media Query Pattern:**
```css
/* Desktop-first approach */
.element {
  /* Desktop styles */
}

@media (max-width: 768px) {
  .element {
    /* Tablet styles */
  }
}

@media (max-width: 480px) {
  .element {
    /* Mobile styles */
  }
}
```

---

## 🌑 Shadows & Depth

### Box Shadows

| Token | Value | Use Case |
|-------|-------|----------|
| `--shadow-sm` | 0 1px 2px rgba(0,0,0,0.05) | Subtle elevation |
| `--shadow-md` | 0 4px 6px rgba(0,0,0,0.1) | Cards, hover states |
| `--shadow-lg` | 0 10px 15px rgba(0,0,0,0.1) | Modals, dropdowns |
| `--shadow-xl` | 0 20px 25px rgba(0,0,0,0.1) | Floating elements |
| `--shadow-2xl` | 0 25px 50px rgba(0,0,0,0.25) | **Image cards** |

### Brand-Specific Shadows

| Token | Value | Use Case |
|-------|-------|----------|
| `--shadow-romantic` | 0 10px 30px rgba(157,107,123,0.3) | Cards with dusty-rose tint |
| `--shadow-gold` | 0 8px 25px rgba(228,200,150,0.4) | Buttons, gold accents |
| `--shadow-walnut` | 0 8px 32px rgba(107,78,61,0.1) | Warm brown tint |
| `--shadow-form` | 0 20px 60px rgba(0,0,0,0.3) | Form containers |

### Text Shadows

| Token | Value | Use Case |
|-------|-------|----------|
| `--text-shadow-sm` | 0 1px 2px rgba(0,0,0,0.1) | Subtle text lift |
| `--text-shadow-md` | 0 2px 4px rgba(0,0,0,0.3) | **Hero text** |
| `--text-shadow-lg` | 0 2px 8px rgba(0,0,0,0.5) | Strong contrast |

**Usage**:
```css
/* Image card */
box-shadow: var(--shadow-2xl);

/* Hero text on dark background */
text-shadow: var(--text-shadow-md);
```

---

## ⭕ Border Radius

| Token | Value | Pixels | Use Case |
|-------|-------|--------|----------|
| `--radius-none` | 0 | 0px | Sharp edges |
| `--radius-sm` | 0.125rem | 2px | Subtle rounding |
| `--radius-md` | 0.375rem | 6px | Small elements |
| `--radius-lg` | 0.5rem | 8px | Buttons, inputs |
| `--radius-xl` | 0.75rem | 12px | Cards |
| `--radius-2xl` | 1rem | 16px | Large cards |
| `--radius-3xl` | 1.25rem | 20px | **Image containers** |
| `--radius-full` | 9999px | Full | Circles, pills |

**Common Usage**:
- **Buttons**: `--radius-full` (pill shape)
- **Cards**: `--radius-xl` or `--radius-2xl`
- **Images**: `--radius-3xl` (20px)
- **Inputs**: `--radius-lg` (12px)

---

## ⚡ Animation

### Duration Tokens

| Token | Value | Use Case |
|-------|-------|----------|
| `--duration-fast` | 0.15s | Quick feedback |
| `--duration-normal` | 0.3s | **Default transitions** |
| `--duration-slow` | 0.4s | Smooth transitions |
| `--duration-slower` | 0.6s | Complex animations |
| `--duration-slowest` | 0.8s | Gallery transitions |
| `--duration-entrance` | 1.2s | Page load animations |

### Easing Tokens

| Token | Value | Use Case |
|-------|-------|----------|
| `--ease-linear` | linear | Constant speed |
| `--ease-in` | ease-in | Accelerating |
| `--ease-out` | ease-out | Decelerating |
| `--ease-in-out` | ease-in-out | Smooth start/end |
| `--ease-material` | cubic-bezier(0.4,0,0.2,1) | **Material Design** |
| `--ease-bounce` | cubic-bezier(0.25,0.46,0.45,0.94) | Gallery cards |

**Standard Transition**:
```css
transition: all var(--duration-normal) var(--ease-material);
```

**Hover Effect**:
```css
.card {
  transition: transform var(--duration-normal) var(--ease-material),
              box-shadow var(--duration-normal) var(--ease-material);
}

.card:hover {
  transform: translateY(-8px);
  box-shadow: var(--shadow-xl);
}
```

---

## 🧩 Component Patterns

### Section Header (Standard)

Used at the top of most sections:

```html
<div class="section-header">
  <p class="script-accent">Perfect Venue</p>
  <h2 class="section-title">Your Dream Wedding</h2>
  <p class="lead">Create unforgettable memories in our rustic barn.</p>
</div>
```

```css
.section-header {
  text-align: center;
  margin-bottom: 4rem;
}

.script-accent {
  font-family: var(--font-script);
  font-size: var(--font-size-3xl);
  color: var(--color-secondary);
  margin-bottom: var(--margin-md);
}

.section-title {
  font-family: var(--font-serif);
  font-size: var(--font-size-6xl);
  color: var(--color-text-primary);
  font-weight: var(--font-weight-regular);
  line-height: var(--line-height-tight);
  margin-bottom: var(--margin-lg);
}

.lead {
  font-family: var(--font-sans);
  font-size: var(--font-size-xl);
  color: var(--color-text-secondary);
  line-height: var(--line-height-loose);
  max-width: 600px;
  margin: 0 auto;
}
```

### Button (Primary)

```css
.button-primary {
  font-family: var(--font-sans);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  letter-spacing: var(--letter-spacing-widest);
  text-transform: uppercase;

  padding: 0.875rem 2.5rem;
  border-radius: var(--radius-full);

  background: var(--color-primary);
  color: var(--color-text-light);
  border: 2px solid var(--color-primary);

  transition: all var(--duration-normal) var(--ease-material);
  cursor: pointer;
}

.button-primary:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-gold);
}
```

### Card Pattern

```css
.card {
  background: var(--color-white);
  border-radius: var(--radius-2xl);
  padding: var(--padding-2xl);
  box-shadow: var(--shadow-romantic);
  transition: all var(--duration-normal) var(--ease-material);
}

.card:hover {
  transform: translateY(-8px);
  box-shadow: var(--shadow-xl);
}
```

### Image Container

```css
.image-container {
  border-radius: var(--radius-3xl);
  overflow: hidden;
  box-shadow: var(--shadow-2xl);
}

.image-container img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform var(--duration-slower) var(--ease-material);
}

.image-container:hover img {
  transform: scale(1.05);
}
```

---

## 📱 Responsive Design

### Mobile-First vs Desktop-First

**This site uses Desktop-First approach:**

```css
/* Desktop styles (default) */
.element {
  font-size: var(--font-size-6xl);
}

/* Tablet */
@media (max-width: 768px) {
  .element {
    font-size: var(--font-size-5xl);
  }
}

/* Mobile */
@media (max-width: 480px) {
  .element {
    font-size: var(--font-size-4xl);
  }
}
```

### Responsive Typography

Titles should scale down on smaller screens:

```css
/* Hero Title - Responsive */
.hero-title {
  font-size: var(--font-size-hero);  /* clamp(3rem, 8vw, 5.5rem) */
}

/* Section Title - Manual scaling */
.section-title {
  font-size: var(--font-size-6xl);  /* 3rem desktop */
}

@media (max-width: 768px) {
  .section-title {
    font-size: var(--font-size-5xl);  /* 2.5rem tablet */
  }
}

@media (max-width: 480px) {
  .section-title {
    font-size: var(--font-size-4xl);  /* 2rem mobile */
  }
}
```

### Responsive Spacing

Section padding should scale:

```css
.section {
  padding: 100px 0;  /* Desktop */
}

@media (max-width: 768px) {
  .section {
    padding: 80px 0;  /* Tablet */
  }
}

@media (max-width: 480px) {
  .section {
    padding: 60px 0;  /* Mobile */
  }
}
```

### Responsive Grid

Grids should collapse to single column:

```css
.grid {
  display: grid;
  grid-template-columns: 1fr 1fr;  /* Desktop */
  gap: var(--gap-2xl);
}

@media (max-width: 768px) {
  .grid {
    grid-template-columns: 1fr;  /* Single column */
    gap: var(--gap-xl);
  }
}
```

---

## 📖 Usage Guidelines

### How to Use This System

#### 1. **Always Reference Tokens First**

**❌ Wrong:**
```css
.title {
  font-size: 3rem;
  color: #6B4E3D;
  margin-bottom: 1.5rem;
}
```

**✅ Correct:**
```css
.title {
  font-size: var(--font-size-6xl);
  color: var(--color-text-primary);
  margin-bottom: var(--margin-lg);
}
```

#### 2. **Use Semantic Tokens**

Prefer semantic names over base colors:

**❌ Wrong:**
```css
color: var(--color-warm-walnut);  /* What does this represent? */
```

**✅ Correct:**
```css
color: var(--color-text-primary);  /* Clear semantic meaning */
```

#### 3. **Check the Design System First**

Before adding a new value:
1. Check if a token exists in this document
2. If it doesn't, ask: "Should this be standardized?"
3. If yes, add it to design-tokens.css and document it here
4. If no, use a one-off value with a comment explaining why

#### 4. **Maintain Consistency**

If you see this pattern 3+ times, create a component pattern or utility class.

#### 5. **Document Deviations**

If you must deviate from the system, add a comment:

```css
.special-case {
  /* Using custom spacing for logo alignment - not in design system */
  padding: 1.3rem;
}
```

### Common Mistakes to Avoid

**❌ Mixing scales:**
```css
padding: 23px;  /* Random value - not in 8px scale */
```

**❌ Using hard-coded colors:**
```css
color: #6B4E3D;  /* Use var(--color-text-primary) */
```

**❌ Inconsistent font weights:**
```css
font-weight: 700;  /* Most headings use 400 */
```

**❌ Pixel-based letter spacing:**
```css
letter-spacing: 2px;  /* Use em-based: var(--letter-spacing-wider) */
```

**❌ Random shadows:**
```css
box-shadow: 0 3px 7px rgba(0,0,0,0.15);  /* Use token */
```

---

## 🔄 Updating This System

### When to Update

Update this document when:
- Adding new design tokens
- Changing existing values
- Adding new component patterns
- Establishing new conventions

### How to Update

1. Update this DESIGN-SYSTEM.md file
2. Update design-tokens.css with new tokens
3. Increment version number
4. Document changes in commit message
5. Notify team of changes

### Version History

**1.0.0** - 2025-01-25
- Initial design system documentation
- Established single source of truth
- Documented all existing tokens

---

## ✅ Quick Reference

### Most Common Tokens

```css
/* Typography */
--font-serif: 'Playfair Display', serif
--font-sans: 'Montserrat', sans-serif
--font-script: 'Dancing Script', cursive
--font-size-6xl: 3rem          /* Section titles */
--font-size-base: 1rem         /* Body text */
--font-weight-regular: 400     /* Default */
--line-height-loose: 1.7       /* Body text */

/* Colors */
--color-text-primary: #6B4E3D
--color-secondary: #9D6B7B
--color-accent: #E4C896
--color-bg-primary: #FFFCF8

/* Spacing */
--padding-xl: 2rem
--padding-2xl: 3rem
--margin-lg: 1.5rem
--gap-xl: 2rem

/* Effects */
--shadow-2xl: 0 25px 50px rgba(0,0,0,0.25)
--radius-3xl: 1.25rem
--duration-normal: 0.3s
--ease-material: cubic-bezier(0.4,0,0.2,1)
```

---

## 🎓 Learning Resources

### Example Sections

**Best Practice Example**: `pricing-styles.css`
This section uses design tokens correctly - reference this file.

### Need Help?

1. Search this document first
2. Check existing section styles for patterns
3. Reference design-tokens.css for available tokens
4. When in doubt, ask!

---

**Remember**: This is the gold standard. When in doubt, reference this document.
**Live by it. Die by it. Design by it.** 🎨

---

**Maintained by**: Development Team
**Contact**: See team for design system questions
**Last Review**: 2025-01-25
