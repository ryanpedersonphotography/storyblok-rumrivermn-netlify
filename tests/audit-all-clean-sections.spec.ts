import { test } from '@playwright/test';

const ORIGIN = process.env.E2E_ORIGIN ?? 'https://localhost:9999';

test('audit ALL clean sections for mutations', async ({ page }) => {
  console.log('\n=== COMPREHENSIVE CLEAN VERSION AUDIT ===\n');

  await page.emulateMedia({ colorScheme: 'light' });

  // Map of hotfix to clean selectors for all sections
  const selectorMap: Record<string, string> = {
    // NAVBAR
    '.hotfix-navbar': '.navbar',
    '.hotfix-navbar-logo-text': '.navbar__logo-text',
    '.hotfix-navbar-nav': '.navbar__nav',
    '.hotfix-navbar-link': '.navbar__link',
    '.hotfix-navbar-mobile-toggle': '.navbar__mobile-toggle',

    // HERO
    '.hotfix-hero': '.hero',
    '.hotfix-hero-content': '.hero__content',
    '.hotfix-hero-kicker': '.hero__kicker',
    '.hotfix-hero-title': '.hero__title',
    '.hotfix-hero-title-accent': '.hero__title--accent',
    '.hotfix-hero-description': '.hero__description',
    '.hotfix-hero-cta': '.hero__cta',
    '.hotfix-hero-scroll': '.hero__scroll-indicator',
    '.hotfix-hero-scroll-text': '.hero__scroll-text',
    '.hotfix-hero-scroll-arrow': '.hero__scroll-arrow',

    // ALTERNATING BLOCKS
    '.hotfix-alternating-blocks': '.alternating-blocks',
    '.hotfix-section-header': '.alternating-blocks__section-header',
    '.hotfix-script-accent': '.alternating-blocks__script-accent',
    '.hotfix-section-title': '.alternating-blocks__section-title',
    '.hotfix-lead': '.alternating-blocks__lead',
    '.hotfix-blocks-container': '.alternating-blocks__container',
    '.hotfix-block-item': '.alternating-blocks__item',
    '.hotfix-block-content': '.alternating-blocks__content',
    '.hotfix-number': '.alternating-blocks__number',
    '.hotfix-block-lead': '.alternating-blocks__content .alternating-blocks__lead',
    '.hotfix-block-image': '.alternating-blocks__image',

    // SPACES
    '.spaces-section': '.spaces',
    '.content-wrapper': '.spaces__container',
    '.section-header': '.spaces__header',
    '.script-accent': '.spaces__script-accent',
    '.section-title': '.spaces__title',
    '.lead': '.spaces__lead',
    '.venue-tabs': '.spaces__tabs',
    '.venue-tab': '.spaces__tab',
    '.venue-tab.active': '.spaces__tab--active',
    '.spaces-content': '.spaces__content',
    '.venue-main-image': '.spaces__image',
    '.carousel-arrow': '.spaces__arrow',
    '.venue-details': '.spaces__details',
    '.venue-features': '.spaces__features',
    '.venue-feature': '.spaces__feature',
  };

  const criticalStyles = [
    'display',
    'position',
    'width',
    'height',
    'padding',
    'margin',
    'marginBottom',
    'border',
    'borderRadius',
    'color',
    'backgroundColor',
    'background',
    'fontSize',
    'fontWeight',
    'fontFamily',
    'lineHeight',
    'textAlign',
    'textTransform',
    'letterSpacing',
    'opacity',
    'gridTemplateColumns',
    'gap',
    'flexDirection',
    'justifyContent',
    'alignItems',
  ];

  // Get hotfix elements
  console.log('📍 Scanning hotfix version...\n');
  await page.goto(`${ORIGIN}/`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  const hotfixElements = await page.evaluate(({ selectors, styles }) => {
    const results: any[] = [];

    for (const selector of Object.keys(selectors)) {
      const elements = document.querySelectorAll(selector);
      if (elements.length > 0) {
        const el = elements[0];
        const computed = window.getComputedStyle(el);
        const styleData: any = {};

        for (const style of styles) {
          styleData[style] = computed[style as any];
        }

        results.push({
          selector,
          count: elements.length,
          styles: styleData,
        });
      }
    }

    return results;
  }, { selectors: selectorMap, styles: criticalStyles });

  console.log(`Found ${hotfixElements.length} hotfix elements\n`);

  // Get clean elements
  console.log('📍 Scanning clean version...\n');
  await page.goto(`${ORIGIN}/clean`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  const cleanElements = await page.evaluate(({ selectors, styles }) => {
    const results: any[] = [];

    for (const selector of Object.values(selectors)) {
      const elements = document.querySelectorAll(selector);
      if (elements.length > 0) {
        const el = elements[0];
        const computed = window.getComputedStyle(el);
        const styleData: any = {};

        for (const style of styles) {
          styleData[style] = computed[style as any];
        }

        results.push({
          selector,
          count: elements.length,
          styles: styleData,
        });
      }
    }

    return results;
  }, { selectors: selectorMap, styles: criticalStyles });

  console.log(`Found ${cleanElements.length} clean elements\n`);

  // Compare
  console.log('🔍 Comparing styles...\n');

  let totalMutations = 0;
  const mutationReport: any[] = [];

  for (const [hotfixSelector, cleanSelector] of Object.entries(selectorMap)) {
    const hotfix = hotfixElements.find(el => el.selector === hotfixSelector);
    const clean = cleanElements.find(el => el.selector === cleanSelector);

    if (!hotfix || !clean) {
      if (!hotfix && !clean) {
        // Both missing - OK (might be conditional)
        continue;
      }
      console.log(`⚠️  Missing: ${hotfixSelector} → ${cleanSelector}`);
      if (!hotfix) console.log(`   Hotfix missing`);
      if (!clean) console.log(`   Clean missing`);
      console.log('');
      continue;
    }

    const differences: string[] = [];

    for (const style of criticalStyles) {
      const hotfixVal = hotfix.styles[style];
      const cleanVal = clean.styles[style];

      // Skip height differences (dynamic content)
      if (style === 'height' && Math.abs(parseFloat(hotfixVal) - parseFloat(cleanVal)) < 5) {
        continue;
      }

      if (hotfixVal !== cleanVal) {
        differences.push(`  ${style}: "${hotfixVal}" → "${cleanVal}"`);
      }
    }

    if (differences.length > 0) {
      totalMutations++;
      console.log(`❌ ${hotfixSelector} → ${cleanSelector}`);
      differences.forEach(diff => console.log(diff));
      console.log('');

      mutationReport.push({
        hotfixSelector,
        cleanSelector,
        differenceCount: differences.length,
        differences,
      });
    } else {
      console.log(`✅ ${hotfixSelector} → ${cleanSelector}`);
    }
  }

  console.log('\n=== MUTATION REPORT ===\n');
  console.log(`Total selectors checked: ${Object.keys(selectorMap).length}`);
  console.log(`Selectors with mutations: ${totalMutations}`);
  console.log(`Selectors matching perfectly: ${Object.keys(selectorMap).length - totalMutations}`);

  if (totalMutations > 0) {
    console.log('\n⚠️  MUTATIONS DETECTED:\n');
    mutationReport.forEach(item => {
      console.log(`   ${item.hotfixSelector} → ${item.cleanSelector}`);
      console.log(`   ${item.differenceCount} style differences`);
      item.differences.slice(0, 3).forEach((diff: string) => console.log(`   ${diff}`));
      if (item.differences.length > 3) {
        console.log(`   ... and ${item.differences.length - 3} more`);
      }
      console.log('');
    });
    console.log('\n❌ Clean version has design mutations!');
  } else {
    console.log('\n✅ ZERO MUTATIONS! Clean version matches hotfix perfectly.');
  }
});
