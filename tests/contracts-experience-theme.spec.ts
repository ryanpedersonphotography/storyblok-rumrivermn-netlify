import { test, expect } from '@playwright/test';

test.describe('Experience Theme Contract', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('https://localhost:9999/clean');
  });

  test('experience section background reacts to theme', async ({ page }) => {
    const experience = page.locator('[data-section="experience"]');

    // Set light theme
    await page.evaluate(() => document.documentElement.setAttribute('data-theme', 'light'));
    await page.waitForTimeout(100);
    const lightBg = await experience.evaluate(el => getComputedStyle(el).backgroundColor);

    // Set dark theme
    await page.evaluate(() => document.documentElement.setAttribute('data-theme', 'dark'));
    await page.waitForTimeout(100);
    const darkBg = await experience.evaluate(el => getComputedStyle(el).backgroundColor);

    // Background colors should be different between light and dark mode
    expect(lightBg).not.toBe(darkBg);
  });

  test('experience title reacts to theme', async ({ page }) => {
    const title = page.locator('[data-section="experience"] .experience-title');

    // Set light theme
    await page.evaluate(() => document.documentElement.setAttribute('data-theme', 'light'));
    await page.waitForTimeout(100);
    const lightColor = await title.evaluate(el => getComputedStyle(el).color);

    // Set dark theme
    await page.evaluate(() => document.documentElement.setAttribute('data-theme', 'dark'));
    await page.waitForTimeout(100);
    const darkColor = await title.evaluate(el => getComputedStyle(el).color);

    // Colors should be different between light and dark mode
    expect(lightColor).not.toBe(darkColor);
  });

  test('experience feature cards react to theme', async ({ page }) => {
    const feature = page.locator('[data-section="experience"] .experience-feature').first();

    // Set light theme
    await page.evaluate(() => document.documentElement.setAttribute('data-theme', 'light'));
    await page.waitForTimeout(100);
    const lightBg = await feature.evaluate(el => getComputedStyle(el).backgroundColor);

    // Set dark theme
    await page.evaluate(() => document.documentElement.setAttribute('data-theme', 'dark'));
    await page.waitForTimeout(100);
    const darkBg = await feature.evaluate(el => getComputedStyle(el).backgroundColor);

    // Feature card backgrounds should be different between light and dark mode
    expect(lightBg).not.toBe(darkBg);
  });

  test('experience script text reacts to theme', async ({ page }) => {
    const script = page.locator('[data-section="experience"] .experience-script');

    // Set light theme
    await page.evaluate(() => document.documentElement.setAttribute('data-theme', 'light'));
    await page.waitForTimeout(100);
    const lightColor = await script.evaluate(el => getComputedStyle(el).color);

    // Set dark theme
    await page.evaluate(() => document.documentElement.setAttribute('data-theme', 'dark'));
    await page.waitForTimeout(100);
    const darkColor = await script.evaluate(el => getComputedStyle(el).color);

    // Colors should be different between light and dark mode
    expect(lightColor).not.toBe(darkColor);
  });
});
