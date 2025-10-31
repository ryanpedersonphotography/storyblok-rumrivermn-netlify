import { test, expect } from '@playwright/test';

const ORIGIN = process.env.E2E_ORIGIN ?? 'https://localhost:9999';

test.describe('Migrated Sections Visual Regression', () => {
  test.beforeEach(async ({ page }) => {
    // Ensure stable page state
    await page.emulateMedia({ colorScheme: 'light' });
  });

  test('Footer section visual parity (≤10% diff)', async ({ page }) => {
    // Capture hotfix baseline
    await page.goto(`${ORIGIN}/`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(500);

    const hotfixFooter = page.locator('[data-section="footer"]');
    await hotfixFooter.scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);

    // Take hotfix screenshot
    await expect(hotfixFooter).toHaveScreenshot('footer-hotfix-baseline.png');

    // Compare clean version
    await page.goto(`${ORIGIN}/clean`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(500);

    const cleanFooter = page.locator('[data-section="footer"]');
    await cleanFooter.scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);

    // Compare with 10% tolerance
    await expect(cleanFooter).toHaveScreenshot('footer-hotfix-baseline.png', {
      maxDiffPixelRatio: 0.10, // ≤10% diff allowed
    });
  });

  test('Alternating Blocks section visual parity (≤10% diff)', async ({ page }) => {
    // Capture hotfix baseline
    await page.goto(`${ORIGIN}/`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(500);

    const hotfixAlt = page.locator('[data-section="alternating-blocks"]');
    await hotfixAlt.scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);

    // Take hotfix screenshot
    await expect(hotfixAlt).toHaveScreenshot('alternating-blocks-hotfix-baseline.png');

    // Compare clean version
    await page.goto(`${ORIGIN}/clean`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(500);

    const cleanAlt = page.locator('[data-section="alternating-blocks"]');
    await cleanAlt.scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);

    // Compare with 10% tolerance
    await expect(cleanAlt).toHaveScreenshot('alternating-blocks-hotfix-baseline.png', {
      maxDiffPixelRatio: 0.10, // ≤10% diff allowed
    });
  });

  test('Hero section visual parity (≤10% diff)', async ({ page }) => {
    // Capture hotfix baseline
    await page.goto(`${ORIGIN}/`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(500);

    const hotfixHero = page.locator('[data-section="hero"]');
    await expect(hotfixHero).toHaveScreenshot('hero-hotfix-baseline.png');

    // Compare clean version
    await page.goto(`${ORIGIN}/clean`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(500);

    const cleanHero = page.locator('[data-section="hero"]');
    await expect(cleanHero).toHaveScreenshot('hero-hotfix-baseline.png', {
      maxDiffPixelRatio: 0.10, // ≤10% diff allowed
    });
  });

  test('Section metrics comparison', async ({ page }) => {
    console.log('\n=== MIGRATED SECTIONS COMPARISON ===\n');

    // Check hotfix
    await page.goto(`${ORIGIN}/`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(500);

    const hotfixMetrics = await page.evaluate(() => {
      const footer = document.querySelector('[data-section="footer"]') as HTMLElement;
      const altBlocks = document.querySelector('[data-section="alternating-blocks"]') as HTMLElement;
      const hero = document.querySelector('[data-section="hero"]') as HTMLElement;

      return {
        footer: {
          exists: !!footer,
          height: footer?.offsetHeight || 0,
          className: footer?.className || '',
        },
        alternatingBlocks: {
          exists: !!altBlocks,
          height: altBlocks?.offsetHeight || 0,
          className: altBlocks?.className || '',
          imageCount: altBlocks?.querySelectorAll('img').length || 0,
        },
        hero: {
          exists: !!hero,
          height: hero?.offsetHeight || 0,
          className: hero?.className || '',
        },
      };
    });

    // Check clean
    await page.goto(`${ORIGIN}/clean`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(500);

    const cleanMetrics = await page.evaluate(() => {
      const footer = document.querySelector('[data-section="footer"]') as HTMLElement;
      const altBlocks = document.querySelector('[data-section="alternating-blocks"]') as HTMLElement;
      const hero = document.querySelector('[data-section="hero"]') as HTMLElement;

      return {
        footer: {
          exists: !!footer,
          height: footer?.offsetHeight || 0,
          className: footer?.className || '',
        },
        alternatingBlocks: {
          exists: !!altBlocks,
          height: altBlocks?.offsetHeight || 0,
          className: altBlocks?.className || '',
          imageCount: altBlocks?.querySelectorAll('img').length || 0,
        },
        hero: {
          exists: !!hero,
          height: hero?.offsetHeight || 0,
          className: hero?.className || '',
        },
      };
    });

    console.log('📊 Footer Metrics:');
    console.log(`  Hotfix: ${hotfixMetrics.footer.height}px (${hotfixMetrics.footer.className})`);
    console.log(`  Clean: ${cleanMetrics.footer.height}px (${cleanMetrics.footer.className})`);
    console.log(`  Height Diff: ${Math.abs(hotfixMetrics.footer.height - cleanMetrics.footer.height)}px`);

    console.log('\n📊 Alternating Blocks Metrics:');
    console.log(`  Hotfix: ${hotfixMetrics.alternatingBlocks.height}px (${hotfixMetrics.alternatingBlocks.className})`);
    console.log(`  Clean: ${cleanMetrics.alternatingBlocks.height}px (${cleanMetrics.alternatingBlocks.className})`);
    console.log(`  Height Diff: ${Math.abs(hotfixMetrics.alternatingBlocks.height - cleanMetrics.alternatingBlocks.height)}px`);
    console.log(`  Hotfix Images: ${hotfixMetrics.alternatingBlocks.imageCount}`);
    console.log(`  Clean Images: ${cleanMetrics.alternatingBlocks.imageCount}`);

    console.log('\n📊 Hero Metrics:');
    console.log(`  Hotfix: ${hotfixMetrics.hero.height}px (${hotfixMetrics.hero.className})`);
    console.log(`  Clean: ${cleanMetrics.hero.height}px (${cleanMetrics.hero.className})`);
    console.log(`  Height Diff: ${Math.abs(hotfixMetrics.hero.height - cleanMetrics.hero.height)}px`);

    // Verify all sections exist
    expect(hotfixMetrics.footer.exists).toBe(true);
    expect(cleanMetrics.footer.exists).toBe(true);
    expect(hotfixMetrics.alternatingBlocks.exists).toBe(true);
    expect(cleanMetrics.alternatingBlocks.exists).toBe(true);
    expect(hotfixMetrics.hero.exists).toBe(true);
    expect(cleanMetrics.hero.exists).toBe(true);

    // Verify images loaded
    expect(cleanMetrics.alternatingBlocks.imageCount).toBeGreaterThan(0);
    console.log(`\n✅ All ${cleanMetrics.alternatingBlocks.imageCount} images loaded in Alternating Blocks`);
  });
});
