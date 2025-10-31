import { test, expect } from '@playwright/test';
import { PNG } from 'pngjs';
import pixelmatch from 'pixelmatch';

const ORIGIN = process.env.E2E_ORIGIN ?? 'https://localhost:9999';

test.describe('Inline Pixel Comparison', () => {
  test('capture and compare in single test', async ({ page, browser }) => {
    console.log('\n=== INLINE PIXEL-BY-PIXEL COMPARISON ===\n');

    const comparisons = [
      { theme: 'light', scrolled: false },
      { theme: 'dark', scrolled: false },
    ];

    for (const { theme, scrolled } of comparisons) {
      // Set theme
      await page.emulateMedia({ colorScheme: theme as 'light' | 'dark' });

      // Capture hotfix
      await page.goto(`${ORIGIN}/`, { waitUntil: 'networkidle' });
      await page.waitForTimeout(500);

      if (scrolled) {
        await page.evaluate(() => window.scrollTo(0, 100));
        await page.waitForTimeout(200);
      }

      const hotfixScreenshot = await page.screenshot({ fullPage: false });
      const hotfixPng = PNG.sync.read(hotfixScreenshot);

      // Capture clean
      await page.goto(`${ORIGIN}/clean`, { waitUntil: 'networkidle' });
      await page.waitForTimeout(500);

      if (scrolled) {
        await page.evaluate(() => window.scrollTo(0, 100));
        await page.waitForTimeout(200);
      }

      const cleanScreenshot = await page.screenshot({ fullPage: false });
      const cleanPng = PNG.sync.read(cleanScreenshot);

      // Ensure same dimensions
      if (hotfixPng.width !== cleanPng.width || hotfixPng.height !== cleanPng.height) {
        console.log(`⚠️  ${theme} (scrolled: ${scrolled}): Dimension mismatch!`);
        console.log(`   Hotfix: ${hotfixPng.width}x${hotfixPng.height}`);
        console.log(`   Clean: ${cleanPng.width}x${cleanPng.height}`);
        continue;
      }

      // Create diff
      const diff = new PNG({ width: hotfixPng.width, height: hotfixPng.height });

      // Compare pixels
      const numDiffPixels = pixelmatch(
        hotfixPng.data,
        cleanPng.data,
        diff.data,
        hotfixPng.width,
        hotfixPng.height,
        {
          threshold: 0.1, // 0-1, lower = more sensitive
          includeAA: false, // Ignore anti-aliasing differences
        }
      );

      const totalPixels = hotfixPng.width * hotfixPng.height;
      const diffPercentage = ((numDiffPixels / totalPixels) * 100).toFixed(3);

      // Report
      const name = `${theme.charAt(0).toUpperCase() + theme.slice(1)}${scrolled ? ' Scrolled' : ''}`;

      if (numDiffPixels === 0) {
        console.log(`✅ ${name}: PERFECT MATCH (0 pixels different)`);
      } else if (parseFloat(diffPercentage) < 0.1) {
        console.log(`✅ ${name}: Near-perfect (${diffPercentage}% / ${numDiffPixels} px different)`);
        console.log(`   This is likely anti-aliasing or font rendering differences`);
      } else if (parseFloat(diffPercentage) < 1) {
        console.log(`⚠️  ${name}: Minor differences (${diffPercentage}% / ${numDiffPixels} px)`);
        console.log(`   Acceptable for minor rendering variations`);
      } else {
        console.log(`❌ ${name}: SIGNIFICANT DIFFERENCES (${diffPercentage}% / ${numDiffPixels} px)`);
        console.log(`   ⚠️  Visual parity FAILED - CSS might be interfering!`);
      }
    }

    console.log('\n=== CHECKING FOR CSS INTERFERENCE ===\n');

    // Analyze clean version for external CSS
    await page.goto(`${ORIGIN}/clean`);
    await page.waitForTimeout(500);

    const cssAnalysis = await page.evaluate(() => {
      const results: any = {
        storyblokCSS: [],
        externalCSS: [],
        allStylesheets: [],
        heroTitleRules: [],
      };

      // Check all stylesheets
      for (const sheet of document.styleSheets) {
        const href = sheet.href || 'inline';
        results.allStylesheets.push(href);

        if (href.includes('storyblok')) {
          results.storyblokCSS.push(href);
        }

        if (href.startsWith('http') && !href.includes('localhost')) {
          results.externalCSS.push(href);
        }

        // Check rules affecting hero title
        try {
          const hero = document.querySelector('.hero__title');
          if (hero) {
            for (const rule of sheet.cssRules || []) {
              if ('selectorText' in rule && (rule as CSSStyleRule).selectorText) {
                const selector = (rule as CSSStyleRule).selectorText;
                try {
                  if (hero.matches(selector)) {
                    results.heroTitleRules.push({
                      selector,
                      source: href,
                      hasImportant: (rule as CSSStyleRule).style.cssText.includes('!important'),
                    });
                  }
                } catch (e) {
                  // Invalid selector or cross-origin
                }
              }
            }
          }
        } catch (e) {
          // Cross-origin stylesheet
        }
      }

      return results;
    });

    console.log('📁 All Loaded Stylesheets:');
    cssAnalysis.allStylesheets.forEach((href: string) => {
      const isLocal = href.includes('localhost') || href === 'inline';
      console.log(`   ${isLocal ? '✓' : '⚠️'}  ${href}`);
    });

    if (cssAnalysis.storyblokCSS.length > 0) {
      console.log('\n⚠️  STORYBLOK CSS DETECTED:');
      cssAnalysis.storyblokCSS.forEach((url: string) => console.log(`   - ${url}`));
      console.log('   These may interfere with clean version!');
    } else {
      console.log('\n✅ No Storyblok CSS detected');
    }

    if (cssAnalysis.externalCSS.length > 0) {
      console.log('\n⚠️  EXTERNAL CSS DETECTED:');
      cssAnalysis.externalCSS.forEach((url: string) => console.log(`   - ${url}`));
    }

    console.log('\n🎯 CSS Rules Affecting .hero__title:');
    if (cssAnalysis.heroTitleRules.length === 0) {
      console.log('   ⚠️  No rules found (unexpected!)');
    } else {
      cssAnalysis.heroTitleRules.forEach((rule: any, i: number) => {
        const importance = rule.hasImportant ? ' [!IMPORTANT]' : '';
        console.log(`   ${i + 1}. ${rule.selector}${importance}`);
        console.log(`      from: ${rule.source}`);
      });
    }

    // Check if hotfix has more specificity
    await page.goto(`${ORIGIN}/`);
    await page.waitForTimeout(500);

    const hotfixCSS = await page.evaluate(() => {
      const hero = document.querySelector('.hotfix-hero-title');
      if (!hero) return { error: 'Hero not found' };

      const results: any[] = [];
      for (const sheet of document.styleSheets) {
        try {
          for (const rule of sheet.cssRules || []) {
            if ('selectorText' in rule && (rule as CSSStyleRule).selectorText) {
              const selector = (rule as CSSStyleRule).selectorText;
              try {
                if (hero.matches(selector)) {
                  results.push({
                    selector,
                    source: sheet.href || 'inline',
                    hasImportant: (rule as CSSStyleRule).style.cssText.includes('!important'),
                  });
                }
              } catch (e) {}
            }
          }
        } catch (e) {}
      }
      return { rules: results };
    });

    console.log('\n🎯 CSS Rules Affecting .hotfix-hero-title:');
    if (hotfixCSS.rules) {
      hotfixCSS.rules.forEach((rule: any, i: number) => {
        const importance = rule.hasImportant ? ' [!IMPORTANT]' : '';
        console.log(`   ${i + 1}. ${rule.selector}${importance}`);
        console.log(`      from: ${rule.source}`);
      });
    }

    console.log('\n=== CONCLUSION ===');
    console.log('If pixel differences exist, check:');
    console.log('1. External CSS loading (Storyblok, CDN)');
    console.log('2. CSS rule count differences (hotfix has !important wall)');
    console.log('3. Cascade order differences');
    console.log('');
  });
});
