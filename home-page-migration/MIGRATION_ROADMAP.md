# Migration Roadmap - Romantic Wedding Barn Theme

## 🔄 UPDATED: Visual Editor-First Approach

> **Important**: This roadmap has been updated to reflect our **Visual Editor-first workflow**. Instead of building static components and wiring to Storyblok later, we now:
> 1. Create Storyblok schema FIRST
> 2. Build components WITH live editing from the start
> 3. Test in Visual Editor IMMEDIATELY
>
> See [VISUAL_EDITOR_WORKFLOW.md](VISUAL_EDITOR_WORKFLOW.md) for complete implementation guide.

## Overview
This roadmap provides a systematic approach for implementing all home page design sections as Storyblok-native components with Visual Editor support. Each section should be implemented as a separate feature branch and validated for both design fidelity and live editing functionality before proceeding to the next.

## 🎯 Migration Objectives
- **100% Design Fidelity**: Preserve every visual detail from the hotfix design
- **Component Architecture**: Convert to reusable React components with Storyblok integration
- **Performance Optimization**: Implement modern web standards
- **Accessibility Compliance**: Ensure full a11y support
- **TypeScript Integration**: Full type safety throughout
- **Storyblok CMS Integration**: Wire all components to Storyblok for content management

## 📋 Pre-Migration Setup

### ✅ Repository Preparation
- [x] Current repository: This Storyblok Next.js site is the target
- [x] Dependencies installed: `npm install` completed
- [x] Development environment verified: `npm run dev` working
- [x] Storyblok CMS integration: Basic setup complete (hero section working)

### ✅ Current Storyblok Setup Status
- [x] **Authentication Working**: Preview and Public tokens configured
- [x] **Visual Editor Route**: `/home-live` route with ClientBridge for live editing
- [x] **Hero Section**: HeroEditor.tsx with `storyblokEditable()` wrapper ✅ **COMPLETE**
- [x] **Alternating Blocks**: AlternatingBlocksEditor.tsx with nested block editing ✅ **COMPLETE**
- [x] **Environment Variables**: All tokens documented in `.env.local`
- [x] **Component Mapping**: `storyblok.ts` registers all Editor components
- [x] **Live Editing Working**: Changes in Storyblok reflect immediately in Visual Editor
- [x] **Production Deployment**: Deployed to Netlify at `storyblok-rumrivermn-netlify.netlify.app`

### ✅ Asset Preparation
- [ ] Review all migration packages in `/home-page-migration/`
- [ ] Copy shared assets: design tokens, animations, documentation
- [ ] Verify image assets are available in `/public/hotfix-assets/`
- [ ] Test font loading: Dancing Script, Playfair Display, Montserrat
- [ ] Ensure Storyblok assets can be uploaded and managed

---

## 🌿 Git Workflow Strategy

### Branch Naming Convention
```bash
feat/design-system-foundation    # Phase 1
feat/navbar-migration           # Phase 2  
feat/hero-migration            # Phase 3
feat/alternating-blocks-migration  # Phase 4
feat/gallery-migration         # Phase 5
feat/social-proof-migration    # Phase 6
feat/testimonials-migration    # Phase 7
feat/carousel-migration        # Phase 8
feat/form-migration           # Phase 9
feat/map-migration            # Phase 10
feat/footer-migration         # Phase 11
feat/home-page-integration    # Final
```

### Phase Workflow Template
**For each phase, follow this exact workflow:**

#### 1. Start New Feature Branch
```bash
# Ensure you're on main and up to date
git checkout main
git pull origin main

# Create new feature branch for the phase
git checkout -b feat/[phase-name]-migration

# Verify clean working directory
git status
```

#### 2. Storyblok Schema Creation (NEW STEP)
```bash
# BEFORE writing any code, create Storyblok schema
# 1. Navigate to Storyblok Block Library
# 2. Create new block with kebab-case name (e.g., "hero-section")
# 3. Add all required fields (match component data needs)
# 4. Set field types, defaults, and descriptions
# 5. Save schema

# Commit schema documentation
git add .
git commit -m "docs: add Storyblok schema for [component]"
```

#### 3. Implementation Work
```bash
# Build component WITH Storyblok integration from start
# - Create [Component]Editor.tsx in /src/components/storyblok/
# - Add 'use client' directive
# - Import and use storyblokEditable()
# - Map blok.field_name to component props
# - Provide fallback values for all fields
# - Copy/adapt CSS from migration package

# Commit work incrementally
git add .
git commit -m "feat: implement [component] with storyblokEditable()"
git commit -m "feat: add [specific-feature] functionality"
git commit -m "feat: complete [phase-name] styling and animations"
```

#### 4. Visual Editor Testing (NEW STEP)
```bash
# Test in Visual Editor BEFORE merging
# 1. Start dev server: npm run dev
# 2. Access http://localhost:9999/home-live
# 3. Add component block to Home story in Storyblok
# 4. Fill in content fields
# 5. Test live editing functionality

# Visual Editor Checklist:
# - [ ] Blue outline appears when clicking component
# - [ ] Field editor panel opens on click
# - [ ] Text changes update immediately (no reload)
# - [ ] Image changes update immediately
# - [ ] Nested blocks editable individually (if applicable)
# - [ ] No console errors about missing components
# - [ ] Bridge loaded message in console

# Final commit
git add .
git commit -m "feat: complete [phase-name] with Visual Editor support"
```

