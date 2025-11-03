# Phase 2 Architecture Status

**Last Updated:** 2025-10-26
**Branch:** `feat/phase2-dtcg-tokens-architecture`

## ✅ Completed Work

### Map Section - Pixel-Perfect Flush Alignment
**Status:** COMPLETE ✅

#### What Was Fixed
Successfully achieved pixel-perfect flush alignment between 6 location items and circular Google Maps embed using advanced CSS Grid techniques.

**Commits:**
- `b6d02e9` - Initial flush alignment with optical overlap offset
- `821aa96` - True vertical flush alignment (final fix)
- `8cf8406` - Removed flowery tagline from migration code

#### Technical Implementation

**1. Horizontal Flush** (`b6d02e9`)
- Changed `grid-template-columns` from fixed `var(--map-size)` to `1fr min-content 1fr`
- Removed `justify-items: center`, added `justify-content: center`
- Added `--flush-offset: -12px` CSS variable for optical overlap
- Applied `transform: translateX(var(--flush-offset))` to left items
- Applied `transform: translateX(calc(var(--flush-offset) * -1))` to right items
- Updated hover states to preserve horizontal offset with vertical lift

**2. Vertical Flush** (`821aa96`)
- Fixed grid row sizing: `grid-template-rows: repeat(3, calc(var(--map-size) / 3))`
- Set container height to match circle: `height: var(--map-size)`
- Changed `row-gap` from `2rem` to `0` for true vertical flush
- Fixed selector issue: Changed from `:nth-of-type()` to `:nth-child()` to avoid counting map div
- Added vertical positioning:
  - Top row (items 1, 5): `align-self: start` - flush with circle top
  - Middle row (items 2, 6): `align-self: center` - vertically centered
  - Bottom row (items 3, 7): `align-self: end` - flush with circle bottom
- Removed vertical padding on corner items (1, 3, 5, 7) for optical "touching"
- Updated mobile responsive rules with consistent selectors

**3. Content Update** (`8cf8406` + API publish)
- Removed flowery tagline: ", where your love story will unfold in perfect harmony with nature"
- Updated via Storyblok Management API and published
- New text: "Discover our beautiful venue nestled in the heart of Minnesota."

#### Files Modified
- `src/styles/hotfix/map-section-styles.css` - All grid positioning and flush alignment
- `home-page-migration/08-map-section/code/map-section.tsx` - Migration reference code
- Storyblok CMS (via API) - Published content update

#### Key Technical Concepts Used
- CSS Grid Layout with exact row/column sizing
- `min-content` for content-driven column width
- CSS Custom Properties (`--map-size`, `--flush-offset`)
- `transform: translateX()` for optical overlap
- `align-self` and `justify-self` for precise positioning
- `calc()` for dynamic calculations
- `:nth-child()` selector specificity
- Mobile responsive transform resets

#### Visual Result
Items now sit **exactly** at the circle's edges:
- Horizontal: 12px optical overlap for flush appearance
- Vertical: Pinned to exact top, middle, bottom of circle
- No gaps: `row-gap: 0`, `column-gap: 0`
- Perfect alignment with circle geometry

#### Fine-Tuning Available
The `--flush-offset` variable can be adjusted between `-8px` to `-18px` if needed for different visual preferences with the circle shadow.

---

## 📋 Phase 2 Original Plan (from Previous Session)

### Overview
Phase 2 focuses on establishing DTCG token architecture and modernizing component structure while maintaining visual appearance.

### Phase 2 Objectives
1. ✅ **DTCG Token System** - Establish Design Token Community Group standard tokens
2. ⏳ **Component Modernization** - Convert hotfix classes to semantic architecture
3. ⏳ **Token Integration** - Wire tokens into components systematically
4. ⏳ **Documentation** - Document token system and migration patterns

### Detailed Phase 2 Plan

#### 2.1 DTCG Token Foundation
**Status:** NOT STARTED

**Tasks:**
- [ ] Create `tokens/` directory structure
- [ ] Set up DTCG-compliant JSON token files:
  - `color.tokens.json`
  - `typography.tokens.json`
  - `spacing.tokens.json`
  - `border.tokens.json`
  - `shadow.tokens.json`
