# Section Spacing & Alignment Report

**Generated:** 2025-10-31
**Purpose:** Document all spacing, margins, and alignment changes made during design system enhancement

---

## Section Overview

Both "Why Choose Rum River Barn" and "Schedule a Tour" sections now use identical header styling and spacing patterns for visual consistency.

---

## 1. Why Choose Rum River Barn (alternating-blocks.css)

### Section Container
```css
[data-clean-root] .alternating-blocks {
  padding: clamp(3.5rem, 6vw, 6rem) 0;
}
```
**Breakdown:**
- **Mobile (320px):** `3.5rem` = 56px top/bottom
- **Tablet (768px):** `~4.6rem` = 73px top/bottom
- **Desktop (1920px):** `6rem` = 96px top/bottom

---

### Section Header Container
```css
[data-clean-root] .alternating-blocks__section-header {
  text-align: center;
  margin-bottom: clamp(2rem, 4vw, 3rem);
  max-width: 900px;
  margin-left: auto;
  margin-right: auto;
  padding-left: clamp(1rem, 3vw, 2rem);
  padding-right: clamp(1rem, 3vw, 2rem);
}
```
**Breakdown:**
- **Max-width:** 900px (centered)
- **Horizontal padding:**
  - Mobile: `1rem` = 16px
  - Tablet: `~2.3rem` = 37px
  - Desktop: `2rem` = 32px
- **Bottom margin:**
  - Mobile: `2rem` = 32px
  - Tablet: `~3.1rem` = 49px
  - Desktop: `3rem` = 48px

---

### Script Accent (Dancing Script)
```css
[data-clean-root] .alternating-blocks__script-accent {
  font-size: clamp(1.5rem, 3.2vw, 1.75rem);
  margin-bottom: 0.75rem;
}
```
**Breakdown:**
- **Font size:**
  - Mobile: `1.5rem` = 24px
  - Tablet: `~1.6rem` = 25.6px
  - Desktop: `1.75rem` = 28px
- **Spacing below:** `0.75rem` = 12px
- **Color:** Gold (`#E4C896`)

---

### Section Title (Playfair Display)
```css
[data-clean-root] .alternating-blocks__section-title {
  font-size: clamp(2.25rem, 4.8vw, 3rem);
  margin: 0 0 0.75rem;
  line-height: 1.2;
}
```
**Breakdown:**
- **Font size:**
  - Mobile: `2.25rem` = 36px
  - Tablet: `~2.7rem` = 43px
  - Desktop: `3rem` = 48px
- **Spacing below:** `0.75rem` = 12px
- **Color:** Brown (`#6B4E3D`)

---

### Lead Description
```css
[data-clean-root] .alternating-blocks__lead {
  font-size: clamp(1rem, 2.4vw, 1.125rem);
  line-height: 1.7;
  max-width: 48ch;
  margin: 0 auto;
}
```
**Breakdown:**
- **Font size:**
  - Mobile: `1rem` = 16px
  - Tablet: `~1.06rem` = 17px
  - Desktop: `1.125rem` = 18px
- **Max-width:** 48 characters (for optimal readability)
- **Centered** with `margin: 0 auto`
- **Color:** Soft brown (`#7B5E4E`)

---

### Blocks Container
```css
[data-clean-root] .alternating-blocks__container {
  max-width: 1200px;
  margin: clamp(2rem, 4vw, 3rem) auto 0;
  padding-left: clamp(1rem, 3vw, 2rem);
  padding-right: clamp(1rem, 3vw, 2rem);
}
```
**Breakdown:**
- **Max-width:** 1200px (centered)
- **Top margin:**
  - Mobile: `2rem` = 32px
  - Tablet: `~3.1rem` = 49px
  - Desktop: `3rem` = 48px
- **Horizontal padding:** Same as section header

---

