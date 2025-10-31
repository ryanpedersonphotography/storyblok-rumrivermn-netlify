# CTA Button Style Archive

**Created:** 2025-10-31
**Purpose:** Preserve the beloved CTA button styling for both light and dark modes

This document archives the exact CSS for the Hero CTA button and Schedule Form submit button that we love and want to preserve.

---

## Table of Contents

1. [Hero CTA Button (Secondary Style)](#hero-cta-button-secondary-style)
2. [Schedule Form Submit Button](#schedule-form-submit-button)
3. [CSS Variable Dependencies](#css-variable-dependencies)
4. [Visual Characteristics](#visual-characteristics)

---

## Hero CTA Button (Secondary Style)

### Location
**File:** [src/styles/components/hero.css](../src/styles/components/hero.css)
**Lines:** 144-176

### Complete CSS (Light Mode)

```css
/* Base button styles */
[data-clean-root] .hero-cta {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-md, 1rem) var(--space-2xl, 2.5rem);
  border-radius: var(--radius-2xl, 16px);
  font-family: var(--font-sans, 'Montserrat', sans-serif);
  font-weight: var(--weight-medium, 500);
  font-size: var(--size-sm, 0.875rem);
  letter-spacing: 0.08em;
  text-transform: uppercase;
  text-decoration: none;
  cursor: pointer;
  transition: transform 200ms ease, box-shadow 200ms ease, background-color 200ms ease, color 200ms ease;
}

/* Secondary variant (the one we love!) */
[data-clean-root] .hero-cta-secondary {
  background: transparent;
  color: var(--_cta-text);
  border: 2px solid var(--_accent);
  border-radius: 9999px;  /* Perfect circle sides */
  position: relative;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(228, 200, 150, 0.2);
  text-shadow: 0 2px 4px rgba(0,0,0,0.3);
}

/* Hover state with color-mix magic */
[data-clean-root] .hero-cta-secondary:hover {
  background: color-mix(in srgb, var(--_accent) 90%, white 10%);
  border-color: var(--_accent);
  color: var(--_cta-hover-text);
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(228, 200, 150, 0.4);
  text-shadow: none;
}

/* Shimmer animation effect */
[data-clean-root] .hero-cta-secondary::before {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(45deg, transparent, rgba(255,255,255,0.2), transparent);
  transform: translateX(-100%);
  transition: transform 0.6s ease;
  z-index: 0;
}

[data-clean-root] .hero-cta-secondary:hover::before {
  transform: translateX(100%);
}

/* Z-index for text above shimmer */
[data-clean-root] .hero-cta-secondary > * {
  position: relative;
  z-index: 1;
}

/* Focus state for accessibility */
[data-clean-root] .hero-cta:focus-visible {
  outline: var(--focus-width, 3px) solid var(--focus-ring, var(--hero-accent, #E4C896));
  outline-offset: var(--focus-offset, 3px);
}
```

### Hero Button CSS Variables (Light Mode)

```css
:root {
  /* Hero section private variables */
  --_text: var(--hero-text, #FFF8E7);
  --_accent: var(--hero-accent, #E4C896);
  --_cta-text: var(--hero-cta-text, #FFF8E7);
  --_cta-hover-text: var(--hero-cta-hover-text, #6B4E3D);
}
```

### Hero Button Dark Mode

**Dark mode CSS variables are defined in theme.css:**

```css
html[data-theme="dark"] {
  --hero-accent: oklch(0.78 0.10 90);  /* Brighter gold in dark mode */
  --hero-cta-text: oklch(0.98 0.01 95);  /* Near white */
  --hero-cta-hover-text: oklch(0.18 0.03 30);  /* Dark walnut */
}
```

**Auto dark mode (OS preference):**

```css
@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) {
    /* Same values as forced dark mode above */
  }
}
```

---

## Schedule Form Submit Button

### Location
**File:** [src/styles/components/schedule-form.css](../src/styles/components/schedule-form.css)
**Lines:** 139-182

### Complete CSS (Light Mode)

```css
[data-clean-root] .form-submit {
  margin: 2rem auto 0;
  display: flex;
  padding: 0.875rem 2.5rem;
  min-width: 200px;
  justify-content: center;
  background: var(--theme-accent-rose, #9D6B7B);
  color: var(--theme-text-on-dark, #FFF8E7);
  border: 2px solid var(--theme-accent-rose, #9D6B7B);
  font-family: 'Montserrat', sans-serif;
  font-weight: 500;
  font-size: 0.875rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  border-radius: 50px;  /* Pill shape */
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

/* Hover state with inverted colors */
[data-clean-root] .form-submit:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px color-mix(in srgb, var(--theme-accent-rose, #9D6B7B) 40%, transparent);
  background: var(--theme-bg-card, #3D2F22);
  border-color: var(--theme-bg-card, #3D2F22);
}

/* Active/pressed state */
[data-clean-root] .form-submit:active {
  transform: translateY(0);
}

/* Shimmer effect on hover */
[data-clean-root] .form-submit::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(45deg, transparent, color-mix(in srgb, var(--theme-text-on-dark, #FFF8E7) 20%, transparent), transparent);
  transform: translateX(-100%);
  transition: transform 0.6s ease;
}

[data-clean-root] .form-submit:hover::before {
  transform: translateX(100%);
}
```

### Form Submit Dark Mode

```css
html[data-theme="dark"] [data-clean-root] .form-submit {
  /* Colors automatically adjust via CSS variables */
  /* --theme-accent-rose inherits from theme.css dark mode values */
  /* --theme-bg-card changes to #3D2F22 in dark mode */
}
```

**Note:** The form submit button uses the same CSS variables system, so it automatically adapts to dark mode through the theme.css token updates. No explicit dark mode overrides needed!

---

## CSS Variable Dependencies

Both buttons rely on these core theme tokens defined in [src/styles/tokens/theme.css](../src/styles/tokens/theme.css):

### Light Mode Tokens

```css
:root {
  /* Colors */
  --theme-accent-rose: #9D6B7B;
  --theme-accent-gold: #E4C896;
  --theme-text-on-dark: #FFF8E7;
  --theme-bg-card: #FFFFFF;
  --text-primary: #6B4E3D;

  /* Hero-specific */
  --hero-text: #FFF8E7;
  --hero-accent: #E4C896;
  --hero-cta-text: #FFF8E7;
  --hero-cta-hover-text: #2C241A;

  /* Spacing */
  --space-md: 1rem;
  --space-2xl: 2.5rem;

  /* Typography */
  --font-sans: 'Montserrat', sans-serif;
  --weight-medium: 500;
  --size-sm: 0.875rem;

  /* Effects */
  --radius-2xl: 16px;
  --focus-width: 3px;
  --focus-offset: 3px;
}
```

### Dark Mode Tokens

```css
html[data-theme="dark"] {
  /* Colors */
  --theme-accent-rose: #D89BAE;  /* Brighter rose for dark mode */
  --theme-accent-gold: #F0D9A8;  /* Brighter gold for dark mode */
  --theme-text-on-dark: #FFF8E7;  /* Same cream color */
  --theme-bg-card: #3D2F22;  /* Dark walnut card background */
  --text-primary: #FFFFFF;

  /* Hero-specific (OKLCH for better color management) */
  --hero-accent: oklch(0.78 0.10 90);
  --hero-cta-text: oklch(0.98 0.01 95);
  --hero-cta-hover-text: oklch(0.18 0.03 30);
}
```

### Auto Dark Mode

```css
@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) {
    /* Mirrors all dark mode values above */
    /* Activates when OS is in dark mode and theme isn't forced to light */
  }
}
```

---

## Visual Characteristics

### Hero CTA Button (Secondary)

**Light Mode:**
- **Border:** 2px solid gold (#E4C896)
- **Background:** Transparent
- **Text Color:** Cream (#FFF8E7)
- **Text Shadow:** Subtle dark shadow for depth (0 2px 4px rgba(0,0,0,0.3))
- **Box Shadow:** Soft gold glow (0 4px 15px rgba(228, 200, 150, 0.2))
- **Shape:** Pill (border-radius: 9999px)

**Light Mode Hover:**
- **Border:** Stays gold
- **Background:** Light gold fill (90% gold + 10% white mix)
- **Text Color:** Dark walnut (#6B4E3D)
- **Text Shadow:** Removed
- **Box Shadow:** Stronger gold glow (0 8px 25px rgba(228, 200, 150, 0.4))
- **Transform:** Lifts up 2px (translateY(-2px))
- **Shimmer:** White gradient sweeps left-to-right

**Dark Mode:**
- **Border:** 2px solid brighter gold (oklch(0.78 0.10 90))
- **Background:** Transparent
- **Text Color:** Near white (oklch(0.98 0.01 95))
- **Box Shadow:** Same gold glow with adjusted opacity
- **Shape:** Same pill shape

**Dark Mode Hover:**
- **Background:** Brighter gold fill
- **Text Color:** Deep dark walnut (oklch(0.18 0.03 30))
- **Rest:** Same hover behavior as light mode

---

### Schedule Form Submit Button

**Light Mode:**
- **Border:** 2px solid rose (#9D6B7B)
- **Background:** Rose (#9D6B7B)
- **Text Color:** Cream (#FFF8E7)
- **Shape:** Pill (border-radius: 50px)
- **Min Width:** 200px

**Light Mode Hover:**
- **Border:** 2px solid dark walnut (#3D2F22)
- **Background:** Dark walnut (#3D2F22)
- **Text Color:** Stays cream
- **Box Shadow:** Rose glow (0 8px 25px with 40% rose opacity)
- **Transform:** Lifts up 2px
- **Shimmer:** Cream gradient sweeps left-to-right

**Dark Mode:**
- **Border:** 2px solid lighter rose (#D89BAE)
- **Background:** Lighter rose (#D89BAE)
- **Text Color:** Cream (#FFF8E7)
- **Shape:** Same pill shape

**Dark Mode Hover:**
- **Background:** Automatically shifts to dark card color via tokens
- **Box Shadow:** Adjusted rose glow
- **Rest:** Same hover behavior

---

## Key Design Principles

1. **Color-mix() Magic:** Both buttons use modern `color-mix(in srgb, ...)` for sophisticated color blending
2. **Shimmer Effect:** Gradient sweep animation on hover for premium feel
3. **Lift Animation:** Subtle translateY(-2px) creates depth and interactivity
4. **Pill Shape:** border-radius: 9999px/50px for perfect rounded ends
5. **Shadow Progression:** Shadow intensifies on hover for depth feedback
6. **Smart Contrast:** Text color inverts on hover for readability
7. **Token-Based:** All colors use CSS custom properties for easy theming
8. **Dark Mode Ready:** Both forced (html[data-theme="dark"]) and auto (@media prefers-color-scheme) support

---

## Usage Examples

### Hero CTA Button

```jsx
// In Hero.tsx component
<div className="hero-ctas">
  <a href="#schedule" className="hero-cta hero-cta-secondary">
    Schedule a Tour
  </a>
</div>
```

### Schedule Form Submit Button

```jsx
// In ScheduleForm.tsx component
<button type="submit" className="form-submit">
  Request Your Tour
</button>
```

---

## Restoration Guide

If you ever need to restore these exact button styles:

1. **Copy CSS files:**
   - Hero button: Copy lines 129-227 from `src/styles/components/hero.css`
   - Form button: Copy lines 138-182 from `src/styles/components/schedule-form.css`

2. **Ensure theme tokens are loaded:**
   - Import `src/styles/tokens/theme.css` before component CSS
   - Verify all CSS variables are defined in theme.css

3. **Apply classes:**
   - Hero: `.hero-cta.hero-cta-secondary`
   - Form: `.form-submit`

4. **Test both themes:**
   - Force dark mode: Add `data-theme="dark"` to `<html>` tag
   - Test auto mode: Change OS dark mode setting
   - Verify shimmer effect on hover
   - Verify shadow and lift animations

---

## Related Files

- **Hero CSS:** [src/styles/components/hero.css](../src/styles/components/hero.css)
- **Schedule Form CSS:** [src/styles/components/schedule-form.css](../src/styles/components/schedule-form.css)
- **Theme Tokens:** [src/styles/tokens/theme.css](../src/styles/tokens/theme.css)
- **Hero Component:** [src/components/clean/Hero.tsx](../src/components/clean/Hero.tsx)
- **Schedule Form Component:** [src/components/clean/ScheduleForm.tsx](../src/components/clean/ScheduleForm.tsx)

---

**Archived by:** Claude Code
**Date:** October 31, 2025
**Reason:** User loves these button styles and wants them preserved for future reference

> "can you archive the current CTA button code/css because i really love it, for light and dark"