- [ ] Install and configure Style Dictionary
- [ ] Create build pipeline for token compilation
- [ ] Generate CSS custom properties from tokens

**Files to Create:**
```
rum-river-site/
├── tokens/
│   ├── color.tokens.json
│   ├── typography.tokens.json
│   ├── spacing.tokens.json
│   ├── border.tokens.json
│   ├── shadow.tokens.json
│   └── config.js (Style Dictionary config)
├── scripts/
│   └── build-tokens.js
└── src/
    └── styles/
        └── tokens/ (generated)
            ├── colors.css
            ├── typography.css
            └── etc...
```

#### 2.2 Map Section Modernization
**Status:** LAYOUT COMPLETE ✅ | TOKENS NOT STARTED ⏳

**Completed:**
- [x] Pixel-perfect flush alignment implementation
- [x] Grid architecture with exact row/column sizing
- [x] Optical overlap system with CSS variables
- [x] Mobile responsive design
- [x] Content cleanup

**Remaining:**
- [ ] Extract hardcoded values to DTCG tokens:
  - `--map-size: 650px` → `{map.size.default}`
  - `--flush-offset: -12px` → `{map.offset.flush}`
  - Colors: `#6B4E3D` → `{color.brown.600}`
  - Spacing: `gap: 1rem` → `{spacing.4}`
  - Border radius: `border-radius: 50%` → `{border.radius.circle}`
- [ ] Create semantic CSS classes:
  - `.map-section` instead of `.hotfix-map-section`
  - `.map-grid` instead of `.hotfix-map-content-grid`
  - `.location-card` instead of `.hotfix-location-item`
- [ ] Update component to use token-based classes
- [ ] Test token changes don't break layout

#### 2.3 Footer Section Modernization
**Status:** NOT STARTED

**Tasks:**
- [ ] Analyze current footer styles in `src/styles/hotfix/footer-styles.css`
- [ ] Extract values to tokens:
  - Background colors
  - Text colors
  - Link hover states
  - Spacing/padding
  - Typography
- [ ] Create semantic footer component structure
- [ ] Wire tokens into footer
- [ ] Test responsive behavior

#### 2.4 History Carousel Modernization
**Status:** NOT STARTED

**Tasks:**
- [ ] Analyze polaroid card design system
- [ ] Extract to tokens:
  - Card dimensions
  - Shadow system
  - Border styles
  - Spacing between cards
  - Animation timings
- [ ] Create semantic carousel component classes
- [ ] Wire tokens into carousel
- [ ] Test timeline navigation

#### 2.5 Additional Sections (if time permits)
**Status:** NOT STARTED

**Sections to modernize:**
- [ ] Form section
- [ ] Testimonials section
- [ ] Love stories gallery
- [ ] Social proof section

---

## 🎯 Next Steps (When Resuming Phase 2)

### Immediate Next Task: DTCG Token Setup

1. **Install Style Dictionary**
   ```bash
   npm install --save-dev style-dictionary
   ```

2. **Create Token Files**
   Start with map section tokens since it's freshly completed:

   `tokens/spacing.tokens.json`:
   ```json
   {
     "spacing": {
       "0": { "value": "0", "type": "dimension" },
       "1": { "value": "0.25rem", "type": "dimension" },
       "2": { "value": "0.5rem", "type": "dimension" },
       "3": { "value": "0.75rem", "type": "dimension" },
       "4": { "value": "1rem", "type": "dimension" },
       "8": { "value": "2rem", "type": "dimension" },
       "16": { "value": "4rem", "type": "dimension" }
     }
   }
   ```

3. **Configure Style Dictionary**
   Create `tokens/config.js` to compile tokens to CSS

4. **Extract Map Section Values**
   - Map size: 650px
   - Flush offset: -12px
   - Gap values: 1rem
   - Padding: 4rem, 0.5rem
   - Colors: #6B4E3D

5. **Test Token System**
   - Build tokens
   - Import into map section
   - Verify no visual changes
   - Commit token foundation

### After Token Foundation

6. **Semantic Class Migration**
   - Create new semantic classes alongside hotfix classes
   - Update components to use both (graceful migration)
   - Test thoroughly
   - Remove hotfix classes

