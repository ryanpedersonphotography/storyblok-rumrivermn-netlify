# Love Stories Gallery Migration - Key Learnings

## ✅ Successfully Completed: Phase 5

**Branch**: `feat/love-stories-gallery-migration`
**Implementation**: `/src/components/storyblok/LoveStoriesGalleryEditor.tsx`
**Status**: COMPLETE - All 6 wedding galleries rendering with Visual Editor support

---

## 🎯 Critical Discoveries for Remaining Components

### 1. **Draft vs Published Content (CRITICAL)**

#### The Problem We Hit
- Visual Editor route (`/home-live`) was fetching **published** content
- New components added in Storyblok were in **draft** state only
- Component didn't appear even though schema and code were correct
- Error: `401 Unauthorized` when trying to access draft content

#### The Solution
```typescript
// /src/app/home-live/page.tsx
export default async function HomeLivePage() {
  // ALWAYS use draft version for Visual Editor route
  const story = await fetchStory('home', 'draft')  // NOT 'published'!
}
```

#### Token Requirements
```typescript
// /src/lib/storyblok.ts - Server-side
storyblokInit({
  accessToken: process.env.STORYBLOK_PREVIEW_TOKEN,  // NOT PUBLIC_TOKEN
})

// /src/app/home-live/ClientBridge.tsx - Client-side
storyblokInit({
  accessToken: process.env.NEXT_PUBLIC_STORYBLOK_PREVIEW_TOKEN,  // NOT PUBLIC_TOKEN
})
```

#### Environment Variables Needed
```bash
# .env.local
STORYBLOK_PREVIEW_TOKEN=AcBamY8QEHeF7Wid0UOgcAtt
NEXT_PUBLIC_STORYBLOK_PREVIEW_TOKEN=AcBamY8QEHeF7Wid0UOgcAtt
```

**⚠️ FOR ALL REMAINING COMPONENTS**: Ensure Visual Editor routes use `draft` version and preview tokens!

---

### 2. **Full-Width Background Breakout Pattern (CRITICAL!)**

#### Discovery
Sections with colored backgrounds MUST break out of container constraints to extend edge-to-edge, otherwise black/white bars appear on the sides.

#### The Problem
- Storyblok's global CSS constrains content width
- Without breakout CSS, backgrounds don't reach viewport edges
- Black bars appear on left/right sides

#### The Solution - Full-Width Breakout CSS
```css
/* REQUIRED for any section with a background color/gradient */
.hotfix-love-stories-gallery {
  background: #F4E4E1 !important; /* Your section background */
  padding: 100px 0 !important;

  /* 🔥 CRITICAL: These 5 lines make background full-width */
  width: 100vw !important;
  max-width: none !important;
  max-inline-size: none !important;
  margin-left: calc(-50vw + 50%) !important;
  margin-right: calc(-50vw + 50%) !important;
}
```

#### How the Math Works
- `width: 100vw` - Full viewport width
- `calc(-50vw + 50%)` - Negative margin pulls section to viewport edge
  - `-50vw` = half viewport width to the left
  - `+50%` = half container width back to the right
  - Net effect: section centered but spanning full width

#### Content Wrapper Pattern (Works With Breakout)
```typescript
// Section spans full viewport, content constrained inside
<section className="full-width-section">  {/* Full viewport width */}
  <div className="content-wrapper">  {/* NO max-width here */}
    <div className="section-header">  {/* max-width: 1200px */}
      {/* Centered header content */}
    </div>
    <div className="main-content">  {/* max-width: 1200px */}
      {/* Grid/content here */}
    </div>
  </div>
</section>
```

