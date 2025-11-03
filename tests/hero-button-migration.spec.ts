import { test, expect } from '@playwright/test';
import { stabilize } from './utils/setup';

test.describe('Hero Button Migration: Component CSS vs Primitives-Only', () => {
  test('Compare computed styles between original and primitives button', async ({ page }) => {
    // Navigate to migration demo page
    await page.goto('https://localhost:9999/hero-button-migration');
    await stabilize(page);

    // Target specific buttons by test-id
    const originalButton = page.locator('[data-testid="hero-button-original"]');
    const primitivesButton = page.locator('[data-testid="hero-button-primitives"]');

    // Wait for buttons to be visible
    await originalButton.waitFor({ state: 'visible' });
    await primitivesButton.waitFor({ state: 'visible' });

    // Extract computed styles from both buttons
    const [originalStyles, primitivesStyles] = await Promise.all([
      originalButton.evaluate((el) => {
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
          transform: computed.transform,
        };
      }),
      primitivesButton.evaluate((el) => {
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
          transform: computed.transform,
        };
      })
    ]);

    // Compare and report differences
    console.log('\n=== HERO BUTTON MIGRATION: STYLE COMPARISON ===\n');
    console.log('Original (Component CSS):');
    console.log(JSON.stringify(originalStyles, null, 2));
    console.log('\nPrimitives-Only (Inline Styles + Tokens):');
    console.log(JSON.stringify(primitivesStyles, null, 2));

    console.log('\n=== DIFFERENCES ===\n');
    const keys = Object.keys(originalStyles) as Array<keyof typeof originalStyles>;
    const differences: Array<{property: string, original: string, primitives: string}> = [];

    keys.forEach(key => {
      if (originalStyles[key] !== primitivesStyles[key]) {
        differences.push({
          property: key,
          original: originalStyles[key],
          primitives: primitivesStyles[key]
        });
        console.log(`${key}:`);
        console.log(`  Original:   ${originalStyles[key]}`);
        console.log(`  Primitives: ${primitivesStyles[key]}`);
        console.log('');
      }
    });

    // Calculate similarity percentage
    const matchCount = keys.length - differences.length;
    const similarity = (matchCount / keys.length) * 100;

    console.log(`\n=== RESULTS ===`);
    console.log(`Matching properties: ${matchCount}/${keys.length}`);
    console.log(`Similarity: ${similarity.toFixed(1)}%`);
    console.log(`Target: 95.0%\n`);

    // Generate detailed report
    if (differences.length > 0) {
      console.log('=== FAILED PROPERTIES ===');
      differences.forEach(({ property, original, primitives }) => {
        console.log(`\n❌ ${property}`);
        console.log(`   Expected: ${original}`);
        console.log(`   Received: ${primitives}`);
      });
      console.log('');
    } else {
      console.log('✅ Perfect match! All properties identical.\n');
    }

    // Assertion: Must be at least 95% similar
    expect(similarity).toBeGreaterThanOrEqual(95);
  });

  test('Visual screenshot comparison of both buttons', async ({ page }) => {
    await page.goto('https://localhost:9999/hero-button-migration');
    await stabilize(page);

    // Wait for both buttons to be visible
    await page.locator('[data-testid="hero-button-original"]').waitFor({ state: 'visible' });
    await page.locator('[data-testid="hero-button-primitives"]').waitFor({ state: 'visible' });

    // Capture original button in isolation
    const originalButton = page.locator('[data-testid="hero-button-original"]');
    await expect(originalButton).toHaveScreenshot('hero-button-original.png', {
      animations: 'disabled',
      maxDiffPixels: 50, // Allow minor anti-aliasing differences
    });

    // Capture primitives button in isolation
    const primitivesButton = page.locator('[data-testid="hero-button-primitives"]');
    await expect(primitivesButton).toHaveScreenshot('hero-button-primitives.png', {
      animations: 'disabled',
      maxDiffPixels: 50,
    });
  });

  test('Hover state comparison', async ({ page }) => {
    await page.goto('https://localhost:9999/hero-button-migration');
    await stabilize(page);

    const originalButton = page.locator('[data-testid="hero-button-original"]');
    const primitivesButton = page.locator('[data-testid="hero-button-primitives"]');

    // Hover original button and capture state
    await originalButton.hover();
    await page.waitForTimeout(300); // Wait for transition

    const originalHoverStyles = await originalButton.evaluate((el) => {
      const computed = getComputedStyle(el);
      return {
        backgroundColor: computed.backgroundColor,
        color: computed.color,
        transform: computed.transform,
        boxShadow: computed.boxShadow,
      };
    });

    // Hover primitives button and capture state
    await primitivesButton.hover();
    await page.waitForTimeout(300); // Wait for transition

    const primitivesHoverStyles = await primitivesButton.evaluate((el) => {
      const computed = getComputedStyle(el);
      return {
        backgroundColor: computed.backgroundColor,
        color: computed.color,
        transform: computed.transform,
        boxShadow: computed.boxShadow,
      };
    });

    console.log('\n=== HOVER STATE COMPARISON ===\n');
    console.log('Original hover:');
    console.log(JSON.stringify(originalHoverStyles, null, 2));
    console.log('\nPrimitives hover:');
    console.log(JSON.stringify(primitivesHoverStyles, null, 2));

    // Check key hover properties match
    expect(originalHoverStyles.backgroundColor).toBe(primitivesHoverStyles.backgroundColor);
    expect(originalHoverStyles.color).toBe(primitivesHoverStyles.color);
  });
});
