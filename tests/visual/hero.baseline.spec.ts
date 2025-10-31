import { test, expect } from '@playwright/test';
import { stabilize } from '../utils/setup';

test.describe('BASELINE: hero (CLEAN)', () => {
  test('capture clean baseline snapshot', async ({ page }) => {
    await page.goto('https://localhost:9999/clean');
    await stabilize(page);
    const hero = page.locator('[data-section="hero"]');
    await expect(hero).toHaveScreenshot('hero.clean.png'); // baseline name
  });
});