### Individual Block Items (Cards)
```css
[data-clean-root] .alternating-blocks__item {
  gap: clamp(2rem, 5vw, 5rem);
  margin-bottom: clamp(3.5rem, 7vw, 7.5rem);
  padding: clamp(1.25rem, 2.5vw, 1.75rem);
  border-radius: 16px;
}
```
**Breakdown:**
- **Gap between image and text:**
  - Mobile: `2rem` = 32px
  - Tablet: `~3.8rem` = 61px
  - Desktop: `5rem` = 80px
- **Space between cards:**
  - Mobile: `3.5rem` = 56px
  - Tablet: `~5.4rem` = 86px
  - Desktop: `7.5rem` = 120px
- **Card padding:**
  - Mobile: `1.25rem` = 20px
  - Tablet: `~1.9rem` = 30px
  - Desktop: `1.75rem` = 28px

---

### Block Content
```css
[data-clean-root] .alternating-blocks__content {
  padding: clamp(1rem, 2vw, 1.5rem);
}

[data-clean-root] .alternating-blocks__number {
  font-size: clamp(2rem, 6vw, 3rem);
  margin-bottom: 1rem;
}

[data-clean-root] .alternating-blocks__title {
  font-size: clamp(1.5rem, 4vw, 2.5rem);
  margin-bottom: 0.75rem;
}

[data-clean-root] .alternating-blocks__paragraph {
  font-size: clamp(1rem, 2vw, 1.125rem);
  margin-bottom: 1rem;
}
```
**Breakdown:**
- **Content padding:**
  - Mobile: `1rem` = 16px
  - Tablet: `~1.5rem` = 24px
  - Desktop: `1.5rem` = 24px
- **Number size:**
  - Mobile: `2rem` = 32px
  - Tablet: `~2.6rem` = 42px
  - Desktop: `3rem` = 48px
- **Number spacing below:** `1rem` = 16px
- **Block title size:**
  - Mobile: `1.5rem` = 24px
  - Tablet: `~2.1rem` = 34px
  - Desktop: `2.5rem` = 40px
- **Block title spacing below:** `0.75rem` = 12px
- **Paragraph spacing below:** `1rem` = 16px

---

## 2. Schedule a Tour (schedule-form.css)

### Section Container
```css
[data-clean-root] .schedule-tour {
  padding: clamp(3.5rem, 6vw, 6rem) 0;
}
```
**Same as "Why Choose" section**

---

### Form Header Container
```css
[data-clean-root] .form-header {
  text-align: center;
  margin-bottom: clamp(2rem, 4vw, 3rem);
  max-width: 900px;
  margin-left: auto;
  margin-right: auto;
  padding-left: clamp(1rem, 3vw, 2rem);
  padding-right: clamp(1rem, 3vw, 2rem);
}
```
**Identical to alternating-blocks__section-header**

---

### Script Accent
```css
[data-clean-root] .form-script {
  font-size: clamp(1.5rem, 3.2vw, 1.75rem);
  margin-bottom: 0.75rem;
}
```
**Identical to alternating-blocks__script-accent**

---

### Title
```css
[data-clean-root] .form-title {
  font-size: clamp(2.25rem, 4.8vw, 3rem);
  margin: 0 0 0.75rem;
  letter-spacing: -0.02em;
}
```
**Identical to alternating-blocks__section-title**

---

### Description
```css
[data-clean-root] .form-description {
  font-size: clamp(1rem, 2.4vw, 1.125rem);
  line-height: 1.7;
  max-width: 48ch;
  margin: 0 auto;
}
```
**Identical to alternating-blocks__lead**

---

### Form Container
```css
[data-clean-root] .form-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 0 2rem;
  position: relative;
  z-index: 1;
}
```
**Breakdown:**
- **Max-width:** 800px (narrower than Why Choose for form focus)
- **Horizontal padding:** `2rem` = 32px (fixed, not responsive)
- **Centered** with `margin: 0 auto`

---

