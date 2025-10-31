# CSS Comparison System Documentation

## Overview

The CSS Comparison System is a Playwright-based testing tool that compares computed CSS styles between the hotfix and clean implementations of website sections. It enables precise visual parity verification during CSS migration by:

- Extracting actual rendered CSS values from the browser DOM
- Comparing 40+ CSS properties per section
- Applying intelligent tolerance for numeric values (1% default)
- Generating detailed JSON reports with severity classifications
- Supporting interactive state testing (hover, focus, active)

## Quick Start

### Run a single section comparison:

```bash
node compare-section.mjs hero
```

### Run all sections:

```bash
node compare-section.mjs all
```

### Adjust tolerance threshold:

```bash
node compare-section.mjs hero --tolerance=2
```

### Fail on critical differences:

```bash
node compare-section.mjs hero --fail-on-critical
```

## How It Works

### 1. Section Identification

All sections must have a `data-section` attribute for reliable identification:

```tsx
// Clean implementation
<section className="hero" data-section="hero">
  {/* content */}
</section>

// Hotfix implementation
<section id="hero" className="hotfix-hero" data-section="hero">
  {/* content */}
</section>
```

The system uses `[data-section="name"]` selectors to locate sections on both pages.

### 2. Style Extraction

For each section, the system extracts 40+ computed CSS properties using `window.getComputedStyle()`:

**Layout & Positioning:**
- `position`, `display`, `flexDirection`, `alignItems`, `justifyContent`, `gap`

**Dimensions:**
- `width`, `height`, `minWidth`, `minHeight`, `maxWidth`, `maxHeight`

**Spacing:**
- `margin`, `padding` (top, right, bottom, left)

**Colors:**
- `color`, `backgroundColor`, `borderColor`

**Typography:**
- `fontSize`, `fontWeight`, `fontFamily`, `lineHeight`, `letterSpacing`, `textAlign`

**Border & Effects:**
- `borderWidth`, `borderStyle`, `borderRadius`, `boxShadow`, `opacity`

**Transform & Z-index:**
- `transform`, `zIndex`

### 3. Intelligent Comparison

The comparison engine applies smart diffing logic:

#### Numeric Tolerance
Values within 1% (configurable) are considered matches:
```typescript
// Example: 16px vs 16.1px = MATCH (within 1%)
// Example: 16px vs 17px = DIFFERENCE (6.25% difference)
```

#### Color Normalization
Different color formats are normalized for comparison:
```typescript
rgb(255, 0, 0) === #ff0000 === red // All match
```

#### Severity Classification

**Match** - Values identical or within tolerance

**Minor** - Small differences (e.g., 1-2px off, similar but not exact colors)

**Warning** - Moderate differences that may affect visual appearance

**Critical** - Major differences that definitely impact appearance

### 4. Report Generation

Results are saved to `test-results/css-comparison-{section}.json`:

```json
{
  "section": "hero",
  "timestamp": "2025-10-30T12:34:56.789Z",
  "hotfixUrl": "https://localhost:9999/",
  "cleanUrl": "https://localhost:9999/clean",
  "matches": [
    {
      "property": "display",
      "hotfixValue": "flex",
      "cleanValue": "flex",
      "severity": "match"
    }
  ],
  "differences": [
    {
      "property": "padding",
      "hotfixValue": "80px",
      "cleanValue": "82px",
      "severity": "minor",
      "percentDiff": 2.5
    }
  ],
  "summary": {
    "totalProperties": 42,
    "matches": 40,
    "differences": 2,
    "minorDiffs": 2,
    "warningDiffs": 0,
    "criticalDiffs": 0
  }
}
```

## File Structure

```
tests/
├── utils/
│   ├── find-section-by-comment.ts    # Section detection utilities
│   ├── extract-styles.ts             # CSS extraction logic
│   └── compare-styles.ts             # Comparison engine
├── compare-css.spec.ts               # Main Playwright test suite
└── debug-data-section.spec.ts        # Debugging utilities

compare-section.mjs                    # CLI wrapper script
test-results/                          # Generated JSON reports
```

## Available Sections

The system supports comparison for all major sections:

- `hero` - Homepage hero section
- `faq` - FAQ accordion
- `testimonials` - Customer testimonials
- `gallery` - Love stories photo gallery
- `alternating-blocks` - Alternating content blocks
- `spaces` - Venue spaces carousel
- `experience` - Rum River experience
- `pricing` - Wedding packages
- `brand-proof` - Social proof/brands
- `schedule-form` - Contact/tour form
- `map` - Location map section
- `footer` - Site footer
- `navbar` - Site navigation (not on hotfix)

