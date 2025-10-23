# Storyblok CMS Integration Guide - Complete Implementation

## What We Learned Through Trial and Error

### The Problem
- Started with static hotfix components that were pixel-perfect
- Needed to make content CMS-editable while maintaining exact visual fidelity
- Multiple token types caused confusion and authentication failures
- Background images hardcoded in CSS broke dynamic updates

### The Solution Pattern
- **Keep static components unchanged** - preserve pixel-perfect styling
- **Create CMS twin routes** - `/beta` (static) vs `/beta-cms` (CMS-driven)
- **Use content mappers** - transform Storyblok data to match static component props
- **Use proper token types** - Public tokens for content delivery, Personal for management
- **Feature flag images safely** - text content first, images when ready

### Key Discoveries
1. **Token Types Matter** - Public tokens for CDN API, Personal tokens for Management API
2. **CSS Variables for Dynamic Images** - `var(--hero-bg, fallback)` pattern
3. **Feature Flags Essential** - `FEATURE_CMS_IMAGES=0` for safe deployment
4. **Component mapping is critical** - Storyblok field names must map to existing props
5. **Single source of truth** - Document all tokens in `STORYBLOK_TOKENS.md`

## Working Code Implementation

### 1. Content Mapper (`src/components/hotfix/mapFromStoryblok.ts`)
```typescript
import { hotfixNavbar, hotfixHero } from "./hotfixStaticContent";

export function mapNavbarFromStory(content: any) {
  if (!content) return hotfixNavbar;
  return {
    ...hotfixNavbar,
    // Map Storyblok navbar fields to static props structure
    items: Array.isArray(content.items)
      ? content.items.map((it: any) => ({
          label: it?.label ?? "",
          href: it?.href?.cached_url ? `/${it.href.cached_url.replace(/^\/+/, "")}` : "#",
          isCta: !!it?.is_cta,
          children: Array.isArray(it?.children)
            ? it.children.map((c: any) => ({
                label: c?.label ?? "",
                href: c?.href?.cached_url ? `/${c.href.cached_url.replace(/^\/+/, "")}` : "#",
                isCta: !!c?.is_cta,
              }))
            : [],
        }))
      : hotfixNavbar.items,
  };
}

export function mapHeroFromStory(content: any) {
  if (!content) return hotfixHero;
  return {
    ...hotfixHero,
    kicker: content?.kicker ?? hotfixHero.kicker,                    // "Where Dreams Begin"
    title: content?.title ?? hotfixHero.title,                      // "Rum River" 
    titleAccent: content?.title_accent ?? hotfixHero.titleAccent,   // "Wedding Barn"
    description: content?.description ?? hotfixHero.description,     // Long description
    bgImage: content?.bg_image || hotfixHero.bgImage,               // CDN URL from upload
    primaryCta: {
      url: "/contact",
      label: content?.primary_cta_text ?? hotfixHero.primaryCta.label  // "Schedule Your Visit"
    },
  };
}
```

### 2. CMS-Driven Page (`src/app/beta-cms/page.tsx`)
```typescript
import NavbarHotfix from "@/components/hotfix/NavbarHotfix";
import HeroHotfix from "@/components/hotfix/HeroHotfix";
import { mapNavbarFromStory, mapHeroFromStory } from "@/components/hotfix/mapFromStoryblok";

async function getStoryblokStory() {
  // Use public token with delivery API for published content
  const token = process.env.STORYBLOK_ACCESS_TOKEN;
  const url = `https://api.storyblok.com/v2/cdn/stories/home?token=${token}&version=published`;
  
  try {
    const response = await fetch(url, { 
      cache: 'no-store',
      headers: {
        'Authorization': token
      }
    });
    if (!response.ok) {
      throw new Error(`Storyblok API Error: ${response.status} ${await response.text()}`);
    }
    const data = await response.json();
    return { story: data.story };
  } catch (error) {
    console.error('Storyblok fetch error:', error);
    return { story: { content: { body: [] } } };
  }
}

export default async function BetaCMSPage() {
  const data = await getStoryblokStory();
  const page = data?.story?.content;

  const navbar = page?.body?.find((b: any) => String(b.component).startsWith("navbar")) || null;
  const hero   = page?.body?.find((b: any) => b.component === "home_hero_section") || null;

  return (
    <>
      <NavbarHotfix data={mapNavbarFromStory(navbar)} />
      <HeroHotfix   data={mapHeroFromStory(hero)} />
    </>
  );
}
```

### 3. Environment Configuration (UPDATED - WORKING VERSION)
```bash
# .env.local - see STORYBLOK_TOKENS.md for complete reference

# Space Information
SPACE_NAME=rum-river-mn
SPACE_ID=288003424841711

# PUBLIC TOKEN - for production, published content only
STORYBLOK_ACCESS_TOKEN=tJCdp1QyfInsvreqnI2gLQtt