#### 5. Design Fidelity Checkpoint
**MANDATORY STOP POINT - Do not proceed until verified:**
- [ ] **Visual Comparison**: Side-by-side with original design
- [ ] **Interactive Elements**: All hover/click behaviors working
- [ ] **Live Editing**: Component editable in Visual Editor ⭐ NEW
- [ ] **storyblokEditable**: Blue outline appears on click ⭐ NEW
- [ ] **Immediate Updates**: Changes reflect without page reload ⭐ NEW
- [ ] **Responsive Design**: Perfect on mobile, tablet, desktop
- [ ] **Performance Check**: No significant slowdown
- [ ] **Cross-browser Test**: Chrome, Firefox, Safari
- [ ] **Accessibility Test**: Screen reader compatibility

#### 6. Merge to Main
```bash
# Push feature branch
git push origin feat/[phase-name]-migration

# Switch to main and merge
git checkout main
git merge feat/[phase-name]-migration

# Push updated main
git push origin main

# Clean up feature branch (optional)
git branch -d feat/[phase-name]-migration
git push origin --delete feat/[phase-name]-migration
```

#### 7. Phase Completion Documentation
```bash
# Update roadmap progress
# Document any deviations or notes
# Create checkpoint commit
git add .
git commit -m "checkpoint: complete Phase X - [phase-name] migration

✅ Design fidelity verified
✅ All interactive elements working
✅ Visual Editor live editing tested ⭐ NEW
✅ Storyblok schema created and documented ⭐ NEW
✅ Responsive design confirmed
✅ Performance maintained
✅ Browser compatibility tested"
```

### Emergency Rollback Procedure
```bash
# If issues discovered after merge
git checkout main
git revert [commit-hash]
git push origin main

# Or reset to previous stable state
git reset --hard [previous-stable-commit]
git push origin main --force-with-lease
```

---

## 🚀 Migration Phases

## Phase 1: Foundation Setup
**Branch**: `feat/design-system-foundation`

### 📦 Design Tokens Integration
- [ ] **Install Design Tokens**
  - [ ] Copy `/shared-assets/styles/design-tokens.css` to project
  - [ ] Import in main CSS file or layout
  - [ ] Verify CSS custom properties are available
  - [ ] Test token usage: `var(--color-warm-walnut)`

- [ ] **Animation System**
  - [ ] Copy `/shared-assets/styles/animations.css` to project
  - [ ] Test keyframe animations work
  - [ ] Verify hardware acceleration settings
  - [ ] Check reduced motion preferences

- [ ] **Typography Setup**
  - [ ] Ensure Google Fonts loading: Dancing Script, Playfair Display, Montserrat
  - [ ] Test font rendering across browsers
  - [ ] Verify font weight variants

### ✅ Phase 1 Completion Criteria
- [ ] All design tokens accessible via CSS custom properties
- [ ] Font families rendering correctly
- [ ] Animation system functional
- [ ] No build errors or warnings
- [ ] Design tokens documentation reviewed

### 🚦 Phase 1 Merge Checkpoint
**STOP - Do not proceed to Phase 2 until verified:**
- [ ] **Design Fidelity Check**: Foundation tokens match original color palette exactly
- [ ] **Build Verification**: `pnpm build` completes successfully
- [ ] **Git Status**: All changes committed to `feat/design-system-foundation`
- [ ] **Branch Merge**: Feature branch merged to `main` and pushed
- [ ] **Documentation**: Phase 1 marked complete in roadmap

**Git Commands:**
```bash
git checkout main
git merge feat/design-system-foundation
git push origin main
git tag "phase-1-complete"
```

---

## Phase 2: Navigation Implementation  
**Branch**: `feat/navbar-migration`
**Base**: `/home-page-migration/00-navbar/`

### 📋 Required Files
- **📚 Read First**: `00-navbar/docs/README.md`
- **📝 Component**: `00-navbar/code/navbar-component.tsx`  
- **🎨 Styles**: `00-navbar/styles/navbar-styles.css`

### 📦 Navbar Component Migration
- [ ] **Component Setup**
  - [ ] Copy `00-navbar/code/navbar-component.tsx` → `components/navigation/Navbar.tsx`
  - [ ] Implement scroll detection hook (already included)
  - [ ] Add mobile menu state management (already included)
  - [ ] Extract styles from `00-navbar/styles/navbar-styles.css`
  - [ ] Create Storyblok component schema for navbar
  - [ ] Wire navbar props to Storyblok fields

- [ ] **Transparent-to-White Effect**
  - [ ] Test scroll position detection (50px threshold)
  - [ ] Verify transparent initial state over hero
  - [ ] Confirm white background with backdrop blur on scroll
  - [ ] Check text color transitions (white → walnut brown)

- [ ] **Mobile Menu Overlay**
  - [ ] Implement full-screen mobile overlay
  - [ ] Test hamburger menu toggle
  - [ ] Verify backdrop blur effects
  - [ ] Test click-outside-to-close

- [ ] **Interactive Elements**
  - [ ] Logo gradient background effect
  - [ ] Navigation link hover underlines
  - [ ] CTA button styling and hover states
  - [ ] Responsive breakpoint behavior (900px)

