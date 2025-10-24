# Visual Editor-First Workflow Guide

## Overview

This guide documents our **Visual Editor-first approach** to implementing Storyblok components. Unlike traditional migration workflows that build static components first and wire them to CMS later, we integrate Storyblok from the start to enable immediate live editing.

## Why Visual Editor-First?

### Traditional Approach (What We DON'T Do)
```
1. Build static React component
2. Test with hardcoded data
3. Create Storyblok schema
4. Wire component to Storyblok
5. Test in Visual Editor
```

### Our Approach (Visual Editor-First)
```
1. Create Storyblok schema FIRST
2. Build component WITH Storyblok integration
3. Test in Visual Editor IMMEDIATELY
4. Iterate with live content editing
```

### Benefits
- **No Double Work**: Build once with CMS integration
- **Immediate Feedback**: See content changes in real-time
- **Better DX**: Content editors can start working sooner
- **Fewer Bugs**: Catch integration issues early

---

## Component Implementation Workflow

### Step 1: Create Storyblok Schema

**Before writing any code**, create the component schema in Storyblok:

1. **Navigate to Storyblok**: Block Library → New Block
2. **Name the Block**: Use kebab-case (e.g., `hero-section`, `alternating-blocks`)
3. **Add Fields**: Match the component's data requirements

**Example: Hero Section Schema**
```
Block Name: hero-section
Fields:
  - kicker (text) - Script accent text
  - title (text) - Main title
  - title_accent (text) - Highlighted portion
  - description (textarea) - Hero description
  - primary_cta_text (text) - Button text
  - scroll_text (text) - Scroll indicator text
  - bg_image (asset) - Background image
```

**Best Practices:**
- Use snake_case for field names (Storyblok convention)
- Add field descriptions for content editors
- Set default values where appropriate
- Mark required fields

### Step 2: Build Component with Storyblok Integration

Create component in `/src/components/storyblok/[ComponentName]Editor.tsx`:

**Template Pattern:**
```tsx
'use client'

import React from 'react'
import { storyblokEditable } from '@storyblok/react'

interface [ComponentName]EditorProps {
  blok: any
}

export default function [ComponentName]Editor({ blok }: [ComponentName]EditorProps) {
  return (
    <section className="hotfix-[component-class]" {...storyblokEditable(blok)}>
      {/* Component markup using blok.field_name */}
      <h1>{blok.title || 'Default Title'}</h1>
      {/* Always provide fallbacks with || operator */}
    </section>
  )
}
```

**Key Requirements:**
1. ✅ `'use client'` directive (Visual Editor needs client-side)
2. ✅ Import `storyblokEditable` from `@storyblok/react`
3. ✅ Spread `{...storyblokEditable(blok)}` on wrapper element
4. ✅ Use `blok.field_name` to access content
5. ✅ Provide fallback values with `||` operator
6. ✅ Keep original CSS classes (e.g., `hotfix-hero-romantic`)

### Step 3: Register Component in Storyblok

Add component mapping in `/src/lib/storyblok.ts`:

```tsx
import HeroEditor from '@/components/storyblok/HeroEditor'
import AlternatingBlocksEditor from '@/components/storyblok/AlternatingBlocksEditor'
// Add new component import

export const storyblokComponents = {
  'hero-section': HeroEditor,
  'alternating-blocks': AlternatingBlocksEditor,
  // Add new component mapping
}
```

**Component Name Matching:**
- Storyblok schema name (kebab-case): `hero-section`
- Component mapping key: `'hero-section'`
- React component: `HeroEditor`

### Step 4: Add Component to Home Story

In Storyblok UI:

1. Navigate to **Content** → **Home** story
2. Add block to `body` field
3. Select your component (e.g., `hero-section`)
4. Fill in content fields
5. **Save** (Draft mode)

### Step 5: Test in Visual Editor

**Access Visual Editor Route:**
```
http://localhost:9999/home-live
```

**What to Test:**

✅ **Visual Highlighting**
- Click component in Visual Editor
- Blue outline should appear around component
- Click should open field editor panel

✅ **Live Editing**
- Change text in field editor
- Content updates immediately (no page reload)
- Changes reflect in real-time