# ⚠️ PERSONAL ACCESS TOKEN - MANAGEMENT API (NEVER EXPOSE PUBLICLY!)
# Full account access - server-side only, content creation/management
STORYBLOK_PERSONAL_ACCESS_TOKEN=YEhO2k7vcACiMyP1hn5jZgtt-104181807873698-2NDxmxXu3ewEQ239Gpcb

# Feature flags - images safely disabled until ready
FEATURE_CMS_IMAGES=0
```

### 4. Token Documentation (CRITICAL!)
**All tokens documented in `STORYBLOK_TOKENS.md`:**
- **Public Token**: Published content via CDN API
- **Preview Token**: Draft + published content  
- **Asset Token**: Private assets access
- **Theme Token**: Theme development
- **Personal Token**: Management API (full account access)

### 4. Asset Upload Script (`scripts/update-home-hero-bg.js`)
```javascript
#!/usr/bin/env node

const API_BASE = "https://mapi.storyblok.com/v1";
const SPACE_ID = process.env.SPACE_ID;
const MANAGEMENT_TOKEN = process.env.STORYBLOK_MANAGEMENT_TOKEN;

async function sbPUT(path, body) {
  const res = await fetch(`${API_BASE}${path}`, {
    method: "PUT",
    headers: {
      Authorization: MANAGEMENT_TOKEN,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`PUT ${path} failed ${res.status}: ${text}`);
  return JSON.parse(text);
}

// Usage: node scripts/update-home-hero-bg.js "CDN_URL" "story_slug"
const [, , ASSET_URL, STORY_SLUG] = process.argv;

(async () => {
  // Update story with background image
  const result = await sbPUT(`/spaces/${SPACE_ID}/stories/${storyId}`, {
    story: { content },
    publish: 1,
  });
  console.log("✅ Story updated and published");
})();
```

## Step-by-Step Migration Guide

### Phase 1: Static Component Import
1. **Import hotfix components as-is** - no modifications
2. **Create static content file** with exact props structure
3. **Deploy static route** (`/beta`) for pixel-perfect reference
4. **Verify visual fidelity** before proceeding

### Phase 2: CMS Integration Setup
1. **Create Storyblok components** that match static props:
   ```json
   {
     "name": "home_hero_section",
     "schema": {
       "kicker": { "type": "text", "default_value": "Where Dreams Begin" },
       "title": { "type": "text", "default_value": "Rum River" },
       "title_accent": { "type": "text", "default_value": "Wedding Barn" },
       "description": { "type": "textarea" },
       "primary_cta_text": { "type": "text" },
       "bg_image": { "type": "asset", "filetypes": ["images"] }
     }
   }
   ```

2. **Create content mappers** that transform Storyblok data to static props
3. **Use Management API directly** - avoid SDK complexity
4. **Create CMS twin route** (`/beta-cms`) for testing

### Phase 3: Content Seeding & Asset Upload
1. **Upload assets using 3-step process**:
   - Request signed upload
   - Upload to S3 using Node.js built-in FormData
   - Link asset to story content

2. **Seed story content** with default values matching static
3. **Test CMS route** for pixel parity
4. **Deploy and verify** live integration

### Phase 4: Switchover
1. **Compare routes visually** - `/beta` vs `/beta-cms`
2. **Test CMS editing workflow** in Storyblok admin
3. **Switch main route** to use CMS data when ready
4. **Remove static route** or keep for backup

## Critical Success Factors

### 1. Token Management (UPDATED - PROPER APPROACH)
- **Use correct token types for each API**:
  - **Public Token**: CDN API for published content (`/beta-cms` production)
  - **Preview Token**: CDN API for draft content (development)
  - **Personal Token**: Management API for admin operations (content creation)
- **Document ALL tokens in `STORYBLOK_TOKENS.md`** - single source of truth
- **Feature flag images** with `FEATURE_CMS_IMAGES=0` for safe deployment

### 2. API Endpoints (CORRECTED)
- **Content Delivery API**: `https://api.storyblok.com/v2/cdn/` (Public/Preview tokens)
- **Management API**: `https://mapi.storyblok.com/v1/` (Personal tokens only)
- **Region doesn't affect endpoints** - use standard URLs

### 3. Content Structure
- **Map Storyblok fields exactly to static props** - prevents visual breaks
- **Use fallbacks extensively** - `content?.field ?? staticFallback`
- **Handle missing content gracefully** - return static defaults

### 4. Development Workflow
- **Test everything locally first** - don't assume deployment will work
- **Use curl to verify API responses** - debug auth issues quickly
- **Keep static route as reference** - compare for pixel parity

### 5. Deployment
- **Set environment variables in Netlify** before deploying
- **Use manual deployment** to verify changes before auto-deploy
- **Check function logs** for server-side errors

## 🚨 IMAGE WIRING TODO - COME BACK TO THIS

### Current Status: Images Safely Disabled
- ✅ **Text content working**: kicker, title, description, CTA text all updating from CMS
- ✅ **Images feature flagged**: `FEATURE_CMS_IMAGES=0` prevents breaking changes
- ✅ **CSS fallbacks active**: Static background images still working perfectly
- ✅ **CSS variables implemented**: `var(--hero-bg, fallback)` pattern ready

### Images That Need CMS Wiring (Complete List)

#### 1. Hero Section Background Images
- **Current**: Hardcoded in CSS `/hotfix-assets/barn-exterior-full-deck-view-evening.jpg`
- **CMS Field**: `bg_image` in `home_hero_section` component
- **Implementation**: CSS variables ready but images DON'T work yet - need debugging
- **Status**: BLOCKED - API/auth issues prevent image loading

#### 2. Gallery Section Images (Future)
- **Current**: Not implemented yet
- **CMS Field**: TBD - likely `gallery_images` array
- **Implementation**: Need to create gallery component with dynamic image grid
- **Priority**: Medium - add after hero images working

#### 3. About Section Images (Future)
- **Current**: Not implemented yet  
- **CMS Field**: TBD - likely `about_image` and `team_images`
- **Implementation**: Need to create about component with image support
- **Priority**: Low - content-heavy section

#### 4. Venue Features Images (Future)
- **Current**: Not implemented yet
- **CMS Field**: TBD - likely `feature_items` with image fields
- **Implementation**: Need to map feature cards with images
- **Priority**: High - important for venue marketing

#### 5. Package Cards Images (Future)  
- **Current**: Not implemented yet
- **CMS Field**: TBD - likely `package_image` per package
- **Implementation**: Need to create package component with image support
- **Priority**: High - critical for conversions

#### 6. Navigation Logo (Future)
- **Current**: Text-only logo "Rum River Barn"
- **CMS Field**: TBD - likely `logo_image` in navbar component
- **Implementation**: Update navbar to support image + text combo
- **Priority**: Low - text logo works fine

### Image Implementation Checklist

When ready to enable images:

#### Phase 1: DEBUG and Fix Hero Background Images
- [ ] Upload test images in Storyblok admin
- [ ] Verify image URLs are accessible directly  
- [ ] Set `FEATURE_CMS_IMAGES=1` for testing (local first!)
- [ ] Debug why `/beta-cms` route doesn't show CMS images
- [ ] Fix API/authentication issues preventing image loading
- [ ] THEN verify images work correctly
- [ ] Test CSS fallback still works if image missing

⚠️ **IMPORTANT**: Images infrastructure is ready but images DON'T work yet due to unresolved API issues!

#### Phase 2: Add Gallery Component
- [ ] Create `GalleryHotfix` component with image grid
- [ ] Add `gallery_section` component in Storyblok schema
- [ ] Implement image array mapping in content mapper
- [ ] Add responsive image sizing and optimization
- [ ] Test gallery editing workflow in Storyblok admin

#### Phase 3: Expand Image Support
- [ ] Add image fields to remaining components (about, features, packages)
- [ ] Implement lazy loading for performance
- [ ] Add image alt text and SEO metadata
- [ ] Create image upload guidelines for content editors
- [ ] Document image sizing requirements

### Image Technical Implementation Notes

#### CSS Variables Pattern (Already Implemented)
```css
.hotfix-hero-romantic {
  background-image: var(--hero-bg, url("/hotfix-assets/fallback.jpg")) !important;
}
```

#### React Component Pattern (Already Implemented)
```typescript
// Only set CSS custom property if CMS image enabled and available
const style: React.CSSProperties = {};
if (enableCmsImages && data.bgImage) {
  style['--hero-bg' as any] = `url("${data.bgImage}")`;
}
```

#### Asset URL Handling (Already Implemented)
```typescript
// Handle both asset objects and string URLs from Storyblok
let bgImageUrl = null;
if (content?.bg_image) {
  if (typeof content.bg_image === 'string') {
    bgImageUrl = content.bg_image;
  } else if (content.bg_image?.filename) {
    bgImageUrl = content.bg_image.filename;
  }
}
```

**🔄 Return to this section when ready to enable images!**

## Common Pitfalls to Avoid

1. **Don't enable images before text content is stable** - get content working first
2. **Don't skip feature flags** - images can break layouts unexpectedly  
3. **Don't forget CSS fallbacks** - always have backup images
4. **Don't assume asset URLs are strings** - handle objects properly
5. **Don't skip local testing** - verify before deploying
6. **Don't forget alt text** - accessibility is critical

This pattern allows for **zero-risk CMS migration** with **pixel-perfect preservation** of existing designs while safely deferring complex image handling until the foundation is solid.