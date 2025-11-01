# FAQ Component Migration Guide
## From Legacy `Section` to Modern `SectionShell` + `SectionLayout`

---

## Migration Summary

The FAQ component was selected as the **first migration candidate** because it represents the simplest use case:
- Single-column, centered layout
- No complex grid or responsive behavior
- Self-contained accordion functionality
- Minimal visual variations

This migration demonstrates the core patterns that will be applied to more complex components.

---

## Step-by-Step Migration Process

### Step 1: Analyze the Original Component

**File**: `src/components/clean/FAQ.tsx`

**Key Characteristics**:
- Uses `Section` component with these props:
  ```tsx
  <Section
    as="section"
    align="center"
    width="prose"        // Narrow width for readability
    paddingY="lg"        // Large vertical padding
    background="surface" // Clean surface background
    header={{
      scriptAccent: subtitle,
      title: title,
      align: 'center'
    }}
    className="faq-accordion"
    data-section="faq"
  >
  ```
- Contains accordion logic (useState for open/close)
- Handles Storyblok data with multiple fallback fields
- Renders rich text from Storyblok

### Step 2: Create the Modern Component

**File**: `src/components/clean/FAQModern.tsx`

**Key Changes**:
1. **Import Changes**:
   ```tsx
   // OLD
   import Section from '@/components/ui/Section'
   
   // NEW
   import SectionShell from '@/components/ui/SectionShell'
   import SectionLayout from '@/components/ui/SectionLayout'
   ```

2. **Component Structure**:
   ```tsx
   // OLD: Single Section component
   <Section {...props}>
     <div className="faq-list">...</div>
   </Section>
   
   // NEW: Separated Shell + Layout
   <SectionShell {...visualProps}>
     <SectionLayout {...contentProps}>
       <div className="faq-list">...</div>
     </SectionLayout>
   </SectionShell>
   ```

3. **Props Mapping**:
   ```tsx
   // Visual frame props → SectionShell
   <SectionShell
     as="section"           // Semantic element
     container="prose"      // Width constraint
     paddingY="lg"          // Vertical spacing
     background="surface"   // Background color
     tone="auto"           // Text tone (auto-adapts to theme)
     className="faq-accordion-modern"
     data-section="faq"
   >
   
   // Content orchestration → SectionLayout
   <SectionLayout
     variant="legacy-full-centered"  // Named preset
     rails={{
       headerWidth: 'prose',
       contentWidth: 'prose',
       align: 'center'
     }}
     header={{
       kicker: subtitle,     // Script accent text
       title: title,
       align: 'center'
     }}
   >
   ```

### Step 3: Update CSS for Compatibility

**Original**: `src/styles/components/faq.css`
- Only targeted `.faq-accordion` class

**Solution**: Created `src/styles/components/faq-modern.css`
- Duplicates all selectors for `.faq-accordion-modern`
- Ensures both components render identically
- Maintains all interactive states (hover, focus, open/close)

```css
/* Works with both legacy and modern */
[data-clean-root="true"] .faq-accordion .faq-list,
[data-clean-root="true"] .faq-accordion-modern .faq-list {
  display: flex;
  flex-direction: column;
}
```

### Step 4: Create Visual Comparison

**File**: `src/app/demo/modern-sections/page.tsx`

Added side-by-side comparison:
```tsx
{/* OLD FAQ */}
<FAQ blok={faqData} />

{/* NEW FAQ */}
<FAQModern blok={faqData} />
```

This allows for:
- Visual regression testing
- Style comparison
- Functionality verification
- Performance comparison

### Step 5: Add Automated Tests

**File**: `tests/section-migration.spec.ts`

Added specific FAQ migration test:
```typescript
test('FAQ: Legacy vs Modern comparison', async ({ page }) => {
  // Compare computed styles
  const oldStyles = await getComputedStyles(page, '.faq-accordion ...');
  const newStyles = await getComputedStyles(page, '.faq-accordion-modern ...');
  
  // Assert minimal differences
  expect(compareStyles(oldStyles, newStyles).differences.length)
    .toBeLessThanOrEqual(2);
  
  // Test accordion functionality
  await oldButton.click();
  await newButton.click();
  expect(oldAnswerVisible).toBe(true);
  expect(newAnswerVisible).toBe(true);
});
```

---

## Migration Patterns Established

### 1. Separation of Concerns

**Before**: Single `Section` component handles everything
**After**: 
- `SectionShell`: Visual frame (background, padding, tone)
- `SectionLayout`: Content orchestration (header, grid, alignment)

### 2. Props Migration Map

| Old Section Prop | New Component | New Prop |
|-----------------|---------------|-----------|
| `align` | SectionShell | `align` |
| `width` | SectionShell | `container` |
| `paddingY` | SectionShell | `paddingY` |
| `background` | SectionShell | `background` |
| `header` | SectionLayout | `header` |
| `className` | SectionShell | `className` |
| `variant` | SectionLayout | `variant` |

### 3. Named Variants

Instead of configuring every prop, use named presets:
- `legacy-full-centered`: Everything centered (FAQ, testimonials)
- `header-center-content-left`: Mixed alignment (features, services)
- `gallery-masonry`: Gallery grid layout
- `split-hero`: Two-column with media

### 4. CSS Migration Strategy

**Option 1**: Update existing CSS to support both classes
```css
.old-class,
.new-class { /* styles */ }
```

**Option 2**: Create new CSS file for modern component
- Cleaner separation
- Easier to remove legacy later
- No risk of breaking existing component

### 5. Testing Approach

1. **Visual Comparison**: Side-by-side rendering
2. **Style Validation**: Computed styles comparison
3. **Functionality Testing**: Interactive behavior
4. **Responsive Testing**: Multiple viewports
5. **Theme Testing**: Dark/light mode support

---

## Benefits Realized

### 1. Cleaner Architecture
- Single responsibility principle
- Easier to understand and maintain
- Better TypeScript types

### 2. Improved Performance
- Container queries instead of viewport queries
- Better component isolation
- Reduced CSS specificity battles

### 3. Enhanced Flexibility
- Mix and match visual frames with content layouts
- Easier to create new variations
- Reusable patterns across components

### 4. Future-Proof
- Modern CSS features (container queries, logical properties)
- Radix UI compatibility (asChild pattern ready)
- Token-driven design system

---

## Next Steps for Other Components

### Simple Components (Priority 1)
Apply same pattern to:
- **BrandProof**: Full-bleed with rose tint
- **Map**: Two-column with iframe

### Medium Complexity (Priority 2)
- **Gallery**: Masonry grid needs `variant="gallery-masonry"`
- **Spaces**: Already uses wrapper mode, direct port

### Complex Components (Priority 3)
- **Hero**: Multiple overlays, complex positioning
- **Footer**: Multi-column, site-wide impact
- **Navbar**: Sticky behavior, navigation states

---

## Rollback Plan

If issues arise:
1. Keep both components in parallel
2. Use feature flag to switch:
   ```tsx
   const FAQ = process.env.USE_MODERN ? FAQModern : FAQLegacy
   ```
3. No data changes required
4. CSS supports both versions

---

## Commands

```bash
# View comparison
npm run dev
# Navigate to: http://localhost:6666/demo/modern-sections

# Run migration tests
npx playwright test tests/section-migration.spec.ts

# Check specific component
npx playwright test -g "FAQ"

# Visual regression screenshots
npx playwright test --update-snapshots
```

---

## Conclusion

The FAQ migration establishes a repeatable pattern for modernizing all Section-based components. The separation of visual frame (Shell) from content orchestration (Layout) provides better maintainability, performance, and flexibility while maintaining full backward compatibility.