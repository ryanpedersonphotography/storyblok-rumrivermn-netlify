import { test, expect } from '@playwright/test';
import { stabilize } from './utils/setup';

test.describe('Hero Button Comparison: Original vs Primitives Demo', () => {
  test('Compare computed styles of hero button', async ({ page }) => {
    // Get original hero button styles
    await page.goto('https://localhost:9999');
    await stabilize(page);

    const originalButton = page.locator('.hero-cta').first();
    const originalStyles = await originalButton.evaluate((el) => {
      const computed = getComputedStyle(el);
      return {
        // Layout
        display: computed.display,
        padding: computed.padding,
        paddingTop: computed.paddingTop,
        paddingRight: computed.paddingRight,
        paddingBottom: computed.paddingBottom,
        paddingLeft: computed.paddingLeft,
        borderRadius: computed.borderRadius,

        // Typography
        fontFamily: computed.fontFamily,
        fontSize: computed.fontSize,
        fontWeight: computed.fontWeight,
        letterSpacing: computed.letterSpacing,
        textTransform: computed.textTransform,

        // Colors
        color: computed.color,
        backgroundColor: computed.backgroundColor,
        borderColor: computed.borderColor,
        borderWidth: computed.borderWidth,
        borderStyle: computed.borderStyle,

        // Effects
        boxShadow: computed.boxShadow,
        transition: computed.transition,
      };
    });

    // Get primitives demo button styles
    await page.goto('https://localhost:9999/primitives-test');
    await stabilize(page);

    const demoButton = page.locator('.hero-cta').first();
    const demoStyles = await demoButton.evaluate((el) => {
      const computed = getComputedStyle(el);
      return {
        // Layout
        display: computed.display,
        padding: computed.padding,
        paddingTop: computed.paddingTop,
        paddingRight: computed.paddingRight,
        paddingBottom: computed.paddingBottom,
        paddingLeft: computed.paddingLeft,
        borderRadius: computed.borderRadius,

        // Typography
        fontFamily: computed.fontFamily,
        fontSize: computed.fontSize,
        fontWeight: computed.fontWeight,
        letterSpacing: computed.letterSpacing,
        textTransform: computed.textTransform,

        // Colors
        color: computed.color,
        backgroundColor: computed.backgroundColor,
        borderColor: computed.borderColor,
        borderWidth: computed.borderWidth,
        borderStyle: computed.borderStyle,

        // Effects
        boxShadow: computed.boxShadow,
        transition: computed.transition,
      };
    });

    // Compare and report differences
    console.log('\n=== HERO BUTTON STYLE COMPARISON ===\n');
    console.log('Original (Home Page):');
    console.log(JSON.stringify(originalStyles, null, 2));
    console.log('\nPrimitives Demo:');
    console.log(JSON.stringify(demoStyles, null, 2));

    console.log('\n=== DIFFERENCES ===\n');
    const keys = Object.keys(originalStyles) as Array<keyof typeof originalStyles>;
    const differences: string[] = [];

    keys.forEach(key => {
      if (originalStyles[key] !== demoStyles[key]) {
        const diff = `${key}:
  Original: ${originalStyles[key]}
  Demo:     ${demoStyles[key]}`;
        differences.push(diff);
        console.log(diff);
      }
    });

    if (differences.length === 0) {
      console.log('✓ Buttons are identical!');
    } else {
      console.log(`\n${differences.length} style differences found`);
    }

    // Calculate similarity percentage
    const matchCount = keys.length - differences.length;
    const similarity = (matchCount / keys.length) * 100;
    console.log(`\nSimilarity: ${similarity.toFixed(1)}%`);

    // Fail if less than 95% similar
    expect(similarity).toBeGreaterThanOrEqual(95);
  });

  test('Visual screenshot comparison', async ({ page }) => {
    // Capture original hero button
    await page.goto('https://localhost:9999');
    await stabilize(page);
    const originalButton = page.locator('.hero-cta').first();
    await expect(originalButton).toHaveScreenshot('hero-button-original.png', {
      animations: 'disabled',
    });

    // Capture primitives demo button
    await page.goto('https://localhost:9999/primitives-test');
    await stabilize(page);

    // Scroll to the hero button demo section
    await page.evaluate(() => {
      const demoSection = document.querySelector('[data-variant*="Demo 15"]');
      if (demoSection) {
        demoSection.scrollIntoView({ behavior: 'instant', block: 'center' });
      }
    });
    await page.waitForTimeout(500);

    const demoButton = page.locator('.hero-cta').first();
    await expect(demoButton).toHaveScreenshot('hero-button-demo.png', {
      animations: 'disabled',
    });
  });
});
