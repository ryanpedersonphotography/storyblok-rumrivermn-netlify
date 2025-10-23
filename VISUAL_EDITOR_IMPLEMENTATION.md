# Storyblok Visual Editor Implementation Plan

**Objective**: Implement live-editing Visual Editor for Storyblok with Next.js 15 App Router

## Implementation Decisions Applied

- ✅ **Next.js 15**: Proceed with current version, use bridge + preview pattern
- ✅ **Token naming**: Support both names with internal standardization
- ✅ **Bridge**: Use official `useStoryblokBridge()` from `@storyblok/react/rsc`
- ✅ **Preview secret**: Generate random UUID for `STORYBLOK_PREVIEW_SECRET`
- ✅ **Client components**: Simple client-first approach for `/home-live`
- ✅ **Component registration**: Register actual components in SDK init

## Hard Rules

- 🔒 **Preview token server-only** (never client-side)
- 🎯 **Blok-first on `/home-live`** (not mapped props)
- 🚫 **Don't touch `/beta-cms`** (leave unchanged)

---

## PHASE 0 — Preflight

### Environment Setup
- [x] Add HTTPS flag to package.json: `"dev": "next dev --experimental-https -p 3333"`
- [x] Generate random UUID for preview secret: `fde8cacd-5cd0-484a-a501-60afa7e4a457`
- [x] Create/update `.env.local` with required tokens:
  - [x] `STORYBLOK_PUBLIC_TOKEN` (alias of existing STORYBLOK_ACCESS_TOKEN)
  - [x] `STORYBLOK_PREVIEW_TOKEN` (existing)
  - [x] `STORYBLOK_PREVIEW_SECRET` (new UUID)

### Sanity Check
- [x] ✅ Server starts on port 3333 (HTTP fallback due to cert issues)
- [ ] ✅ HTTPS certificate setup (requires manual intervention)

### Notes
- HTTPS certificate generation failed due to permissions, but server runs on HTTP
- Visual Editor will require HTTPS for production, but we can proceed with development

---

## PHASE 1 — Draft Mode Route

### API Route Creation
- [ ] Create `src/app/api/preview/route.ts`
- [ ] Implement GET handler with:
  - [ ] Validate `?secret` parameter against `STORYBLOK_PREVIEW_SECRET`
  - [ ] Call `draftMode().enable()`
  - [ ] Redirect to `slug` parameter or `/home-live`

### Sanity Check
- [ ] ✅ Hitting `/api/preview?secret=<uuid>&slug=/home-live` sets draft cookie
- [ ] ✅ Route redirects correctly to specified slug
- [ ] ✅ Invalid secret returns 401 status

---

## PHASE 2 — SDK Init + Component Registration

### Storyblok SDK Setup
- [ ] Create/update `src/lib/storyblok.ts` with:
  - [ ] `storyblokInit()` configuration
  - [ ] Token selection: `STORYBLOK_PUBLIC_TOKEN || STORYBLOK_ACCESS_TOKEN`
  - [ ] Component registration: `{ hero_section: HeroEditor, alternating_blocks_section: AlternatingBlocksEditor }`
  - [ ] API options: `{ region: 'eu' }`
- [ ] Export `getApi()` helper function

### Component Creation
- [ ] Create `HeroEditor` component (blok-first, client component)
- [ ] Create `AlternatingBlocksEditor` component (blok-first, client component)

### Sanity Check
- [ ] ✅ `StoryblokComponent` renders blocks by component name
- [ ] ✅ No SDK initialization errors in console
- [ ] ✅ Components accept `{ blok }` props correctly

---

## PHASE 3 — Live-Editing Route `/home-live`

### Route Implementation
- [ ] Create `src/app/home-live/page.tsx` (RSC wrapper)
- [ ] Implement story fetching:
  - [ ] Use `draftMode()` to determine version: `draft` vs `published`
  - [ ] Fetch story by slug using appropriate token
  - [ ] Pass `content.body` to client child component
- [ ] Create client child component for blok mapping

### Editor Components
- [ ] Update `HeroEditor`:
  - [ ] Accept only `{ blok }` prop
  - [ ] Render directly from `blok` fields
  - [ ] Add `{...storyblokEditable(blok)}` spread
- [ ] Update `AlternatingBlocksEditor`:
  - [ ] Accept only `{ blok }` prop
  - [ ] Render directly from `blok` fields
  - [ ] Add `{...storyblokEditable(blok)}` spread

### Sanity Check
- [ ] ✅ `/home-live` loads and displays content
- [ ] ✅ Component outlines appear in Visual Editor
- [ ] ✅ Components are clickable in VE iframe

---

## PHASE 4 — Bridge (Live Updates)

### Bridge Implementation
- [ ] Import `useStoryblokBridge` from `@storyblok/react/rsc`
- [ ] Mount bridge only on `/home-live` route
- [ ] Configure bridge to listen for: `['input', 'published', 'change']`
- [ ] Implement `router.refresh()` on bridge events

### Sanity Check
- [ ] ✅ Typing in VE field updates page instantly
- [ ] ✅ No hard refresh required for live updates
- [ ] ✅ Bridge only activates on `/home-live` route

---

## PHASE 5 — Visual Editor Settings

### Storyblok Admin Configuration
- [ ] Navigate to Settings → Visual Editor in Storyblok
- [ ] Set Default environment: `https://localhost:3333/home-live`
- [ ] Add preview URL: `https://<site>.netlify.app/home-live`
- [ ] Verify story slug configuration (use exact slug if nested)

### Sanity Check
- [ ] ✅ VE iframe loads over HTTPS
- [ ] ✅ Components highlight when clicked in VE
- [ ] ✅ Live editing works end-to-end
- [ ] ✅ Published content shows on production site

---

## Final Deliverables

### Documentation
- [ ] File changes summary
- [ ] Screenshots of Visual Editor working
- [ ] GIF/video of live editing in action
- [ ] Confirmation of all sanity checks passing

### Code Quality
- [ ] All TypeScript errors resolved
- [ ] Console warnings addressed
- [ ] Components follow blok-first pattern
- [ ] Security: Preview token remains server-only

---

## Environment Variables Required

```bash
# .env.local
STORYBLOK_PUBLIC_TOKEN=tJCdp1QyfInsvreqnI2gLQtt  # Public token (alias)
STORYBLOK_ACCESS_TOKEN=tJCdp1QyfInsvreqnI2gLQtt  # Public token (existing)
STORYBLOK_PREVIEW_TOKEN=AcBamY8QEHeF7Wid0UOgcAtt  # Preview token (existing)
STORYBLOK_PREVIEW_SECRET=[GENERATED_UUID]         # New UUID for draft mode
```

## Component Mapping

| Storyblok Component | React Component | Usage |
|---|---|---|
| `home_hero_section` | `HeroEditor` | Hero section with blok-first rendering |
| `alternating_blocks_section` | `AlternatingBlocksEditor` | Alternating content blocks |

---

**Status**: Ready to implement
**Branch**: `live-edits`
**Next Action**: Begin PHASE 0 implementation