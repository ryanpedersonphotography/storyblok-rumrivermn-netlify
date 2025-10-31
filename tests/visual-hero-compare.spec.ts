import { test } from '@playwright/test';

test.describe('Visual Hero Comparison', () => {
  test.use({ ignoreHTTPSErrors: true });

  test('Capture both hero sections', async ({ page }) => {
    // Capture hotfix hero
    await page.goto('https://localhost:9999/', { waitUntil: 'networkidle' });
    await page.screenshot({
      path: 'test-results/hero-hotfix.png',
      fullPage: false
    });

    // Capture clean hero
    await page.goto('https://localhost:9999/clean', { waitUntil: 'networkidle' });
    await page.screenshot({
      path: 'test-results/hero-clean.png',
      fullPage: false
    });

    console.log('Screenshots saved to test-results/');
  });
});