## Usage Examples

### Basic Comparison

```bash
# Compare hero section
node compare-section.mjs hero

# Output:
# ✅ Comparison successful!
# Results saved to: test-results/css-comparison-hero.json
```

### Comparing Multiple Sections

```bash
# Compare all sections
node compare-section.mjs all

# Or chain specific sections
for section in hero faq testimonials; do
  node compare-section.mjs $section
done
```

### Adjusting Tolerance

```bash
# More strict (0.5% tolerance)
node compare-section.mjs hero --tolerance=0.5

# More lenient (5% tolerance)
node compare-section.mjs hero --tolerance=5
```

### CI/CD Integration

```bash
# Fail build on critical differences
node compare-section.mjs hero --fail-on-critical
EXIT_CODE=$?

if [ $EXIT_CODE -ne 0 ]; then
  echo "❌ Critical CSS differences detected!"
  exit 1
fi
```

### Comparing Interactive States

The system tests default state only by default. To test other states, modify the test:

```typescript
// In compare-css.spec.ts
const hoverStyles = await extractStylesInState(page, hotfixSection, 'hover');
const focusStyles = await extractStylesInState(page, hotfixSection, 'focus');
```

## Configuration

### Test Configuration

Edit `tests/compare-css.spec.ts` to modify:

**Section Mapping:**
```typescript
const SECTIONS = {
  hero: 'hero',
  faq: 'faq',
  // Add new sections here
};
```

**URLs:**
```typescript
const HOTFIX_URL = 'https://localhost:9999/';
const CLEAN_URL = 'https://localhost:9999/clean';
```

**Timeouts:**
```typescript
const TIMEOUT = 15000; // 15 seconds
```

### Tolerance Configuration

Adjust tolerance in `compare-styles.ts`:

```typescript
export function compareStyles(
  // ...
  tolerance: number = 1  // Change default here
): ComparisonResult
```

### Property Selection

Customize which CSS properties to extract in `extract-styles.ts`:

```typescript
export interface ExtractedStyles {
  // Add/remove properties as needed
  position?: string;
  display?: string;
  // ...
}
```

## Troubleshooting

### Section Not Found

**Error:** `Section "hero" not found within 15000ms`

**Solutions:**
1. Verify the section has `data-section="hero"` attribute
2. Check the dev server is running on port 9999
3. Ensure the page has fully loaded (increase timeout)

**Debug:**
```bash
npx playwright test tests/debug-data-section.spec.ts --reporter=list
```

### Dev Server Issues

**Error:** `net::ERR_CONNECTION_REFUSED at https://localhost:9999/`

**Solutions:**
1. Start the dev server: `PORT=9999 npm run dev`
2. Check if port is in use: `lsof -ti:9999`
3. Kill conflicting process: `lsof -ti:9999 | xargs kill -9`

### HTTPS Certificate Errors

The tests use `ignoreHTTPSErrors: true` to bypass self-signed certificate warnings.

If tests fail with HTTPS errors, verify this is configured:

```typescript
test.describe('CSS Section Comparison', () => {
  test.use({ ignoreHTTPSErrors: true });
  // ...
});
```

### False Positives

If the comparison reports differences that appear identical:

1. **Check color formats:** `rgb()` vs `hex` vs named colors
2. **Check unit differences:** `1em` vs `16px` may be functionally identical
3. **Check browser rounding:** Some values may vary by sub-pixels
4. **Increase tolerance:** Use `--tolerance=2` for more lenient comparison

### Missing Properties

If critical CSS properties aren't being compared:

1. Add them to `ExtractedStyles` interface in `extract-styles.ts`
2. Add extraction logic in `extractStyles()` function
3. Rerun the tests

## Advanced Usage

### Programmatic API

Use the comparison system in your own scripts:

```typescript
import { test } from '@playwright/test';
import { findSectionByComment, waitForSectionByComment } from './tests/utils/find-section-by-comment';
import { extractStyles } from './tests/utils/extract-styles';
import { compareStyles } from './tests/utils/compare-styles';

test('custom comparison', async ({ page }) => {
  await page.goto('https://localhost:9999/');

  const section = await waitForSectionByComment(page, 'hero');
  const styles = await extractStyles(page, section);

  // Do something with styles
  console.log(styles);
});
```

### Batch Processing

Compare all sections and aggregate results:

```bash
#!/bin/bash

SECTIONS=("hero" "faq" "testimonials" "gallery" "pricing" "footer")
FAILED=0

for section in "${SECTIONS[@]}"; do
  echo "Testing $section..."
  node compare-section.mjs "$section" --fail-on-critical
  if [ $? -ne 0 ]; then
    FAILED=$((FAILED + 1))
  fi
done

echo "---"
echo "Results: $FAILED / ${#SECTIONS[@]} sections have critical differences"

if [ $FAILED -gt 0 ]; then
  exit 1
fi
```

