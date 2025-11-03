# 🎨 Design Token Migration Plan
**Single Source of Truth Implementation**

## 📋 Overview

**Objective**: Convert all 13 sections from hard-coded CSS values to a token-based design system using design-tokens.css as the single source of truth.

**Current State**: Only Pricing section (1 of 14) uses design tokens
**Target State**: 100% token adoption across all sections
**Time Estimate**: 11 hours total (can be done in phases)

---

## 🎯 Goals

1. ✅ Create complete design token system in design-tokens.css
2. ✅ Migrate all sections to use design tokens exclusively
3. ✅ Maintain current visual design (zero breaking changes)
4. ✅ Achieve perfect spacing/typography consistency
5. ✅ Enable easy global design changes

---

## 📦 Implementation Phases

### **Phase 1: Foundation** (1.5 hours)

**Objective**: Enhance design tokens and create shared patterns

#### **Task 1.1**: Enhance design-tokens.css
- [ ] Add section spacing tokens (desktop, tablet, mobile)
- [ ] Add component spacing tokens (headers, cards, forms)
- [ ] Add any missing typography variants
- [ ] Test that all tokens are accessible

**Files**: `src/styles/hotfix/design-tokens.css`

#### **Task 1.2**: Create common-patterns.css
- [ ] Create shared section header pattern
- [ ] Create shared button patterns
- [ ] Create shared card patterns
- [ ] Import in layout.js

**Files**:
- `src/styles/hotfix/common-patterns.css` (new)
- `src/app/layout.js` (update)

#### **Deliverable**: Complete token system ready for migration

---

### **Phase 2: Simple Sections** (2 hours)

**Objective**: Migrate straightforward sections to build confidence

#### Sections to Migrate:
1. Footer (text-heavy, simple)
2. Brand Social Proof (small section)
3. FAQ Accordion (recently created)
4. Testimonials (card layout)

#### Per-Section Checklist:
- [ ] Convert font-family to `var(--font-*)`
- [ ] Convert font-size to `var(--font-size-*)`
- [ ] Convert font-weight to `var(--font-weight-*)`
- [ ] Convert line-height to `var(--line-height-*)`
- [ ] Convert letter-spacing to `var(--letter-spacing-*)`
- [ ] Convert colors to `var(--color-*)`
- [ ] Convert spacing to `var(--padding-*)`, `var(--margin-*)`
- [ ] Convert shadows to `var(--shadow-*)`
- [ ] Convert border-radius to `var(--radius-*)`
- [ ] Test visual output matches original

**Files**:
- `src/styles/hotfix/footer-styles.css`
- `src/styles/hotfix/brand-social-proof-styles.css`
- `src/styles/hotfix/faq-accordion-styles.css`
- `src/styles/hotfix/testimonials-styles.css`

#### **Deliverable**: 4 sections fully migrated, patterns established

---

### **Phase 3: Moderate Sections** (2 hours)

**Objective**: Migrate medium-complexity sections

#### Sections to Migrate:
5. Map Section (two-column layout)
6. Spaces (tab interface)
7. Rum River Experience (features grid)
8. Love Stories Gallery (image grid)

#### Additional Considerations:
- Interactive states (hover, active)
- Grid layouts
- Image handling

**Files**:
- `src/styles/hotfix/map-section-styles.css`
- `src/styles/hotfix/spaces-styles.css`
- `src/styles/hotfix/rum-river-experience-styles.css`
- `src/styles/hotfix/love-stories-gallery-styles.css`

#### **Deliverable**: 8 total sections migrated

---

### **Phase 4: Complex Sections** (2 hours)

**Objective**: Migrate sections with advanced features

#### Sections to Migrate:
9. History Carousel (Embla integration, animations)
10. Alternating Blocks (full-width, gradients)
11. Schedule Form (form elements, validation states)

#### Additional Considerations:
- Animation timing functions
- Complex gradients
- Form focus states
- Carousel mechanics

**Files**:
- `src/styles/hotfix/history-carousel-styles.css`
- `src/styles/hotfix/alternating-blocks-styles.css`
- `src/styles/hotfix/schedule-form-styles.css`

#### **Deliverable**: 11 total sections migrated

---

### **Phase 5: Critical Sections** (2 hours)

**Objective**: Migrate the most complex, high-traffic sections

#### Sections to Migrate:
12. Hero (complex animations, scroll effects)
13. Navbar (state management, scroll behavior, mobile menu)

