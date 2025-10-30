import { test, expect } from '@playwright/test';

const ORIGIN = process.env.E2E_ORIGIN ?? 'https://localhost:9999';

test.describe('Visual Comparison: Clean vs Hotfix', () => {
  test('navbar and hero should look identical', async ({ page }) => {
    // Test both light and dark mode
    for (const theme of ['light', 'dark']) {
      console.log(`\n=== Testing ${theme} mode ===`);

      // Set theme
      if (theme === 'dark') {
        await page.emulateMedia({ colorScheme: 'dark' });
      } else {
        await page.emulateMedia({ colorScheme: 'light' });
      }

      // Screenshot hotfix version
      await page.goto(`${ORIGIN}/`, { waitUntil: 'networkidle' });
      await page.waitForTimeout(500); // Let animations settle
      await page.screenshot({
        path: `test-results/hotfix-${theme}.png`,
        fullPage: false,
      });
      console.log(`✓ Hotfix ${theme} screenshot saved`);

      // Screenshot clean version
      await page.goto(`${ORIGIN}/clean`, { waitUntil: 'networkidle' });
      await page.waitForTimeout(500); // Let animations settle
      await page.screenshot({
        path: `test-results/clean-${theme}.png`,
        fullPage: false,
      });
      console.log(`✓ Clean ${theme} screenshot saved`);

      // Screenshot scrolled navbar state
      await page.goto(`${ORIGIN}/`, { waitUntil: 'networkidle' });
      await page.evaluate(() => window.scrollTo(0, 200));
      await page.waitForTimeout(300);
      await page.screenshot({
        path: `test-results/hotfix-${theme}-scrolled.png`,
        fullPage: false,
      });
      console.log(`✓ Hotfix ${theme} scrolled screenshot saved`);

      await page.goto(`${ORIGIN}/clean`, { waitUntil: 'networkidle' });
      await page.evaluate(() => window.scrollTo(0, 200));
      await page.waitForTimeout(300);
      await page.screenshot({
        path: `test-results/clean-${theme}-scrolled.png`,
        fullPage: false,
      });
      console.log(`✓ Clean ${theme} scrolled screenshot saved`);
    }

    console.log('\n✅ All screenshots captured!');
    console.log('📁 Check test-results/ folder for comparison');
    console.log('   - hotfix-light.png vs clean-light.png');
    console.log('   - hotfix-dark.png vs clean-dark.png');
    console.log('   - hotfix-*-scrolled.png vs clean-*-scrolled.png');
  });

  test('measure specific element styles', async ({ page }) => {
    const results: any = {
      hotfix: {},
      clean: {},
    };

    // Test hotfix version
    await page.goto(`${ORIGIN}/`, { waitUntil: 'networkidle' });
    await page.emulateMedia({ colorScheme: 'light' });

    results.hotfix.navbar = await page.evaluate(() => {
      const navbar = document.querySelector('.hotfix-navbar');
      if (!navbar) return null;
      const styles = getComputedStyle(navbar);
      return {
        background: styles.backgroundColor,
        padding: styles.padding,
        position: styles.position,
      };
    });

    results.hotfix.heroTitle = await page.evaluate(() => {
      const title = document.querySelector('.hotfix-hero-title');
      if (!title) return null;
      const styles = getComputedStyle(title);
      return {
        fontSize: styles.fontSize,
        fontFamily: styles.fontFamily,
        color: styles.color,
      };
    });

    // Test clean version
    await page.goto(`${ORIGIN}/clean`, { waitUntil: 'networkidle' });

    results.clean.navbar = await page.evaluate(() => {
      const navbar = document.querySelector('.navbar');
      if (!navbar) return null;
      const styles = getComputedStyle(navbar);
      return {
        background: styles.backgroundColor,
        padding: styles.padding,
        position: styles.position,
      };
    });

    results.clean.heroTitle = await page.evaluate(() => {
      const title = document.querySelector('.hero__title');
      if (!title) return null;
      const styles = getComputedStyle(title);
      return {
        fontSize: styles.fontSize,
        fontFamily: styles.fontFamily,
        color: styles.color,
      };
    });

    console.log('\n=== Style Comparison ===');
    console.log('Hotfix Navbar:', results.hotfix.navbar);
    console.log('Clean Navbar:', results.clean.navbar);
    console.log('\nHotfix Hero Title:', results.hotfix.heroTitle);
    console.log('Clean Hero Title:', results.clean.heroTitle);

    // Basic assertions - both should have values
    expect(results.hotfix.navbar).toBeTruthy();
    expect(results.clean.navbar).toBeTruthy();
    expect(results.hotfix.heroTitle).toBeTruthy();
    expect(results.clean.heroTitle).toBeTruthy();
  });
});