### ✅ Phase 2 Completion Criteria
- [ ] Navbar renders correctly on all viewport sizes
- [ ] Scroll effect transitions smoothly
- [ ] Mobile menu functions properly
- [ ] All hover animations working
- [ ] Typography matches design exactly
- [ ] Z-index layering correct (navbar above hero)

### 🚦 Phase 2 Merge Checkpoint
**STOP - Do not proceed to Phase 3 until verified:**
- [ ] **Design Fidelity Check**: Navbar behavior identical to hotfix implementation
- [ ] **Scroll Testing**: Transparent to white transition works at 50px scroll
- [ ] **Mobile Testing**: Hamburger menu and overlay function perfectly
- [ ] **Cross-browser**: Tested in Chrome, Firefox, Safari
- [ ] **Git Status**: All changes committed to `feat/navbar-migration`
- [ ] **Branch Merge**: Feature branch merged to `main` and pushed

**Git Commands:**
```bash
git checkout main
git merge feat/navbar-migration
git push origin main
git tag "phase-2-complete"
```

---

## Phase 3: Hero Section Implementation ✅ COMPLETE
**Branch**: `feat/hero-migration` (merged to main)
**Base**: `/home-page-migration/01-hero-section/`
**Implementation**: `/src/components/storyblok/HeroEditor.tsx`

### 📋 Required Files
- **📚 Read First**: `01-hero-section/docs/README.md`
- **📝 Component**: `01-hero-section/code/hero-section.tsx`
- **🎨 Styles**: `01-hero-section/styles/hero-styles.css`
- **🖼️ Background**: `01-hero-section/images/barn-exterior-full-deck-view-evening.jpg`

### ✅ Hero Component Implementation (COMPLETE)
- [x] **Storyblok Schema Created**
  - [x] Block name: `hero-section`
  - [x] Fields: kicker, title, title_accent, description, primary_cta_text, scroll_text, bg_image

- [x] **Hero Structure**
  - [x] Created `HeroEditor.tsx` in `/src/components/storyblok/`
  - [x] Added `'use client'` directive for Visual Editor
  - [x] Implemented `storyblokEditable()` wrapper
  - [x] Copied background image to `public/hotfix-assets/`
  - [x] Styles integrated in `hotfix-site.css`
  - [x] All hero props mapped from `blok.field_name`

- [x] **Background System**
  - [x] Implemented CSS variable background (`--hero-bg`)
  - [x] Gradient overlay system working
  - [x] Background image positioning correct
  - [x] Parallax effect via CSS

- [x] **Content Animation**
  - [x] `hotfixFadeInUp` animation working
  - [x] Staggered content entrance implemented
  - [x] Script accent fade-in functional
  - [x] Button animations verified

- [x] **Scroll Indicator**
  - [x] Bounce animation working (2s infinite)
  - [x] Positioned absolutely at bottom
  - [x] Scroll behavior tested
  - [x] Fade-in timing correct (1.8s delay)

- [x] **Button System**
  - [x] Romantic button styles implemented
  - [x] Shimmer hover effects working
  - [x] Transform animations smooth
  - [x] Focus states accessible

- [x] **Visual Editor Integration** ⭐
  - [x] Component registered in `storyblok.ts`
  - [x] Live editing tested on `/home-live` route
  - [x] Blue outline appears on click
  - [x] All fields update immediately in Visual Editor
  - [x] Fallback values provided for all fields

### ✅ Phase 3 Completion Criteria
- [x] Hero displays at full viewport height
- [x] Background image loads and positions correctly
- [x] All entrance animations trigger properly
- [x] Scroll indicator bounces correctly
- [x] Button interactions feel smooth
- [x] Typography hierarchy matches exactly
- [x] Responsive behavior works on mobile
- [x] Visual Editor live editing functional ⭐

**Design Fidelity Check**: ✅ Hero section visually identical to original, all animations working, live editing confirmed

---

## Phase 4: Alternating Blocks Implementation ✅ COMPLETE
**Branch**: `feat/alternating-blocks-migration` (merged to main)
**Base**: `/home-page-migration/02-alternating-blocks/`
**Implementation**: `/src/components/storyblok/AlternatingBlocksEditor.tsx`

### ✅ Alternating Blocks Implementation (COMPLETE)
- [x] **Storyblok Schema Created**
  - [x] Parent block: `alternating-blocks`
  - [x] Fields: script_accent, title, description, blocks (nested)
  - [x] Nested block: `alternating-block-item` with number, title, lead, content, image, is_reverse

- [x] **Component Structure**
  - [x] Created `AlternatingBlocksEditor.tsx` in `/src/components/storyblok/`
  - [x] Added `'use client'` directive for Visual Editor
  - [x] Implemented `storyblokEditable()` on both parent and nested blocks
  - [x] Two-column alternating layout implemented
  - [x] Gradient background system working
  - [x] Styles integrated in `hotfix-site.css`

- [x] **Content System**
  - [x] Venue feature data structure with nested blocks
  - [x] Numbered block indicators (01, 02)
  - [x] Image hover transforms working
  - [x] Content alternation (left/right via `is_reverse`)

- [x] **Interactive Effects**
  - [x] Image hover scale (1.02) with enhanced shadows
  - [x] Text content fade animations
  - [x] Numbered indicator styling verified
  - [x] Responsive stacking behavior confirmed

- [x] **Visual Editor Integration** ⭐
  - [x] Component registered in `storyblok.ts`
  - [x] Nested blocks individually editable
  - [x] Live editing tested on `/home-live` route
  - [x] Blue outline appears on each block
  - [x] Image changes update immediately
  - [x] Fallback images for development

