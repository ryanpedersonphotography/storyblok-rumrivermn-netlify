# Storyblok CMS Integration Guide

## What I Learned

### The Problem
- Started with static hotfix components that were pixel-perfect
- Needed to make content CMS-editable while maintaining exact visual fidelity
- Multiple token types caused confusion and authentication failures
- TypeScript module resolution issues with Storyblok SDK imports

### The Solution Pattern
- **Keep static components unchanged** - preserve pixel-perfect styling
- **Create CMS twin routes** - `/beta` (static) vs `/beta-cms` (CMS-driven)
- **Use content mappers** - transform Storyblok data to match static component props
- **Use Management API directly** - avoid SDK complexity and token issues

### Key Discoveries
1. **Management tokens work for everything** - no need for separate delivery tokens
2. **EU region uses default API endpoint** - `https://api.storyblok.com/v2` (not `api.eu.storyblok.com`)
3. **Direct fetch > SDK** - simpler, fewer dependencies, easier debugging
4. **Component mapping is critical** - Storyblok field names must map to existing props

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
  // Use the working management token instead of delivery token
  const token = process.env.STORYBLOK_MANAGEMENT_TOKEN;
  const url = `https://mapi.storyblok.com/v1/spaces/288003424841711/stories/104455170476316`;
  
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

### 3. Environment Configuration
```bash
# .env.local
STORYBLOK_MANAGEMENT_TOKEN=szELu2FhITIyhqwwnkCclQtt-104181807873698-6gB8c2-pNYzsiPocqTp-
STORYBLOK_REGION=eu
SPACE_ID=288003424841711
```

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

### 1. Token Management
- **Use Management API tokens for everything** - simpler than multiple token types
- **Management tokens can read + write** - no need for separate delivery tokens
- **Store tokens in environment variables** for both local and production

### 2. API Endpoints
- **EU Region**: `https://api.storyblok.com/v2` (default)
- **US Region**: `https://api-us.storyblok.com/v2`
- **Management API**: `https://mapi.storyblok.com/v1`

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

## Common Pitfalls to Avoid

1. **Don't modify static components** - keep them pixel-perfect
2. **Don't rely on SDKs** - direct fetch is more reliable
3. **Don't use multiple token types** - management token handles everything
4. **Don't assume delivery tokens work** - they often have permission issues
5. **Don't skip local testing** - verify before deploying
6. **Don't change API endpoints randomly** - stick to documented formats

This pattern allows for **zero-risk CMS migration** with **pixel-perfect preservation** of existing designs.