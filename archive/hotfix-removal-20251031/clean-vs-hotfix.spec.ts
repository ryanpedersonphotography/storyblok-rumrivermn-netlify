import { test, expect } from '@playwright/test';
import { stabilize } from '../utils/setup';

test.describe('Clean vs Hotfix Hero Comparison', () => {
  // Step 1: Capture hotfix baseline (run with --update-snapshots to regenerate)
  test('capture hotfix baseline', async ({ page }) => {
    await page.goto('https://localhost:9999');
    await stabilize(page);
    const hotfixHero = page.locator('[data-section="hero"]');
    await expect(hotfixHero).toHaveScreenshot('hotfix-hero-baseline.png');
  });

  // Step 2: Compare clean against hotfix baseline (90% match goal)
  test('clean hero matches hotfix baseline', async ({ page }) => {
    await page.goto('https://localhost:9999/clean');
    await stabilize(page);
    const cleanHero = page.locator('[data-section="hero"]');
    await expect(cleanHero).toHaveScreenshot('hotfix-hero-baseline.png', {
      maxDiffPixelRatio: 0.10, // 90% match
    });
  });
});