### ✅ Phase 4 Completion Criteria
- [x] Two-column layout alternates correctly
- [x] Gradient background matches original
- [x] Image hover effects smooth
- [x] Content hierarchy preserved
- [x] Mobile stacking works properly
- [x] All spacing matches design
- [x] Nested block editing functional ⭐

**Design Fidelity Check**: ✅ Layout, colors, interactions match hotfix design, nested live editing confirmed

---

## Phase 5: Love Stories Gallery Implementation ✅ COMPLETE
**Branch**: `feat/love-stories-gallery-migration` (merged to main)
**Base**: `/home-page-migration/03-love-stories-gallery/`
**Implementation**: `/src/components/storyblok/LoveStoriesGalleryEditor.tsx`
**📚 KEY LEARNINGS**: See [LOVE_STORIES_GALLERY_LEARNINGS.md](../LOVE_STORIES_GALLERY_LEARNINGS.md)

### ✅ Gallery Component Migration (COMPLETE)
- [x] **Storyblok Schema Created**
  - [x] Parent block: `love_stories_gallery`
  - [x] Fields: script_accent, title, description, galleries (nested)
  - [x] Nested block: `gallery_item` with couple_names, season, photo_count, venue, href, image

- [x] **Gallery Grid System**
  - [x] Created `LoveStoriesGalleryEditor.tsx` in `/src/components/storyblok/`
  - [x] Implemented 4-column CSS Grid
  - [x] Added masonry-style positioning (1st and 6th span 2 columns)
  - [x] Copied gallery styles to `/src/styles/hotfix/love-stories-gallery-styles.css`
  - [x] Fixed width pattern to match other sections (1200px max-width)

- [x] **Glassmorphism Cards**
  - [x] Implemented card hover transforms (translateY(-8px))
  - [x] Added image scale effects (1.1x on hover)
  - [x] Created glassmorphic overlay system
  - [x] Tested backdrop blur effects

- [x] **Shimmer Animation**
  - [x] Implemented left-to-right shimmer sweep
  - [x] Animation timing correct (0.8s ease-in-out)
  - [x] Shimmer triggers on hover only
  - [x] Z-index layering verified

- [x] **Wedding Data Structure**
  - [x] All 6 weddings from original seeded with complete data
  - [x] Gallery metadata overlay working (couple names, season, photo count)
  - [x] All wedding images uploaded to Storyblok
  - [x] Link structure to detail pages verified

- [x] **Visual Editor Integration** ⭐
  - [x] Component registered in both `storyblok.ts` and `ClientBridge.tsx`
  - [x] Nested blocks individually editable
  - [x] Live editing tested on `/home-live` route
  - [x] Blue outline appears on parent and each gallery item
  - [x] Image changes update immediately
  - [x] Draft vs Published content issue resolved (using preview tokens)

### ✅ Phase 5 Completion Criteria
- [x] Grid layout displays correctly on all screen sizes
- [x] Card hover effects smooth and performant
- [x] Shimmer animations trigger properly
- [x] Text overlays readable with proper contrast
- [x] Mobile responsive grid works
- [x] All 6 wedding images uploaded and displaying properly
- [x] Visual Editor live editing functional ⭐
- [x] Width pattern matches other sections (1200px max-width) ⭐

### 🎯 Critical Discoveries for Future Phases
1. **Draft vs Published**: Visual Editor routes MUST use `draft` version with `PREVIEW` tokens
2. **Content Wrapper Pattern**: Follow 1200px max-width pattern for alignment
3. **Complete Data Seeding**: Always seed with full data from original (all 6 items, not 3)
4. **Cache Clearing**: Hard refresh browser after Storyblok API updates
5. **Image Upload**: Use Node.js script with Content-Length header for S3 uploads

**Design Fidelity Check**: ✅ Gallery layout, effects, typography, and all 6 wedding cards match original perfectly

---

## Phase 6: Brand Social Proof Implementation
**Branch**: `feat/social-proof-migration`
**Base**: `/home-page-migration/04-brand-social-proof/`

### 📦 Social Proof Migration
- [ ] **Quote Section**
  - [ ] Create `components/testimonials/BrandSocialProof.tsx`
  - [ ] Implement gradient background with star pattern
  - [ ] 🔥 **CRITICAL: Add full-width breakout CSS** (see Love Stories Gallery learnings)
    - [ ] `width: 100vw`, `max-width: none`, `max-inline-size: none`
    - [ ] `margin-left: calc(-50vw + 50%)`, `margin-right: calc(-50vw + 50%)`
  - [ ] Add bevel edge effects (top and bottom)
  - [ ] Copy complex CSS from migration package

- [ ] **Visual Effects**
  - [ ] Implement SVG star pattern background
  - [ ] Add rounded bevel divider effects
  - [ ] Test backdrop filter blur (4px)
  - [ ] Verify multiple box-shadow layers

- [ ] **Typography Treatment**
  - [ ] Implement highlight text effects
  - [ ] Add brand logo hover animations
  - [ ] Test text shadow and glow effects
  - [ ] Verify script font integration

### ✅ Phase 6 Completion Criteria
- [ ] Complex background gradients render correctly
- [ ] Star pattern overlay visible
- [ ] Bevel effects display properly
- [ ] All text effects working
- [ ] Hover animations smooth
- [ ] Mobile layout preserved