#### Additional Considerations:
- Scroll-triggered state changes
- Mobile menu transitions
- Fixed positioning
- Z-index management
- Critical path CSS

**Files**:
- `src/styles/hotfix/hero-styles.css`
- `src/styles/hotfix/navbar-styles.css`

#### **Deliverable**: All 13 sections migrated

---

### **Phase 6: Quality Assurance** (1.5 hours)

**Objective**: Ensure consistency and quality

#### **Task 6.1**: Visual Consistency Review
- [ ] Compare before/after screenshots of all sections
- [ ] Test responsive behavior (desktop, tablet, mobile)
- [ ] Verify spacing consistency across sections
- [ ] Check color consistency
- [ ] Test all interactive states

#### **Task 6.2**: Performance Check
- [ ] Measure CSS file size reduction
- [ ] Verify no CSS specificity issues
- [ ] Check browser compatibility
- [ ] Test load times

#### **Task 6.3**: Documentation
- [ ] Create design-system.md usage guide
- [ ] Document all tokens with examples
- [ ] Create quick reference guide
- [ ] Add migration guide for future sections

**Files**:
- `DESIGN-SYSTEM.md` (new)
- `TOKEN-REFERENCE.md` (new)

#### **Deliverable**: Fully tested, documented system

---

## 🚦 Execution Strategy

### **Recommended Approach**: Phased Rollout

Each phase gets its own feature branch:

```bash
# Phase 1
git checkout -b feat/design-tokens-foundation
# ... complete phase 1 work ...
git commit -m "feat: establish design token foundation"

# Phase 2
git checkout -b feat/tokens-simple-sections
# ... complete phase 2 work ...
git commit -m "feat: migrate simple sections to design tokens"

# And so on...
```

### **Alternative Approach**: All at Once

Single feature branch for entire migration:

```bash
git checkout -b feat/complete-design-token-migration
# ... complete all phases ...
git commit -m "feat: implement complete design token system"
```

---

## ✅ Success Criteria

| Metric | Before | After | Target |
|--------|--------|-------|--------|
| Token Adoption | 6% | 100% | ✅ 100% |
| Visual Consistency | ~75% | 100% | ✅ 100% |
| Spacing Variants | 18 different values | 5 standard values | ✅ Standardized |
| Line Height Variants | 6 different values | 4 standard values | ✅ Standardized |
| CSS Maintainability | 13 files to change | 1 file to change | ✅ Centralized |
| Development Time (new sections) | 4 hours | 2 hours | ✅ 50% faster |

---

## 📊 Risk Assessment

| Risk | Impact | Mitigation |
|------|--------|------------|
| Visual regressions | Medium | Screenshot testing before/after |
| Token naming conflicts | Low | Use existing well-defined tokens |
| Responsive breakpoints | Medium | Test all breakpoints thoroughly |
| Browser compatibility | Low | Use standard CSS custom properties |
| Developer adoption | Low | Clear documentation + examples |

---

## 🎓 Learning from Pricing Section

The Pricing section already demonstrates the pattern:

```css
/* ✅ GOOD EXAMPLE from pricing-styles.css */
.pricing-section .script-accent {
  font-family: var(--font-script);
  font-size: var(--font-size-2xl);
  color: var(--color-dusty-rose);
  margin-bottom: var(--margin-md);
  font-weight: var(--font-weight-medium);
}
```

**All other sections should follow this exact pattern.**

---

## 📁 File Change Summary

| Phase | Files Changed | Lines Changed (Est.) |
|-------|---------------|---------------------|
| Phase 1 | 2 files | +150 lines |
| Phase 2 | 4 files | ~800 lines |
| Phase 3 | 4 files | ~900 lines |
| Phase 4 | 3 files | ~700 lines |
| Phase 5 | 2 files | ~600 lines |
| Phase 6 | 2 files | +100 lines |
| **Total** | **17 files** | **~3,250 lines** |

---

## 🚀 Ready to Execute

**Next Steps:**
1. Review this plan
2. Choose execution strategy (phased vs. all-at-once)
3. Start with Phase 1: Foundation
4. Progress through phases systematically
5. Test thoroughly at each phase
6. Document as you go

---

**Status**: ⏸️ Awaiting approval to begin implementation
**Estimated Completion**: 11 hours (can be split across multiple sessions)
**Risk Level**: Low (non-breaking visual changes)
**Benefit Level**: High (massive maintainability improvement)