✅ **Image Updates**
- Upload new image in asset field
- Image updates in Visual Editor immediately

✅ **Bridge Communication**
- Check browser console for bridge messages
- Should see: `StoryblokBridge loaded`, `visual-editor-event`
- No errors about missing components

**Troubleshooting Live Editing:**

| Issue | Solution |
|-------|----------|
| No blue outline | Check `storyblokEditable()` is on wrapper element |
| Changes don't update | Verify `'use client'` directive present |
| Component not found | Check component name matches in mapping |
| Bridge not loading | Check `/home-live/ClientBridge.tsx` included |
| Still seeing old content | Clear browser cache, hard refresh |

### Step 6: Add to Production Route (Optional)

Once tested, add component to main route:

**File:** `/src/app/page.tsx` or `/src/app/[[...slug]]/page.tsx`

```tsx
import { fetchStory } from '@/lib/storyblok'
import StoryblokComponent from '@/components/storyblok/StoryblokComponent'

export default async function HomePage() {
  const story = await fetchStory('home', 'published')

  return (
    <>
      {story?.content?.body?.map((blok: any) => (
        <StoryblokComponent key={blok._uid} blok={blok} />
      ))}
    </>
  )
}
```

---

## Storyblok Schema Patterns

### Simple Text Fields
```
Field Name: title
Type: Text
Default Value: "Default Title"
Required: Yes
```

### Rich Text / Textarea
```
Field Name: description
Type: Textarea
Default Value: "Default description text"
Max Length: 500 (optional)
```

### Asset (Image/File)
```
Field Name: bg_image
Type: Asset
File Types: Images only
Required: No
```

### Repeatable Blocks (Nested Content)
```
Field Name: blocks
Type: Blocks
Allow: alternating-block-item (custom block)
Minimum: 1
Maximum: 10
```

**Example: Nested Block Structure**
```
Parent Block: alternating-blocks
  - title (text)
  - description (textarea)
  - blocks (blocks) → References: alternating-block-item

Child Block: alternating-block-item
  - number (text)
  - title (text)
  - lead (text)
  - content (textarea)
  - image (asset)
  - is_reverse (boolean)
```

---

## Component Code Patterns

### Pattern 1: Simple Text Content
```tsx
<h1>{blok.title || 'Default Title'}</h1>
<p>{blok.description || 'Default description'}</p>
```

### Pattern 2: Image Handling
```tsx
const bgImage = typeof blok.bg_image === 'string'
  ? blok.bg_image
  : blok.bg_image?.filename || '/fallback-image.jpg'

<img src={bgImage} alt={blok.image_alt || 'Description'} />
```

### Pattern 3: CSS Custom Properties
```tsx
const style: React.CSSProperties = {}
style['--hero-bg' as any] = `url("${bgImage}")`

<section style={style}>
  {/* Background applied via CSS var */}
</section>
```

### Pattern 4: Repeatable Blocks
```tsx
{(blok.blocks || []).map((block: any, index: number) => (
  <div
    key={block._uid || index}
    {...storyblokEditable(block)}
  >
    <h3>{block.title}</h3>
    <p>{block.content}</p>
  </div>
))}
```

**Important**: Nested blocks also need `storyblokEditable()` for individual editing!

### Pattern 5: Conditional Rendering
```tsx
{blok.show_cta && (
  <a href={blok.cta_link || '#'}>
    {blok.cta_text || 'Learn More'}
  </a>
)}
```

---

## Visual Editor URLs & Configuration

### Development URLs
```bash
# Visual Editor route (live editing)
http://localhost:9999/home-live

# Standard preview route
http://localhost:9999/

# API preview route (enables Draft Mode)
http://localhost:9999/api/preview?secret=YOUR_SECRET&slug=home
```

### Storyblok Visual Editor Configuration

**In Storyblok Dashboard:**
1. Navigate to **Settings** → **Visual Editor**
2. Set **Default Environment**:
   ```
   Location (Default): https://your-site.netlify.app/home-live
   Location (Development): http://localhost:9999/home-live
   ```
3. Save changes