**Design Fidelity Check**: ✅ Complex visual effects identical to original design

---

## Phase 7: Testimonials Section Implementation
**Branch**: `feat/testimonials-migration`
**Base**: `/home-page-migration/05-testimonials/`

### 📦 Testimonials Migration
- [ ] **Testimonial Grid**
  - [ ] Create `components/testimonials/TestimonialsSection.tsx`
  - [ ] Implement auto-fit grid (minmax(350px, 1fr))
  - [ ] 🔥 **CRITICAL: Add full-width breakout CSS if section has background** (see Love Stories Gallery learnings)
    - [ ] `width: 100vw`, `max-width: none`, `max-inline-size: none`
    - [ ] `margin-left: calc(-50vw + 50%)`, `margin-right: calc(-50vw + 50%)`
  - [ ] Add glassmorphic card styling
  - [ ] Copy testimonial styles from migration package

- [ ] **Card Interactions**
  - [ ] Implement card hover lift effects
  - [ ] Add underline width animations
  - [ ] Create avatar overlay effects
  - [ ] Test all hover state transitions

- [ ] **Content System**
  - [ ] Create testimonial data structure
  - [ ] Implement star rating system
  - [ ] Add couple avatar handling
  - [ ] Test content overflow handling

### ✅ Phase 7 Completion Criteria
- [ ] Grid layout responsive and functional
- [ ] Card hover effects smooth
- [ ] Star ratings display correctly
- [ ] Avatar images load properly
- [ ] Typography hierarchy preserved
- [ ] Mobile layout works well

**Design Fidelity Check**: ✅ Testimonial cards match original styling and behavior

---

## Phase 8: History Carousel Implementation
**Branch**: `feat/carousel-migration`
**Base**: `/home-page-migration/06-history-carousel/`

### 📦 Carousel Component Migration
- [ ] **Embla Carousel Setup**
  - [ ] Install: `pnpm add embla-carousel-react embla-carousel-autoplay`
  - [ ] Create `components/carousel/HistoryCarousel.tsx`
  - [ ] Implement Embla carousel configuration
  - [ ] Copy carousel styles from migration package

- [ ] **Navigation System**
  - [ ] Add previous/next arrow controls
  - [ ] Implement indicator dots
  - [ ] Add autoplay with play/pause toggle
  - [ ] Test touch/drag navigation

- [ ] **Card Design**
  - [ ] Implement photo card hover effects
  - [ ] Add image scale animations (1.05x)
  - [ ] Create card lift animations
  - [ ] Test glassmorphic navigation buttons

- [ ] **Historical Content**
  - [ ] Integrate historical timeline data
  - [ ] Test year, title, description display
  - [ ] Verify image loading and optimization
  - [ ] Check content overflow handling

### ✅ Phase 8 Completion Criteria
- [ ] Carousel navigation works smoothly
- [ ] Autoplay functions correctly
- [ ] Card animations smooth and performant
- [ ] Touch/drag gestures responsive
- [ ] Navigation buttons styled correctly
- [ ] Content displays properly on all devices

**Design Fidelity Check**: ✅ Carousel behavior and styling identical to original

---

## Phase 9: Schedule Form Implementation
**Branch**: `feat/form-migration`
**Base**: `/home-page-migration/07-schedule-form/`

### 📦 Form Component Migration
- [ ] **Server Actions Setup**
  - [ ] Install: `pnpm add resend` (if not present)
  - [ ] Create `app/actions/schedule-tour.ts`
  - [ ] Implement Resend email integration
  - [ ] Set up environment variables

- [ ] **Form Component**
  - [ ] Create `components/forms/ScheduleForm.tsx`
  - [ ] Implement glassmorphic form container
  - [ ] Add rotating background animation
  - [ ] Copy form styles from migration package

- [ ] **Field System**
  - [ ] Implement form field components
  - [ ] Add focus state animations (gold glow)
  - [ ] Create field validation
  - [ ] Test two-column responsive grid

- [ ] **Submit Handling**
  - [ ] Implement form submission with Server Actions
  - [ ] Add loading states and feedback
  - [ ] Create thank-you page redirect
  - [ ] Test form validation and error handling

### ✅ Phase 9 Completion Criteria
- [ ] Form renders with correct glassmorphic styling
- [ ] Rotating background animation works
- [ ] All field focus states functioning
- [ ] Form submission works end-to-end
- [ ] Email delivery confirmed
- [ ] Validation errors display properly
- [ ] Mobile layout preserved

**Design Fidelity Check**: ✅ Form styling, animations, and functionality match original

---

## Phase 10: Map Section Implementation
**Branch**: `feat/map-migration`
**Base**: `/home-page-migration/08-map-section/`

### 📦 Map Component Migration
- [ ] **Split-Screen Layout**
  - [ ] Create `components/map/MapSection.tsx`
  - [ ] Implement 50/50 split-screen grid
  - [ ] Add location information panel
  - [ ] Copy map styles from migration package

- [ ] **Google Maps Integration**
  - [ ] Embed Google Maps iframe
  - [ ] Add gradient overlay effects
  - [ ] Implement floating action buttons
  - [ ] Test responsive map sizing

- [ ] **Location Data**
  - [ ] Create location information cards
  - [ ] Implement icon system with gradients
  - [ ] Add hover animations for cards
  - [ ] Test content hierarchy

