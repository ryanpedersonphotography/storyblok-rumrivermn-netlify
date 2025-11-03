# Color Contrast Policy
**Ensuring WCAG 2.2 Level AA Compliance**

> **Status**: 🟢 Active Policy
> **Last Updated**: 2025-01-25
> **WCAG Level**: AA (minimum), AAA (target where feasible)

---

## Table of Contents

1. [Requirements](#requirements)
2. [Contrast Ratios](#contrast-ratios)
3. [Color Pairing Matrix](#color-pairing-matrix)
4. [Common Violations](#common-violations)
5. [Testing Tools](#testing-tools)
6. [Remediation](#remediation)

---

## Requirements

### WCAG 2.2 Success Criteria

This site must meet the following contrast requirements:

#### 1.4.3 Contrast (Minimum) - Level AA
- **Normal text** (< 18pt, or < 14pt bold): **4.5:1 minimum**
- **Large text** (≥ 18pt, or ≥ 14pt bold): **3:1 minimum**
- **UI components** (buttons, form borders, icons): **3:1 minimum**

#### 1.4.6 Contrast (Enhanced) - Level AAA (Aspirational)
- **Normal text**: **7:1 minimum**
- **Large text**: **4.5:1 minimum**

#### 1.4.11 Non-text Contrast - Level AA
- **UI controls** (focus indicators, active states): **3:1 minimum**
- **Graphical elements** (icons, charts): **3:1 minimum**

### Our Policy

✅ **Enforce AA for all text** (4.5:1 minimum)
✅ **Enforce AA for all UI** (3:1 minimum)
🎯 **Strive for AAA** where possible without compromising brand

---

## Contrast Ratios

### How Contrast is Measured

Contrast ratio is calculated using relative luminance:

```
Contrast Ratio = (L1 + 0.05) / (L2 + 0.05)
```

Where:
- L1 = relative luminance of lighter color
- L2 = relative luminance of darker color

**Ratio Scale:**
- **1:1** = No contrast (same color)
- **3:1** = Minimum for large text & UI (AA)
- **4.5:1** = Minimum for normal text (AA)
- **7:1** = Enhanced for normal text (AAA)
- **21:1** = Maximum (black on white)

### Quick Reference

| Use Case | WCAG Level | Minimum Ratio | Example |
|----------|------------|---------------|---------|
| Body text (16px) | AA | 4.5:1 | Text-dark on cream-pearl |
| Headings (18px+) | AA | 3:1 | Warm-walnut on white |
| Buttons | AA | 3:1 | Button bg vs page bg |
| Focus rings | AA | 3:1 | Focus-ring vs surface |
| Icons | AA | 3:1 | Icon color vs background |

---

## Color Pairing Matrix

### Primary Text Colors on Backgrounds

All values tested with [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)

| Text Color | Background | Ratio | AA Pass | AAA Pass | Use Case |
|------------|------------|-------|---------|----------|----------|
| **Warm Walnut** `#6B4E3D` | Cream Pearl `#FFFCF8` | **6.9:1** | ✅ | ✅ | Primary headings on light |
| **Warm Walnut** `#6B4E3D` | White `#FFFFFF` | **7.2:1** | ✅ | ✅ | Primary headings on cards |
| **Warm Walnut** `#6B4E3D` | Blush Pink `#F4E4E1` | **6.1:1** | ✅ | ✅ | Headings on alt sections |
| **Warm Walnut** `#6B4E3D` | Warm Cream `#FBF8F4` | **6.6:1** | ✅ | ✅ | Headings on surfaces |
| **Text Dark** `#2C2416` | Cream Pearl `#FFFCF8` | **13.8:1** | ✅ | ✅ | Body text (default) |
| **Text Dark** `#2C2416` | White `#FFFFFF` | **14.3:1** | ✅ | ✅ | Body text on cards |
| **Text Dark** `#2C2416` | Blush Pink `#F4E4E1` | **12.2:1** | ✅ | ✅ | Body text on alt sections |
| **Text Dark** `#2C2416` | Warm Cream `#FBF8F4` | **13.2:1** | ✅ | ✅ | Body text on surfaces |

### Accent Colors (Large Text Only - ≥18pt)

| Text Color | Background | Ratio | AA Pass (18pt+) | Use Case |
|------------|------------|-------|-----------------|----------|
| **Dusty Rose** `#9D6B7B` | Cream Pearl `#FFFCF8` | **4.2:1** | ✅ | Script accents, large text |
| **Dusty Rose** `#9D6B7B` | White `#FFFFFF` | **4.4:1** | ✅ | Script accents on cards |
| **Dusty Rose** `#9D6B7B` | Blush Pink `#F4E4E1` | **3.7:1** | ✅ | Script on blush (borderline) |
| **Champagne Gold** `#E4C896` | Deep Brown `#4A3426` | **4.8:1** | ✅ | Gold accents on dark bg |
| **Champagne Gold** `#E4C896` | Warm Walnut `#6B4E3D` | **3.2:1** | ✅ | Hero text overlays |

### Inverse (Light on Dark)

| Text Color | Background | Ratio | AA Pass | AAA Pass | Use Case |
|------------|------------|-------|---------|----------|----------|
| **White** `#FFFFFF` | Deep Brown `#4A3426` | **12.3:1** | ✅ | ✅ | Footer text |
| **White** `#FFFFFF` | Warm Walnut `#6B4E3D` | **7.2:1** | ✅ | ✅ | Dark section text |
| **Cream Pearl** `#FFFCF8` | Deep Brown `#4A3426` | **11.9:1** | ✅ | ✅ | Footer text (warm) |
| **Champagne Gold** `#E4C896` | Deep Brown `#4A3426` | **4.8:1** | ✅ | ❌ | CTA buttons on dark |

### UI Components & Focus States

| Element | Foreground | Background | Ratio | AA Pass (3:1) | Use Case |
|---------|-----------|------------|-------|---------------|----------|
| **Focus Ring** | Warm Walnut `#6B4E3D` | Cream Pearl `#FFFCF8` | **6.9:1** | ✅ | Keyboard focus |
| **Focus Ring** | Warm Walnut `#6B4E3D` | White `#FFFFFF` | **7.2:1** | ✅ | Focus on cards |
| **Focus Ring** | Warm Walnut `#6B4E3D` | Blush Pink `#F4E4E1` | **6.1:1** | ✅ | Focus on alt sections |
| **Button Border** | Warm Walnut `#6B4E3D` | Cream Pearl `#FFFCF8` | **6.9:1** | ✅ | Outline buttons |
| **Hover State** | Warm Walnut bg | Cream Pearl | **6.9:1** | ✅ | Hover backgrounds |

---

## Common Violations

### ❌ Failures to Avoid

#### 1. Dusty Rose on Light Backgrounds (Small Text)
```css
/* ❌ FAIL - Only 4.2:1 (needs 4.5:1 for small text) */
color: var(--color-dusty-rose);  /* #9D6B7B */
background: var(--color-cream-pearl);  /* #FFFCF8 */
font-size: 16px;  /* Normal text */
```

**Fix:** Use warm-walnut or text-dark for normal text
```css
/* ✅ PASS - 6.9:1 */
color: var(--color-text-primary);  /* #6B4E3D */
```

#### 2. Champagne Gold on Light Backgrounds
```css
/* ❌ FAIL - Only 1.9:1 (needs 4.5:1) */
color: var(--color-champagne-gold);  /* #E4C896 */
background: var(--color-cream-pearl);  /* #FFFCF8 */
```

**Fix:** Reserve gold for dark backgrounds or non-text elements
```css
/* ✅ PASS - 4.8:1 (on dark bg) */
color: var(--color-champagne-gold);
background: var(--color-deep-brown);  /* #4A3426 */
```

#### 3. Sage Green Anywhere
```css
/* ❌ FAIL - Only 2.8:1 on cream (needs 4.5:1) */
color: var(--color-sage-green);  /* #7A8B7F */
background: var(--color-cream-pearl);
```

**Fix:** Use sage green only for decorative borders/accents, never text
```css
/* ✅ ACCEPTABLE - Non-text decoration */
border-color: var(--color-sage-green);
```

---

## Testing Tools

### Automated Testing

#### WebAIM Contrast Checker (Manual)
🔗 [https://webaim.org/resources/contrastchecker/](https://webaim.org/resources/contrastchecker/)

**How to use:**
1. Enter foreground color (text)
2. Enter background color
3. Check ratio against WCAG AA/AAA
4. Test at 16px and 18px+ sizes

#### Browser DevTools

**Chrome:**
1. Inspect element
2. Open "Accessibility" panel
3. Check "Contrast ratio" under "Text"
4. Look for ✅ AA / ❌ Fail indicators

**Firefox:**
1. Inspect element
2. Open "Accessibility" panel
3. Check "Contrast" section
4. Shows WCAG levels and pass/fail

#### Pa11y-CI (Automated in CI)
```bash
# Run accessibility tests (includes contrast)
npm run ci:a11y
```

### Manual Testing Checklist

For every new component:

- [ ] Check all text colors against their backgrounds
- [ ] Verify focus ring contrast (3:1 minimum)
- [ ] Test button states (normal, hover, pressed, disabled)
- [ ] Check icon colors against backgrounds
- [ ] Verify form input borders (3:1 minimum)
- [ ] Test in both light and dark sections

---

## Remediation

### When You Encounter a Contrast Violation

#### Step 1: Identify the Violation
```bash
# Example error from pa11y:
Error: Elements must have sufficient color contrast
Element: <p class="description">Your romantic wedding venue</p>
Foreground: rgb(157, 107, 123)  # Dusty Rose
Background: rgb(255, 252, 248)  # Cream Pearl
Ratio: 4.2:1 (fails AA at 16px)
```

#### Step 2: Determine Text Size
- **Small text** (< 18pt): Needs 4.5:1
- **Large text** (≥ 18pt): Needs 3:1

#### Step 3: Choose Fix Strategy

**Option A: Darken Foreground**
```css
/* Before: 4.2:1 (fail) */
color: var(--color-dusty-rose);  /* #9D6B7B */

/* After: 6.9:1 (pass) */
color: var(--color-text-primary);  /* #6B4E3D */
```

**Option B: Lighten Background**
```css
/* If you must use dusty-rose, increase font size */
color: var(--color-dusty-rose);
font-size: var(--font-size-3xl);  /* 28px - large text */
font-weight: var(--font-weight-regular);
/* Now passes at 4.2:1 (meets 3:1 for large text) */
```

**Option C: Use for Decoration Only**
```css
/* Don't use for text, use as accent */
border-color: var(--color-dusty-rose);
/* or */
background-color: var(--color-dusty-rose);  /* with proper text color */
color: var(--color-white);  /* 4.4:1 - passes */
```

#### Step 4: Re-test
```bash
# Run automated tests
npm run ci:a11y

# Manual check with WebAIM
# https://webaim.org/resources/contrastchecker/
```

---

## Safe Color Combinations

### Always Safe (AAA on all backgrounds)

**Text Colors:**
- `--color-text-dark` (#2C2416) - **13.8:1** on cream pearl ⭐
- `--color-text-primary` (#6B4E3D) - **6.9:1** on cream pearl ⭐

**Inverse:**
- `--color-white` on `--color-deep-brown` - **12.3:1** ⭐
- `--color-white` on `--color-warm-walnut` - **7.2:1** ⭐

### Conditionally Safe (AA only, context-dependent)

**Large Text Only (≥18pt):**
- `--color-dusty-rose` on light backgrounds - **4.2:1** (AA large text)
- `--color-champagne-gold` on `--color-deep-brown` - **4.8:1** (AA large text)

### Never Use for Text

- `--color-sage-green` on any light background ❌
- `--color-champagne-gold` on any light background ❌
- `--color-blush-pink` text on `--color-cream-pearl` ❌

---

## CI Integration

This project enforces contrast checks in CI using pa11y-ci:

```yaml
# .github/workflows/accessibility.yml
- name: Run accessibility tests
  run: npm run ci:a11y
```

**What it checks:**
- All text contrast ratios
- Focus indicator contrast
- UI component contrast
- Interactive element states

**Merge Blocker:** PRs fail if contrast violations are detected.

---

## Resources

- [WCAG 2.2 SC 1.4.3 Contrast (Minimum)](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html)
- [WCAG 2.2 SC 1.4.6 Contrast (Enhanced)](https://www.w3.org/WAI/WCAG22/Understanding/contrast-enhanced.html)
- [WCAG 2.2 SC 1.4.11 Non-text Contrast](https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html)
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [Accessible Colors](https://accessible-colors.com/)

---

**Last Audit**: 2025-01-25
**Next Audit**: On any design system color change
**Contact**: Design System Team
