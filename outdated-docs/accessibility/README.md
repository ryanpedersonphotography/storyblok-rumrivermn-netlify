# Accessibility Documentation
**Rum River Barn - WCAG 2.2 Level AA Compliance**

> **Our Commitment**: Every user, regardless of ability, deserves a beautiful, functional experience.

---

## Overview

This directory contains comprehensive accessibility policies and guidelines for the Rum River Barn website. All policies enforce **WCAG 2.2 Level AA** as the minimum standard, with AAA as the aspirational target where feasible.

---

## Documentation Index

### 🎨 [Color Contrast Policy](./CONTRAST.md)
**Ensuring visible, readable text for all users**

Covers:
- WCAG contrast requirements (4.5:1 text, 3:1 UI)
- Complete color pairing matrix
- Safe and dangerous color combinations
- Contrast testing tools and methodology
- Remediation strategies

**Key Takeaway:** All text must meet 4.5:1 contrast ratio minimum (3:1 for large text/UI).

---

### ⌨️ [Focus Management Policy](./FOCUS.md)
**Keyboard navigation and focus indicators**

Covers:
- Focus indicator standards (3px outline, 3:1 contrast)
- `:focus-visible` implementation
- Component-specific focus patterns
- Modal focus trapping
- Skip links and navigation shortcuts

**Key Takeaway:** All interactive elements have a visible, high-contrast focus ring.

---

### 🎬 [Motion & Animation Policy](./MOTION.md)
**Respecting user motion preferences**

Covers:
- `prefers-reduced-motion` implementation
- Safe vs. risky animations
- Component compliance guidelines
- Auto-playing content policies
- Animation testing procedures

**Key Takeaway:** All animations respect `prefers-reduced-motion: reduce`.

---

## Quick Start

### For Developers

**Before creating any new component:**

1. ✅ **Read** [CONTRAST.md](./CONTRAST.md) - Check your text/background pairs
2. ✅ **Read** [FOCUS.md](./FOCUS.md) - Ensure keyboard accessibility
3. ✅ **Read** [MOTION.md](./MOTION.md) - Handle animations correctly

### For Designers

**Before creating mockups:**