- [ ] **Interactive Elements**
  - [ ] Add action button shimmer effects
  - [ ] Implement button hover transforms
  - [ ] Test external map links
  - [ ] Verify mobile stacking behavior

### ✅ Phase 10 Completion Criteria
- [ ] Split-screen layout works perfectly
- [ ] Google Maps loads and displays correctly
- [ ] Action buttons function and animate properly
- [ ] Location cards hover effects smooth
- [ ] Mobile layout stacks correctly
- [ ] All external links work

**Design Fidelity Check**: ✅ Map section layout and interactions identical to original

---

## 🔚 Phase 11: Footer Section Implementation
**Branch**: `feat/footer-migration`
**Base**: `/home-page-migration/09-footer-section/`

### 🗂️ Required Migration Files
- **📝 Component**: `09-footer-section/code/footer-component.tsx`  
- **🎨 Styles**: `09-footer-section/styles/footer-styles.css`

### 📦 Footer Component Migration
- [ ] **Component Setup**
  - [ ] Install @heroicons/react package dependency
  - [ ] Copy `09-footer-section/code/footer-component.tsx` → `components/site/Footer.tsx`
  - [ ] Import all required heroicons (PhoneIcon, EnvelopeIcon, MapPinIcon, UserGroupIcon, CameraIcon)
  - [ ] Extract styles from `09-footer-section/styles/footer-styles.css`

- [ ] **3-Column Layout Structure**
  - [ ] Implement brand & description column (2fr width)
  - [ ] Create contact information column (1.5fr width)
  - [ ] Build social links column (1.5fr width)
  - [ ] Test grid responsive breakpoints (desktop → tablet → mobile)

- [ ] **Glassmorphic Effects**
  - [ ] Apply base gradient background (brown tones)
  - [ ] Add subtle dot pattern overlay (::before pseudo-element)
  - [ ] Implement glassmorphic gradient overlay (::after pseudo-element)
  - [ ] Verify backdrop-filter blur effects render correctly
  - [ ] Test z-index layering (pattern → overlay → content)

- [ ] **Heroicons Integration**
  - [ ] MapPinIcon for address display
  - [ ] PhoneIcon for telephone link
  - [ ] EnvelopeIcon for email link
  - [ ] UserGroupIcon for Facebook social link
  - [ ] CameraIcon for Instagram social link
  - [ ] Test all icons render with proper sizing (20px desktop, 18px mobile)

- [ ] **Interactive Elements**
  - [ ] Phone and email links with hover animations (translateX effect)
  - [ ] Social media buttons with glassmorphic hover states
  - [ ] Icon scale animations on hover (1.1x scale)
  - [ ] Color transitions (white → champagne-gold)

### ✅ Phase 11 Completion Criteria
- [ ] Footer renders with exact 3-column layout
- [ ] All heroicons display correctly and scale properly
- [ ] Glassmorphic overlay effects visible and smooth
- [ ] Contact links function (tel:, mailto:, external social)
- [ ] Responsive design works on all breakpoints
- [ ] Typography hierarchy matches original (Playfair Display titles, Montserrat body)
- [ ] Color consistency (champagne-gold headers, white-transparency body text)

### 🚦 Phase 11 Merge Checkpoint
**STOP - Do not proceed to Final Integration until verified:**
- [ ] **Design Fidelity Check**: Footer styling identical to hotfix implementation
- [ ] **Heroicons Testing**: All 5 icons render correctly with hover effects
- [ ] **Glassmorphic Testing**: Overlay gradient and blur effects visible
- [ ] **Contact Testing**: Phone, email, and social links function properly
- [ ] **Responsive Testing**: 3-column → 2-column → 1-column layout transitions
- [ ] **Cross-browser**: Tested in Chrome, Firefox, Safari (backdrop-filter support)
- [ ] **Git Status**: All changes committed to `feat/footer-migration`
- [ ] **Branch Merge**: Feature branch merged to `main` and pushed

**Git Commands:**
```bash
git checkout main
git merge feat/footer-migration
git push origin main
git tag "phase-11-complete"
```

**Design Fidelity Check**: ✅ Footer section with heroicons and glassmorphic effects identical to original

---

## 🏁 Final Integration Phase
**Branch**: `feat/home-page-integration`

### 📦 Complete Page Assembly
- [ ] **Page Integration**
  - [ ] Create main home page layout with Storyblok integration
  - [ ] Import all section components
  - [ ] Test complete page rendering with CMS data
  - [ ] Verify section spacing and flow
  - [ ] Wire all components to Storyblok story structure

- [ ] **Performance Optimization**
  - [ ] Implement image optimization
  - [ ] Add lazy loading where appropriate
  - [ ] Test page load performance
  - [ ] Verify Core Web Vitals

- [ ] **Cross-Browser Testing**
  - [ ] Test in Chrome, Firefox, Safari
  - [ ] Verify mobile device compatibility
  - [ ] Check tablet layout behavior
  - [ ] Test accessibility with screen readers

- [ ] **Final Validation**
  - [ ] Complete visual comparison with original
  - [ ] Test all interactive elements
  - [ ] Verify form submissions work
  - [ ] Check all external links

### ✅ Final Completion Criteria
- [ ] All sections render correctly in sequence
- [ ] Page performance meets standards
- [ ] All animations and interactions working
- [ ] Cross-browser compatibility confirmed
- [ ] Mobile responsiveness perfect
- [ ] Accessibility compliance verified

