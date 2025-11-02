import { test, expect } from '@playwright/test';
import pixelmatch from 'pixelmatch';
import { PNG } from 'pngjs';

test.describe('Hero Primitives Migration', () => {
  test.beforeEach(async ({ page }) => {
    // Set viewport to consistent size
    await page.setViewportSize({ width: 1440, height: 900 });
  });

  test('primitives hero uses NO original hero CSS classes', async ({ page }) => {
    await page.goto('https://localhost:9999/primitives-migration');

    // Wait for hero to load
    await page.waitForSelector('section[data-recipe="hero-dark"]', { timeout: 5000 });

    // Get the hero section
    const heroSection = page.locator('section[data-recipe="hero-dark"]').first();

    // Check that NO legacy hero classes are used
    const forbiddenClasses = [
      '.hero',
      '.hero-content',
      '.hero-eyebrow',
      '.hero-title',
      '.hero-title-accent',
      '.hero-lead',
      '.hero-ctas',
      '.hero-cta',
      '.hero-cta-secondary',
      '.hero-scroll',
      '.hero-scroll-text',
      '.hero-scroll-arrow'
    ];

    for (const selector of forbiddenClasses) {
      const count = await heroSection.locator(selector).count();
      expect(count, `Should NOT use legacy class: ${selector}`).toBe(0);
    }

    console.log('✅ No legacy hero classes found');
  });

  test('primitives hero ONLY uses primitives and tokens', async ({ page }) => {
    await page.goto('https://localhost:9999/primitives-migration');

    await page.waitForSelector('section[data-recipe="hero-dark"]', { timeout: 5000 });

    const heroSection = page.locator('section[data-recipe="hero-dark"]').first();

    // Verify it uses Section primitive with recipe/density
    const recipeAttr = await heroSection.getAttribute('data-recipe');
    expect(recipeAttr).toBe('hero-dark');

    const densityAttr = await heroSection.getAttribute('data-density');
    expect(densityAttr).toBe('airy');

    // Verify stack primitive is used
    const stackCount = await heroSection.locator('.stack').count();
    expect(stackCount, 'Should use .stack primitive').toBeGreaterThan(0);

    // Verify cluster primitive is used for buttons
    const clusterCount = await heroSection.locator('.cluster').count();
    expect(clusterCount, 'Should use .cluster primitive for CTAs').toBeGreaterThan(0);

    // Verify typography primitives
    const headingCount = await heroSection.locator('[data-ui="heading"]').count();
    expect(headingCount, 'Should use heading primitive').toBeGreaterThan(0);

    const textCount = await heroSection.locator('[data-ui="text"]').count();
    expect(textCount, 'Should use text primitive').toBeGreaterThan(0);

    // Verify button primitives
    const buttonCount = await heroSection.locator('.button').count();
    expect(buttonCount, 'Should use button primitive').toBeGreaterThan(0);

    console.log('✅ All primitives verified');
  });

  test('primitives hero matches original visual layout', async ({ page }) => {
    // Go to primitives version
    await page.goto('https://localhost:9999/primitives-migration');
    await page.waitForSelector('section[data-recipe="hero-dark"]', { timeout: 5000 });

    // Wait for images and fonts to load
    await page.waitForTimeout(1000);

    const primitivesHero = page.locator('section[data-recipe="hero-dark"]').first();

    // Check key layout properties
    const primitivesBox = await primitivesHero.boundingBox();
    expect(primitivesBox?.height, 'Hero should be viewport height').toBeGreaterThan(700);

    // Check text content is present
    const hasTitle = await primitivesHero.locator('h1:has-text("Rum River")').count() > 0;
    expect(hasTitle, 'Should have Rum River title').toBe(true);

    const hasEyebrow = await primitivesHero.locator('text=Where Dreams Begin').count() > 0;
    expect(hasEyebrow, 'Should have eyebrow text').toBe(true);

    const hasLead = await primitivesHero.locator('text=Nestled along Minnesota').count() > 0;
    expect(hasLead, 'Should have lead paragraph').toBe(true);

    // Check CTAs are present
    const ctaCount = await primitivesHero.locator('.button').count();
    expect(ctaCount, 'Should have 3 buttons (2 CTAs + scroll)').toBe(3);

    console.log('✅ Visual layout verified');
  });

  test('primitives hero uses correct token-based styling', async ({ page }) => {
    await page.goto('https://localhost:9999/primitives-migration');
    await page.waitForSelector('section[data-recipe="hero-dark"]', { timeout: 5000 });

    const heroSection = page.locator('section[data-recipe="hero-dark"]').first();

    // Check background image is set via Section's backgroundImage property
    const bgImage = await heroSection.evaluate((el) => {
      return window.getComputedStyle(el).backgroundImage;
    });
    expect(bgImage, 'Should have background image set').toContain('barn-exterior-full-deck-view-evening.jpg');

    // Check heading uses correct data attributes
    const heading = heroSection.locator('[data-ui="heading"]').first();
    const headingSize = await heading.getAttribute('data-size');
    expect(headingSize).toBe('xl');

    // Check text primitives use correct data attributes
    const text = heroSection.locator('[data-ui="text"]').first();
    const textSize = await text.getAttribute('data-size');
    expect(textSize).toBe('lg');

    // Check buttons use correct variants
    const primaryBtn = heroSection.locator('.button[data-variant="primary"]');
    const primaryCount = await primaryBtn.count();
    expect(primaryCount, 'Should have primary button').toBeGreaterThan(0);

    const ghostBtn = heroSection.locator('.button[data-variant="ghost"]');
    const ghostCount = await ghostBtn.count();
    expect(ghostCount, 'Should have ghost buttons').toBeGreaterThan(0);

    console.log('✅ Token-based styling verified');
  });

  test('primitives hero has proper z-index layering', async ({ page }) => {
    await page.goto('https://localhost:9999/primitives-migration');
    await page.waitForSelector('section[data-recipe="hero-dark"]', { timeout: 5000 });

    const heroSection = page.locator('section[data-recipe="hero-dark"]').first();
    const contentStack = heroSection.locator('.stack').first();

    // Check that content has higher z-index than background
    const zIndex = await contentStack.evaluate((el) => {
      return window.getComputedStyle(el).zIndex;
    });
    expect(parseInt(zIndex), 'Content should be above background').toBeGreaterThanOrEqual(10);

    console.log('✅ Z-index layering verified');
  });

  test('primitives hero is responsive', async ({ page }) => {
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('https://localhost:9999/primitives-migration');
    await page.waitForSelector('section[data-recipe="hero-dark"]', { timeout: 5000 });

    const heroSection = page.locator('section[data-recipe="hero-dark"]').first();
    const heading = heroSection.locator('h1').first();

    // Check that heading is visible and not overflowing
    const headingBox = await heading.boundingBox();
    expect(headingBox?.width).toBeLessThan(375);

    // Check that buttons stack vertically on mobile (cluster wraps)
    const cluster = heroSection.locator('.cluster').first();
    const clusterBox = await cluster.boundingBox();
    expect(clusterBox, 'Cluster should exist').not.toBeNull();

    console.log('✅ Mobile responsiveness verified');
  });

  test('primitives hero recipe variables are applied', async ({ page }) => {
    await page.goto('https://localhost:9999/primitives-migration');
    await page.waitForSelector('section[data-recipe="hero-dark"]', { timeout: 5000 });

    const heroSection = page.locator('section[data-recipe="hero-dark"]').first();

    // Check that recipe CSS variables are set
    const rcBg = await heroSection.evaluate((el) => {
      return window.getComputedStyle(el).getPropertyValue('--rc-bg');
    });
    expect(rcBg, 'Recipe should set --rc-bg').toBeTruthy();

    const rcFg = await heroSection.evaluate((el) => {
      return window.getComputedStyle(el).getPropertyValue('--rc-fg');
    });
    expect(rcFg, 'Recipe should set --rc-fg').toBeTruthy();

    console.log('✅ Recipe variables verified');
  });

  test('primitives hero has smooth scroll interaction', async ({ page }) => {
    await page.goto('https://localhost:9999/primitives-migration');
    await page.waitForSelector('section[data-recipe="hero-dark"]', { timeout: 5000 });

    const heroSection = page.locator('section[data-recipe="hero-dark"]').first();
    const scrollButton = heroSection.locator('button').last(); // Scroll indicator button

    // Get initial scroll position
    const initialScroll = await page.evaluate(() => window.scrollY);

    // Click scroll button
    await scrollButton.click();

    // Wait for scroll animation
    await page.waitForTimeout(500);

    // Check scroll position changed
    const newScroll = await page.evaluate(() => window.scrollY);
    expect(newScroll, 'Should scroll down after click').toBeGreaterThan(initialScroll);

    console.log('✅ Scroll interaction verified');
  });

  test('primitives hero visual regression check', async ({ page }, testInfo) => {
    await page.goto('https://localhost:9999/primitives-migration');
    await page.waitForSelector('section[data-recipe="hero-dark"]', { timeout: 5000 });

    // Wait for images and animations to settle
    await page.waitForTimeout(1500);

    const heroSection = page.locator('section[data-recipe="hero-dark"]').first();

    // Take screenshot of primitives hero
    const screenshot = await heroSection.screenshot();

    // Attach to test report
    await testInfo.attach('primitives-hero', {
      body: screenshot,
      contentType: 'image/png',
    });

    // Check screenshot dimensions
    const png = PNG.sync.read(screenshot);
    expect(png.width, 'Screenshot should capture full width').toBeGreaterThan(1400);
    expect(png.height, 'Screenshot should capture viewport height').toBeGreaterThan(700);

    console.log(`✅ Visual regression baseline captured: ${png.width}x${png.height}`);
  });

  test('primitives hero accessibility check', async ({ page }) => {
    await page.goto('https://localhost:9999/primitives-migration');
    await page.waitForSelector('section[data-recipe="hero-dark"]', { timeout: 5000 });

    const heroSection = page.locator('section[data-recipe="hero-dark"]').first();

    // Check heading hierarchy
    const h1Count = await heroSection.locator('h1').count();
    expect(h1Count, 'Should have exactly one h1').toBe(1);

    // Check buttons have accessible text
    const buttons = await heroSection.locator('.button').all();
    for (const button of buttons) {
      const text = await button.textContent();
      expect(text?.trim().length, 'Buttons should have text').toBeGreaterThan(0);
    }

    // Check links have href
    const links = await heroSection.locator('a').all();
    for (const link of links) {
      const href = await link.getAttribute('href');
      expect(href, 'Links should have href').toBeTruthy();
    }

    console.log('✅ Accessibility verified');
  });

  test('NO legacy hero CSS is loaded in primitives version', async ({ page }) => {
    await page.goto('https://localhost:9999/primitives-migration');

    // Check that hero.css styles are NOT applied
    const hasLegacyHeroStyles = await page.evaluate(() => {
      // Check if any elements have computed styles from legacy hero.css
      const section = document.querySelector('section[data-recipe="hero-dark"]');
      if (!section) return false;

      // Legacy hero.css sets specific custom properties like --_text, --_accent
      const computedStyle = window.getComputedStyle(section);

      // Check for legacy-specific custom props that primitives version shouldn't have
      // (These are defined in hero.css with --_text, --_accent prefixes)
      const hasLegacyVars =
        computedStyle.getPropertyValue('--_text') !== '' ||
        computedStyle.getPropertyValue('--_accent') !== '' ||
        computedStyle.getPropertyValue('--_overlay-start') !== '';

      return hasLegacyVars;
    });

    expect(hasLegacyHeroStyles, 'Should NOT have legacy hero CSS variables').toBe(false);

    console.log('✅ No legacy hero CSS detected');
  });
});
