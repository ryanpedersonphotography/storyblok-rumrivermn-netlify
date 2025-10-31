import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';
import { PNG } from 'pngjs';
import pixelmatch from 'pixelmatch';

const ORIGIN = process.env.E2E_ORIGIN || 'http://localhost:3000';
const RESULTS_DIR = 'test-results';

test.describe('Pixel-Perfect Visual Diff', () => {
  test('compare screenshots pixel-by-pixel', async () => {
    const comparisons = [
      { hotfix: 'hotfix-light.png', clean: 'clean-light.png', name: 'Light Mode' },
      { hotfix: 'hotfix-dark.png', clean: 'clean-dark.png', name: 'Dark Mode' },
      { hotfix: 'hotfix-light-scrolled.png', clean: 'clean-light-scrolled.png', name: 'Light Scrolled' },
      { hotfix: 'hotfix-dark-scrolled.png', clean: 'clean-dark-scrolled.png', name: 'Dark Scrolled' },
    ];

    console.log('\n=== PIXEL-BY-PIXEL COMPARISON ===\n');

    for (const { hotfix, clean, name } of comparisons) {
      const hotfixPath = path.join(RESULTS_DIR, hotfix);
      const cleanPath = path.join(RESULTS_DIR, clean);
      const diffPath = path.join(RESULTS_DIR, `diff-${name.toLowerCase().replace(/\s+/g, '-')}.png`);

      // Check if files exist
      if (!fs.existsSync(hotfixPath) || !fs.existsSync(cleanPath)) {
        console.log(`⏭️  Skipping ${name} - screenshots not found`);
        continue;
      }

      // Read images
      const img1 = PNG.sync.read(fs.readFileSync(hotfixPath));
      const img2 = PNG.sync.read(fs.readFileSync(cleanPath));

      // Ensure same dimensions
      if (img1.width !== img2.width || img1.height !== img2.height) {
        console.log(`⚠️  ${name}: Dimension mismatch!`);
        console.log(`   Hotfix: ${img1.width}x${img1.height}`);
        console.log(`   Clean: ${img2.width}x${img2.height}`);
        continue;
      }

      // Create diff image
      const diff = new PNG({ width: img1.width, height: img1.height });

      // Compare pixels
      const numDiffPixels = pixelmatch(
        img1.data,
        img2.data,
        diff.data,
        img1.width,
        img1.height,
        {
          threshold: 0.1, // 0-1, lower = more sensitive
          includeAA: false, // Ignore anti-aliasing
        }
      );

      // Calculate percentage
      const totalPixels = img1.width * img1.height;
      const diffPercentage = ((numDiffPixels / totalPixels) * 100).toFixed(3);

      // Save diff image
      fs.writeFileSync(diffPath, PNG.sync.write(diff));

      // Report results
      if (numDiffPixels === 0) {
        console.log(`✅ ${name}: Perfect match (0 pixels different)`);
      } else if (parseFloat(diffPercentage) < 0.1) {
        console.log(`✅ ${name}: Near-perfect match (${diffPercentage}% different, ${numDiffPixels} pixels)`);
        console.log(`   Diff image: ${diffPath}`);
      } else if (parseFloat(diffPercentage) < 1) {
        console.log(`⚠️  ${name}: Minor differences (${diffPercentage}% different, ${numDiffPixels} pixels)`);
        console.log(`   Diff image: ${diffPath}`);
      } else {
        console.log(`❌ ${name}: Significant differences (${diffPercentage}% different, ${numDiffPixels} pixels)`);
        console.log(`   Diff image: ${diffPath}`);
        console.log(`   Hotfix: ${hotfixPath}`);
        console.log(`   Clean: ${cleanPath}`);
      }
    }

    console.log('\n=== CSS INTERFERENCE CHECK ===\n');
    console.log('Checking for Storyblok CSS interference...');
  });

  test('analyze CSS specificity and potential conflicts', async ({ page }) => {
    // Test clean version for external CSS interference
    await page.goto(`${ORIGIN}/clean`);
    await page.waitForTimeout(1000);

    const cssAnalysis = await page.evaluate(() => {
      const hero = document.querySelector('.hero__title');
      if (!hero) return { error: 'Hero not found' };

      const computed = window.getComputedStyle(hero);
      const allRules: any[] = [];

      // Get all CSS rules applying to hero title
      for (const sheet of document.styleSheets) {
        try {
          for (const rule of sheet.cssRules || []) {
            if ('selectorText' in rule && (rule as CSSStyleRule).selectorText) {
              const selector = (rule as CSSStyleRule).selectorText;
              if (hero.matches(selector)) {
                allRules.push({
                  selector,
                  href: sheet.href,
                  important: (rule as CSSStyleRule).style.cssText.includes('!important'),
                });
              }
            }
          }
        } catch (e) {
          // Cross-origin stylesheet
        }
      }

      return {
        computedColor: computed.color,
        computedFontSize: computed.fontSize,
        matchingRules: allRules,
      };
    });

    console.log('\n=== Clean Version CSS Analysis ===');
    console.log('Hero Title Computed Styles:', {
      color: cssAnalysis.computedColor,
      fontSize: cssAnalysis.computedFontSize,
    });
    console.log('\nMatching CSS Rules:');
    cssAnalysis.matchingRules?.forEach((rule: any, i: number) => {
      console.log(`  ${i + 1}. ${rule.selector}`);
      console.log(`     Source: ${rule.href || 'inline/component'}`);
      console.log(`     Has !important: ${rule.important}`);
    });

    // Check for Storyblok CSS
    const storyblokCSS = await page.evaluate(() => {
      const sheets = Array.from(document.styleSheets);
      return sheets
        .filter(s => s.href?.includes('storyblok'))
        .map(s => s.href);
    });

    console.log('\n=== Storyblok CSS Files ===');
    if (storyblokCSS.length > 0) {
      console.log('⚠️  Found Storyblok CSS that might interfere:');
      storyblokCSS.forEach(url => console.log(`   - ${url}`));
    } else {
      console.log('✅ No Storyblok CSS detected');
    }
  });
});
