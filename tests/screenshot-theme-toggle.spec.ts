import { test } from '@playwright/test';

const ORIGIN = process.env.E2E_ORIGIN ?? 'https://localhost:9999';

test('capture theme toggle screenshots', async ({ page }) => {
  console.log('\n=== CAPTURING THEME TOGGLE SCREENSHOTS ===\n');

  await page.emulateMedia({ colorScheme: 'light' });

  // Hotfix - navbar area only
  await page.goto(`${ORIGIN}/`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);

  const hotfixNavbar = await page.locator('.hotfix-navbar');
  await hotfixNavbar.screenshot({ path: 'test-results/hotfix-navbar-with-toggle.png' });
  console.log('✓ Saved: test-results/hotfix-navbar-with-toggle.png');

  // Hotfix - just the toggle (first one - desktop)
  const hotfixToggle = await page.locator('.theme-toggle').first();
  await hotfixToggle.screenshot({ path: 'test-results/hotfix-theme-toggle.png' });
  console.log('✓ Saved: test-results/hotfix-theme-toggle.png');

  // Clean - navbar area only
  await page.goto(`${ORIGIN}/clean`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);

  const cleanNavbar = await page.locator('.navbar');
  await cleanNavbar.screenshot({ path: 'test-results/clean-navbar-with-toggle.png' });
  console.log('✓ Saved: test-results/clean-navbar-with-toggle.png');

  // Clean - just the toggle (first one - desktop)
  const cleanToggle = await page.locator('.theme-toggle').first();
  await cleanToggle.screenshot({ path: 'test-results/clean-theme-toggle.png' });
  console.log('✓ Saved: test-results/clean-theme-toggle.png');

  console.log('\n✅ All screenshots saved to test-results/');
  console.log('Compare:');
  console.log('  - hotfix-navbar-with-toggle.png vs clean-navbar-with-toggle.png');
  console.log('  - hotfix-theme-toggle.png vs clean-theme-toggle.png');
});
