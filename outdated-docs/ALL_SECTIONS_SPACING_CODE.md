# Complete Spacing & Alignment Code - All Sections

**Generated:** 2025-10-31
**Purpose:** Actual CSS code for spacing/alignment across entire /clean page

---

## Page Order (Top to Bottom)

1. Navbar (fixed/sticky)
2. Hero
3. Spaces (Venue Spaces)
4. Alternating Blocks (Why Choose Rum River Barn)
5. Experience (Rum River Experience)
6. Gallery (Love Stories)
7. Brand Proof (Social Proof)
8. Schedule Form
9. Pricing
10. Map
11. FAQ
12. Footer

---

## 1. NAVBAR

**File:** `src/styles/components/navbar.css`

```css
/* Navbar Container - Fixed to top */
[data-clean-root] .navbar {
  position: fixed;
  top: 0; left: 0; right: 0;
  z-index: 100;
  background: var(--navbar-bg);
  border-bottom: 1px solid var(--navbar-underline);
  transition: background 200ms ease, backdrop-filter 200ms ease;
}

/* Inner Container */
[data-clean-root] .navbar__container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 16px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

/* Desktop Nav */
[data-clean-root] .navbar__nav {
  display: none;  /* Hidden on mobile */
  align-items: center;
  gap: 32px;      /* Space between nav items */
}

/* CTA Button Spacing */
[data-clean-root] .navbar__cta {
  padding: 10px 24px;
  border-radius: 6px;
  margin-left: 8px;
}

/* Responsive: Desktop */
@media (min-width: 1024px) {
  [data-clean-root] .navbar__nav {
    display: flex;
  }
}
```

**Key Spacing:**
- Container max-width: `1280px` (centered)
- Vertical padding: `16px`
- Horizontal padding: `24px`
- Nav item gap: `32px`

---

## 2. HERO

**File:** `src/styles/components/hero.css`

```css
/* Hero Container - Full viewport */
[data-clean-root] .hero {
  position: relative;
  min-height: 100vh;
  width: 100vw;
  margin-left: calc(50% - 50vw);  /* Full-width breakout */
  margin-right: calc(50% - 50vw);
  max-width: none;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

/* Content Container */
[data-clean-root] .hero-content {
  position: relative;
  z-index: 10;
  text-align: center;
  max-width: 800px;
  padding: 0 var(--space-xl, 2rem);
  animation: fadeInUp 1.2s ease-out;
}

/* Eyebrow (Script) */
[data-clean-root] .hero-eyebrow {
  margin-bottom: var(--space-md, 1rem);
}

/* Title */
[data-clean-root] .hero-title {
  margin-bottom: var(--space-xl, 2rem);
}

/* Lead Text */
[data-clean-root] .hero-lead {
  margin-bottom: var(--space-3xl, 3rem);
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

/* CTA Buttons */
[data-clean-root] .hero-ctas {
  display: flex;
  gap: var(--space-md, 1rem);
  justify-content: center;
  flex-wrap: wrap;
}

/* Scroll Indicator */
[data-clean-root] .hero-scroll {
  position: absolute;
  bottom: var(--space-xl, 2rem);
  left: 50%;
  transform: translateX(-50%);
}

/* Responsive: Tablet */
@media (max-width: 1024px) {
  [data-clean-root] .hero-content {
    padding: 0 var(--space-lg, 1.5rem);
  }
  [data-clean-root] .hero-lead {
    margin-bottom: var(--space-2xl, 2.5rem);
  }
}

/* Responsive: Mobile */
@media (max-width: 768px) {
  [data-clean-root] .hero-content {
    padding: 0 var(--space-md, 1rem);
  }
  [data-clean-root] .hero-ctas {
    flex-direction: column;
    align-items: center;
    gap: var(--space-sm, 0.75rem);
  }
}
```