#### Complete CSS Implementation
```css
/* Section - FULL WIDTH with breakout */
.hotfix-love-stories-gallery {
  background: #F4E4E1 !important;
  padding: 100px 0 !important;
  width: 100vw !important;
  max-width: none !important;
  max-inline-size: none !important;
  margin-left: calc(-50vw + 50%) !important;
  margin-right: calc(-50vw + 50%) !important;
}

/* Content wrapper - full width */
.hotfix-love-stories-content {
  max-width: none !important;
  width: 100% !important;
  margin: 0 !important;
  padding: 0 !important;
}

/* Header - constrained to 1200px */
.hotfix-love-stories-header {
  max-width: 1200px !important;
  margin: 0 auto 3rem auto !important;
  padding: 0 2rem !important;
}

/* Main content - constrained to 1200px */
.hotfix-wedding-gallery {
  max-width: 1200px !important;
  margin: 0 auto 3rem auto !important;
  padding: 0 2rem !important;
}
```

**✅ FOR ALL REMAINING COMPONENTS**:
- Any section with a background color/gradient MUST use the full-width breakout CSS
- Inner content constrained to 1200px max-width for consistency
- This pattern used by: Alternating Blocks, Love Stories Gallery, and likely Brand Social Proof, Testimonials, etc.

---

### 3. **Complete Content Seeding (Not Just Placeholders)**

#### The Issue
- Initially seeded only 3 sample gallery items
- Original design had **6 wedding galleries**
- Missing content breaks the grid layout design

#### The Solution
Always seed with **complete, real content** from the original:
```json
{
  "galleries": [
    {
      "couple_names": "Anthony & Linnea",
      "season": "Summer 2024",
      "photo_count": 114,
      "venue": "Rum River Barn",
      "href": "/real-weddings/anthony-and-linnea",
      "image": "..."
    },
    // ... ALL 6 galleries from original
  ]
}
```

**✅ FOR ALL REMAINING COMPONENTS**: Check original code for complete data, don't use minimal placeholders!

---

### 4. **Cache Clearing After API Updates**

#### The Problem
- Updated Storyblok content via Management API
- Content showed in API responses but not in browser
- Next.js cached the old content

#### The Solutions
```bash
# Option 1: Hard refresh browser
# Mac: Cmd + Shift + R
# Windows: Ctrl + Shift + F5

# Option 2: Restart dev server
# Stop server (Ctrl+C), then:
npm run dev

# Option 3: Clear browser cache
# DevTools → Right-click refresh → Empty Cache and Hard Reload
```

**✅ FOR ALL REMAINING COMPONENTS**: Always hard refresh after Storyblok content updates!

---

### 5. **Component Registration (Both Locations Required)**

#### Critical Setup
Every Visual Editor component needs registration in **TWO places**:

```typescript
// 1. Server-side: /src/lib/storyblok.ts
import LoveStoriesGalleryEditor from '@/components/storyblok/LoveStoriesGalleryEditor'

storyblokInit({
  components: {
    love_stories_gallery: LoveStoriesGalleryEditor,  // kebab-case name
  },
})

// 2. Client-side: /src/app/home-live/ClientBridge.tsx
import LoveStoriesGalleryEditor from '@/components/storyblok/LoveStoriesGalleryEditor'

storyblokInit({
  components: {
    love_stories_gallery: LoveStoriesGalleryEditor,  // SAME name
  },
})
```

**⚠️ IMPORTANT**: Component name in Storyblok schema must match registration key exactly!

---

### 6. **Debugging Strategy That Worked**

#### When Component Doesn't Appear

**Step 1**: Verify block exists in Storyblok
```bash
curl -s 'https://api.storyblok.com/v2/cdn/stories/home?token=PREVIEW_TOKEN&version=draft' \
  | jq '.story.content.body[] | {component: .component}'
```

**Step 2**: Check if using correct version (draft vs published)
```bash
# Draft version (for Visual Editor)
curl 'https://api.storyblok.com/v2/cdn/stories/home?token=PREVIEW_TOKEN&version=draft'

# Published version (for production)
curl 'https://api.storyblok.com/v2/cdn/stories/home?token=PUBLIC_TOKEN&version=published'
```

