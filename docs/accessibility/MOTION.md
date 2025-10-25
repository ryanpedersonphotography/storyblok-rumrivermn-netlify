# Motion & Animation Accessibility Policy
**Respecting User Preferences for Reduced Motion**

> **Status**: 🟢 Active Policy
> **Last Updated**: 2025-01-25
> **WCAG Level**: AA (enforced)

---

## Table of Contents

1. [Requirements](#requirements)
2. [Reduced Motion Implementation](#reduced-motion-implementation)
3. [Animation Guidelines](#animation-guidelines)
4. [Component Compliance](#component-compliance)
5. [Testing](#testing)
6. [Common Patterns](#common-patterns)

---

## Requirements

### WCAG 2.2 Success Criteria

This site must meet:

#### 2.3.3 Animation from Interactions - Level AAA (Adopted as AA for this site)
- Motion animation triggered by user interaction can be **disabled**
- Unless the animation is **essential** to functionality
- Respects `prefers-reduced-motion` media query

#### 2.2.2 Pause, Stop, Hide - Level A
- Moving, blinking, scrolling content that:
  - Starts **automatically**
  - Lasts **more than 5 seconds**
  - Presented in **parallel with other content**
- Must have a mechanism to **pause, stop, or hide** it

### Our Policy

✅ **Respect `prefers-reduced-motion: reduce`** for ALL animations
✅ **No auto-playing motion** without user control
✅ **Disable transitions/animations** when user preference is set
✅ **Essential motion only** when absolutely necessary

**What this means:**
- Users with vestibular disorders won't experience nausea
- Users with attention disorders can focus without distraction
- Users on slow connections get faster page loads
- All users have control over their experience

---

## Reduced Motion Implementation

### Global Implementation

Applied automatically via `globals.css`:

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

**What this does:**
- ✅ Disables all CSS animations
- ✅ Disables all CSS transitions
- ✅ Disables smooth scrolling
- ✅ Applies to all elements and pseudo-elements
- ✅ Uses `!important` to override component-specific styles

**Why 0.01ms and not 0s?**
- Some browsers/libraries check for `duration === 0` and ignore it
- `0.01ms` is effectively instant but doesn't trigger that check
- Ensures animations still "complete" for JS listeners

### When Reduced Motion is Active

**These animations are DISABLED:**
- Hover transitions (opacity, transform, etc.)
- Page load animations (fade-in, slide-in)
- Scroll-triggered animations
- Auto-playing carousels
- Parallax effects
- Infinite spin/pulse animations
- Smooth scrolling

**These are PRESERVED:**
- Focus ring appearance (accessibility-critical)
- Loading spinners (user-initiated, essential)
- Visibility toggles (show/hide, no motion)
- State changes (color changes without transitions)

---

## Animation Guidelines

### Safe Animations (Always Allowed)

These animations are acceptable even with motion:

#### 1. Opacity Fades (Subtle)
```css
.element {
  transition: opacity var(--duration-normal) var(--ease-material);
}

.element:hover {
  opacity: 0.8;
}
```

**Why it's safe:**
- No spatial movement
- Subtle change
- Short duration (0.3s)

#### 2. Color Transitions
```css
.button {
  transition: background-color var(--duration-normal) var(--ease-material);
}

.button:hover {
  background-color: var(--color-primary-hover);
}
```

**Why it's safe:**
- No movement
- Visual feedback only
- Essential for interaction

#### 3. Scale Transforms (Minimal)
```css
.button {
  transition: transform var(--duration-fast) var(--ease-material);
}

.button:active {
  transform: scale(0.98);  /* Max 2% change */
}
```

**Why it's safe:**
- Minimal movement (< 5%)
- Very short duration (0.15s)
- User-initiated (active state)

### Risky Animations (Use with Caution)

These may cause issues for some users:

#### 1. Transform Translations
```css
/* ⚠️ Can cause vestibular issues */
.card {
  transition: transform var(--duration-normal) var(--ease-material);
}

.card:hover {
  transform: translateY(-8px);  /* Large movement */
}
```

**Mitigation:**
```css
/* ✅ Respects reduced motion */
.card {
  transition: transform var(--duration-normal) var(--ease-material);
}

@media (prefers-reduced-motion: reduce) {
  .card {
    transition: none;
  }

  .card:hover {
    transform: none;  /* Disable movement */
    box-shadow: var(--elevation-2);  /* Visual feedback instead */
  }
}
```

#### 2. Scroll-Triggered Animations
```css
/* ⚠️ Auto-triggering can be disorienting */
.animate-on-scroll {
  opacity: 0;
  transform: translateY(50px);
  transition: all var(--duration-slower) var(--ease-material);
}

.animate-on-scroll.in-view {
  opacity: 1;
  transform: translateY(0);
}
```

**Mitigation:**
```css
/* ✅ Skip animation if reduced motion */
@media (prefers-reduced-motion: reduce) {
  .animate-on-scroll {
    opacity: 1 !important;
    transform: none !important;
    transition: none !important;
  }
}
```

#### 3. Parallax Scrolling
```css
/* ❌ AVOID - causes motion sickness */
.parallax {
  transform: translateY(calc(var(--scroll-position) * 0.5));
}
```

**Better alternative:**
```css
/* ✅ Fixed background instead */
.hero {
  background-attachment: fixed;
}

@media (prefers-reduced-motion: reduce) {
  .hero {
    background-attachment: scroll;  /* Disable parallax */
  }
}
```

### Dangerous Animations (Avoid Entirely)

These animations should **never** be used:

#### ❌ Infinite Rotations
```css
/* ❌ NEVER DO THIS */
.spinner {
  animation: spin 2s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
```

**Why:** Induces nausea, can't be paused

**Exception:** Loading spinners (user-initiated, essential)
```css
/* ✅ ACCEPTABLE - Essential feedback */
.loading-spinner {
  animation: spin 1s linear infinite;
}

@media (prefers-reduced-motion: reduce) {
  .loading-spinner {
    /* Use static "loading..." text instead */
    animation: none;
  }
  .loading-spinner::after {
    content: "Loading...";
  }
}
```

#### ❌ Auto-Playing Carousels
```css
/* ❌ NEVER AUTO-PLAY */
.carousel {
  animation: auto-slide 20s ease-in-out infinite;
}
```

**Why:** Violates WCAG 2.2.2, distracting, can't be controlled

**Better:**
```css
/* ✅ User-controlled only */
.carousel-next-button:focus,
.carousel-next-button:active {
  /* User clicks to advance */
}
```

#### ❌ Flashing/Blinking
```css
/* ❌ NEVER DO THIS - SEIZURE RISK */
.blink {
  animation: flash 0.5s infinite;
}

@keyframes flash {
  50% { opacity: 0; }
}
```

**Why:** Violates WCAG 2.3.1 (Three Flashes), seizure risk

---

## Component Compliance

### Current Components Audit

| Component | Motion Type | Complies with Reduced Motion | Notes |
|-----------|------------|------------------------------|-------|
| **Hero** | Background image overlay | ✅ | No auto-animation |
| **Navbar** | Sticky positioning | ✅ | Position change only, no transition |
| **Alternating Blocks** | None | ✅ | Static layout |
| **Love Stories Gallery** | Modal transitions | ⚠️ | Check modal open/close |
| **History Carousel** | Scroll-triggered fade | ⚠️ | Needs reduced-motion check |
| **Testimonials** | Rotate quotes (manual) | ✅ | User-controlled |
| **Schedule Form** | Form validation feedback | ✅ | Instant feedback |
| **Map** | Interactive map | ✅ | User-controlled zoom/pan |
| **FAQ Accordion** | Expand/collapse | ⚠️ | Check transition duration |
| **Footer** | None | ✅ | Static |

**Legend:**
- ✅ Fully compliant
- ⚠️ Needs verification/mitigation
- ❌ Violates policy (must fix)

### Component Guidelines

#### Carousels / Galleries

**Requirements:**
- ❌ **No auto-advance** (violates 2.2.2)
- ✅ Manual controls only (prev/next buttons)
- ✅ Pause button if auto-advance is essential
- ✅ Respect reduced motion for slide transitions

**Example:**
```javascript
// History Carousel
const carousel = {
  autoPlay: false,  // ✅ Never auto-play

  nextSlide() {
    // User-initiated only
    if (this.canAnimate()) {
      this.animateSlide();
    } else {
      this.jumpToSlide();  // Instant for reduced motion
    }
  },

  canAnimate() {
    return !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }
};
```

#### Modals / Dialogs

**Requirements:**
- ✅ Fade-in acceptable (subtle, short)
- ✅ Must respect reduced motion
- ✅ Instant show/hide if user prefers

**Example:**
```css
.modal {
  opacity: 0;
  transition: opacity var(--duration-normal) var(--ease-material);
}

.modal.open {
  opacity: 1;
}

@media (prefers-reduced-motion: reduce) {
  .modal {
    transition: none;
  }

  .modal.open {
    opacity: 1;  /* Instant */
  }
}
```

#### Accordions / Expandable Sections

**Requirements:**
- ✅ Height transitions acceptable (short duration)
- ✅ Must not auto-expand on scroll
- ✅ User-controlled only

**Example:**
```css
.accordion-content {
  max-height: 0;
  overflow: hidden;
  transition: max-height var(--duration-slow) var(--ease-material);
}

.accordion-content.expanded {
  max-height: 1000px;
}

@media (prefers-reduced-motion: reduce) {
  .accordion-content {
    transition: none;
  }

  .accordion-content.expanded {
    max-height: none;  /* Instant expand */
  }
}
```

#### Hover Effects

**Requirements:**
- ✅ Subtle transitions acceptable
- ✅ Max 0.3s duration
- ✅ Color/opacity changes preferred over movement

**Example:**
```css
.card {
  transition:
    transform var(--duration-normal) var(--ease-material),
    box-shadow var(--duration-normal) var(--ease-material);
}

.card:hover {
  transform: translateY(-8px);
  box-shadow: var(--elevation-3);
}

@media (prefers-reduced-motion: reduce) {
  .card {
    transition: box-shadow var(--duration-fast) var(--ease-material);
  }

  .card:hover {
    transform: none;  /* No movement */
    box-shadow: var(--elevation-2);  /* Subtle shadow only */
  }
}
```

---

## Testing

### Manual Testing

#### Enable Reduced Motion

**macOS:**
1. System Preferences → Accessibility
2. Display → Reduce motion ✅

**Windows 10/11:**
1. Settings → Ease of Access
2. Display → Show animations ❌ (turn OFF)

**iOS:**
1. Settings → Accessibility
2. Motion → Reduce Motion ✅

**Android:**
1. Settings → Accessibility
2. Remove animations ✅

#### Browser DevTools

**Chrome/Edge:**
1. DevTools (F12) → Command Menu (Ctrl+Shift+P)
2. Type "Emulate CSS prefers-reduced-motion"
3. Select "reduce"

**Firefox:**
1. DevTools → Responsive Design Mode
2. Settings → prefers-reduced-motion: reduce

#### Testing Checklist

- [ ] Enable reduced motion in OS
- [ ] Reload page
- [ ] Verify NO animations on:
  - [ ] Page load
  - [ ] Scroll
  - [ ] Hover states
  - [ ] Button clicks
  - [ ] Modal open/close
  - [ ] Carousel transitions
  - [ ] Accordion expand/collapse

- [ ] Verify functionality still works:
  - [ ] Modals open/close (instant)
  - [ ] Accordions expand/collapse (instant)
  - [ ] Carousels advance (instant)
  - [ ] Hover states visible (color change)
  - [ ] Focus states visible

### Automated Testing

**JavaScript Detection:**
```javascript
// Detect user preference
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (prefersReducedMotion) {
  console.log('✅ User prefers reduced motion');
  // Disable JavaScript-driven animations
  disableAnimations();
} else {
  console.log('✅ Animations enabled');
}

// Listen for changes
window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', (e) => {
  if (e.matches) {
    disableAnimations();
  } else {
    enableAnimations();
  }
});
```

**Pa11y-CI:**
```bash
# Run accessibility tests
npm run ci:a11y

# Checks for:
# - Auto-playing content without controls
# - Infinite animations
# - Missing reduced-motion handling
```

---

## Common Patterns

### Pattern 1: Fade-In on Load

**❌ Bad (auto-triggers):**
```css
.element {
  animation: fadeIn 1s ease-in;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
```

**✅ Good (respects preference):**
```css
.element {
  opacity: 1;  /* Default: visible */
}

@media (prefers-reduced-motion: no-preference) {
  .element {
    animation: fadeIn 0.5s ease-in;
  }
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
```

### Pattern 2: Scroll-Triggered Animations

**❌ Bad (triggers automatically):**
```javascript
// Triggers on scroll
window.addEventListener('scroll', () => {
  if (isInViewport(element)) {
    element.classList.add('animate');
  }
});
```

**✅ Good (checks preference first):**
```javascript
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

window.addEventListener('scroll', () => {
  if (isInViewport(element) && !prefersReducedMotion) {
    element.classList.add('animate');
  } else if (isInViewport(element)) {
    element.classList.add('visible');  // No animation class
  }
});
```

### Pattern 3: Loading Spinners

**✅ Essential animation (with fallback):**
```css
.spinner {
  /* Visual spinner */
  width: 40px;
  height: 40px;
  border: 4px solid var(--color-border-light);
  border-top-color: var(--color-primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@media (prefers-reduced-motion: reduce) {
  .spinner {
    /* Hide spinner */
    display: none;
  }

  .spinner::after {
    /* Show text instead */
    content: "Loading...";
    display: block;
  }
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
```

---

## Resources

- [WCAG 2.2 SC 2.3.3 Animation from Interactions](https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html)
- [WCAG 2.2 SC 2.2.2 Pause, Stop, Hide](https://www.w3.org/WAI/WCAG22/Understanding/pause-stop-hide.html)
- [MDN: prefers-reduced-motion](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion)
- [Vestibular Disorders Association](https://vestibular.org/article/what-is-vestibular/about-vestibular-disorders/)
- [An Introduction to the Reduced Motion Media Query](https://css-tricks.com/introduction-reduced-motion-media-query/)

---

**Last Audit**: 2025-01-25
**Next Audit**: On any new animation implementation
**Contact**: Design System Team