**Key Spacing:**
- Content max-width: `800px` (centered)
- Content padding: `2rem` → `1.5rem` → `1rem` (responsive)
- Lead max-width: `600px` (centered)
- Element gaps: `1rem` → `2rem` → `3rem`

---

## 3. SPACES (Venue Spaces)

**File:** `src/styles/components/spaces.css`

```css
/* Section Container */
[data-clean-root] .venue-spaces {
  padding: 80px 0;
  max-width: 100%;
  margin: 0 auto;
}

/* Section Header */
[data-clean-root] .section-header {
  text-align: center;
  max-width: 1200px;
  margin: 0 auto 3rem;
  padding: 0 2rem;
}

/* Script */
[data-clean-root] .script-accent {
  margin-bottom: 1rem;
}

/* Title */
[data-clean-root] .section-title {
  margin-bottom: 1rem;
}

/* Lead */
[data-clean-root] .lead {
  max-width: 700px;
  margin: 1.5rem auto 0;
}

/* Tabs Container */
[data-clean-root] .venue-tabs {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-bottom: 2rem;
  flex-wrap: wrap;
}

/* Tab Items */
[data-clean-root] .venue-tab {
  padding: 12px 24px;
  border-radius: 25px;
}

/* Content Grid */
[data-clean-root] .venue-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 2rem;
}

/* Space Card */
[data-clean-root] .venue-card {
  border-radius: 20px;
  overflow: hidden;
  padding: 0;
}

/* Card Content */
[data-clean-root] .venue-details {
  padding: 1.5rem;
}

/* Card Title */
[data-clean-root] .venue-name {
  margin-bottom: 0.75rem;
}

/* Card Description */
[data-clean-root] .venue-description {
  margin-bottom: 1rem;
}

/* Features List */
[data-clean-root] .venue-features {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

/* Responsive: Tablet */
@media (max-width: 1024px) {
  [data-clean-root] .venue-spaces {
    padding: 60px 0;
  }
  [data-clean-root] .venue-grid {
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1.5rem;
  }
}

/* Responsive: Mobile */
@media (max-width: 768px) {
  [data-clean-root] .venue-spaces {
    padding: 50px 0;
  }
  [data-clean-root] .section-header {
    margin-bottom: 2rem;
    padding: 0 1.5rem;
  }
  [data-clean-root] .venue-grid {
    padding: 0 1.5rem;
    gap: 1.25rem;
  }
}
```

**Key Spacing:**
- Section padding: `80px` → `60px` → `50px` (responsive)
- Header max-width: `1200px` (centered)
- Lead max-width: `700px` (centered)
- Grid max-width: `1400px` (centered)
- Grid gap: `2rem` → `1.5rem` → `1.25rem` (responsive)
- Card padding: `1.5rem`

---

## 4. ALTERNATING BLOCKS (Why Choose)

**File:** `src/styles/components/alternating-blocks.css`

