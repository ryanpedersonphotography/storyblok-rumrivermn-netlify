# /clean Architecture Documentation

> Comprehensive guide to the Rum River site's clean, tokenized architecture

**Last Updated**: 2025-10-31
**Status**: Production-ready ✅

---

## Table of Contents

1. [Overview](#overview)
2. [Route Structure](#route-structure)
3. [Component Inventory](#component-inventory)
4. [Token System](#token-system)
5. [CSS Architecture](#css-architecture)
6. [Storyblok Integration](#storyblok-integration)
7. [Dark Mode System](#dark-mode-system)
8. [Scoping Mechanism](#scoping-mechanism)
9. [Layout System](#layout-system)
10. [Component Patterns](#component-patterns)
11. [Quick Reference](#quick-reference)

---

## Overview

The `/clean` route is a **fully tokenized, dark-mode capable, Storyblok-editable** website implementation that is completely isolated from the legacy `/beta` (hotfix) route using CSS scoping and Next.js route groups.

**Key Features**:
- ✅ Design token system with light/dark/auto modes
- ✅ 17 clean section components
- ✅ Scoped CSS prevents style leakage
- ✅ Storyblok CMS integration with visual editing
- ✅ Unified layout system with containers
- ✅ @layer cascade for predictable specificity

---

## Route Structure

### File Locations

```
/src/app/clean/
├── layout.tsx    → Wraps everything with <div data-clean-root>
└── page.tsx      → Fetches Storyblok story & renders via CleanStoryRenderer
```

### Render Flow

```
RootLayout (src/app/layout.js)
  ├── Imports theme tokens globally
  ├── Sets up HTML[data-theme] script for dark mode
  └── Renders <StoryblokProvider>

CleanLayout (src/app/clean/layout.tsx)
  ├── Imports ALL clean component CSS files
  ├── Wraps content with <div data-clean-root>
  ├── Renders Navbar component
  └── Renders {children} from page.tsx

CleanPage (src/app/clean/page.tsx)
  ├── async: Fetches story from Storyblok API
  ├── Sets cache: 'no-store' for draft content
  └── Passes story to CleanStoryRenderer

CleanStoryRenderer
  ├── Client-side Storyblok initialization
  ├── Maps Storyblok component types to clean components
  └── Renders blok tree via StoryblokComponent
```

**Key Detail**: The `data-clean-root` attribute acts as a **scoping mechanism** - ALL clean component CSS rules are prefixed with `[data-clean-root]` to prevent style leakage to `/beta`.

---

## Component Inventory

### All Clean Components (17 Total)

| Component | Lines | File | Storyblok Type | Status |
|-----------|-------|------|----------------|--------|
| Hero | 85 | `Hero.tsx` | `home_hero_section` | ✅ Live |
| Navbar | 105 | `Navbar.tsx` | Layout component | ✅ Live |
| Footer | 34 | `Footer.tsx` | `footer_section` | ✅ Live |
| AlternatingBlocks | 39 | `AlternatingBlocks.tsx` | `alternating_blocks_section` | ✅ Live |
| Experience | 67 | `Experience.tsx` | `rum_river_experience` | ✅ Live |
| Spaces | 140 | `Spaces.tsx` | `spaces_section` | ✅ Live |
| Gallery | 105 | `Gallery.tsx` | `love_stories_gallery` | ✅ Live |
| BrandProof | 59 | `BrandProof.tsx` | `brand_social_proof` | ✅ Live |
| Pricing | 91 | `Pricing.tsx` | `pricing_section` | ✅ Live |
| ScheduleForm | 43 | `ScheduleForm.tsx` | `schedule_form` | ✅ Live |
| Map | 69 | `Map.tsx` | `map_section` | ✅ Live |
| FAQ | 96 | `FAQ.tsx` | `faq_accordion` | ✅ Live |
| HistoryCarousel | ~100 | `HistoryCarousel.tsx` | `history_carousel` | ✅ Live |
| CleanStoryRenderer | 93 | `CleanStoryRenderer.tsx` | System | ✅ |
| CleanStoryblokBridge | ~50 | `CleanStoryblokBridge.tsx` | System | ✅ |
| CleanStoryblokProvider | ~30 | `CleanStoryblokProvider.tsx` | System | ✅ |
| CleanStatic | ~20 | `CleanStatic.tsx` | System | ✅ |

**Total Component Lines**: 1,955 lines

---

## Token System

### Token Files

```
/src/styles/tokens/
├── theme.css    (708 lines) - Primary design tokens
└── tokens.css   (102 lines) - Design token dictionary
```

### Token Flow Architecture

```
1. theme.css defines root-level tokens
   ├── :root { --surface-0, --text-primary, --hero-bg, etc. }
   ├── html[data-theme="dark"] { dark overrides }
   └── @media (prefers-color-scheme: dark) { auto dark mode }

2. Component CSS references tokens
   └── [data-clean-root] .hero { color: var(--hero-text, #FFF8E7); }

3. Dark mode toggle changes HTML[data-theme] attribute
   └── Cascades new token values to all components instantly
```

### Token Categories

#### 1. Semantic Surfaces (Background Colors)

**Light Mode**:
```css
:root {
  --surface-0: rgb(244 228 225);  /* cream/blush - page bg */
  --surface-1: rgb(255 255 255);  /* white - cards */
  --surface-2: rgb(244 228 225);  /* cream - section bg */
  --surface-3: rgb(250 246 242);  /* subtle lift */
  --surface-4: rgb(246 240 234);  /* brightest */
}
```

**Dark Mode**:
```css
html[data-theme="dark"] {
  --surface-0: rgb(15 12 10);     /* #0F0C0A - deepest walnut */
  --surface-1: rgb(26 20 16);     /* #1A1410 */
  --surface-2: oklch(0.25 0.035 65); /* #231D18 */
  --surface-3: rgb(44 36 22);     /* #2C2416 */
  --surface-4: rgb(55 45 27);     /* #372D1B */
}
```

#### 2. Text Colors

```css
:root {
  --text-primary: rgb(107 78 61);    /* #6B4E3D - walnut brown */
  --text-secondary: rgb(68 57 50);
  --text-inverse: rgb(255 255 255);
}

html[data-theme="dark"] {
  --text-primary: rgb(255 255 255);
  --text-secondary: color-mix(in oklch, white 86%, gold 14%);
  --text-inverse: rgb(26 20 16);
}
```

#### 3. Accent Colors

```css
:root {
  --accent-rose: rgb(157 107 123);      /* #9D6B7B */
  --accent-rose-soft: rgb(216 155 174); /* #D89BAE */
  --accent-gold: rgb(240 217 168);      /* #F0D9A8 */
}
```

#### 4. Section-Specific Tokens

```css
/* Hero */
--hero-bg: #2c241a;
--hero-text: #FFF8E7;
--hero-accent: #E4C896;
--hero-overlay-start: rgba(44, 36, 22, 0.85);

/* Navbar */
--navbar-bg: #FFFFFF;
--navbar-text: #2B2B2B;
--navbar-accent: #E4C896;

/* Footer */
--footer-bg: #1E1A16;
--footer-text: #FFF8E7;
--footer-link: #E4C896;

/* Gallery */
--gallery-rose: #9D6B7B;
--gallery-gold: #E4C896;
--gallery-on-dark: #FFF8E7;

/* Pricing */
--pricing-bg: #FFFFFF;
--pricing-text: #2B2B2B;
--price-accent: #E4C896;

/* ... more section tokens */
```

### Token Naming Convention

1. **Primitives**: `--clr-{name}-{number}` (sRGB) or `--ok-{name}` (OKLCH)
2. **Semantics**: `--{role}-{element}`
3. **Generic Roles**: `--surface-{level}`, `--text-{type}`, `--accent-{color}`
4. **Motion/Spacing**: `--duration-{speed}`, `--space-{size}`, `--radius-{size}`
5. **Legacy Aliases**: `--theme-{old-name}` (backward compatibility)

### Example: Token Usage in Component

```css
/* theme.css */
:root {
  --hero-text: #FFF8E7;
  --hero-accent: #E4C896;
}

html[data-theme="dark"] {
  --hero-text: oklch(0.98 0.01 95);
  --hero-accent: oklch(0.78 0.10 90);
}

/* hero.css */
[data-clean-root] .hero {
  /* Local private variables with fallbacks */
  --_text: var(--hero-text, #FFF8E7);
  --_accent: var(--hero-accent, #E4C896);

  color: var(--_text);
}

[data-clean-root] .hero-title-accent {
  color: var(--_accent);
}
```

---

## CSS Architecture

### File Organization

```
/src/styles/
├── tokens/
│   ├── theme.css           (708L) - ALL design tokens
│   └── tokens.css          (102L) - Token dictionary
├── components/
│   ├── hero.css            (7.0K)
│   ├── navbar.css          (5.8K)
│   ├── footer.css          (6.2K)
│   ├── alternating-blocks.css (5.1K)
│   ├── experience.css      (10K)
│   ├── gallery.css         (12K)
│   ├── spaces.css          (13K)
│   ├── map.css             (12K)
│   ├── schedule-form.css   (9.5K)
│   ├── pricing.css         (6.3K)
│   ├── brand-proof.css     (6.7K)
│   ├── faq.css             (3.4K)
│   ├── buttons.css         (2.6K)
│   └── [more...]
├── system/
│   └── layout.css          (150L) - Container utilities
├── semantic/               (Legacy - unused in clean)
├── hotfix/                 (Hotfix route - isolated)
└── globals.css             (75L) - Base reset
```

### Layer Strategy

```css
/* In globals.css */
@layer base, components, utilities;

@layer base {
  /* Reset: box-sizing, margins, typography defaults */
  * { box-sizing: border-box; margin: 0; }
  body {
    background: var(--surface-0);
    color: var(--text-primary);
  }
}

/* In each component/*.css */
@layer components {
  [data-clean-root] .hero { ... }
  [data-clean-root] .navbar { ... }
}

/* In system/layout.css */
@layer utilities {
  [data-clean-root] .container { max-width: var(--page-max); }
}
```

**Why this order?** `base < components < utilities`
- Base provides foundation
- Components have consistent styling
- Utilities can override when needed (highest specificity)

---

## Storyblok Integration

### Component Mapping

**File**: `/src/components/clean/CleanStoryRenderer.tsx`

```tsx
storyblokInit({
  accessToken: process.env.NEXT_PUBLIC_STORYBLOK_PREVIEW_TOKEN,
  use: [apiPlugin],
  components: {
    // System components
    page: Page,

    // Clean section components
    home_hero_section: Hero,                      // ✅
    alternating_blocks_section: AlternatingBlocks, // ✅
    rum_river_experience: Experience,              // ✅
    brand_social_proof: BrandProof,                // ✅
    pricing_section: Pricing,                      // ✅
    love_stories_gallery: Gallery,                 // ✅
    schedule_form: ScheduleForm,                   // ✅
    map_section: Map,                              // ✅
    spaces_section: Spaces,                        // ✅
    footer_section: Footer,                        // ✅
    faq_accordion: FAQ,                            // ✅

    // Legacy components
    history_carousel: HistoryCarouselEditor,
    testimonials_section: () => null,  // Hidden

    // Nested items
    location_item: LocationItem,
  }
})

return <StoryblokComponent blok={story.content} />
```

### Data Flow

```
Storyblok API
├── GET /v2/cdn/stories/home?version=draft&token=xxx
└── Returns:
    {
      story: {
        content: {
          component: "page",
          body: [
            {
              _uid: "uuid1",
              component: "home_hero_section",
              title: "Rum River Barn",
              background_image: { filename: "..." },
              ...
            },
            {
              _uid: "uuid2",
              component: "alternating_blocks_section",
              blocks: [...],
              ...
            }
          ]
        }
      }
    }

↓ Render Flow

CleanStoryRenderer
├── storyblokInit() registers component map
├── StoryblokComponent({ blok: story.content })
├── Recursively renders story.content.body[]
├── Each blok matches: component type → React component
│   Example: "home_hero_section" → Hero
└── Component receives entire blok object as prop
```

### Visual Editing

```tsx
// Component enables inline editing in Storyblok
export default function Hero({ blok }: { blok: HeroBlok }) {
  return (
    <section {...storyblokEditable(blok)}>
      {/* Content */}
    </section>
  )
}
```

When `{...storyblokEditable(blok)}` is added:
- Visual editor highlights the section
- Click to edit opens field panel
- Changes preview in real-time

---

## Dark Mode System

### Three-Way Toggle

**Modes**: `light` → `dark` → `system` → `light`

### Implementation Files

1. **ThemeToggle Component** (`/src/components/ThemeToggle.tsx`)
2. **Root Layout Script** (`/src/app/layout.js`)
3. **Token Overrides** (`/src/styles/tokens/theme.css`)

### Flow Diagram

```
User clicks ThemeToggle
├── cycle() updates state
├── localStorage.setItem('theme-mode', nextMode)
├── document.documentElement.setAttribute('data-theme', nextMode)
└── CSS token overrides activate instantly

Next page load
├── Root layout <script> runs before React hydration
├── Reads localStorage.getItem('theme-mode')
├── Falls back to window.matchMedia('prefers-color-scheme: dark')
└── Sets HTML[data-theme] immediately (no flash)
```

### Code Example

```tsx
// ThemeToggle.tsx
const cycle = () => {
  setMode(prev => {
    const next = prev === 'light' ? 'dark'
                : prev === 'dark' ? 'system'
                : 'light'

    localStorage.setItem('theme-mode', next)
    document.documentElement.setAttribute('data-theme', next)
    return next
  })
}
```

```javascript
// layout.js - runs before React
<script dangerouslySetInnerHTML={{
  __html: `
(function(){
  var stored = localStorage.getItem('theme-mode');
  var systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  var theme = stored || (systemDark ? 'dark' : 'light');
  document.documentElement.setAttribute('data-theme', theme);
})();
`}} />
```

### CSS Token Overrides

```css
/* Light mode (default) */
:root {
  --hero-bg: #2c241a;
  --hero-text: #FFF8E7;
}

/* Dark mode (explicit) */
html[data-theme="dark"] {
  --hero-bg: oklch(0.16 0.03 30);
  --hero-text: oklch(0.98 0.01 95);
}

/* Auto dark (OS preference) */
@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) {
    --hero-bg: oklch(0.16 0.03 30);
    --hero-text: oklch(0.98 0.01 95);
  }
}
```

---

## Scoping Mechanism

### The `[data-clean-root]` Prefix

**ALL clean CSS rules** use this attribute selector:

```css
/* ✅ CORRECT - Scoped to /clean route */
[data-clean-root] .hero { background: var(--hero-bg); }
[data-clean-root] .hero::before { content: ""; }
[data-clean-root] .navbar__link { color: var(--navbar-link); }

/* ❌ WRONG - Would leak to /beta route */
.hero { background: #000; }
```

### Parent Wrapper

**File**: `/src/app/clean/layout.tsx`

```tsx
export default function CleanLayout({ children }) {
  return (
    <div data-clean-root>
      <Navbar />
      {children}
    </div>
  )
}
```

### Why This Matters

- **Isolation**: Styles in `/clean` don't affect `/beta` (hotfix route)
- **Coexistence**: Both routes can exist with different styling systems
- **Safety**: Prevents accidental style leakage during migration
- **Specificity**: `[data-clean-root]` adds specificity without `!important`

---

## Layout System

### Container Classes

**File**: `/src/styles/system/layout.css`

```css
:root {
  --page-max: 1200px;                    /* standard content */
  --page-wide: 1400px;                   /* wide grids */
  --gutter: clamp(16px, 4vw, 40px);     /* responsive padding */
  --prose-max: 68ch;                     /* readable text */
}
```

| Class | Max Width | Padding | Use Case |
|-------|-----------|---------|----------|
| `.container` | 1200px | `--gutter` | Standard sections |
| `.container--wide` | 1400px | `--gutter` | Wide grids (Gallery) |
| `.left-rail` | 65ch | Responsive | Prose, left-aligned |
| `.full-bleed` | 100vw | 0 | Hero, Navbar (edge-to-edge) |

### Full-Bleed Technique

```css
[data-clean-root] .hero {
  width: 100vw;
  margin-left: calc(50% - 50vw);
  margin-right: calc(50% - 50vw);
  max-width: none;
}
```

Extends from centered container to viewport edges.

### Left-Rail Pattern

```css
[data-clean-root] .left-rail {
  max-width: var(--prose-max);
  text-align: left;
}

@media (min-width: 900px) {
  [data-clean-root] .left-rail {
    margin-left: var(--rail-offset);
    margin-right: auto;
  }
}
```

Content stays left-aligned with page edge, capped at readable width.

---

## Component Patterns

### Pattern 1: Standard Section Component

```tsx
// Component
'use client'
import { storyblokEditable } from '@storyblok/react'

interface SectionBlok {
  _uid?: string
  component?: string
  title?: string
  description?: string
}

export default function Section({ blok }: { blok: SectionBlok }) {
  const title = blok.title || 'Default Title'
  const description = blok.description || ''

  return (
    <section
      className="section-name"
      data-section="section-name"
      {...storyblokEditable(blok)}
    >
      <div className="content-wrapper">
        <h2>{title}</h2>
        <p>{description}</p>
      </div>
    </section>
  )
}
```

```css
/* CSS */
[data-clean-root] .section-name {
  background: var(--section-bg, #FFFFFF);
  padding: clamp(3rem, 6vw, 6rem) 0;
}

[data-clean-root] .content-wrapper {
  max-width: var(--page-max);
  margin: 0 auto;
  padding: 0 var(--gutter);
}
```

### Pattern 2: Hero with Background Image

```tsx
export default function Hero({ blok }: { blok: HeroBlok }) {
  const bgImage = assetUrl(blok.background_image)

  // Inline CSS var for dynamic image
  const style = {
    '--hero-bg-url': `url("${bgImage}")`
  } as React.CSSProperties

  return (
    <section className="hero" style={style} {...storyblokEditable(blok)}>
      <div className="hero-content">
        <h1 className="hero-title">{blok.title}</h1>
      </div>
    </section>
  )
}
```

```css
[data-clean-root] .hero {
  min-height: 100vh;
  position: relative;
}

/* Background image layer */
[data-clean-root] .hero::before {
  content: "";
  position: absolute;
  inset: 0;
  background-image: var(--hero-bg-url);
  background-size: cover;
  background-position: center;
  z-index: 1;
}

/* Gradient overlay */
[data-clean-root] .hero::after {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg,
    var(--hero-overlay-start),
    var(--hero-overlay-mid) 50%,
    var(--hero-overlay-end)
  );
  z-index: 2;
}

/* Content floats above */
[data-clean-root] .hero-content {
  position: relative;
  z-index: 10;
}
```

### Pattern 3: Grid with Tokens

```css
[data-clean-root] .experience-features {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: clamp(1.5rem, 3vw, 2.5rem);
}

[data-clean-root] .experience-feature {
  padding: clamp(1.5rem, 2vw, 2rem);
  background: var(--feature-card-bg);
  border: 1px solid var(--feature-card-border);
  border-radius: var(--radius-xl, 20px);
  transition: all var(--duration-normal, 300ms) ease;
}

[data-clean-root] .experience-feature:hover {
  transform: translateY(-2px);
  box-shadow: var(--theme-shadow-dark-lg);
}
```

### Pattern 4: Dark Mode Override

```css
/* Light mode rules first */
[data-clean-root] .spaces-section {
  background: var(--theme-bg-secondary, #F4E4E1);
}

/* Dark mode explicit */
html[data-theme="dark"] [data-clean-root] .spaces-section {
  background: var(--surface-4, #5A4A3A);
}

/* Auto dark via media query */
@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) [data-clean-root] .spaces-section {
    background: var(--surface-4, #5A4A3A);
  }
}
```

---

## Quick Reference

### Key Files & Paths

```
Core Architecture:
├── src/app/clean/layout.tsx                    - [data-clean-root] wrapper
├── src/app/clean/page.tsx                      - Storyblok story fetcher
├── src/components/clean/CleanStoryRenderer.tsx - Component mapper
├── src/styles/tokens/theme.css                 - Design tokens (708L)
└── src/styles/globals.css                      - Base reset

Components (17):
└── src/components/clean/*.tsx                  - All section components

Styles:
├── src/styles/components/*.css                 - Section-specific CSS
├── src/styles/system/layout.css                - Layout utilities
└── src/styles/hotfix/                          - Isolated hotfix styles
```

### Common Commands

```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Type check
npm run type-check

# Lint
npm run lint
```

### Token Quick Lookup

```css
/* Surfaces */
--surface-0 to --surface-4

/* Text */
--text-primary, --text-secondary, --text-inverse

/* Accents */
--accent-rose, --accent-gold

/* Spacing */
--space-xs to --space-5xl

/* Typography */
--font-sans, --font-serif, --font-script
--size-sm to --size-6xl
--line-tight, --line-normal, --line-loose

/* Motion */
--duration-fast, --duration-normal, --duration-slow

/* Radius */
--radius-sm to --radius-2xl, --radius-pill

/* Layout */
--page-max: 1200px
--page-wide: 1400px
--gutter: clamp(16px, 4vw, 40px)
```

### Storyblok Component Types

```
home_hero_section           → Hero.tsx
alternating_blocks_section  → AlternatingBlocks.tsx
rum_river_experience        → Experience.tsx
spaces_section              → Spaces.tsx
love_stories_gallery        → Gallery.tsx
brand_social_proof          → BrandProof.tsx
pricing_section             → Pricing.tsx
schedule_form               → ScheduleForm.tsx
map_section                 → Map.tsx
footer_section              → Footer.tsx
faq_accordion               → FAQ.tsx
```

---

## Summary

The `/clean` architecture provides:

✅ **Tokenized Design System** - 700+ tokens for colors, typography, spacing
✅ **Dark Mode Support** - Light/dark/auto with no flash
✅ **CSS Isolation** - `[data-clean-root]` prevents style leakage
✅ **Storyblok CMS** - 17 mapped components with visual editing
✅ **Unified Layouts** - Container system with full-bleed & left-rail
✅ **Layer Cascade** - Predictable specificity via @layer
✅ **Type Safety** - TypeScript interfaces for all bloks
✅ **Production Ready** - Live at `/clean` route

**Result**: A maintainable, scalable, and accessible website architecture that can coexist with legacy code during migration.

---

**Need Help?**

- Token not working? Check `theme.css` for definition
- Style not applying? Verify `[data-clean-root]` prefix
- Dark mode issues? Check HTML[data-theme] attribute
- Storyblok not rendering? Check `CleanStoryRenderer.tsx` mapping
- Layout problems? Review `system/layout.css` containers

**Documentation Version**: 1.0.0
**Last Reviewed**: 2025-10-31
