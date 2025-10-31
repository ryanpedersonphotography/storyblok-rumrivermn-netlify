import { test } from '@playwright/test';

const ORIGIN = process.env.E2E_ORIGIN ?? 'https://localhost:9999';

test('audit ALL elements for design mutations', async ({ page }) => {
  console.log('\n=== FULL MUTATION AUDIT ===\n');
  console.log('Checking EVERY element in Navbar and Hero for differences...\n');

  await page.emulateMedia({ colorScheme: 'light' });

  // Get all elements from hotfix
  await page.goto(`${ORIGIN}/`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);

  const hotfixElements = await page.evaluate(() => {
    const elements = [];

    // Navbar elements
    const navbar = document.querySelector('.hotfix-navbar');
    if (navbar) {
      elements.push({
        selector: '.hotfix-navbar',
        tag: navbar.tagName.toLowerCase(),
        styles: window.getComputedStyle(navbar),
      });

      // All navbar descendants
      const navChildren = navbar.querySelectorAll('*');
      navChildren.forEach((el) => {
        const classes = Array.from(el.classList).filter(c => c.startsWith('hotfix-navbar'));
        if (classes.length > 0) {
          elements.push({
            selector: '.' + classes[0],
            tag: el.tagName.toLowerCase(),
            styles: window.getComputedStyle(el),
          });
        }
      });
    }

    // Hero elements
    const hero = document.querySelector('.hotfix-hero-romantic');
    if (hero) {
      const heroChildren = hero.querySelectorAll('*');
      heroChildren.forEach((el) => {
        const classes = Array.from(el.classList).filter(c => c.startsWith('hotfix-hero'));
        if (classes.length > 0) {
          elements.push({
            selector: '.' + classes[0],
            tag: el.tagName.toLowerCase(),
            styles: window.getComputedStyle(el),
          });
        }
      });
    }

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
        color: el.styles.color,
        backgroundColor: el.styles.backgroundColor,
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
      }
    }));
  });

  // Get all elements from clean
  await page.goto(`${ORIGIN}/clean`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);

  const cleanElements = await page.evaluate(() => {
    const elements = [];

    // Navbar elements
    const navbar = document.querySelector('.navbar');
    if (navbar) {
      elements.push({
        selector: '.navbar',
        tag: navbar.tagName.toLowerCase(),
        styles: window.getComputedStyle(navbar),
      });

      // All navbar descendants with BEM classes
      const navChildren = navbar.querySelectorAll('*');
      navChildren.forEach((el) => {
        const classes = Array.from(el.classList).filter(c => c.startsWith('navbar__') || c.startsWith('navbar--'));
        if (classes.length > 0) {
          elements.push({
            selector: '.' + classes[0],
            tag: el.tagName.toLowerCase(),
            styles: window.getComputedStyle(el),
          });
        }
      });
    }

    // Hero elements
    const hero = document.querySelector('.hero');
    if (hero) {
      const heroChildren = hero.querySelectorAll('*');
      heroChildren.forEach((el) => {
        const classes = Array.from(el.classList).filter(c => c.startsWith('hero__') || c.startsWith('hero--'));
        if (classes.length > 0) {
          elements.push({
            selector: '.' + classes[0],
            tag: el.tagName.toLowerCase(),
            styles: window.getComputedStyle(el),
          });
        }
      });
    }

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
        color: el.styles.color,
        backgroundColor: el.styles.backgroundColor,
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
      }
    }));
  });

  // Create mapping between hotfix and clean selectors
  const selectorMap: Record<string, string> = {
    '.hotfix-navbar': '.navbar',
    '.hotfix-navbar-container': '.navbar__container',
    '.hotfix-navbar-logo': '.navbar__logo',
    '.hotfix-navbar-logo-icon': '.navbar__logo-icon',
    '.hotfix-navbar-logo-text': '.navbar__logo-text',
    '.hotfix-navbar-nav': '.navbar__nav',
    '.hotfix-navbar-link': '.navbar__link',
    '.hotfix-navbar-mobile-btn': '.navbar__mobile-toggle',
    '.hotfix-hero-romantic': '.hero',
    '.hotfix-hero-content': '.hero__content',
    '.hotfix-hero-kicker': '.hero__kicker',
    '.hotfix-hero-title': '.hero__title',
    '.hotfix-hero-title-accent': '.hero__title--accent',
    '.hotfix-hero-description': '.hero__description',
    '.hotfix-hero-buttons': '.hero__buttons',
    '.hotfix-btn-romantic-secondary': '.hero__cta',
    '.hotfix-hero-scroll': '.hero__scroll-indicator',
    '.hotfix-hero-scroll-text': '.hero__scroll-text',
    '.hotfix-hero-scroll-arrow': '.hero__scroll-arrow',
  };

  console.log('🔍 Comparing computed styles for each element:\n');

  let totalMutations = 0;
  const mutationReport: any[] = [];

  for (const [hotfixSelector, cleanSelector] of Object.entries(selectorMap)) {
    const hotfixEl = hotfixElements.find(el => el.selector === hotfixSelector);
    const cleanEl = cleanElements.find(el => el.selector === cleanSelector);

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
  console.log(`Total elements checked: ${Object.keys(selectorMap).length}`);
  console.log(`Elements with mutations: ${totalMutations}`);
  console.log(`Elements matching perfectly: ${Object.keys(selectorMap).length - totalMutations}`);

  if (totalMutations > 0) {
    console.log('\n⚠️  MUTATIONS DETECTED:\n');
    mutationReport.forEach(item => {
      console.log(`   ${item.hotfixSelector} → ${item.cleanSelector}`);
      console.log(`   ${item.differences} style differences`);
    });
    console.log('\n❌ Clean version has design mutations!');
    console.log('   Need to re-copy from hotfix following strict process.');
  } else {
    console.log('\n✅ ZERO MUTATIONS! Clean version matches hotfix perfectly.');
  }
});