```css
/* Section Container */
[data-clean-root] .alternating-blocks {
  padding: clamp(3.5rem, 6vw, 6rem) 0;
  width: 100%;
  overflow: hidden;
  margin: 0;
}

/* Section Header */
[data-clean-root] .alternating-blocks__section-header {
  text-align: center;
  margin-bottom: clamp(2rem, 4vw, 3rem);
  max-width: 900px;
  margin-left: auto;
  margin-right: auto;
  padding-left: clamp(1rem, 3vw, 2rem);
  padding-right: clamp(1rem, 3vw, 2rem);
}

/* Script Accent */
[data-clean-root] .alternating-blocks__script-accent {
  margin-bottom: 0.75rem;
}

/* Section Title */
[data-clean-root] .alternating-blocks__section-title {
  margin: 0 0 0.75rem;
}

/* Lead */
[data-clean-root] .alternating-blocks__lead {
  max-width: 48ch;
  margin: 0 auto;
}

/* Blocks Container */
[data-clean-root] .alternating-blocks__container {
  max-width: 1200px;
  margin: clamp(2rem, 4vw, 3rem) auto 0;
  padding-left: clamp(1rem, 3vw, 2rem);
  padding-right: clamp(1rem, 3vw, 2rem);
}

/* Individual Block Item */
[data-clean-root] .alternating-blocks__item {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: clamp(2rem, 5vw, 5rem);
  align-items: center;
  margin-bottom: clamp(3.5rem, 7vw, 7.5rem);
  padding: clamp(1.25rem, 2.5vw, 1.75rem);
  border-radius: 16px;
}

[data-clean-root] .alternating-blocks__item:last-child {
  margin-bottom: 0;
}

/* Block Content */
[data-clean-root] .alternating-blocks__content {
  padding: clamp(1rem, 2vw, 1.5rem);
}

/* Number */
[data-clean-root] .alternating-blocks__number {
  margin-bottom: 1rem;
}

/* Block Title */
[data-clean-root] .alternating-blocks__title {
  margin-bottom: 0.75rem;
}

/* Paragraph */
[data-clean-root] .alternating-blocks__paragraph {
  margin-bottom: 1rem;
}

[data-clean-root] .alternating-blocks__paragraph:last-child {
  margin-bottom: 0;
}

/* Block Image */
[data-clean-root] .alternating-blocks__image {
  border-radius: 12px;
}

/* Responsive: Mobile */
@media (max-width: 900px) {
  [data-clean-root] .alternating-blocks__item {
    grid-template-columns: 1fr;
    gap: clamp(1.5rem, 3vw, 2rem);
  }
}

@media (max-width: 480px) {
  [data-clean-root] .alternating-blocks__content {
    padding: 0.5rem;
  }
}
```

**Key Spacing:**
- Section padding: `56px` → `96px` (fluid)
- Header max-width: `900px` (centered)
- Header padding: `16px` → `32px` (fluid)
- Header bottom margin: `32px` → `48px` (fluid)
- Container max-width: `1200px` (centered)
- Container padding: `16px` → `32px` (fluid)
- Item gap: `32px` → `80px` (fluid)
- Item bottom margin: `56px` → `120px` (fluid)
- Item padding: `20px` → `28px` (fluid)

---

## 5. EXPERIENCE (Rum River Experience)

**File:** `src/styles/components/experience.css`

```css
/* Section Container */
[data-clean-root] .rum-river-experience {
  padding: 100px 0;
  max-width: 100%;
  margin: 0;
}

/* Section Header */
[data-clean-root] .experience-header {
  text-align: center;
  max-width: 900px;
  margin: 0 auto 80px;
  padding: 0 2rem;
}

/* Script */
[data-clean-root] .experience-script {
  margin-bottom: 1.5rem;
}

/* Title */
[data-clean-root] .experience-title {
  margin-bottom: 1.5rem;
}

/* Description */
[data-clean-root] .experience-description {
  max-width: 700px;
  margin: 0 auto;
}

/* Features Grid */
[data-clean-root] .experience-grid {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2.5rem;
}

/* Feature Card */
[data-clean-root] .feature-card {
  padding: 2rem;
  border-radius: 20px;
  text-align: center;
}

/* Icon Container */
[data-clean-root] .feature-icon {
  width: 72px;
  height: 72px;
  margin: 0 auto 1.5rem;
  border-radius: 50%;
}

/* Feature Title */
[data-clean-root] .feature-title {
  margin-bottom: 1rem;
}

/* Feature Text */
[data-clean-root] .feature-text {
  margin: 0;
}

/* Responsive: Tablet */
@media (max-width: 1024px) {
  [data-clean-root] .rum-river-experience {
    padding: 80px 0;
  }
  [data-clean-root] .experience-header {
    margin-bottom: 60px;
  }
  [data-clean-root] .experience-grid {
    gap: 2rem;
  }
}

/* Responsive: Mobile */
@media (max-width: 768px) {
  [data-clean-root] .rum-river-experience {
    padding: 60px 0;
  }
  [data-clean-root] .experience-header {
    margin-bottom: 40px;
    padding: 0 1.5rem;
  }
  [data-clean-root] .experience-grid {
    padding: 0 1.5rem;
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
  [data-clean-root] .feature-card {
    padding: 1.5rem;
  }
}
```

