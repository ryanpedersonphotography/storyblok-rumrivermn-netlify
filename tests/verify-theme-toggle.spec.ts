import { test } from '@playwright/test';

const ORIGIN = process.env.E2E_ORIGIN ?? 'https://localhost:9999';

test('compare theme toggle appearance', async ({ page }) => {
  console.log('\n=== THEME TOGGLE COMPARISON ===\n');

  await page.emulateMedia({ colorScheme: 'light' });

  // Get hotfix theme toggle styles
  await page.goto(`${ORIGIN}/`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);

  const hotfixToggle = await page.evaluate(() => {
    const toggle = document.querySelector('.theme-toggle');
    if (!toggle) return null;

    const computed = window.getComputedStyle(toggle);
    return {
      width: computed.width,
      height: computed.height,
      background: computed.background,
      border: computed.border,
      borderRadius: computed.borderRadius,
      color: computed.color,
      display: computed.display,
      position: computed.position,
    };
  });

  // Get clean theme toggle styles
  await page.goto(`${ORIGIN}/clean`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);

  const cleanToggle = await page.evaluate(() => {
    const toggle = document.querySelector('.theme-toggle');
    if (!toggle) return null;

    const computed = window.getComputedStyle(toggle);
    return {
      width: computed.width,
      height: computed.height,
      background: computed.background,
      border: computed.border,
      borderRadius: computed.borderRadius,
      color: computed.color,
      display: computed.display,
      position: computed.position,
    };
  });

  console.log('Hotfix Theme Toggle:');
  console.log(JSON.stringify(hotfixToggle, null, 2));

  console.log('\nClean Theme Toggle:');
  console.log(JSON.stringify(cleanToggle, null, 2));

  console.log('\n=== COMPARISON ===\n');

  if (!hotfixToggle || !cleanToggle) {
    console.log('❌ Theme toggle not found in one or both versions');
    return;
  }

  const keys = Object.keys(hotfixToggle) as (keyof typeof hotfixToggle)[];
  let matches = 0;
  let diffs = 0;

  for (const key of keys) {
    const match = hotfixToggle[key] === cleanToggle[key];
    if (match) {
      matches++;
      console.log(`✅ ${key}: ${hotfixToggle[key]}`);
    } else {
      diffs++;
      console.log(`❌ ${key}:`);
      console.log(`   Hotfix: ${hotfixToggle[key]}`);
      console.log(`   Clean:  ${cleanToggle[key]}`);
    }
  }

  console.log(`\n${matches} matches, ${diffs} differences`);

  if (diffs === 0) {
    console.log('\n✅ Theme toggles are identical!');
  } else {
    console.log('\n⚠️  Theme toggles have visual differences');
  }
});