**Final Design Fidelity Check**: ✅ Complete home page identical to hotfix implementation

---

## 📊 Progress Tracking

### Migration Status Dashboard
```
Phase 1: Foundation Setup           [x] Complete     (Storyblok + Visual Editor ready)
Phase 2: Navigation                 [ ] Not Started  [ ] In Progress  [ ] Complete
Phase 3: Hero Section              [x] Complete     (HeroEditor.tsx with live editing) ✅
Phase 4: Alternating Blocks        [x] Complete     (AlternatingBlocksEditor.tsx with nested editing) ✅
Phase 5: Love Stories Gallery      [x] Complete     (LoveStoriesGalleryEditor.tsx + all 6 wedding images) ✅
Phase 6: Brand Social Proof        [ ] Not Started  [ ] In Progress  [ ] Complete  👈 NEXT
Phase 7: Testimonials              [ ] Not Started  [ ] In Progress  [ ] Complete
Phase 8: History Carousel          [ ] Not Started  [ ] In Progress  [ ] Complete
Phase 9: Schedule Form             [ ] Not Started  [ ] In Progress  [ ] Complete
Phase 10: Map Section             [ ] Not Started  [ ] In Progress  [ ] Complete
Phase 11: Footer Section          [ ] Not Started  [ ] In Progress  [ ] Complete
Final: Integration                 [ ] Not Started  [ ] In Progress  [ ] Complete
```

**Current Progress**: 3 of 11 sections complete (27%)
**Next Section**: Brand Social Proof (Phase 6)

### Quality Gates
Each phase must pass these gates before proceeding:
- ✅ **Visual Fidelity**: Pixel-perfect match to original
- ✅ **Functionality**: All interactions working correctly
- ✅ **Visual Editor**: Live editing with blue outline on click ⭐ NEW
- ✅ **Immediate Updates**: Changes reflect without page reload ⭐ NEW
- ✅ **Storyblok Schema**: Block created with all required fields ⭐ NEW
- ✅ **Performance**: No significant performance regression
- ✅ **Accessibility**: WCAG 2.1 AA compliance
- ✅ **Responsive**: Works perfectly on all device sizes

---

## 🎯 Storyblok Integration Pattern (UPDATED for Visual Editor)

### Visual Editor-First Component Pattern
For each component, follow this implementation pattern:

#### 1. Create Storyblok Schema FIRST (in Storyblok UI)
```
Navigate to: Block Library → New Block
Block Name: component-name-section (kebab-case)
Fields:
  - field_name (text/textarea/asset/blocks)
  - Set defaults and descriptions for content editors
  - Mark required fields
Save block
```

#### 2. Create Editor Component (in codebase)
```typescript
// /src/components/storyblok/[ComponentName]Editor.tsx
'use client'

import React from 'react'
import { storyblokEditable } from '@storyblok/react'

interface [ComponentName]EditorProps {
  blok: any
}

export default function [ComponentName]Editor({ blok }: [ComponentName]EditorProps) {
  return (
    <section className="hotfix-[component-class]" {...storyblokEditable(blok)}>
      {/* Use blok.field_name with fallbacks */}
      <h1>{blok.title || 'Default Title'}</h1>
    </section>
  )
}
```

#### 3. Register Component Mapping
```typescript
// /src/lib/storyblok.ts
import ComponentNameEditor from '@/components/storyblok/ComponentNameEditor'

export const storyblokComponents = {
  'component-name-section': ComponentNameEditor,
}
```

#### 4. Test in Visual Editor
```bash
# Access Visual Editor route
http://localhost:9999/home-live

# In Storyblok: Add block to Home story
# Verify:
# - Blue outline on click
# - Field editor opens
# - Changes update immediately
```

#### 5. NO Content Mapping Layer Needed
**Key Difference**: We don't use `mapFromStoryblok()` functions anymore. Components receive `blok` prop directly and access fields via `blok.field_name`. Fallbacks are inline with `||` operator.

#### 6. Asset Management
- **Asset Fields**: Use `type: "asset"` in Storyblok schema
- **Image Handling**: `blok.image?.filename || blok.image || '/fallback.jpg'`
- **Fallback Strategy**: Always provide fallbacks inline

---

## 🔧 Technical Requirements

### Dependencies to Install
```bash
# Core dependencies (using npm for this project)
npm install embla-carousel-react embla-carousel-autoplay
npm install resend
npm install @heroicons/react

# Storyblok dependencies (already installed)
# @storyblok/react @storyblok/js
```

### Environment Variables
```bash
# .env.local
RESEND_API_KEY=your_resend_api_key_here

# Storyblok variables (already configured)
STORYBLOK_ACCESS_TOKEN=tJCdp1QyfInsvreqnI2gLQtt
STORYBLOK_PERSONAL_ACCESS_TOKEN=YEhO2k7vcACiMyP1hn5jZgtt-104181807873698-2NDxmxXu3ewEQ239Gpcb
FEATURE_CMS_IMAGES=0
SPACE_ID=288003424841711
SPACE_NAME=rum-river-mn
```