**Key Spacing:**
- Section padding: `100px` → `80px` → `60px` (responsive)
- Header max-width: `900px` (centered)
- Header bottom margin: `80px` → `60px` → `40px` (responsive)
- Description max-width: `700px` (centered)
- Grid max-width: `1200px` (centered)
- Grid gap: `2.5rem` → `2rem` → `1.5rem` (responsive)
- Card padding: `2rem` → `1.5rem` (responsive)

---

## 6. GALLERY (Love Stories)

**File:** `src/styles/components/gallery.css`

```css
/* Section Container */
[data-clean-root] .love-stories-gallery {
  padding: 100px 0;
  margin: 0 auto;
  max-width: 100%;
}

/* Section Header */
[data-clean-root] .gallery-header {
  text-align: center;
  max-width: 900px;
  margin: 0 auto 60px;
  padding: 0 2rem;
}

/* Script */
[data-clean-root] .gallery-script {
  margin-bottom: 1rem;
}

/* Title */
[data-clean-root] .gallery-title {
  margin-bottom: 1rem;
}

/* Description */
[data-clean-root] .gallery-lead {
  max-width: 600px;
  margin: 0 auto;
}

/* Gallery Grid */
[data-clean-root] .gallery-grid {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 2rem;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 2rem;
}

/* Gallery Item */
[data-clean-root] .gallery-item {
  position: relative;
  border-radius: 16px;
  overflow: hidden;
  aspect-ratio: 4/5;
}

/* Overlay Content */
[data-clean-root] .gallery-overlay {
  padding: 2rem;
}

/* Responsive: Tablet */
@media (max-width: 1024px) {
  [data-clean-root] .love-stories-gallery {
    padding: 80px 0;
  }
  [data-clean-root] .gallery-grid {
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 1.5rem;
  }
}

/* Responsive: Mobile */
@media (max-width: 768px) {
  [data-clean-root] .love-stories-gallery {
    padding: 60px 0;
  }
  [data-clean-root] .gallery-header {
    margin-bottom: 40px;
    padding: 0 1.5rem;
  }
  [data-clean-root] .gallery-grid {
    grid-template-columns: 1fr;
    padding: 0 1.5rem;
    gap: 1.25rem;
  }
  [data-clean-root] .gallery-overlay {
    padding: 1.5rem;
  }
}
```

**Key Spacing:**
- Section padding: `100px` → `80px` → `60px` (responsive)
- Header max-width: `900px` (centered)
- Header bottom margin: `60px` → `40px` (responsive)
- Lead max-width: `600px` (centered)
- Grid max-width: `1400px` (centered)
- Grid gap: `2rem` → `1.5rem` → `1.25rem` (responsive)
- Overlay padding: `2rem` → `1.5rem` (responsive)

---

## 7. BRAND PROOF (Social Proof)

**File:** `src/styles/components/brand-proof.css`

```css
/* Section Container - Full Width */
[data-clean-root] .brand-quote-section {
  padding: 50px 0;
  position: relative;
  width: 100vw;
  max-width: none;
  margin-left: calc(-50vw + 50%);
  margin-right: calc(-50vw + 50%);
}

/* Content Container */
[data-clean-root] .brand-quote-content {
  position: relative;
  z-index: 5;
  text-align: center;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

/* Brand Logos */
[data-clean-root] .brand-logos {
  display: flex;
  justify-content: center;
  gap: 60px;
  margin-bottom: 40px;
  flex-wrap: wrap;
}

/* Quote Text */
[data-clean-root] .brand-quote-text {
  max-width: 850px;
  margin: 0 auto;
}

/* Responsive: Tablet */
@media (max-width: 1024px) {
  [data-clean-root] .brand-quote-section {
    padding: 40px 0;
  }
  [data-clean-root] .brand-logos {
    gap: 40px;
    margin-bottom: 30px;
  }
}

/* Responsive: Mobile */
@media (max-width: 768px) {
  [data-clean-root] .brand-quote-section {
    padding: 35px 0;
  }
  [data-clean-root] .brand-quote-content {
    padding: 0 1.5rem;
  }
  [data-clean-root] .brand-logos {
    gap: 30px;
    margin-bottom: 25px;
  }
}
```