**Preview URL Configuration:**
1. Navigate to story (e.g., **Home**)
2. Click **Config** tab
3. Set **Real Path**: `/home-live`
4. Save

---

## Testing Checklist

### Visual Editor Testing
- [ ] Component renders in Visual Editor
- [ ] Blue outline appears when clicking component
- [ ] Field editor panel opens on click
- [ ] Text changes update immediately
- [ ] Image changes update immediately
- [ ] Nested blocks are individually editable
- [ ] No console errors about missing components
- [ ] Bridge loaded message in console
- [ ] Router refresh triggered on changes

### Production Testing
- [ ] Component renders on production route
- [ ] Published content shows correctly
- [ ] Images load properly
- [ ] No hydration errors
- [ ] Fallback values work when fields empty
- [ ] Component styling matches design

### Responsive Testing
- [ ] Mobile (375px) - Component stacks/adapts
- [ ] Tablet (768px) - Layout adjusts appropriately
- [ ] Desktop (1440px) - Full design visible
- [ ] Large screens (1920px+) - Max-width constraints work

---

## Common Issues & Solutions

### Issue: "Component not found" error

**Cause:** Component not registered in mapping

**Solution:**
```tsx
// In /src/lib/storyblok.ts
export const storyblokComponents = {
  'your-component-name': YourComponentEditor,
}
```

### Issue: Changes don't update in Visual Editor

**Cause:** Missing `'use client'` directive

**Solution:**
```tsx
'use client'  // Add this at top of file

import React from 'react'
// ... rest of file
```

### Issue: Blue outline doesn't appear

**Cause:** Missing `storyblokEditable()` wrapper

**Solution:**
```tsx
// Add this to wrapper element
<section {...storyblokEditable(blok)}>
```

### Issue: Seeing old/cached content

**Cause:** Next.js caching or Storyblok CDN cache

**Solution:**
```bash
# Clear Next.js cache
rm -rf .next

# Hard refresh browser
Cmd+Shift+R (Mac) or Ctrl+Shift+R (Windows)

# Add cache busting to fetch
# (Already implemented in /home-live route)
```

### Issue: Bridge not loading

**Cause:** ClientBridge component not included

**Solution:**
```tsx
// In page.tsx
import ClientBridge from './ClientBridge'

export default function Page() {
  return (
    <>
      <ClientBridge story={story} />
      {/* Content */}
    </>
  )
}
```

### Issue: Images not loading

**Cause:** Image URL formatting issue

**Solution:**
```tsx
// Handle both string and object formats
const imageUrl = typeof blok.image === 'string'
  ? blok.image
  : blok.image?.filename || '/fallback.jpg'
```

---

## Migration Phase Integration

### Updated Phase Workflow

Each migration phase now follows this pattern:

**1. Pre-Implementation**
- [ ] Read migration docs for section
- [ ] Review component code in `/code/` folder
- [ ] Study original CSS in `/styles/` folder

**2. Storyblok Schema Setup** ⭐ NEW
- [ ] Create block in Storyblok Block Library
- [ ] Add all required fields
- [ ] Set field types and defaults
- [ ] Test schema in Storyblok UI

**3. Component Implementation**
- [ ] Create `[Component]Editor.tsx` in `/src/components/storyblok/`
- [ ] Add `storyblokEditable()` wrapper
- [ ] Map `blok.field_name` to component props
- [ ] Add fallback values for all fields
- [ ] Copy CSS to project styles

**4. Registration**
- [ ] Add component to mapping in `storyblok.ts`
- [ ] Register component in Storyblok settings

**5. Visual Editor Testing** ⭐ NEW
- [ ] Access `/home-live` route
- [ ] Test live editing functionality
- [ ] Verify blue outline on click
- [ ] Check immediate content updates
- [ ] Test image upload and preview

**6. Production Integration**
- [ ] Add component to main route
- [ ] Test with published content
- [ ] Verify fallbacks work
- [ ] Deploy to staging/production

**7. Git Workflow**
```bash
git checkout -b feat/[component]-migration
# Implement component
git add .
git commit -m "feat: implement [component] with Visual Editor support"
# Test thoroughly
git checkout main
git merge feat/[component]-migration
git push origin main
```