### File Structure
```
src/
├── components/
│   ├── navigation/
│   │   └── Navbar.tsx
│   ├── hero/
│   │   └── HeroSection.tsx
│   ├── sections/
│   │   └── AlternatingBlocks.tsx
│   ├── gallery/
│   │   └── LoveStoriesGallery.tsx
│   ├── testimonials/
│   │   ├── BrandSocialProof.tsx
│   │   └── TestimonialsSection.tsx
│   ├── carousel/
│   │   └── HistoryCarousel.tsx
│   ├── forms/
│   │   └── ScheduleForm.tsx
│   └── map/
│       └── MapSection.tsx
├── styles/
│   ├── design-tokens.css
│   └── animations.css
└── app/
    ├── actions/
    │   └── schedule-tour.ts
    └── page.tsx
```

---

## 🚨 Critical Success Factors

### Must-Have Outcomes
1. **Zero Visual Regression**: Every pixel must match the original
2. **Performance Maintained**: Page load times must not degrade
3. **Accessibility Enhanced**: Meet or exceed WCAG 2.1 AA standards
4. **Mobile Excellence**: Perfect mobile experience preserved
5. **Browser Compatibility**: Works across all modern browsers

### Risk Mitigation
- **Backup Strategy**: Keep original hotfix CSS as fallback
- **Testing Protocol**: Test each section thoroughly before merging
- **Performance Monitoring**: Use Lighthouse to track metrics
- **Documentation**: Maintain detailed notes on any deviations

### Success Metrics
- [ ] Visual comparison passes 100%
- [ ] Lighthouse Performance Score: 90+
- [ ] Lighthouse Accessibility Score: 100
- [ ] Core Web Vitals: All green
- [ ] Cross-browser compatibility: 100%

---

## 📞 Support & Resources

### Documentation File Map
```
📁 home-page-migration/
├── 📖 README.md                    ← Overview & getting started
├── 📖 MIGRATION_ROADMAP.md         ← This file (complete workflow)
├── 📁 shared-assets/docs/
│   ├── 📖 DESIGN-TOKENS.md         ← Color system & typography
│   └── 📖 ANIMATIONS.md            ← Interactive elements guide
├── 📁 00-navbar/docs/README.md     ← Phase 2: Navigation details
├── 📁 01-hero-section/docs/README.md ← Phase 3: Hero implementation
├── 📁 02-alternating-blocks/docs/README.md ← Phase 4: Feature blocks
├── 📁 03-love-stories-gallery/docs/README.md ← Phase 5: Gallery system
├── 📁 04-brand-social-proof/docs/README.md ← Phase 6: Visual effects
├── 📁 05-testimonials/docs/README.md ← Phase 7: Testimonial cards
├── 📁 06-history-carousel/docs/README.md ← Phase 8: Carousel setup
├── 📁 07-schedule-form/docs/README.md ← Phase 9: Form + Server Actions
├── 📁 08-map-section/docs/README.md ← Phase 10: Map integration
└── 📁 09-footer-section/docs/README.md ← Phase 11: Footer with heroicons
```

### File Usage Pattern
For each phase:
1. **Read** `[XX-section]/docs/README.md` for implementation details
2. **Copy** `[XX-section]/code/*.tsx` files to project
3. **Extract** styles from `[XX-section]/styles/*.css`
4. **Reference** shared documentation as needed

### Original Implementation Source
- **Hotfix CSS**: `/src/styles/hotfix-site.css` (lines vary by section)
- **Live Reference**: `http://localhost:7777/` (current implementation)
- **Color Values**: All documented in `shared-assets/docs/DESIGN-TOKENS.md`

### Quality Validation Resources
- **Design Comparison**: Side-by-side with `http://localhost:7777/`
- **Section Documentation**: Each README.md has feature checklists
- **Animation Reference**: `shared-assets/docs/ANIMATIONS.md` for all effects
- **Token Verification**: `shared-assets/docs/DESIGN-TOKENS.md` for colors

---

## 🔄 Complete Workflow Summary

### Per-Phase Workflow
**Each phase follows this exact 6-step process:**

1. **🌱 Start Feature Branch**
   ```bash
   git checkout main && git pull origin main
   git checkout -b feat/[phase-name]-migration
   ```

2. **⚡ Implement Phase**
   - Follow detailed phase checklist
   - Commit work incrementally
   - Test thoroughly in development

3. **✅ Validate Implementation**
   - Complete all phase completion criteria
   - Test across browsers and devices
   - Verify design fidelity

4. **🚦 Merge Checkpoint (MANDATORY STOP)**
   - Review merge checkpoint requirements
   - Do NOT proceed until all items checked
   - Side-by-side comparison with original

5. **🔀 Merge to Main**
   ```bash
   git checkout main
   git merge feat/[phase-name]-migration
   git push origin main
   git tag "phase-X-complete"
   ```

6. **📝 Document & Continue**
   - Update progress dashboard
   - Document any notes or deviations
   - Proceed to next phase

### Critical Success Points
- **11 Git Tags**: One for each phase completion
- **11 Merge Checkpoints**: Mandatory validation gates
- **Zero Regression Policy**: Each phase must maintain previous work
- **Design Fidelity**: 100% visual accuracy required at each step

### Emergency Procedures
```bash
# Rollback if issues found
git checkout main
git revert [problematic-commit]
git push origin main

# Or hard reset to previous stable tag
git reset --hard phase-X-complete
git push origin main --force-with-lease
```

This roadmap ensures systematic migration with validation at each step, maintaining perfect design fidelity throughout the process.