**Key Spacing:**
- Section padding: `50px` → `40px` → `35px` (responsive)
- Content max-width: `1200px` (centered)
- Content padding: `2rem` → `1.5rem` (responsive)
- Logo gap: `60px` → `40px` → `30px` (responsive)
- Logo bottom margin: `40px` → `30px` → `25px` (responsive)
- Quote max-width: `850px` (centered)

---

## 8. SCHEDULE FORM

**File:** `src/styles/components/schedule-form.css`

```css
/* Section Container - Full Width */
[data-clean-root] .schedule-tour {
  padding: clamp(3.5rem, 6vw, 6rem) 0;
  position: relative;
  overflow: hidden;
  width: 100vw;
  max-width: none;
  max-inline-size: none;
  margin-left: calc(-50vw + 50%);
  margin-right: calc(-50vw + 50%);
}

/* Form Container */
[data-clean-root] .form-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 0 2rem;
  position: relative;
  z-index: 1;
}

/* Form Header */
[data-clean-root] .form-header {
  text-align: center;
  margin-bottom: clamp(2rem, 4vw, 3rem);
  max-width: 900px;
  margin-left: auto;
  margin-right: auto;
  padding-left: clamp(1rem, 3vw, 2rem);
  padding-right: clamp(1rem, 3vw, 2rem);
}

/* Script */
[data-clean-root] .form-script {
  margin-bottom: 0.75rem;
}

/* Title */
[data-clean-root] .form-title {
  margin: 0 0 0.75rem;
}

/* Description */
[data-clean-root] .form-description {
  max-width: 48ch;
  margin: 0 auto;
}

/* Form Card */
[data-clean-root] .tour-form {
  padding: 50px;
  border-radius: 20px;
  display: grid;
  gap: 30px;
}

/* Form Row */
[data-clean-root] .form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
}

/* Form Group */
[data-clean-root] .form-group {
  display: grid;
  gap: 10px;
}

/* Submit Button */
[data-clean-root] .form-submit {
  margin: 2rem auto 0;
  padding: 0.875rem 2.5rem;
  min-width: 200px;
}

/* Responsive: Tablet */
@media (max-width: 768px) {
  [data-clean-root] .schedule-tour {
    padding: 80px 0;
  }
  [data-clean-root] .form-container {
    padding: 0 40px;
  }
  [data-clean-root] .tour-form {
    padding: 30px;
    border-radius: 16px;
  }
  [data-clean-root] .form-row {
    grid-template-columns: 1fr;
    gap: 20px;
  }
}

/* Responsive: Mobile */
@media (max-width: 480px) {
  [data-clean-root] .schedule-tour {
    padding: 60px 0;
  }
  [data-clean-root] .form-container {
    padding: 0 16px;
  }
  [data-clean-root] .tour-form {
    padding: 20px;
    gap: 20px;
  }
}
```

**Key Spacing:**
- Section padding: `56px` → `96px` (fluid with clamp)
- Container max-width: `800px` (centered)
- Header max-width: `900px` (centered)
- Header padding: `16px` → `32px` (fluid)
- Header bottom margin: `32px` → `48px` (fluid)
- Form padding: `50px` → `30px` → `20px` (responsive)
- Form gap: `30px` → `20px` (responsive)
- Row gap: `30px` → `20px` (responsive)

---

## 9. PRICING

