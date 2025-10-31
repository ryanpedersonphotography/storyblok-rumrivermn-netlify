import { test } from '@playwright/test';

const ORIGIN = process.env.E2E_ORIGIN ?? 'https://localhost:9999';

test('verify alternating blocks section has zero design mutations', async ({ page }) => {
  console.log('\n=== ALTERNATING BLOCKS VERIFICATION ===\n');

  await page.emulateMedia({ colorScheme: 'light' });

  // Get hotfix elements
  await page.goto(`${ORIGIN}/`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);

  const hotfixElements = await page.evaluate(() => {
    const elements: any[] = [];

    const section = document.querySelector('.hotfix-alternating-blocks');
    if (!section) return elements;

    // Section container
    elements.push({
      selector: '.hotfix-alternating-blocks',
      styles: window.getComputedStyle(section),
    });

    // All descendant elements with hotfix-alternating classes
    const descendants = section.querySelectorAll('*');
    descendants.forEach((el) => {
      const classes = Array.from(el.classList);
      const relevantClass = classes.find(c =>
        c.startsWith('hotfix-alternating') ||
        c.startsWith('hotfix-section') ||
        c.startsWith('hotfix-script') ||
        c.startsWith('hotfix-lead') ||
        c.startsWith('hotfix-blocks') ||
        c.startsWith('hotfix-block') ||
        c.startsWith('hotfix-number') ||
        c.startsWith('hotfix-content')
      );

      if (relevantClass) {
        elements.push({
          selector: '.' + relevantClass,
          tag: el.tagName.toLowerCase(),
          styles: window.getComputedStyle(el),
        });
      }
    });

    // Convert CSSStyleDeclaration to plain object
    return elements.map(el => ({
      selector: el.selector,
      tag: el.tag,
      styles: {
        display: el.styles.display,
        position: el.styles.position,
        width: el.styles.width,
        height: el.styles.height,
        padding: el.styles.padding,
        margin: el.styles.margin,
        border: el.styles.border,
        borderRadius: el.styles.borderRadius,
        color: el.styles.color,
        backgroundColor: el.styles.backgroundColor,
        background: el.styles.background,
        fontSize: el.styles.fontSize,
        fontWeight: el.styles.fontWeight,
        fontFamily: el.styles.fontFamily,
        lineHeight: el.styles.lineHeight,
        textAlign: el.styles.textAlign,
        textTransform: el.styles.textTransform,
        letterSpacing: el.styles.letterSpacing,
        opacity: el.styles.opacity,
        visibility: el.styles.visibility,
        zIndex: el.styles.zIndex,
        flexDirection: el.styles.flexDirection,
        justifyContent: el.styles.justifyContent,
        alignItems: el.styles.alignItems,
        gap: el.styles.gap,
        gridTemplateColumns: el.styles.gridTemplateColumns,
        direction: el.styles.direction,
        maxWidth: el.styles.maxWidth,
        marginBottom: el.styles.marginBottom,
        boxShadow: el.styles.boxShadow,
        transform: el.styles.transform,
        transition: el.styles.transition,
        overflow: el.styles.overflow,
        objectFit: el.styles.objectFit,
      }
    }));
  });

  // Get clean elements
  await page.goto(`${ORIGIN}/clean`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);

  const cleanElements = await page.evaluate(() => {
    const elements: any[] = [];

    const section = document.querySelector('.alternating-blocks');
    if (!section) return elements;

    // Section container
    elements.push({
      selector: '.alternating-blocks',
      styles: window.getComputedStyle(section),
    });

    // All descendant elements with alternating-blocks classes
    const descendants = section.querySelectorAll('*');
    descendants.forEach((el) => {
      const classes = Array.from(el.classList);
      const relevantClass = classes.find(c => c.startsWith('alternating-blocks'));

      if (relevantClass) {
        elements.push({
          selector: '.' + relevantClass,
          tag: el.tagName.toLowerCase(),
          styles: window.getComputedStyle(el),
        });
      }
    });

    // Convert CSSStyleDeclaration to plain object
    return elements.map(el => ({
      selector: el.selector,
      tag: el.tag,
      styles: {
        display: el.styles.display,
        position: el.styles.position,
        width: el.styles.width,
        height: el.styles.height,
        padding: el.styles.padding,
        margin: el.styles.margin,
        border: el.styles.border,
        borderRadius: el.styles.borderRadius,
        color: el.styles.color,
        backgroundColor: el.styles.backgroundColor,
        background: el.styles.background,
        fontSize: el.styles.fontSize,
        fontWeight: el.styles.fontWeight,
        fontFamily: el.styles.fontFamily,
        lineHeight: el.styles.lineHeight,
        textAlign: el.styles.textAlign,
        textTransform: el.styles.textTransform,
        letterSpacing: el.styles.letterSpacing,
        opacity: el.styles.opacity,
        visibility: el.styles.visibility,
        zIndex: el.styles.zIndex,
        flexDirection: el.styles.flexDirection,
        justifyContent: el.styles.justifyContent,
        alignItems: el.styles.alignItems,
        gap: el.styles.gap,
        gridTemplateColumns: el.styles.gridTemplateColumns,
        direction: el.styles.direction,
        maxWidth: el.styles.maxWidth,
        marginBottom: el.styles.marginBottom,
        boxShadow: el.styles.boxShadow,
        transform: el.styles.transform,
        transition: el.styles.transition,
        overflow: el.styles.overflow,
        objectFit: el.styles.objectFit,
      }
    }));
  });

  // Create mapping
  const selectorMap: Record<string, string> = {
    '.hotfix-alternating-blocks': '.alternating-blocks',
    '.hotfix-content-wrapper': '.alternating-blocks__content-wrapper',
    '.hotfix-section-header': '.alternating-blocks__section-header',
    '.hotfix-script-accent': '.alternating-blocks__script-accent',
    '.hotfix-section-title': '.alternating-blocks__section-title',
    '.hotfix-lead': '.alternating-blocks__lead',
    '.hotfix-blocks-container': '.alternating-blocks__container',
    '.hotfix-block-item': '.alternating-blocks__item',
    '.hotfix-block-content': '.alternating-blocks__content',
    '.hotfix-number': '.alternating-blocks__number',
    '.hotfix-block-image': '.alternating-blocks__image',
  };

  console.log(`📊 Element Count Verification:\n`);
  console.log(`Hotfix elements found: ${hotfixElements.length}`);
  console.log(`Clean elements found: ${cleanElements.length}`);

  console.log('\n🔍 Comparing computed styles for each element:\n');

  let totalMutations = 0;
  const mutationReport: any[] = [];

  for (const [hotfixSelector, cleanSelector] of Object.entries(selectorMap)) {
    const hotfixMatches = hotfixElements.filter(el => el.selector === hotfixSelector);
    const cleanMatches = cleanElements.filter(el => el.selector === cleanSelector);

    // Compare first instance of each
    const hotfixEl = hotfixMatches[0];
    const cleanEl = cleanMatches[0];

    if (!hotfixEl || !cleanEl) {
      console.log(`⏭️  Skipping ${hotfixSelector} - element not found`);
      continue;
    }

    const differences: string[] = [];
    const styleKeys = Object.keys(hotfixEl.styles) as (keyof typeof hotfixEl.styles)[];

    for (const key of styleKeys) {
      if (hotfixEl.styles[key] !== cleanEl.styles[key]) {
        differences.push(`  ${key}: "${hotfixEl.styles[key]}" → "${cleanEl.styles[key]}"`);
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
        differences: differences.length,
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
      console.log(`   ${item.differences} style differences`);
    });
    console.log('\n❌ Clean version has design mutations!');
  } else {
    console.log('\n✅ ZERO MUTATIONS! Clean version matches hotfix perfectly.');
  }
});