### Custom Reporters

Process the JSON output for custom reporting:

```javascript
import fs from 'fs';

const result = JSON.parse(
  fs.readFileSync('test-results/css-comparison-hero.json', 'utf8')
);

if (result.summary.criticalDiffs > 0) {
  console.error('❌ Critical differences found:');
  result.differences
    .filter(d => d.severity === 'critical')
    .forEach(d => {
      console.error(`  ${d.property}: ${d.hotfixValue} → ${d.cleanValue}`);
    });
}
```

## Best Practices

### 1. Run Comparisons Frequently

Run comparisons after each CSS change to catch regressions early:

```bash
# Add to your git pre-commit hook
node compare-section.mjs hero --fail-on-critical
```

### 2. Document Intentional Differences

If clean implementation intentionally differs from hotfix:

```typescript
// In hero.css
.hero {
  /* INTENTIONAL DIFFERENCE: Improved mobile padding */
  padding: 80px 20px; /* was: 80px 16px in hotfix */
}
```

### 3. Use Tolerance Wisely

- **0-1%**: Strict, catches almost all differences
- **1-2%**: Balanced, allows for minor browser rounding
- **2-5%**: Lenient, focuses on major differences only

### 4. Test on Clean Builds

Always test on a fresh build to avoid cached styles:

```bash
rm -rf .next && PORT=9999 npm run dev
# Wait for build to complete
node compare-section.mjs hero
```

### 5. Version Control Reports

Consider committing baseline JSON reports to track changes over time:

```bash
git add test-results/css-comparison-*.json
git commit -m "docs: update CSS comparison baselines"
```

## Limitations

### What It Can't Detect

1. **Visual-only differences:** Changes that don't affect computed styles (e.g., background image content)
2. **Animation timing:** Different animation durations/timing functions
3. **Pseudo-elements:** `::before`, `::after` content
4. **Media query breakpoints:** Responsive behavior at different viewport sizes
5. **User interaction:** Multi-step interactions beyond single hover/focus

### Workarounds

For limitations, combine with:
- **Visual regression testing:** Playwright screenshot comparison
- **Manual review:** Designer/developer visual verification
- **E2E tests:** Full user interaction flows

## Maintenance

### Adding New Sections

1. **Add `data-section` attribute to both implementations:**
   ```tsx
   <section data-section="new-section">
   ```

2. **Add to section mapping in `compare-css.spec.ts`:**
   ```typescript
   const SECTIONS = {
     // ...existing sections
     'new-section': 'new-section',
   };
   ```

3. **Test the new section:**
   ```bash
   node compare-section.mjs new-section
   ```

### Updating Property List

To track additional CSS properties:

1. **Update `ExtractedStyles` interface:**
   ```typescript
   export interface ExtractedStyles {
     // ...existing
     textDecoration?: string;
     textTransform?: string;
   }
   ```

2. **Add extraction logic:**
   ```typescript
   export async function extractStyles(page: Page, locator: Locator) {
     return await locator.evaluate((el) => {
       const computed = window.getComputedStyle(el);
       return {
         // ...existing
         textDecoration: computed.textDecoration,
         textTransform: computed.textTransform,
       };
     });
   }
   ```

3. **Rerun tests to include new properties**

## Support

### Getting Help

1. **Check debug output:**
   ```bash
   npx playwright test tests/debug-data-section.spec.ts --reporter=list
   ```

2. **Review test reports:**
   ```bash
   npx playwright show-report
   ```

3. **Enable verbose logging:**
   ```bash
   DEBUG=pw:api npx playwright test tests/compare-css.spec.ts
   ```

### Common Issues

**Q: Why are my sections not being found?**
A: Ensure `data-section` attributes are present and the page is fully loaded.

**Q: Why do I see so many minor differences?**
A: Browser rendering can introduce sub-pixel variations. Increase tolerance or focus on critical properties.

**Q: Can I compare sections on different URLs?**
A: Yes, modify `HOTFIX_URL` and `CLEAN_URL` in `compare-css.spec.ts`.

**Q: How do I test responsive breakpoints?**
A: Use Playwright's viewport configuration:
```typescript
await page.setViewportSize({ width: 375, height: 667 }); // Mobile
```

---

**Version:** 1.0.0
**Last Updated:** October 30, 2025
**Compatibility:** Next.js 15.3+, Playwright 1.40+