**File:** `src/styles/components/pricing.css`

```css
/* Section Container */
[data-clean-root] .pricing-section {
  padding: 100px 0;
  margin: 0;
}

/* Section Header */
[data-clean-root] .pricing-section .section-header {
  text-align: center;
  max-width: 900px;
  margin: 0 auto clamp(2rem, 6vw, 4rem);
  padding: 0 2rem;
}

/* Script */
[data-clean-root] .pricing-section .script-accent {
  margin-bottom: .75rem;
}

/* Title */
[data-clean-root] .pricing-section .section-title {
  margin: 0 0 .75rem;
}

/* Lead */
[data-clean-root] .pricing-section .hero-pricing-line {
  margin-bottom: .75rem;
}

/* Pricing Grid */
[data-clean-root] .pricing-grid {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

/* Pricing Card */
[data-clean-root] .pricing-card {
  padding: 3rem 2rem;
  border-radius: 16px;
}

/* Popular Badge */
[data-clean-root] .popular-badge {
  margin-bottom: 1.5rem;
  padding: .5rem 1.25rem;
  border-radius: 9999px;
}

/* Package Name */
[data-clean-root] .package-name {
  margin-bottom: 1rem;
}

/* Price */
[data-clean-root] .price {
  margin-bottom: 2rem;
}

/* Features List */
[data-clean-root] .features-list {
  margin-bottom: 2rem;
}

[data-clean-root] .features-list li {
  margin-bottom: .75rem;
}

/* CTA Button */
[data-clean-root] .cta-button {
  padding: 0.75rem 1rem;
  min-height: 44px;
  border-radius: 10px;
  margin-top: 1rem;
}

/* Responsive: Tablet */
@media (max-width: 1024px) {
  [data-clean-root] .pricing-section {
    padding: 80px 0;
  }
  [data-clean-root] .pricing-grid {
    gap: 1.5rem;
  }
}

/* Responsive: Mobile */
@media (max-width: 768px) {
  [data-clean-root] .pricing-section {
    padding: 60px 0;
  }
  [data-clean-root] .pricing-grid {
    grid-template-columns: 1fr;
    padding: 0 1.5rem;
  }
  [data-clean-root] .pricing-card {
    padding: 2rem 1.5rem;
  }
}
```

**Key Spacing:**
- Section padding: `100px` → `80px` → `60px` (responsive)
- Header max-width: `900px` (centered)
- Header bottom margin: `32px` → `64px` (fluid)
- Grid max-width: `1200px` (centered)
- Grid gap: `2rem` → `1.5rem` (responsive)
- Card padding: `3rem 2rem` → `2rem 1.5rem` (responsive)

---

## 10. MAP

**File:** `src/styles/components/map.css`

```css
/* Section Container */
[data-clean-root] .map-section {
  padding: 100px 0;
  margin: 0;
}

/* Section Header */
[data-clean-root] .map-header {
  text-align: center;
  max-width: 900px;
  margin: 0 auto 60px;
  padding: 0 2rem;
}

/* Script */
[data-clean-root] .map-script {
  margin-bottom: 1rem;
}

/* Title */
[data-clean-root] .map-title {
  margin-bottom: 1rem;
}

/* Description */
[data-clean-root] .map-description {
  max-width: 600px;
  margin: 0 auto;
}

/* Map Container */
[data-clean-root] .map-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  align-items: start;
}

/* Map Embed */
[data-clean-root] .map-embed {
  border-radius: 16px;
  overflow: hidden;
}

/* Map Details */
[data-clean-root] .map-details {
  padding: 2rem;
}

/* Info Item */
[data-clean-root] .map-info-item {
  margin-bottom: 1.5rem;
}

/* Responsive: Tablet */
@media (max-width: 1024px) {
  [data-clean-root] .map-section {
    padding: 80px 0;
  }
  [data-clean-root] .map-container {
    gap: 2rem;
  }
}

/* Responsive: Mobile */
@media (max-width: 768px) {
  [data-clean-root] .map-section {
    padding: 60px 0;
  }
  [data-clean-root] .map-header {
    margin-bottom: 40px;
    padding: 0 1.5rem;
  }
  [data-clean-root] .map-container {
    grid-template-columns: 1fr;
    padding: 0 1.5rem;
    gap: 1.5rem;
  }
  [data-clean-root] .map-details {
    padding: 1.5rem;
  }
}
```