**Step 3**: Add debug logging
```typescript
// Page.tsx
export default function Page({ blok }: PageProps) {
  console.log('Body blocks:', (blok.body || []).map((b: any) => b.component))
  // ...
}

// Component
export default function LoveStoriesGalleryEditor({ blok }: Props) {
  console.log('Component rendering!', blok)
  // ...
}
```

**Step 4**: Add visible debug UI
```typescript
<div style={{background: 'lime', padding: '20px'}}>
  ✅ COMPONENT IS RENDERING!
</div>
```

---

## 📋 Pre-Flight Checklist for Remaining Components

Before starting each new component migration:

### Schema Setup
- [ ] Create Storyblok block in Block Library
- [ ] Use kebab-case for block name (e.g., `testimonials-section`)
- [ ] Add all required fields with defaults
- [ ] Set field types correctly (text, textarea, asset, blocks)
- [ ] Mark required fields

### Component Implementation
- [ ] Create `[ComponentName]Editor.tsx` in `/src/components/storyblok/`
- [ ] Add `'use client'` directive at top
- [ ] Import and use `storyblokEditable(blok)` on root element
- [ ] Map all `blok.field_name` with fallbacks
- [ ] Follow 1200px max-width content wrapper pattern
- [ ] Copy CSS from migration package to `/src/styles/hotfix/`
- [ ] Import CSS in `/src/app/layout.js`

### Registration
- [ ] Register in `/src/lib/storyblok.ts` (server-side)
- [ ] Register in `/src/app/home-live/ClientBridge.tsx` (client-side)
- [ ] Verify component name matches Storyblok schema exactly

### Testing
- [ ] Start dev server: `npm run dev`
- [ ] Access: `https://localhost:9999/home-live`
- [ ] Add block to Home story in Storyblok UI
- [ ] **Hard refresh browser** (Cmd+Shift+R / Ctrl+Shift+F5)
- [ ] Verify blue outline appears on click
- [ ] Test field editing updates immediately
- [ ] Check console for errors

### Content Seeding
- [ ] Review original component code for complete data structure
- [ ] Seed all items from original (not just 2-3 placeholders)
- [ ] Use Management API to update story content
- [ ] Verify content appears correctly

---

## 🎯 Recommended Order for Remaining Components

Based on complexity and dependencies:

### Next (Phase 6-7): Low Complexity
1. **Brand Social Proof** - Simple quote section, no nested blocks
2. **Testimonials** - Simple grid cards, straightforward data

### Medium (Phase 8-9): Moderate Complexity
3. **History Carousel** - Embla carousel dependency, image handling
4. **Map Section** - Google Maps iframe, split-screen layout

### Complex (Phase 10-11): High Complexity
5. **Schedule Form** - Server Actions, validation, email integration
6. **Footer** - Multiple columns, heroicons, social links

---

## 🔧 Quick Reference Commands

```bash
# Check what's in Storyblok (draft)
curl -s 'https://api.storyblok.com/v2/cdn/stories/home?token=AcBamY8QEHeF7Wid0UOgcAtt&version=draft' \
  | jq '.story.content.body[] | {component: .component}'

# Update story via Management API
curl -X PUT \
  -H 'Authorization: PERSONAL_TOKEN' \
  -H 'Content-Type: application/json' \
  -d @story-update.json \
  'https://mapi.storyblok.com/v1/spaces/SPACE_ID/stories/STORY_ID'

# Hard restart dev server (clear all caches)
# Ctrl+C to stop, then:
npm run dev
```

---

## ✅ Love Stories Gallery Final Status

- [x] Storyblok schema created (6 fields total)
- [x] Component implemented with `storyblokEditable()`
- [x] CSS extracted and imported
- [x] Server-side registration complete
- [x] Client-side registration complete
- [x] All 6 wedding galleries seeded
- [x] Draft content accessible
- [x] Preview tokens configured
- [x] Visual Editor tested and working
- [x] Width pattern matches other sections
- [x] Migration documentation updated

**This component serves as the blueprint for all remaining sections!** 🎉
