import { test } from '@playwright/test';

const ORIGIN = process.env.E2E_ORIGIN ?? 'https://localhost:9999';

test('test theme toggle click behavior', async ({ page }) => {
  console.log('\n=== TESTING THEME TOGGLE CLICK BEHAVIOR ===\n');

  await page.emulateMedia({ colorScheme: 'light' });

  // Test HOTFIX version
  console.log('--- HOTFIX VERSION ---\n');
  await page.goto(`${ORIGIN}/`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);

  // Before click
  const hotfixBefore = await page.evaluate(() => {
    const toggle = document.querySelector('.theme-toggle') as HTMLElement;
    if (!toggle) return null;
    const computed = window.getComputedStyle(toggle);
    return {
      mode: localStorage.getItem('theme-mode'),
      dataTheme: document.documentElement.getAttribute('data-theme'),
      width: computed.width,
      height: computed.height,
      border: computed.border,
      background: computed.background,
      transform: computed.transform,
      innerHTML: toggle.innerHTML,
    };
  });

  console.log('BEFORE CLICK:');
  console.log(`  Mode: ${hotfixBefore?.mode}`);
  console.log(`  data-theme: ${hotfixBefore?.dataTheme || 'none'}`);
  console.log(`  Width: ${hotfixBefore?.width}`);
  console.log(`  Border: ${hotfixBefore?.border}`);
  console.log(`  Transform: ${hotfixBefore?.transform}`);

  // Take screenshot before click
  const hotfixToggleBefore = await page.locator('.theme-toggle').first();
  await hotfixToggleBefore.screenshot({ path: 'test-results/hotfix-toggle-before-click.png' });

  // Click the toggle
  await page.click('.theme-toggle');
  await page.waitForTimeout(500);

  // After click
  const hotfixAfter = await page.evaluate(() => {
    const toggle = document.querySelector('.theme-toggle') as HTMLElement;
    if (!toggle) return null;
    const computed = window.getComputedStyle(toggle);
    return {
      mode: localStorage.getItem('theme-mode'),
      dataTheme: document.documentElement.getAttribute('data-theme'),
      width: computed.width,
      height: computed.height,
      border: computed.border,
      background: computed.background,
      transform: computed.transform,
      innerHTML: toggle.innerHTML,
    };
  });

  console.log('\nAFTER CLICK:');
  console.log(`  Mode: ${hotfixAfter?.mode}`);
  console.log(`  data-theme: ${hotfixAfter?.dataTheme || 'none'}`);
  console.log(`  Width: ${hotfixAfter?.width}`);
  console.log(`  Border: ${hotfixAfter?.border}`);
  console.log(`  Transform: ${hotfixAfter?.transform}`);

  // Take screenshot after click
  const hotfixToggleAfter = await page.locator('.theme-toggle').first();
  await hotfixToggleAfter.screenshot({ path: 'test-results/hotfix-toggle-after-click.png' });

  // Test CLEAN version
  console.log('\n--- CLEAN VERSION ---\n');
  await page.goto(`${ORIGIN}/clean`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);

  // Before click
  const cleanBefore = await page.evaluate(() => {
    const toggle = document.querySelector('.theme-toggle') as HTMLElement;
    if (!toggle) return null;
    const computed = window.getComputedStyle(toggle);
    return {
      mode: localStorage.getItem('theme-mode'),
      dataTheme: document.documentElement.getAttribute('data-theme'),
      width: computed.width,
      height: computed.height,
      border: computed.border,
      background: computed.background,
      transform: computed.transform,
      innerHTML: toggle.innerHTML,
    };
  });

  console.log('BEFORE CLICK:');
  console.log(`  Mode: ${cleanBefore?.mode}`);
  console.log(`  data-theme: ${cleanBefore?.dataTheme || 'none'}`);
  console.log(`  Width: ${cleanBefore?.width}`);
  console.log(`  Border: ${cleanBefore?.border}`);
  console.log(`  Transform: ${cleanBefore?.transform}`);

  // Take screenshot before click
  const cleanToggleBefore = await page.locator('.theme-toggle').first();
  await cleanToggleBefore.screenshot({ path: 'test-results/clean-toggle-before-click.png' });

  // Click the toggle
  await page.click('.theme-toggle');
  await page.waitForTimeout(500);

  // After click
  const cleanAfter = await page.evaluate(() => {
    const toggle = document.querySelector('.theme-toggle') as HTMLElement;
    if (!toggle) return null;
    const computed = window.getComputedStyle(toggle);
    return {
      mode: localStorage.getItem('theme-mode'),
      dataTheme: document.documentElement.getAttribute('data-theme'),
      width: computed.width,
      height: computed.height,
      border: computed.border,
      background: computed.background,
      transform: computed.transform,
      innerHTML: toggle.innerHTML,
    };
  });

  console.log('\nAFTER CLICK:');
  console.log(`  Mode: ${cleanAfter?.mode}`);
  console.log(`  data-theme: ${cleanAfter?.dataTheme || 'none'}`);
  console.log(`  Width: ${cleanAfter?.width}`);
  console.log(`  Border: ${cleanAfter?.border}`);
  console.log(`  Transform: ${cleanAfter?.transform}`);

  // Take screenshot after click
  const cleanToggleAfter = await page.locator('.theme-toggle').first();
  await cleanToggleAfter.screenshot({ path: 'test-results/clean-toggle-after-click.png' });

  console.log('\n=== COMPARISON ===\n');

  // Compare hotfix before/after
  console.log('HOTFIX State Change:');
  console.log(`  Mode: ${hotfixBefore?.mode} → ${hotfixAfter?.mode}`);
  console.log(`  Width: ${hotfixBefore?.width} → ${hotfixAfter?.width}`);
  console.log(`  Border: ${hotfixBefore?.border === hotfixAfter?.border ? 'same' : 'CHANGED'}`);
  if (hotfixBefore?.border !== hotfixAfter?.border) {
    console.log(`    Before: ${hotfixBefore?.border}`);
    console.log(`    After: ${hotfixAfter?.border}`);
  }

  // Compare clean before/after
  console.log('\nCLEAN State Change:');
  console.log(`  Mode: ${cleanBefore?.mode} → ${cleanAfter?.mode}`);
  console.log(`  Width: ${cleanBefore?.width} → ${cleanAfter?.width}`);
  console.log(`  Border: ${cleanBefore?.border === cleanAfter?.border ? 'same' : 'CHANGED'}`);
  if (cleanBefore?.border !== cleanAfter?.border) {
    console.log(`    Before: ${cleanBefore?.border}`);
    console.log(`    After: ${cleanAfter?.border}`);
  }

  console.log('\n✅ Screenshots saved:');
  console.log('  - hotfix-toggle-before-click.png');
  console.log('  - hotfix-toggle-after-click.png');
  console.log('  - clean-toggle-before-click.png');
  console.log('  - clean-toggle-after-click.png');
});