1. ✅ Check contrast ratios using [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
2. ✅ Design focus states for all interactive elements
3. ✅ Consider reduced-motion alternatives for animations

### For QA

**Every release must pass:**

1. ✅ Keyboard-only navigation test
2. ✅ Screen reader test (VoiceOver/NVDA)
3. ✅ Reduced-motion test
4. ✅ Automated pa11y-ci checks

---

## Compliance Status

### Current Compliance Level

| WCAG Criterion | Level | Status | Notes |
|----------------|-------|--------|-------|
| **1.4.3 Contrast (Minimum)** | AA | ✅ | All text ≥ 4.5:1, UI ≥ 3:1 |
| **1.4.6 Contrast (Enhanced)** | AAA | 🎯 | Most text ≥ 7:1 (aspirational) |
| **1.4.11 Non-text Contrast** | AA | ✅ | Focus rings ≥ 3:1 |
| **2.4.7 Focus Visible** | AA | ✅ | All interactive elements |
| **2.4.11 Focus Not Obscured** | AA | ✅ | No overlays hide focus |
| **2.3.3 Animation from Interactions** | AAA* | ✅ | Adopted as AA for this site |
| **2.2.2 Pause, Stop, Hide** | A | ✅ | No auto-playing content |

**Legend:**
- ✅ Fully compliant
- 🎯 Aspirational (exceeds requirement)
- ⚠️ In progress
- ❌ Not compliant (must fix)

### Audit History

| Date | Auditor | Level | Issues Found | Issues Fixed |
|------|---------|-------|--------------|--------------|
| 2025-01-25 | Design System Team | AA | 0 | N/A |

---

## Testing Guidelines

### Manual Testing Checklist

Before every release, manually test:

#### Keyboard Navigation
- [ ] Tab through entire page (logical order)
- [ ] All interactive elements are focusable
- [ ] All focusable elements are interactive
- [ ] Focus ring is visible on all backgrounds
- [ ] Skip link works
- [ ] No keyboard traps (except intentional modals)
- [ ] Escape closes modals/dropdowns

#### Screen Reader
- [ ] All images have meaningful alt text
- [ ] Form labels are properly associated
- [ ] Headings follow logical hierarchy (h1→h2→h3)
- [ ] Landmarks are properly defined (nav, main, footer)
- [ ] Dynamic content is announced
- [ ] Error messages are announced

#### Reduced Motion
- [ ] Enable `prefers-reduced-motion: reduce`
- [ ] No animations play on page load
- [ ] No animations trigger on scroll
- [ ] Hover states work without transitions
- [ ] Modals open/close instantly
- [ ] Carousels don't auto-advance

#### Zoom & Resize
- [ ] Page works at 200% zoom
- [ ] Text reflows properly at 400% zoom
- [ ] No horizontal scrolling (except data tables)
- [ ] Mobile viewport works (320px minimum)

### Automated Testing

**Run before every commit:**

```bash
# Accessibility tests (pa11y-ci)
npm run ci:a11y

# Lighthouse accessibility audit
npm run lighthouse

# ESLint accessibility rules
npm run lint
```

**What's checked automatically:**
- Color contrast violations
- Missing alt text
- Form label associations
- Heading hierarchy
- ARIA usage
- Focus management

---

## Common Patterns

### Safe Color Combinations

Always safe for text:

```css
/* AAA-compliant (7:1+) */
color: var(--color-text-dark);        /* #2C2416 on cream pearl: 13.8:1 */
color: var(--color-text-primary);     /* #6B4E3D on cream pearl: 6.9:1 */
color: var(--color-white);            /* on deep brown: 12.3:1 */
```

### Focus Indicator

Use globally (already applied):

```css
:focus-visible {
  outline: 3px solid var(--focus-ring);
  outline-offset: 3px;
}
```

### Reduced Motion

Wrap animations:

```css
.element {
  transition: transform 0.3s ease;
}

@media (prefers-reduced-motion: reduce) {
  .element {
    transition: none;
  }
}
```

---

## Resources

### WCAG 2.2 Official Documentation
- [Understanding WCAG 2.2](https://www.w3.org/WAI/WCAG22/Understanding/)
- [How to Meet WCAG 2.2](https://www.w3.org/WAI/WCAG22/quickref/)
- [WCAG 2.2 Success Criteria](https://www.w3.org/TR/WCAG22/)

### Testing Tools
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [WAVE Browser Extension](https://wave.webaim.org/extension/)
- [axe DevTools](https://www.deque.com/axe/devtools/)
- [Pa11y-CI](https://github.com/pa11y/pa11y-ci)
- [Lighthouse](https://developers.google.com/web/tools/lighthouse)

### Learning Resources
- [WebAIM: Web Accessibility In Mind](https://webaim.org/)
- [A11y Project](https://www.a11yproject.com/)
- [Inclusive Components](https://inclusive-components.design/)
- [ARIA Authoring Practices Guide](https://www.w3.org/WAI/ARIA/apg/)

### Browser Extensions
- **Chrome/Edge:** axe DevTools, WAVE, Lighthouse
- **Firefox:** WAVE, Accessibility Inspector
- **Safari:** Accessibility Inspector (built-in)

### Screen Readers
- **macOS:** VoiceOver (built-in, Cmd+F5)
- **iOS:** VoiceOver (Settings → Accessibility)
- **Windows:** NVDA (free), JAWS (paid)
- **Android:** TalkBack (built-in)

---

## Support & Questions

### For Developers

**Got an accessibility question?**
1. Check this documentation first
2. Search [WebAIM articles](https://webaim.org/articles/)
3. Ask in #accessibility Slack channel
4. Contact Design System Team

### For Designers

**Need help with accessible design?**
1. Review [CONTRAST.md](./CONTRAST.md) for color guidance
2. Check [Inclusive Design Principles](https://inclusivedesignprinciples.org/)
3. Use [Accessible Colors tool](https://accessible-colors.com/)
4. Contact Design System Team

### For QA

**Found an accessibility issue?**
1. Document the issue (screenshots, steps to reproduce)
2. Reference relevant WCAG criteria
3. Suggest remediation if possible
4. File GitHub issue with `[A11Y]` tag

---

## Continuous Improvement

### Reporting Issues

If you find an accessibility issue:

1. **File a GitHub Issue** with:
   - `[A11Y]` tag
   - WCAG criterion violated
   - Steps to reproduce
   - Affected user groups
   - Suggested fix (if known)

2. **Severity Levels:**
   - 🔴 **Critical**: Blocks core functionality (fix immediately)
   - 🟠 **High**: Degrades experience significantly (fix within sprint)
   - 🟡 **Medium**: Minor issue (fix in backlog)
   - 🟢 **Low**: Enhancement opportunity (nice to have)

### Monthly Audits

**First Monday of every month:**
- Run full accessibility audit
- Review any new WCAG updates
- Check for new tools/techniques
- Update documentation as needed

---

## Version History

**v1.0.0** - 2025-01-25
- Initial accessibility documentation
- CONTRAST.md: Complete color contrast policy
- FOCUS.md: Keyboard navigation and focus management
- MOTION.md: Motion and animation accessibility
- Global accessibility styles implemented

---

**Maintained by**: Design System Team
**Last Updated**: 2025-01-25
**Next Audit**: 2025-02-01

---

## Our Promise

> "Accessibility is not a feature, it's a baseline. Every user deserves to plan their dream wedding at Rum River Barn, regardless of how they access the web."

— Rum River Barn Team
