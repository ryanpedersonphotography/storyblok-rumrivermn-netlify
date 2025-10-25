# Focus Management Policy
**Keyboard Navigation & Focus Indicators**

> **Status**: 🟢 Active Policy
> **Last Updated**: 2025-01-25
> **WCAG Level**: AA (enforced)

---

## Table of Contents

1. [Requirements](#requirements)
2. [Focus Indicator Standards](#focus-indicator-standards)
3. [Implementation](#implementation)
4. [Component Guidelines](#component-guidelines)
5. [Common Patterns](#common-patterns)
6. [Testing](#testing)
7. [Troubleshooting](#troubleshooting)

---

## Requirements

### WCAG 2.2 Success Criteria

This site must meet:

#### 2.4.7 Focus Visible - Level AA
- **All** interactive elements must have a **visible** focus indicator
- Focus indicator must be **programmatically determined**
- Minimum **3:1 contrast** against adjacent colors (SC 1.4.11)

#### 2.4.11 Focus Not Obscured (Minimum) - Level AA (NEW in 2.2)
- Focused element must not be fully hidden by other content
- At least part of the focus indicator must be visible

#### 2.4.13 Focus Appearance - Level AAA (Aspirational)
- Focus indicator contrast: **3:1 minimum**
- Focus indicator size: **at least 2 CSS pixels** thick
- Focus indicator encloses the focused element or is at least as large as a 2px border

### Our Policy

✅ **All interactive elements have visible focus**
✅ **3:1 contrast minimum** (meets AA)
✅ **3px outline with 3px offset** (exceeds AAA)
✅ **Warm walnut color** (#6B4E3D) for consistency

---

## Focus Indicator Standards

### Global Focus Style

All interactive elements use this baseline style (defined in `globals.css`):

```css
:focus-visible {
  outline: 3px solid #6B4E3D;  /* var(--focus-ring) */
  outline-offset: 3px;
}
```

**Why this works:**
- ✅ **3px thickness** (exceeds WCAG AAA 2px minimum)
- ✅ **3px offset** (prevents cutting into element)
- ✅ **Warm walnut** visible on all backgrounds (6.9:1 on cream pearl)
- ✅ **Solid outline** (not dotted/dashed for clarity)

### Focus Ring Tokens

Use these tokens for consistency:

```css
--focus-ring: #6B4E3D;           /* Color */
--focus-ring-width: 3px;          /* Thickness */
--focus-ring-offset: 3px;         /* Spacing */
--focus-ring-style: solid;        /* Style */
```

### Contrast Requirements

| Surface | Focus Ring | Contrast | Pass |
|---------|-----------|----------|------|
| Cream Pearl `#FFFCF8` | Warm Walnut `#6B4E3D` | **6.9:1** | ✅ AAA |
| White `#FFFFFF` | Warm Walnut `#6B4E3D` | **7.2:1** | ✅ AAA |
| Blush Pink `#F4E4E1` | Warm Walnut `#6B4E3D` | **6.1:1** | ✅ AAA |
| Warm Cream `#FBF8F4` | Warm Walnut `#6B4E3D` | **6.6:1** | ✅ AAA |

All surfaces exceed 3:1 requirement ✅

---

## Implementation

### Browser Support

#### :focus-visible vs :focus

**✅ Use `:focus-visible`** (modern, user-friendly)
- Shows focus **only** when needed (keyboard, not mouse clicks)
- Supported in all modern browsers (Chrome 86+, Firefox 85+, Safari 15.4+)

**❌ Don't use `:focus` alone** (old, intrusive)
- Shows focus for **all** interactions (including mouse clicks)
- Confuses mouse users

### Global Implementation

Applied automatically via `globals.css`:

```css
/* Modern browsers with :where() support */
:where(a, button, [role="button"], input, select, textarea, [tabindex]:not([tabindex="-1"])):focus-visible {
  outline: var(--focus-ring-width) var(--focus-ring-style) var(--focus-ring);
  outline-offset: var(--focus-ring-offset);
}

/* Remove :focus to avoid double outline */
:where(a, button, [role="button"], input, select, textarea):focus {
  outline: none;
}

/* Safari fallback (no :where() support) */
@supports not selector(:where(a)) {
  a:focus-visible,
  button:focus-visible,
  /* ... all interactive elements ... */
  {
    outline: 3px solid var(--focus-ring);
    outline-offset: 3px;
  }
}
```

**What this covers:**
- Links (`<a>`)
- Buttons (`<button>`)
- Custom buttons (`[role="button"]`)
- Form inputs (`<input>`, `<select>`, `<textarea>`)
- Focusable elements (`[tabindex]`, except `-1`)

### Component-Specific Overrides

Only override if you have a **specific design need**:

```css
/* Example: Buttons with custom focus */
.custom-button:focus-visible {
  outline: var(--focus-ring-width) var(--focus-ring-style) var(--focus-ring);
  outline-offset: var(--focus-ring-offset);
  /* Add extra visual feedback */
  box-shadow: 0 0 0 6px rgba(107, 78, 61, 0.15);
}
```

**Rules for overrides:**
1. Must meet 3:1 contrast ✅
2. Must be clearly visible ✅
3. Must use consistent thickness (3px) ✅
4. Must use `--focus-ring` token ✅

---

## Component Guidelines

### Buttons

**Standard Button:**
```css
.button {
  /* Normal state */
  background: var(--color-primary);
  color: var(--color-white);
  border: 2px solid transparent;
  padding: 0.875rem 2.5rem;
  border-radius: var(--radius-full);

  /* Focus automatically handled by global styles */
}

/* Global focus applies automatically */
.button:focus-visible {
  outline: 3px solid var(--focus-ring);
  outline-offset: 3px;
}
```

**✅ Good:** Global styles handle focus automatically

**❌ Bad:**
```css
/* Don't remove outline without replacement */
.button:focus {
  outline: none;  /* ❌ WCAG VIOLATION */
}
```

### Links

**Standard Link:**
```css
.link {
  color: var(--color-text-primary);
  text-decoration: underline;

  /* Focus automatically handled */
}
```

**In Navigation:**
```css
.nav-link {
  color: var(--color-white);
  text-decoration: none;
  padding: 0.5rem 1rem;

  /* Focus automatically handled */
  /* Additional visual feedback on hover */
}

.nav-link:hover {
  background: var(--state-hover);
}

.nav-link:focus-visible {
  /* Global outline + background */
  background: var(--state-hover);
}
```

### Form Inputs

**Text Inputs:**
```css
.input {
  border: 2px solid var(--color-border-light);
  padding: 0.875rem 1rem;
  border-radius: var(--radius-lg);

  /* Focus automatically handled by global styles */
}

/* Optional: Additional visual feedback */
.input:focus-visible {
  /* Global outline still applies */
  border-color: var(--focus-ring);
}
```

**Checkboxes & Radios:**
```css
/* Custom checkbox (native hidden) */
.checkbox-custom {
  width: 24px;
  height: 24px;
  border: 2px solid var(--color-border-medium);
  border-radius: var(--radius-sm);
}

/* Focus on wrapper or label */
.checkbox-wrapper:focus-within .checkbox-custom {
  outline: 3px solid var(--focus-ring);
  outline-offset: 3px;
}
```

### Custom Interactive Elements

**Card Links:**
```css
.card-link {
  /* Entire card is clickable */
  display: block;
  text-decoration: none;
  border-radius: var(--radius-2xl);
  transition: all var(--duration-normal) var(--ease-material);
}

.card-link:focus-visible {
  /* Global outline + lift effect */
  transform: translateY(-8px);
  box-shadow: var(--elevation-3);
}
```

**Custom Dropdowns:**
```css
.dropdown-trigger {
  /* Button that opens menu */
  cursor: pointer;
}

.dropdown-trigger:focus-visible {
  /* Global focus + show dropdown */
  outline: 3px solid var(--focus-ring);
  outline-offset: 3px;
}

.dropdown-trigger[aria-expanded="true"] {
  /* Visual indication dropdown is open */
  background: var(--state-pressed);
}
```

---

## Common Patterns

### Skip Links

**Required for keyboard navigation:**

```html
<!-- First focusable element in <body> -->
<a href="#main-content" class="skip-link">
  Skip to main content
</a>
```

```css
.skip-link {
  /* Hidden until focused */
  position: absolute;
  top: -100px;
  left: 0;
  z-index: var(--z-tooltip);

  background: var(--color-primary);
  color: var(--color-white);
  padding: 1rem 2rem;
  text-decoration: none;
  border-radius: var(--radius-lg);
}

.skip-link:focus {
  /* Show on keyboard focus */
  top: 1rem;
  left: 1rem;
}
```

### Modal Dialogs

**Focus trap pattern:**

```javascript
// When modal opens
const modal = document.querySelector('[role="dialog"]');
const focusableElements = modal.querySelectorAll(
  'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
);

const firstFocusable = focusableElements[0];
const lastFocusable = focusableElements[focusableElements.length - 1];

// Focus first element
firstFocusable.focus();

// Trap focus inside modal
modal.addEventListener('keydown', (e) => {
  if (e.key === 'Tab') {
    if (e.shiftKey) {
      // Shift + Tab
      if (document.activeElement === firstFocusable) {
        e.preventDefault();
        lastFocusable.focus();
      }
    } else {
      // Tab
      if (document.activeElement === lastFocusable) {
        e.preventDefault();
        firstFocusable.focus();
      }
    }
  }

  // Close on Escape
  if (e.key === 'Escape') {
    closeModal();
  }
});
```

### Focus Management on SPA Navigation

**Announce route changes:**

```javascript
// On route change
function handleRouteChange(newRoute) {
  // Move focus to main heading
  const heading = document.querySelector('h1');
  if (heading) {
    heading.setAttribute('tabindex', '-1');
    heading.focus();
  }

  // Announce to screen readers
  const announcement = document.createElement('div');
  announcement.setAttribute('role', 'status');
  announcement.setAttribute('aria-live', 'polite');
  announcement.textContent = `Navigated to ${newRoute.title}`;
  document.body.appendChild(announcement);

  setTimeout(() => announcement.remove(), 1000);
}
```

---

## Testing

### Manual Testing Checklist

For every interactive element:

- [ ] **Tab through the entire page**
  - All interactive elements receive focus
  - Focus order is logical (top-to-bottom, left-to-right)
  - No focus traps (except intentional modals)

- [ ] **Check focus visibility**
  - Focus ring is clearly visible on all backgrounds
  - Focus ring has 3:1 contrast minimum
  - Focus ring doesn't get cut off by overflow

- [ ] **Test with keyboard only**
  - No mouse/trackpad use
  - All actions can be completed
  - Skip link works

- [ ] **Test focus states**
  - Buttons show focus on Tab
  - Links show focus on Tab
  - Form inputs show focus on Tab
  - Custom elements show focus

- [ ] **Test state combinations**
  - Hover + focus
  - Active + focus
  - Disabled elements can't be focused

### Browser Testing

**Chrome DevTools:**
1. Open DevTools (F12)
2. Switch to "Accessibility" panel
3. Inspect element
4. Check "Focus" section
5. Verify focus ring contrast

**Keyboard Shortcuts:**
- `Tab` - Next focusable element
- `Shift + Tab` - Previous focusable element
- `Enter` - Activate link/button
- `Space` - Activate button, toggle checkbox
- `Arrow keys` - Radio groups, dropdowns

### Automated Testing

**axe DevTools:**
```bash
# Install browser extension
# https://www.deque.com/axe/devtools/

# Run automated scan
# Reports focus issues automatically
```

**Pa11y-CI:**
```bash
# Run in CI
npm run ci:a11y

# Checks for:
# - Missing focus indicators
# - Insufficient focus contrast
# - Focus order issues
```

---

## Troubleshooting

### Issue: Focus ring not visible

**Symptoms:**
- Can tab through page but don't see focus indicator
- Focus ring is too faint

**Diagnosis:**
```javascript
// Check if :focus-visible is supported
const supported = CSS.supports('selector(:focus-visible)');
console.log('focus-visible supported:', supported);

// Check computed styles
const element = document.querySelector('button');
element.focus();
const styles = getComputedStyle(element);
console.log('outline:', styles.outline);
console.log('outline-color:', styles.outlineColor);
```

**Solutions:**
1. Check browser version (need Chrome 86+, Firefox 85+, Safari 15.4+)
2. Verify globals.css is imported before component styles
3. Check for CSS that removes outline without replacement

### Issue: Focus ring cut off

**Symptoms:**
- Focus ring gets clipped by parent overflow

**Solution:**
```css
/* Parent container */
.parent {
  overflow: visible;  /* Don't clip focus */
  padding: 6px;       /* Space for outline + offset */
}

/* OR use box-shadow instead of outline */
.element:focus-visible {
  outline: none;
  box-shadow: 0 0 0 3px var(--focus-ring);
}
```

### Issue: Double focus rings

**Symptoms:**
- See both browser default and custom focus ring

**Solution:**
```css
/* Make sure :focus removes outline */
.element:focus {
  outline: none;
}

.element:focus-visible {
  outline: 3px solid var(--focus-ring);
}
```

### Issue: Focus trapped in modal

**Symptoms:**
- Can't Tab out of modal

**Solution:**
This is **intentional** for modals! But ensure:
- `Escape` key closes modal
- Close button is accessible
- Focus returns to trigger element on close

### Issue: Skip link doesn't work

**Symptoms:**
- Skip link visible but clicking does nothing

**Solution:**
```javascript
// Ensure target has tabindex
const mainContent = document.getElementById('main-content');
mainContent.setAttribute('tabindex', '-1');
mainContent.focus();
```

---

## Resources

- [WCAG 2.2 SC 2.4.7 Focus Visible](https://www.w3.org/WAI/WCAG22/Understanding/focus-visible.html)
- [WCAG 2.2 SC 2.4.11 Focus Not Obscured](https://www.w3.org/WAI/WCAG22/Understanding/focus-not-obscured-minimum.html)
- [WebAIM: Keyboard Accessibility](https://webaim.org/techniques/keyboard/)
- [MDN: :focus-visible](https://developer.mozilla.org/en-US/docs/Web/CSS/:focus-visible)
- [ARIA Authoring Practices Guide](https://www.w3.org/WAI/ARIA/apg/)

---

**Last Audit**: 2025-01-25
**Next Audit**: On any interactive component changes
**Contact**: Design System Team
