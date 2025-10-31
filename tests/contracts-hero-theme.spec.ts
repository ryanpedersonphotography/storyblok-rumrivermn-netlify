import { test, expect } from '@playwright/test';

test.describe('Hero Theme Contract', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('https://localhost:9999/clean');
  });

  test('hero reacts to theme tokens', async ({ page }) => {
    const title = page.locator('[data-section="hero"] .hero-title');

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

  test('hero background reacts to theme', async ({ page }) => {
    const hero = page.locator('[data-section="hero"]');

    // Set light theme
    await page.evaluate(() => document.documentElement.setAttribute('data-theme', 'light'));
    await page.waitForTimeout(100);
    const lightBg = await hero.evaluate(el => getComputedStyle(el).backgroundColor);

    // Set dark theme
    await page.evaluate(() => document.documentElement.setAttribute('data-theme', 'dark'));
    await page.waitForTimeout(100);
    const darkBg = await hero.evaluate(el => getComputedStyle(el).backgroundColor);

    // Background colors should be different between light and dark mode
    expect(lightBg).not.toBe(darkBg);
  });

  test('hero CTA button reacts to theme', async ({ page }) => {
    const cta = page.locator('[data-section="hero"] .hero-cta').first();

    // Set light theme
    await page.evaluate(() => document.documentElement.setAttribute('data-theme', 'light'));
    await page.waitForTimeout(100);
    const lightColor = await cta.evaluate(el => getComputedStyle(el).color);

    // Set dark theme
    await page.evaluate(() => document.documentElement.setAttribute('data-theme', 'dark'));
    await page.waitForTimeout(100);
    const darkColor = await cta.evaluate(el => getComputedStyle(el).color);

    // CTA text colors should be different between light and dark mode
    expect(lightColor).not.toBe(darkColor);
  });
});
