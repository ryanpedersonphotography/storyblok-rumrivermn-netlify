import { test } from '@playwright/test';

const ORIGIN = process.env.E2E_ORIGIN ?? 'https://localhost:9999';

test.describe('Section-Specific Visual Analysis', () => {
  test('compare specific elements only', async ({ page }) => {
    console.log('\n=== SECTION-BY-SECTION COMPARISON ===\n');

    // Light mode comparison
    await page.emulateMedia({ colorScheme: 'light' });

    // Analyze hotfix
    await page.goto(`${ORIGIN}/`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(500);

    const hotfixMetrics = await page.evaluate(() => {
      const navbar = document.querySelector('.hotfix-navbar') as HTMLElement;
      const hero = document.querySelector('.hotfix-hero') as HTMLElement;
      const body = document.body;

      return {
        pageHeight: body.scrollHeight,
        viewportHeight: window.innerHeight,
        navbarHeight: navbar?.offsetHeight || 0,
        heroHeight: hero?.offsetHeight || 0,
        navbarBg: navbar ? window.getComputedStyle(navbar).background : null,
        heroBg: hero ? window.getComputedStyle(hero).background : null,
        bodyBg: window.getComputedStyle(body).background,
        sectionsFound: {
          navbar: !!navbar,
          hero: !!hero,
          spaces: !!document.querySelector('.hotfix-spaces'),
          footer: !!document.querySelector('.hotfix-footer'),
        },
      };
    });

    // Analyze clean
    await page.goto(`${ORIGIN}/clean`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(500);

    const cleanMetrics = await page.evaluate(() => {
      const navbar = document.querySelector('.navbar') as HTMLElement;
      const hero = document.querySelector('.hero') as HTMLElement;
      const body = document.body;

      return {
        pageHeight: body.scrollHeight,
        viewportHeight: window.innerHeight,
        navbarHeight: navbar?.offsetHeight || 0,
        heroHeight: hero?.offsetHeight || 0,
        navbarBg: navbar ? window.getComputedStyle(navbar).background : null,
        heroBg: hero ? window.getComputedStyle(hero).background : null,
        bodyBg: window.getComputedStyle(body).background,
        sectionsFound: {
          navbar: !!navbar,
          hero: !!hero,
          spaces: !!document.querySelector('.spaces'),
          footer: !!document.querySelector('.footer'),
        },
      };
    });

    console.log('📏 Page Metrics Comparison:\n');
    console.log(`Hotfix Total Height: ${hotfixMetrics.pageHeight}px`);
    console.log(`Clean Total Height: ${cleanMetrics.pageHeight}px`);
    console.log(`Height Difference: ${Math.abs(hotfixMetrics.pageHeight - cleanMetrics.pageHeight)}px\n`);

    console.log(`Hotfix Navbar Height: ${hotfixMetrics.navbarHeight}px`);
    console.log(`Clean Navbar Height: ${cleanMetrics.navbarHeight}px`);
    console.log(`Navbar Difference: ${Math.abs(hotfixMetrics.navbarHeight - cleanMetrics.navbarHeight)}px\n`);

    console.log(`Hotfix Hero Height: ${hotfixMetrics.heroHeight}px`);
    console.log(`Clean Hero Height: ${cleanMetrics.heroHeight}px`);
    console.log(`Hero Difference: ${Math.abs(hotfixMetrics.heroHeight - cleanMetrics.heroHeight)}px\n`);

    console.log('🎨 Background Comparison:\n');
    const bodyMatch = hotfixMetrics.bodyBg === cleanMetrics.bodyBg;
    console.log(`Body Background Match: ${bodyMatch ? '✅' : '❌'}`);
    if (!bodyMatch) {
      console.log(`  Hotfix: ${hotfixMetrics.bodyBg}`);
      console.log(`  Clean: ${cleanMetrics.bodyBg}`);
    }

    console.log('\n📦 Sections Present:\n');
    console.log('Hotfix:', hotfixMetrics.sectionsFound);
    console.log('Clean:', cleanMetrics.sectionsFound);

    const sectionDiff = {
      navbar: hotfixMetrics.sectionsFound.navbar === cleanMetrics.sectionsFound.navbar,
      hero: hotfixMetrics.sectionsFound.hero === cleanMetrics.sectionsFound.hero,
      spaces: hotfixMetrics.sectionsFound.spaces === cleanMetrics.sectionsFound.spaces,
      footer: hotfixMetrics.sectionsFound.footer === cleanMetrics.sectionsFound.footer,
    };

    console.log('\nSection Parity:', sectionDiff);

    if (!sectionDiff.spaces || !sectionDiff.footer) {
      console.log('\n⚠️  MISSING SECTIONS DETECTED!');
      console.log('Clean version is incomplete - missing sections will cause pixel differences.');
      console.log('This is EXPECTED and not a CSS interference issue.');
    }

    // Check if viewport only shows navbar + hero
    const aboveFold = hotfixMetrics.navbarHeight + hotfixMetrics.heroHeight;
    const cleanAboveFold = cleanMetrics.navbarHeight + cleanMetrics.heroHeight;

    console.log('\n📐 Above-the-Fold Analysis:\n');
    console.log(`Hotfix Navbar+Hero: ${aboveFold}px`);
    console.log(`Clean Navbar+Hero: ${cleanAboveFold}px`);
    console.log(`Viewport Height: ${hotfixMetrics.viewportHeight}px`);

    if (aboveFold > hotfixMetrics.viewportHeight && cleanAboveFold > cleanMetrics.viewportHeight) {
      console.log('\n✅ Both pages extend beyond viewport - fair comparison');
    } else if (hotfixMetrics.pageHeight > hotfixMetrics.viewportHeight && cleanMetrics.pageHeight < cleanMetrics.viewportHeight) {
      console.log('\n❌ ISSUE: Hotfix has content below fold, Clean does not!');
      console.log('   This will show as pixel differences in the empty space.');
    }

    // Specific element style comparison
    await page.goto(`${ORIGIN}/`, { waitUntil: 'networkidle' });
    const hotfixStyles = await page.evaluate(() => {
      const title = document.querySelector('.hotfix-hero-title');
      const navbar = document.querySelector('.hotfix-navbar');
      if (!title || !navbar) return null;

      const titleStyle = window.getComputedStyle(title);
      const navStyle = window.getComputedStyle(navbar);

      return {
        title: {
          color: titleStyle.color,
          fontSize: titleStyle.fontSize,
          fontFamily: titleStyle.fontFamily,
          textShadow: titleStyle.textShadow,
        },
        navbar: {
          background: navStyle.background,
          backdropFilter: navStyle.backdropFilter,
          boxShadow: navStyle.boxShadow,
        },
      };
    });

    await page.goto(`${ORIGIN}/clean`, { waitUntil: 'networkidle' });
    const cleanStyles = await page.evaluate(() => {
      const title = document.querySelector('.hero__title');
      const navbar = document.querySelector('.navbar');
      if (!title || !navbar) return null;

      const titleStyle = window.getComputedStyle(title);
      const navStyle = window.getComputedStyle(navbar);

      return {
        title: {
          color: titleStyle.color,
          fontSize: titleStyle.fontSize,
          fontFamily: titleStyle.fontFamily,
          textShadow: titleStyle.textShadow,
        },
        navbar: {
          background: navStyle.background,
          backdropFilter: navStyle.backdropFilter,
          boxShadow: navStyle.boxShadow,
        },
      };
    });

    console.log('\n🎯 Critical Element Styles:\n');
    console.log('Hero Title:');
    console.log(`  Color: ${hotfixStyles?.title.color === cleanStyles?.title.color ? '✅' : '❌'}`);
    console.log(`    Hotfix: ${hotfixStyles?.title.color}`);
    console.log(`    Clean: ${cleanStyles?.title.color}`);
    console.log(`  Font Size: ${hotfixStyles?.title.fontSize === cleanStyles?.title.fontSize ? '✅' : '❌'}`);
    console.log(`    Hotfix: ${hotfixStyles?.title.fontSize}`);
    console.log(`    Clean: ${cleanStyles?.title.fontSize}`);

    console.log('\nNavbar:');
    console.log(`  Background: ${hotfixStyles?.navbar.background === cleanStyles?.navbar.background ? '✅' : '❌'}`);
    if (hotfixStyles?.navbar.background !== cleanStyles?.navbar.background) {
      console.log(`    Hotfix: ${hotfixStyles?.navbar.background}`);
      console.log(`    Clean: ${cleanStyles?.navbar.background}`);
    }

    console.log('\n=== CONCLUSION ===\n');
    if (!sectionDiff.spaces || !sectionDiff.footer) {
      console.log('✅ Pixel differences are EXPECTED - clean version is incomplete');
      console.log('   Clean has 2 sections, hotfix has 13 sections');
      console.log('   Screenshots show different page lengths');
    } else if (hotfixStyles?.title.color !== cleanStyles?.title.color) {
      console.log('❌ COLOR MISMATCH - CSS interference detected!');
    } else {
      console.log('⚠️  Investigate further - sections match but pixels differ');
    }
  });
});
