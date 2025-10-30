import { test, expect } from '@playwright/test';

const ORIGIN = process.env.E2E_ORIGIN ?? 'http://localhost:3000';

test.describe('Theme toggle + dark tokens', () => {
  test('auto follows system; toggle forces opposite; overlay darkens', async ({ page }) => {
    // Ensure AUTO
    await page.addInitScript(() => localStorage.removeItem('theme-mode'));

    // Start in system LIGHT
    await page.emulateMedia({ colorScheme: 'light' });

    await page.goto(ORIGIN, { waitUntil: 'networkidle' });

    const html = page.locator('html');
    const toggle = page.locator('.theme-toggle').first();

    // Auto = no attribute
    await expect(html).not.toHaveAttribute('data-theme', /dark|light/);

    // Get ::after background in light
    const lightBG = await page.evaluate(() => {
      const el = document.querySelector('.hotfix-hero-romantic') as HTMLElement;
      return getComputedStyle(el, '::after').backgroundImage;
    });
    expect(lightBG).toContain('linear-gradient');

    // Click - should force DARK (opposite)
    await toggle.click();
    await expect(html).toHaveAttribute('data-theme', 'dark');

    const darkBG = await page.evaluate(() => {
      const el = document.querySelector('.hotfix-hero-romantic') as HTMLElement;
      return getComputedStyle(el, '::after').backgroundImage;
    });
    expect(darkBG).toContain('linear-gradient');
    expect(darkBG).not.toEqual(lightBG);
    // Check for new OKLCH tonal ladder tokens (--grad-section-deep)
    expect(darkBG).toMatch(/oklch\(0\.(18|22|25)/); // surface-0 or surface-1

    // Click again - back to AUTO (no attribute)
    await toggle.click();
    await expect(html).not.toHaveAttribute('data-theme', /dark|light/);

    // Flip system to DARK; auto should track
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.waitForTimeout(75);
    await expect(html).not.toHaveAttribute('data-theme', /dark|light/);

    const autoDarkBG = await page.evaluate(() => {
      const el = document.querySelector('.hotfix-hero-romantic') as HTMLElement;
      return getComputedStyle(el, '::after').backgroundImage;
    });
    expect(autoDarkBG).toMatch(/oklch\(0\.(18|22|25)/);
  });
});