---

## Best Practices

### 1. Always Provide Fallbacks
```tsx
// Good
{blok.title || 'Default Title'}

// Bad
{blok.title}
```

### 2. Handle Image Objects
```tsx
// Good
const image = blok.image?.filename || blok.image || '/fallback.jpg'

// Bad
const image = blok.image
```

### 3. Use Semantic Keys for Lists
```tsx
// Good
{blocks.map((block) => <div key={block._uid}>...</div>)}

// Acceptable fallback
{blocks.map((block, i) => <div key={block._uid || i}>...</div>)}

// Bad
{blocks.map((block, i) => <div key={i}>...</div>)}
```

### 4. Nest storyblokEditable for Nested Blocks
```tsx
<section {...storyblokEditable(blok)}>
  {blok.blocks.map((block) => (
    <div key={block._uid} {...storyblokEditable(block)}>
      {/* Block content */}
    </div>
  ))}
</section>
```

### 5. Use 'use client' Only When Needed
```tsx
// Visual Editor components: ALWAYS use 'use client'
'use client'

// Regular page components: Can be server components
// (No 'use client' directive)
```

---

## Example: Complete Component Implementation

### 1. Storyblok Schema
```
Block Name: testimonial-section
Fields:
  - script_accent (text) - "Kind Words"
  - title (text) - Section title
  - testimonials (blocks) → testimonial-item

Nested Block: testimonial-item
  - quote (textarea) - Customer quote
  - author (text) - Customer name
  - role (text) - "Bride" or "Groom"
  - image (asset) - Customer photo
```

### 2. Component Code
```tsx
'use client'

import React from 'react'
import { storyblokEditable } from '@storyblok/react'

interface TestimonialSectionEditorProps {
  blok: any
}

export default function TestimonialSectionEditor({ blok }: TestimonialSectionEditorProps) {
  return (
    <section className="hotfix-testimonials" {...storyblokEditable(blok)}>
      <div className="hotfix-section-header">
        <div className="hotfix-script-accent">
          {blok.script_accent || 'Kind Words'}
        </div>
        <h2>{blok.title || 'What Our Couples Say'}</h2>
      </div>

      <div className="hotfix-testimonials-grid">
        {(blok.testimonials || []).map((testimonial: any) => (
          <div
            key={testimonial._uid}
            className="hotfix-testimonial-card"
            {...storyblokEditable(testimonial)}
          >
            <blockquote>{testimonial.quote || 'Testimonial quote'}</blockquote>
            <div className="hotfix-testimonial-author">
              {testimonial.image?.filename && (
                <img src={testimonial.image.filename} alt={testimonial.author} />
              )}
              <div>
                <strong>{testimonial.author || 'Author Name'}</strong>
                <span>{testimonial.role || 'Role'}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
```

### 3. Registration
```tsx
// In /src/lib/storyblok.ts
import TestimonialSectionEditor from '@/components/storyblok/TestimonialSectionEditor'

export const storyblokComponents = {
  'testimonial-section': TestimonialSectionEditor,
}
```

### 4. Testing
```bash
# Start dev server
npm run dev

# Open Visual Editor
open http://localhost:9999/home-live

# In Storyblok:
# 1. Add testimonial-section block to Home story
# 2. Fill in content
# 3. Verify live editing works
```

---

## Resources

- **Storyblok Docs**: https://www.storyblok.com/docs/guide/essentials/visual-editor
- **Next.js Integration**: https://www.storyblok.com/tp/nextjs-headless-cms-guide
- **storyblokEditable**: https://github.com/storyblok/storyblok-js-client#storyblok-editable

---

## Summary

**Visual Editor-First Workflow:**
1. ✅ Create Storyblok schema FIRST
2. ✅ Build component WITH `storyblokEditable()`
3. ✅ Test in Visual Editor IMMEDIATELY
4. ✅ Iterate with live content
5. ✅ Deploy to production route

**Key Difference from Traditional Approach:**
- No static component phase
- No separate CMS wiring phase
- Storyblok integration from the start
- Immediate live editing feedback

This approach eliminates double work and enables faster iteration with real content.