**Key Spacing:**
- Section padding: `100px` → `80px` → `60px` (responsive)
- Header max-width: `900px` (centered)
- Header bottom margin: `60px` → `40px` (responsive)
- Description max-width: `600px` (centered)
- Container max-width: `1200px` (centered)
- Container gap: `3rem` → `2rem` → `1.5rem` (responsive)
- Details padding: `2rem` → `1.5rem` (responsive)

---

## 11. FAQ

**File:** `src/styles/components/faq.css`

```css
/* Section Container */
[data-clean-root] .faq-section {
  padding: 100px 0;
  margin: 0;
}

/* Section Header */
[data-clean-root] .faq-header {
  text-align: center;
  max-width: 900px;
  margin: 0 auto 60px;
  padding: 0 2rem;
}

/* Script */
[data-clean-root] .faq-script {
  margin-bottom: 1rem;
}

/* Title */
[data-clean-root] .faq-title {
  margin-bottom: 1rem;
}

/* Description */
[data-clean-root] .faq-description {
  max-width: 600px;
  margin: 0 auto;
}

/* FAQ Container */
[data-clean-root] .faq-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 0 2rem;
}

/* FAQ Item */
[data-clean-root] .faq-item {
  margin-bottom: 1.5rem;
  padding: 1.5rem;
  border-radius: 12px;
}

/* Question */
[data-clean-root] .faq-question {
  padding-right: 3rem;
  margin-bottom: 0;
}

/* Answer */
[data-clean-root] .faq-answer {
  padding-top: 1rem;
  margin: 0;
}

/* Responsive: Tablet */
@media (max-width: 1024px) {
  [data-clean-root] .faq-section {
    padding: 80px 0;
  }
}

/* Responsive: Mobile */
@media (max-width: 768px) {
  [data-clean-root] .faq-section {
    padding: 60px 0;
  }
  [data-clean-root] .faq-header {
    margin-bottom: 40px;
    padding: 0 1.5rem;
  }
  [data-clean-root] .faq-container {
    padding: 0 1.5rem;
  }
  [data-clean-root] .faq-item {
    padding: 1.25rem;
  }
}
```

**Key Spacing:**
- Section padding: `100px` → `80px` → `60px` (responsive)
- Header max-width: `900px` (centered)
- Header bottom margin: `60px` → `40px` (responsive)
- Description max-width: `600px` (centered)
- Container max-width: `800px` (centered)
- Item margin-bottom: `1.5rem`
- Item padding: `1.5rem` → `1.25rem` (responsive)

---

## 12. FOOTER

**File:** `src/styles/components/footer.css`

```css
/* Footer Container */
[data-clean-root] .footer {
  padding: 80px 0 40px;
  margin: 0;
}

/* Footer Content */
[data-clean-root] .footer-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 3rem;
}

/* Footer Section */
[data-clean-root] .footer-section {
  margin-bottom: 0;
}

/* Section Title */
[data-clean-root] .footer-section-title {
  margin-bottom: 1.5rem;
}

/* Links List */
[data-clean-root] .footer-links {
  list-style: none;
  padding: 0;
  margin: 0;
}

[data-clean-root] .footer-links li {
  margin-bottom: 0.75rem;
}

/* Bottom Bar */
[data-clean-root] .footer-bottom {
  max-width: 1200px;
  margin: 3rem auto 0;
  padding: 2rem 2rem 0;
  border-top: 1px solid var(--footer-border);
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
}

/* Social Links */
[data-clean-root] .footer-social {
  display: flex;
  gap: 1rem;
}

/* Responsive: Tablet */
@media (max-width: 1024px) {
  [data-clean-root] .footer {
    padding: 60px 0 30px;
  }
  [data-clean-root] .footer-content {
    gap: 2rem;
  }
}

/* Responsive: Mobile */
@media (max-width: 768px) {
  [data-clean-root] .footer {
    padding: 50px 0 25px;
  }
  [data-clean-root] .footer-content {
    grid-template-columns: 1fr;
    padding: 0 1.5rem;
    gap: 2rem;
  }
  [data-clean-root] .footer-bottom {
    flex-direction: column;
    text-align: center;
    padding: 1.5rem 1.5rem 0;
  }
}
```