7. **Documentation**
   - Document token naming conventions
   - Create migration guide
   - Add examples

---

## 🔄 Phase 3 Preview (Future)

Phase 3 will focus on Storyblok Visual Editor enhancement and dynamic content:

1. **Rich Text Rendering** - Properly render Storyblok rich text fields
2. **Visual Editor Integration** - Improve editing experience
3. **Dynamic Content** - Move remaining hardcoded content to CMS
4. **Component Library** - Build reusable Storyblok components

---

## 📁 Key Files Reference

### Current Work Files
- `src/styles/hotfix/map-section-styles.css` - Map section styles (flush alignment)
- `src/components/storyblok/MapSectionEditor.tsx` - Map section component
- `home-page-migration/08-map-section/code/map-section.tsx` - Migration reference

### Files to Create (Phase 2 Continuation)
- `tokens/*.tokens.json` - DTCG token definitions
- `tokens/config.js` - Style Dictionary configuration
- `scripts/build-tokens.js` - Token build script
- `src/styles/tokens/*.css` - Generated token CSS files
- `src/styles/semantic/*.css` - New semantic class definitions

### Documentation Files
- `DTCG_TOKENS.md` - Token system documentation (to create)
- `MIGRATION_GUIDE.md` - Hotfix to semantic migration guide (to create)

---

## 🐛 Known Issues

### Map Section
- None currently - flush alignment working perfectly ✅

### Other Sections (Deferred to Phase 2 continuation)
- Footer uses hotfix classes
- History carousel uses hotfix classes
- Form section needs token extraction
- Testimonials section needs modernization

---

## 💡 Notes for Future Work

### Map Section Success Patterns
The map section flush alignment work demonstrated several patterns to apply elsewhere:

1. **Use exact calculations** - `calc(var(--map-size) / 3)` instead of `1fr`
2. **Optical overlap** - CSS variables for fine-tuning visual alignment
3. **Grid direct children** - Avoid wrapper divs that interfere with selectors
4. **Selector specificity** - Use `:nth-child()` with class filters, not `:nth-of-type()`
5. **Mobile resets** - Transform and positioning resets for responsive

### Token System Recommendations
- Use semantic naming: `color.brown.600` not `color.hex.6B4E3D`
- Create size scales: `spacing.0` through `spacing.16`
- Document token relationships: `map.offset.flush` references `spacing.-3`
- Keep tokens composable: `shadow.card` = `shadow.sm` + `color.black.alpha.10`

---

## ✅ Acceptance Criteria for Phase 2 Completion

Phase 2 will be considered complete when:

- [x] Map section has pixel-perfect flush alignment (DONE)
- [ ] DTCG token system is established and documented
- [ ] Style Dictionary is configured and building tokens
- [ ] Map section uses tokens instead of hardcoded values
- [ ] Footer section is modernized with tokens
- [ ] At least one additional section (carousel/form) uses tokens
- [ ] Migration guide is documented
- [ ] All changes are committed and tested
- [ ] No visual regressions from token migration

---

## 🚀 Quick Resume Commands

When you're ready to continue Phase 2:

```bash
# Ensure you're on the right branch
git checkout feat/phase2-dtcg-tokens-architecture

# Start dev server
PORT=9999 npm run dev

# View current work
open https://localhost:9999

# Install Style Dictionary (if continuing with tokens)
npm install --save-dev style-dictionary

# Create token directories
mkdir -p tokens src/styles/tokens scripts
```

---

## 📝 Session Summary

**What we accomplished today:**
1. ✅ Achieved pixel-perfect horizontal flush alignment with optical overlap
2. ✅ Achieved pixel-perfect vertical flush alignment with exact row sizing
3. ✅ Fixed CSS selector issues (nth-of-type → nth-child)
4. ✅ Removed vertical padding on corner items for optical touch
5. ✅ Updated Storyblok content via Management API
6. ✅ Committed all changes with detailed documentation

**Map section is now production-ready** with the best CSS Grid flush alignment implementation.

**Next session should start with:** DTCG token system setup and extraction of map section hardcoded values to tokens.
