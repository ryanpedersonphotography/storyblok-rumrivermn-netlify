import { test, expect } from '@playwright/test';

test.describe('Theme Toggle', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('https://localhost:9999/clean');
  });

  test('navbar reacts to theme tokens', async ({ page }) => {
    const nav = page.locator('[data-section="navbar"] .navbar__link').first();

    // Set light theme
    await page.evaluate(() => document.documentElement.setAttribute('data-theme', 'light'));
    await page.waitForTimeout(100); // Allow CSS to apply
    const lightColor = await nav.evaluate(el => getComputedStyle(el).color);

    // Set dark theme
    await page.evaluate(() => document.documentElement.setAttribute('data-theme', 'dark'));
    await page.waitForTimeout(100); // Allow CSS to apply
    const darkColor = await nav.evaluate(el => getComputedStyle(el).color);

    // Colors should be different between light and dark mode
    expect(lightColor).not.toBe(darkColor);
  });

  test('theme toggle button exists and is visible', async ({ page }) => {
    const toggle = page.locator('[data-testid="theme-toggle"]').first();
    await expect(toggle).toBeVisible();
  });

  test('clicking theme toggle changes theme attribute', async ({ page }) => {
    // Set a known initial state (light mode)
    await page.evaluate(() => {
      localStorage.setItem('theme-mode', 'light');
      document.documentElement.setAttribute('data-theme', 'light');
    });

    await page.reload();
    await page.waitForSelector('[data-testid="theme-toggle"]', { state: 'visible' });

    // Get initial theme (should be light)
    const initialTheme = await page.evaluate(() =>
      document.documentElement.getAttribute('data-theme')
    );
    expect(initialTheme).toBe('light');

    // Click the first visible toggle (desktop navbar) to go to dark
    await page.locator('[data-testid="theme-toggle"]').first().click();
    await page.waitForTimeout(300);

    // Get new theme (should be dark)
    const newTheme = await page.evaluate(() =>
      document.documentElement.getAttribute('data-theme')
    );

    // Theme should have changed from light to dark
    expect(newTheme).toBe('dark');
  });

  test('theme cycles through light, dark, and system modes', async ({ page }) => {
    // Clear localStorage and set to light mode
    await page.evaluate(() => {
      localStorage.setItem('theme-mode', 'light');
      document.documentElement.setAttribute('data-theme', 'light');
    });

    await page.reload();
    await page.waitForSelector('[data-testid="theme-toggle"]', { state: 'visible' });

    // Should be light
    let theme = await page.evaluate(() => document.documentElement.getAttribute('data-theme'));
    expect(theme).toBe('light');

    // Click to go to dark
    await page.click('[data-testid="theme-toggle"]');
    await page.waitForTimeout(200);
    theme = await page.evaluate(() => document.documentElement.getAttribute('data-theme'));
    expect(theme).toBe('dark');

    // Click to go to system
    await page.click('[data-testid="theme-toggle"]');
    await page.waitForTimeout(200);
    theme = await page.evaluate(() => document.documentElement.getAttribute('data-theme'));
    expect(['light', 'dark']).toContain(theme); // System will be either light or dark

    // Click to go back to light
    await page.click('[data-testid="theme-toggle"]');
    await page.waitForTimeout(200);
    theme = await page.evaluate(() => document.documentElement.getAttribute('data-theme'));
    expect(theme).toBe('light');
  });

  test('theme persists across page reloads', async ({ page }) => {
    // Set dark mode
    await page.evaluate(() => {
      localStorage.setItem('theme-mode', 'dark');
    });

    await page.reload();
    await page.waitForSelector('[data-testid="theme-toggle"]', { state: 'visible' });

    const theme = await page.evaluate(() =>
      document.documentElement.getAttribute('data-theme')
    );

    expect(theme).toBe('dark');
  });

  test('navbar colors update when theme changes', async ({ page }) => {
    const logo = page.locator('[data-section="navbar"] .navbar__logo');

    // Set light theme
    await page.evaluate(() => document.documentElement.setAttribute('data-theme', 'light'));
    await page.waitForTimeout(100);
    const lightBg = await logo.evaluate(el => getComputedStyle(el).color);

    // Set dark theme
    await page.evaluate(() => document.documentElement.setAttribute('data-theme', 'dark'));
    await page.waitForTimeout(100);
    const darkBg = await logo.evaluate(el => getComputedStyle(el).color);

    // Should use different colors
    expect(lightBg).not.toBe(darkBg);
  });

  test('no hydration errors with theme toggle', async ({ page }) => {
    // Listen for console errors
    const errors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });

    await page.reload();
    await page.waitForSelector('[data-testid="theme-toggle"]', { state: 'visible' });

    // Should not have hydration errors
    const hydrationErrors = errors.filter(e => e.includes('Hydration'));
    expect(hydrationErrors).toHaveLength(0);
  });
});
