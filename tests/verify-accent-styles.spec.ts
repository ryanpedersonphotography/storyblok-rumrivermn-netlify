import { test } from '@playwright/test';

const ORIGIN = process.env.E2E_ORIGIN ?? 'https://localhost:9999';

test('verify hero title accent styles match exactly', async ({ page }) => {
  console.log('\n=== VERIFYING ACCENT STYLE FIX ===\n');

  // Get hotfix styles
  await page.goto(`${ORIGIN}/`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);

  const hotfixStyles = await page.evaluate(() => {
    const accent = document.querySelector('.hotfix-hero-title-accent');
    if (!accent) return null;

    const computed = window.getComputedStyle(accent);
    return {
      display: computed.display,
      fontWeight: computed.fontWeight,
      width: computed.width,
      height: computed.height,
      color: computed.color,
      fontSize: computed.fontSize,
      fontFamily: computed.fontFamily,
      lineHeight: computed.lineHeight,
      textAlign: computed.textAlign,
      boxSizing: computed.boxSizing,
      margin: computed.margin,
      padding: computed.padding,
      border: computed.border,
      opacity: computed.opacity,
      visibility: computed.visibility,
      zIndex: computed.zIndex,
    };
  });

  // Get clean styles
  await page.goto(`${ORIGIN}/clean`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);

  const cleanStyles = await page.evaluate(() => {
    const accent = document.querySelector('.hero__title--accent');
    if (!accent) return null;

    const computed = window.getComputedStyle(accent);
    return {
      display: computed.display,
      fontWeight: computed.fontWeight,
      width: computed.width,
      height: computed.height,
      color: computed.color,
      fontSize: computed.fontSize,
      fontFamily: computed.fontFamily,
      lineHeight: computed.lineHeight,
      textAlign: computed.textAlign,
      boxSizing: computed.boxSizing,
      margin: computed.margin,
      padding: computed.padding,
      border: computed.border,
      opacity: computed.opacity,
      visibility: computed.visibility,
      zIndex: computed.zIndex,
    };
  });

  console.log('📊 Comparing all computed styles:\n');

  const keys = Object.keys(hotfixStyles || {}) as (keyof typeof hotfixStyles)[];
  let matches = 0;
  let mismatches = 0;

  for (const key of keys) {
    const hotfixValue = hotfixStyles?.[key];
    const cleanValue = cleanStyles?.[key];
    const match = hotfixValue === cleanValue;

    if (match) {
      matches++;
      console.log(`✅ ${key}: ${hotfixValue}`);
    } else {
      mismatches++;
      console.log(`❌ ${key}:`);
      console.log(`   Hotfix: ${hotfixValue}`);
      console.log(`   Clean:  ${cleanValue}`);
    }
  }

  console.log(`\n=== SUMMARY ===`);
  console.log(`Matches: ${matches}`);
  console.log(`Mismatches: ${mismatches}`);

  if (mismatches === 0) {
    console.log('\n🎉 PERFECT MATCH! All styles identical.\n');
  } else {
    console.log(`\n⚠️  ${mismatches} style differences remain.\n`);
  }

  // Critical checks
  const criticalChecks = {
    'Font Weight': hotfixStyles?.fontWeight === cleanStyles?.fontWeight,
    'Display': hotfixStyles?.display === cleanStyles?.display,
    'Color': hotfixStyles?.color === cleanStyles?.color,
    'Font Size': hotfixStyles?.fontSize === cleanStyles?.fontSize,
  };

  console.log('🎯 Critical Style Checks:');
  for (const [check, passed] of Object.entries(criticalChecks)) {
    console.log(`   ${passed ? '✅' : '❌'} ${check}`);
  }
});