**Key Spacing:**
- Footer padding: `80px 0 40px` → `60px 0 30px` → `50px 0 25px` (responsive)
- Content max-width: `1200px` (centered)
- Content gap: `3rem` → `2rem` (responsive)
- Section title margin-bottom: `1.5rem`
- Link margin-bottom: `0.75rem`
- Bottom bar top margin: `3rem`
- Bottom bar top padding: `2rem` → `1.5rem` (responsive)

---

## SUMMARY TABLE

| Section | Vertical Padding | Max-Width | Horizontal Padding |
|---------|------------------|-----------|-------------------|
| Navbar | `16px` | `1280px` | `24px` |
| Hero | `100vh` | `800px` content | `2rem` → `1rem` |
| Spaces | `80px` → `50px` | `1400px` grid | `2rem` → `1.5rem` |
| Alternating Blocks | `56px` → `96px` | `1200px` | `16px` → `32px` |
| Experience | `100px` → `60px` | `1200px` | `2rem` → `1.5rem` |
| Gallery | `100px` → `60px` | `1400px` | `2rem` → `1.5rem` |
| Brand Proof | `50px` → `35px` | `1200px` | `2rem` → `1.5rem` |
| Schedule Form | `56px` → `96px` | `800px` | `2rem` → `16px` |
| Pricing | `100px` → `60px` | `1200px` | `2rem` → `1.5rem` |
| Map | `100px` → `60px` | `1200px` | `2rem` → `1.5rem` |
| FAQ | `100px` → `60px` | `800px` | `2rem` → `1.5rem` |
| Footer | `80px` → `50px` | `1200px` | `2rem` → `1.5rem` |

---

## GLOBAL PATTERNS

### Container Centering
```css
max-width: [size]px;
margin: 0 auto;
padding: 0 2rem;  /* 1.5rem on mobile */
```

### Section Padding
```css
/* Large sections */
padding: 100px 0;  /* Desktop */
padding: 80px 0;   /* Tablet */
padding: 60px 0;   /* Mobile */

/* Medium sections */
padding: 80px 0;   /* Desktop */
padding: 60px 0;   /* Tablet */
padding: 50px 0;   /* Mobile */

/* Small sections */
padding: 50px 0;   /* Desktop */
padding: 40px 0;   /* Tablet */
padding: 35px 0;   /* Mobile */

/* Fluid sections (NEW) */
padding: clamp(3.5rem, 6vw, 6rem) 0;  /* 56px → 96px */
```

### Grid Gaps
```css
gap: 2rem;      /* Desktop: 32px */
gap: 1.5rem;    /* Tablet: 24px */
gap: 1.25rem;   /* Mobile: 20px */
```

### Header Margins
```css
margin-bottom: 60px;  /* Desktop */
margin-bottom: 40px;  /* Mobile */
```

---

## RESPONSIVE BREAKPOINTS

```css
/* Desktop First */
@media (max-width: 1024px) { /* Tablet */ }
@media (max-width: 768px)  { /* Mobile */ }
@media (max-width: 480px)  { /* Small Mobile */ }

/* Desktop Only */
@media (min-width: 1024px) { /* Show desktop nav */ }
```
