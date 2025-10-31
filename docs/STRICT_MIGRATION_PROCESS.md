# STRICT MIGRATION PROCESS - NO EDITORIAL CHANGES

## Core Rule
**COPY HOTFIX EXACTLY. TRANSFORM NAMES ONLY. ADD NOTHING. REMOVE ONLY !IMPORTANT.**

## Allowed Transformations (ONLY THESE)

### 1. Class Name Transformation
```css
/* Hotfix */
.hotfix-hero-title { }

/* Clean - ONLY change class name */
.hero__title { }
```

### 2. Remove !important
```css
/* Hotfix */
color: #FFF8E7 !important;

/* Clean - Remove !important only */
color: #FFF8E7;
```

### 3. Add Fallback to Existing var()
```css
/* Hotfix */
color: var(--theme-text-on-dark);

/* Clean - Add fallback to existing var() */
color: var(--theme-text-on-dark, #FFF8E7);
```

## FORBIDDEN Actions

❌ DO NOT add new properties
❌ DO NOT remove properties (except !important)
❌ DO NOT change values
❌ DO NOT add vendor prefixes not in hotfix
❌ DO NOT add animations not in hotfix
❌ DO NOT add media queries not in hotfix
❌ DO NOT add pseudo-elements not in hotfix
❌ DO NOT add pseudo-classes not in hotfix
❌ DO NOT "improve" or "optimize" anything
❌ DO NOT use different units (px vs rem, etc)
❌ DO NOT add comments beyond what exists
❌ DO NOT reorder properties
❌ DO NOT consolidate or expand shorthand
❌ DO NOT add fallback fonts
❌ DO NOT add background gradients
❌ DO NOT add text effects
❌ DO NOT make ANY design decisions

## Step-by-Step Process

### For Each Section (e.g., "Spaces"):

**Step 1: Read Hotfix CSS Completely**
```bash
Read: src/styles/hotfix/spaces-styles.css
# Read ENTIRE file, every line
```

**Step 2: Create Semantic CSS - Line by Line Copy**

Open two files side by side:
- Left: hotfix CSS (source)
- Right: semantic CSS (destination)

For each line in hotfix:
1. Copy line exactly
2. IF line contains `.hotfix-[name]`, replace with `.BEM-equivalent`
3. IF line contains `!important`, remove it
4. IF line contains `var(--token)` without fallback, add `, fallback-value)`
5. Write line to semantic CSS
6. Move to next line

**DO NOT:**
- Skip lines
- Add lines
- Change property names
- Change property values
- Change property order
- Make any judgment calls

**Step 3: Verify Property Count**
```bash
# Count properties in hotfix
grep -o ":" src/styles/hotfix/spaces-styles.css | wc -l

# Count properties in semantic (excluding !important removals)
grep -o ":" src/styles/semantic/spaces.css | wc -l

# MUST be equal (or semantic = hotfix - 1 for each !important removed)
```

**Step 4: Run Computed Style Verification**
```typescript
// For EVERY element with class in section:
// 1. Get computed styles from hotfix
// 2. Get computed styles from clean
// 3. Compare ALL properties
// 4. FAIL if ANY difference exists
```

**Step 5: Report to User**
Show:
- Properties copied: X
- !important removed: Y
- Fallbacks added: Z
- Computed styles match: ✅/❌

**DO NOT proceed to next section until user approves.**

## Verification Script Template

```typescript
test('verify [section] has zero design mutations', async ({ page }) => {
  // Get all elements in section
  const hotfixElements = await page.$$('.hotfix-[section] *');
  const cleanElements = await page.$$('.[section] *');

  // For each element
  for (let i = 0; i < hotfixElements.length; i++) {
    const hotfixProps = await getAllComputedStyles(hotfixElements[i]);
    const cleanProps = await getAllComputedStyles(cleanElements[i]);

    // Compare EVERY property
    for (const prop in hotfixProps) {
      if (hotfixProps[prop] !== cleanProps[prop]) {
        throw new Error(`MUTATION DETECTED in ${prop}: ${hotfixProps[prop]} vs ${cleanProps[prop]}`);
      }
    }
  }
});
```

## Example: Correct Transformation

### Hotfix CSS (Source)
```css
.hotfix-spaces-container {
  display: flex !important;
  padding: 4rem 2rem !important;
  background: var(--theme-bg-primary) !important;
  max-width: 1200px !important;
}

.hotfix-spaces-title {
  font-size: 2.5rem !important;
  color: var(--theme-text-primary) !important;
  margin-bottom: 2rem !important;
}
```

### Clean CSS (Result)
```css
.spaces__container {
  display: flex;
  padding: 4rem 2rem;
  background: var(--theme-bg-primary, #FBF8F4);
  max-width: 1200px;
}

.spaces__title {
  font-size: 2.5rem;
  color: var(--theme-text-primary, #2C2416);
  margin-bottom: 2rem;
}
```

### What Changed:
1. Class names: `.hotfix-spaces-*` → `.spaces__*`
2. Removed: `!important` (5 instances)
3. Added: Fallback values to `var()` (2 instances)
4. **NOTHING ELSE**

### Property Count Verification:
- Hotfix properties: 8
- Clean properties: 8 ✅
- Added properties: 0 ✅
- Removed properties: 0 ✅

## If Unsure

**STOP. DO NOT GUESS.**

If ANY of these situations occur:
- Hotfix CSS is unclear
- Class naming is ambiguous
- Fallback value is unknown
- Property seems wrong

**ASK USER. DO NOT PROCEED.**

## Summary

This is a **mechanical transformation**, not design work.

Think of it as:
- Find & Replace for class names
- Delete for !important
- Append for fallbacks

**NO creativity. NO improvements. NO design decisions.**
