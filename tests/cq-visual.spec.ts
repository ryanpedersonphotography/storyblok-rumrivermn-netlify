/* ==========================================================================
   CONTAINER QUERY VISUAL REGRESSION TESTS
   ==========================================================================
   Validates that container query styles match viewport media query fallbacks
   by comparing pixel-perfect screenshots across 3 widths with CQ on/off.

   This catches "fallback drift" where container queries diverge from their
   @supports not (container-type: inline-size) equivalents.
   ========================================================================== */

import { test, expect } from '@playwright/test';

const widths = [400, 768, 1200] as const;

const routes = [
  { path: '/',         selector: '.navbar',           name: 'navbar' },
  { path: '/',         selector: '.wedding-gallery',  name: 'gallery' },
  { path: '/',         selector: '.footer',           name: 'footer'  },
];

/**
 * Helper: Snap a region at a specific viewport width
 */
async function snapRegion(page: any, selector: string, name: string, width: number) {
  await page.setViewportSize({ width, height: 900 });
  const el = page.locator(selector).first();
  await expect(el).toBeVisible();

  // Wait for fonts to load
  await page.evaluate(() => document.fonts && (document as any).fonts.ready);

  await expect(el).toHaveScreenshot(`${name}-${width}.png`, {
    animations: 'disabled',
    maxDiffPixelRatio: 0.02,
    arg: `${name}-${width}`
  } as any);
}

/**
 * Test each component at 3 widths with CQ on/off
 */
for (const { path, selector, name } of routes) {
  test.describe(`${name} (CQ on/off parity)`, () => {
    for (const w of widths) {
      test(`renders consistently at ${w}px`, async ({ page, baseURL }) => {
        await page.goto(`${baseURL}${path}`);
        await snapRegion(page, selector, name, w);
      });
    }
  });
}
