import { test, expect } from '@playwright/test';
import { stabilize } from '../utils/setup';
import { readComputed, toPx, normalizeColor, beforeAfterBackground, bbox, near } from '../utils/style-helpers';

test.describe('Hero contract checks (token-aware, surgical)', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
  });

  test('CTA style contract', async ({ page }) => {
    await page.goto('https://localhost:9999');
    await stabilize(page);

    const cta = page.locator('.hero-cta').first();

    // Read essential properties
    const styles = await readComputed(cta, [
      'background-color', 'background-image', 'border-radius',
      'padding-top','padding-right','padding-bottom','padding-left',
      'font-family', 'font-weight', 'color'
    ]);

    // Transparent or gradient background is acceptable per spec
    const bgOk =
      normalizeColor(styles['background-color']) === 'rgba(0, 0, 0, 0)' ||
      (styles['background-image'] && styles['background-image'] !== 'none');

    expect(bgOk).toBeTruthy();

    // Pill shape
    expect(toPx(styles['border-radius'])).toBeGreaterThanOrEqual(9999);

    // Padding contract ~ 1rem 2.5rem (tolerances)
    expect(near(toPx(styles['padding-top']), 16, 2)).toBeTruthy();
    expect(near(toPx(styles['padding-bottom']), 16, 2)).toBeTruthy();
    expect(near(toPx(styles['padding-right']), 40, 2)).toBeTruthy();
    expect(near(toPx(styles['padding-left']), 40, 2)).toBeTruthy();

    // Font contract
    expect(styles['font-family']).toContain('var(--font-sans)');
    expect(parseInt(styles['font-weight'] || '400', 10)).toBeGreaterThanOrEqual(400);

    // Pseudo elements sometimes render gradients/underlines
    const { before, after } = await beforeAfterBackground(cta);
    // No assertion required; present for debugging visibility
    console.log('CTA ::before bg:', before, ' ::after bg:', after);
  });

  test('Section tokens and layout probes', async ({ page }) => {
    await page.goto('https://localhost:9999');
    await stabilize(page);

    const hero = page.locator('[data-section="hero"]');

    // Token presence check
    const tokenTextOnDark = await hero.evaluate((el) =>
      getComputedStyle(el).getPropertyValue('--theme-text-on-dark').trim()
    );
    expect(tokenTextOnDark).not.toBe('');

    // Layout probe: ensure hero is at least viewport height
    const rect = await bbox(hero);
    expect(rect.height).toBeGreaterThanOrEqual(900 - 1); // ≥ viewport height (minus rounding)
  });
});