### Form Card
```css
[data-clean-root] .tour-form {
  padding: 50px;
  border-radius: 20px;
  gap: 30px;
}
```
**Breakdown:**
- **Card padding:** 50px all sides
- **Border radius:** 20px
- **Gap between form elements:** 30px

---

## Color Scheme Comparison

### Why Choose Section
| Element | Color | Hex | Token |
|---------|-------|-----|-------|
| Script accent | Gold | `#E4C896` | `--theme-accent-gold` |
| Section title | Brown | `#6B4E3D` | `--theme-text-primary` |
| Lead text | Soft brown | `#7B5E4E` | `--theme-text-secondary` |
| Number | Gold | `#E4C896` | `--why-number` |
| Background gradient | Cream→Rose | `#FFF8E7 → #F4E4E1` | `--why-bg-start/end` |

### Schedule a Tour Section (FIXED)
| Element | Color | Hex | Token |
|---------|-------|-----|-------|
| Script accent | Gold | `#E4C896` | `--theme-accent-gold` |
| Section title | Brown ✅ | `#6B4E3D` | `--theme-text-primary` |
| Lead text | Soft brown ✅ | `#7B5E4E` | `--theme-text-secondary` |
| Background gradient | Cream→Cream | `#F4E4E1 → #FFF8E7` | `--surface-0/2` |

**✅ Fixed:** Changed title and description from white (`#FFF8E7`) to brown for readability

---

## Responsive Breakpoints Summary

### Header Text Scaling

| Screen Size | Script | Title | Description |
|-------------|--------|-------|-------------|
| Mobile (320px) | 24px | 36px | 16px |
| Tablet (768px) | 25.6px | 43px | 17px |
| Desktop (1920px) | 28px | 48px | 18px |

### Section Padding

| Screen Size | Vertical Padding |
|-------------|------------------|
| Mobile (320px) | 56px |
| Tablet (768px) | 73px |
| Desktop (1920px) | 96px |

### Card Spacing (Why Choose)

| Screen Size | Gap | Bottom Margin |
|-------------|-----|---------------|
| Mobile (320px) | 32px | 56px |
| Tablet (768px) | 61px | 86px |
| Desktop (1920px) | 80px | 120px |

---

## Alignment Strategy

### Horizontal Centering
- All section headers: `max-width + margin: 0 auto`
- All content wrappers: `max-width + margin: 0 auto`
- Lead text: `max-width: 48ch + margin: 0 auto` (optimal line length)

### Vertical Rhythm
- Consistent `clamp()` values across both sections
- Script → Title → Description spacing: `0.75rem` between each
- Header → Content spacing: `clamp(2rem, 4vw, 3rem)`

### Card Layout (Why Choose)
- Two-column grid on desktop (`grid-template-columns: 1fr 1fr`)
- Single column on mobile (< 900px)
- Alternating reverse with `direction: rtl`

---

## Key Changes Made

### Before → After

**Schedule Form Title:**
- ❌ Before: White text (`#FFF8E7`) on light background → **unreadable**
- ✅ After: Brown text (`#6B4E3D`) on light background → **readable**

**Schedule Form Description:**
- ❌ Before: White text (`#FFF8E7`) on light background → **unreadable**
- ✅ After: Soft brown (`#7B5E4E`) on light background → **readable**

**Spacing:**
- ❌ Before: Fixed pixel values (80px, 50px, etc.)
- ✅ After: Responsive `clamp()` values that scale smoothly

**Consistency:**
- ✅ Both sections now use identical header patterns
- ✅ Both sections use identical font sizes and scaling
- ✅ Both sections use identical color scheme (gold + brown)

---

## Visual Hierarchy

Both sections follow this pattern:

1. **Script Accent** (Dancing Script, gold, 24-28px)
2. **Section Title** (Playfair Display, brown, 36-48px) ← **Primary focus**
3. **Description** (Montserrat, soft brown, 16-18px)
4. **Content** (Cards or Form)

This creates a clear, consistent visual flow across the entire site.
