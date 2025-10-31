import { test, expect } from '@playwright/test';
import { stabilize } from '../utils/setup';

test.describe('Hero visual regression vs CLEAN baseline', () => {
  test('hotfix matches clean baseline', async ({ page }) => {
    await page.goto('https://localhost:9999');
    await stabilize(page);
    const hero = page.locator('[data-section="hero"]');

    // Compare current (hotfix route) to stored clean baseline file
    await expect(hero).toHaveScreenshot('hero.clean.png', {
      animations: 'disabled',
      maxDiffPixelRatio: 0.02,
    });
  });
});
