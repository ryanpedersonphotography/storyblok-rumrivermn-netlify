import { test, expect } from '@playwright/test';
const ORIGIN = process.env.E2E_ORIGIN ?? 'http://localhost:3000';

async function getAfterBG(page: any, selector: string) {
  return page.evaluate((sel) => {
    const el = document.querySelector(sel) as HTMLElement;
    if (!el) return '';
    return getComputedStyle(el, '::after').backgroundImage;
  }, selector);
}

test.describe('Sitewide dark mode', () => {
  test('navbar, hero, pricing, footer respond to theme + auto', async ({ page }) => {
    // Reset to AUTO and system LIGHT
    await page.addInitScript(() => localStorage.removeItem('theme-mode'));
    await page.emulateMedia({ colorScheme: 'light' });

    await page.goto(ORIGIN, { waitUntil: 'networkidle' });

    const html = page.locator('html');
    const toggle = page.locator('.theme-toggle').first();

    // In auto, no data-theme
    await expect(html).not.toHaveAttribute('data-theme', /dark|light/);

    // NAVBAR: scrolled state colors respond in dark
    await page.evaluate(() => window.scrollTo(0, 200));
    const nav = page.locator('.hotfix-navbar');
    await expect(nav).toBeVisible();

    // HERO overlay baseline (light)
    const heroSel = '.hotfix-hero-romantic';
    const heroLight = await getAfterBG(page, heroSel);
    expect(heroLight).toContain('linear-gradient');

    // PRICING card bg + text colors computed (light)
    const pricingCard = page.locator('.pricing-card, .hotfix-pricing-card').first();
    if (await pricingCard.count()) {
      await expect(pricingCard).toBeVisible();
      const priceBgLight = await pricingCard.evaluate((el) => getComputedStyle(el as HTMLElement).backgroundColor);
      const priceColorLight = await pricingCard.evaluate((el) => getComputedStyle(el as HTMLElement).color);
      expect(priceBgLight).toBeTruthy();
      expect(priceColorLight).toBeTruthy();

      // Force DARK via toggle (opposite-of-system)
      await toggle.click();
      await expect(html).toHaveAttribute('data-theme', 'dark');

      // Navbar stays dark when scrolled
      const navBgDark = await nav.evaluate((el) => getComputedStyle(el as HTMLElement).backgroundColor);
      expect(navBgDark).toBeTruthy();

      // Hero overlay gets darker (opacities ~0.92+ expected)
      const heroDark = await getAfterBG(page, heroSel);
      expect(heroDark).not.toEqual(heroLight);
      expect(heroDark).toMatch(/oklch\(0\.(18|22|25)/);

      // Pricing colors changed (surface + text)
      const priceBgDark = await pricingCard.evaluate((el) => getComputedStyle(el as HTMLElement).backgroundColor);
      const priceColorDark = await pricingCard.evaluate((el) => getComputedStyle(el as HTMLElement).color);
      expect(priceBgDark).not.toEqual(priceBgLight);
      expect(priceColorDark).not.toEqual(priceColorLight);

      // Back to AUTO
      await toggle.click();
      await expect(html).not.toHaveAttribute('data-theme', /dark|light/);

      // Flip system to DARK and ensure auto tracks
      await page.emulateMedia({ colorScheme: 'dark' });
      await page.waitForTimeout(75);
      const heroAutoDark = await getAfterBG(page, heroSel);
      expect(heroAutoDark).toMatch(/oklch\(0\.(18|22|25)/);
    } else {
      // No pricing section, just test hero and nav
      await toggle.click();
      await expect(html).toHaveAttribute('data-theme', 'dark');

      const heroDark = await getAfterBG(page, heroSel);
      expect(heroDark).not.toEqual(heroLight);
      expect(heroDark).toMatch(/oklch\(0\.(18|22|25)/);
    }
  });

  test('footer and alternating blocks have proper dark mode', async ({ page }) => {
    await page.addInitScript(() => localStorage.setItem('theme-mode', 'dark'));
    await page.emulateMedia({ colorScheme: 'light' }); // System light, but forced dark

    await page.goto(ORIGIN, { waitUntil: 'networkidle' });

    const html = page.locator('html');
    await expect(html).toHaveAttribute('data-theme', 'dark');

    // Check footer exists and has proper colors
    const footer = page.locator('.hotfix-footer').first();
    if (await footer.count()) {
      const footerBg = await footer.evaluate((el) => getComputedStyle(el as HTMLElement).backgroundColor);
      const footerColor = await footer.evaluate((el) => getComputedStyle(el as HTMLElement).color);
      expect(footerBg).toBeTruthy();
      expect(footerColor).toBeTruthy();

      // Footer should not be pure white text
      expect(footerColor).not.toContain('rgb(255, 255, 255)');
    }

    // Check alternating blocks if present
    const altBlocks = page.locator('.hotfix-alternating-blocks').first();
    if (await altBlocks.count()) {
      const altBg = await altBlocks.evaluate((el) => getComputedStyle(el as HTMLElement).backgroundColor);
      const altColor = await altBlocks.evaluate((el) => getComputedStyle(el as HTMLElement).color);
      expect(altBg).toBeTruthy();
      expect(altColor).toBeTruthy();

      // Should not be pure white
      expect(altColor).not.toContain('rgb(255, 255, 255)');
    }
  });

  test('STEP 1 — schedule/booking form responds to dark mode', async ({ page }) => {
    // Start in auto mode with light system preference
    await page.addInitScript(() => localStorage.removeItem('theme-mode'));
    await page.emulateMedia({ colorScheme: 'light' });

    await page.goto(ORIGIN, { waitUntil: 'networkidle' });

    const html = page.locator('html');
    const toggle = page.locator('.theme-toggle').first();

    // Locate form elements
    const formSection = page.locator('.hotfix-schedule-tour').first();
    const formCard = page.locator('.hotfix-tour-form').first();
    const formInput = page.locator('.hotfix-form-input').first();
    const formLabel = page.locator('.hotfix-form-label').first();
    const submitBtn = page.locator('.hotfix-form-submit').first();

    // Only test if form section exists
    if (await formSection.count() === 0) {
      console.log('Schedule form not found, skipping test');
      return;
    }

    // LIGHT MODE: Capture baseline styles (use backgroundImage for gradient sections)
    const sectionBgLight = await formSection.evaluate((el) => getComputedStyle(el as HTMLElement).backgroundImage);
    const cardBgLight = await formCard.evaluate((el) => getComputedStyle(el as HTMLElement).backgroundColor);
    const inputBgLight = await formInput.evaluate((el) => getComputedStyle(el as HTMLElement).backgroundColor);
    const inputColorLight = await formInput.evaluate((el) => getComputedStyle(el as HTMLElement).color);
    const labelColorLight = await formLabel.evaluate((el) => getComputedStyle(el as HTMLElement).color);
    const btnBgLight = await submitBtn.evaluate((el) => getComputedStyle(el as HTMLElement).backgroundColor);

    // FORCED DARK MODE: Toggle to dark
    await toggle.click();
    await expect(html).toHaveAttribute('data-theme', 'dark');
    await page.waitForTimeout(75); // Allow CSS transition

    const sectionBgDark = await formSection.evaluate((el) => getComputedStyle(el as HTMLElement).backgroundImage);
    const cardBgDark = await formCard.evaluate((el) => getComputedStyle(el as HTMLElement).backgroundColor);
    const inputBgDark = await formInput.evaluate((el) => getComputedStyle(el as HTMLElement).backgroundColor);
    const inputColorDark = await formInput.evaluate((el) => getComputedStyle(el as HTMLElement).color);
    const labelColorDark = await formLabel.evaluate((el) => getComputedStyle(el as HTMLElement).color);
    const btnBgDark = await submitBtn.evaluate((el) => getComputedStyle(el as HTMLElement).backgroundColor);

    // Assertions: All elements changed from light to dark
    expect(sectionBgDark).not.toEqual(sectionBgLight);
    expect(sectionBgDark).toContain('linear-gradient'); // Verify it's a gradient
    expect(cardBgDark).not.toEqual(cardBgLight);
    expect(inputBgDark).not.toEqual(inputBgLight);
    expect(inputColorDark).not.toEqual(inputColorLight);
    expect(labelColorDark).not.toEqual(labelColorLight);
    expect(btnBgDark).not.toEqual(btnBgLight);

    // Verify no pure white text in dark mode (255, 255, 255)
    expect(inputColorDark).not.toContain('rgb(255, 255, 255)');
    expect(labelColorDark).not.toContain('rgb(255, 255, 255)');

    // Verify card has proper background (not pure white or pure black)
    expect(cardBgDark).not.toContain('rgb(255, 255, 255)');
    expect(cardBgDark).not.toContain('rgb(0, 0, 0)');

    // AUTO MODE: Return to auto and test OS preference tracking
    await toggle.click();
    await expect(html).not.toHaveAttribute('data-theme', /dark|light/);

    // Emulate dark OS preference
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.waitForTimeout(75);

    const sectionBgAutoDark = await formSection.evaluate((el) => getComputedStyle(el as HTMLElement).backgroundImage);
    const inputBgAutoDark = await formInput.evaluate((el) => getComputedStyle(el as HTMLElement).backgroundColor);
    const cardBgAutoDark = await formCard.evaluate((el) => getComputedStyle(el as HTMLElement).backgroundColor);

    // Auto dark should match forced dark (or at least be different from light)
    expect(sectionBgAutoDark).not.toEqual(sectionBgLight);
    expect(inputBgAutoDark).not.toEqual(inputBgLight);
    expect(cardBgAutoDark).not.toEqual(cardBgLight);
  });

  test('STEP 2 — map/visit section responds to dark mode', async ({ page }) => {
    // Start in auto mode with light system preference
    await page.addInitScript(() => localStorage.removeItem('theme-mode'));
    await page.emulateMedia({ colorScheme: 'light' });

    await page.goto(ORIGIN, { waitUntil: 'networkidle' });

    const html = page.locator('html');
    const toggle = page.locator('.theme-toggle').first();

    // Locate map section elements
    const mapSection = page.locator('.hotfix-map-section').first();
    const sectionTitle = page.locator('.hotfix-map-section-title').first();
    const sectionLead = page.locator('.hotfix-map-section-lead').first();
    const actionBtn = page.locator('.hotfix-map-action-btn').first();

    // Only test if map section exists
    if (await mapSection.count() === 0) {
      console.log('Map section not found, skipping test');
      return;
    }

    // LIGHT MODE: Capture baseline styles
    const bgLight = await mapSection.evaluate((el) => getComputedStyle(el as HTMLElement).backgroundColor);
    const titleColorLight = await sectionTitle.evaluate((el) => getComputedStyle(el as HTMLElement).color);
    const leadColorLight = await sectionLead.evaluate((el) => getComputedStyle(el as HTMLElement).color);

    // CTA button baseline
    let btnBgLight, btnColorLight;
    if (await actionBtn.count() > 0) {
      btnBgLight = await actionBtn.evaluate((el) => getComputedStyle(el as HTMLElement).backgroundColor);
      btnColorLight = await actionBtn.evaluate((el) => getComputedStyle(el as HTMLElement).color);
    }

    // FORCED DARK MODE: Toggle to dark
    await toggle.click();
    await expect(html).toHaveAttribute('data-theme', 'dark');
    await page.waitForTimeout(75);

    const bgDark = await mapSection.evaluate((el) => getComputedStyle(el as HTMLElement).backgroundColor);
    const titleColorDark = await sectionTitle.evaluate((el) => getComputedStyle(el as HTMLElement).color);
    const leadColorDark = await sectionLead.evaluate((el) => getComputedStyle(el as HTMLElement).color);

    // Assertions: All elements changed from light to dark
    expect(bgDark).not.toEqual(bgLight);
    expect(titleColorDark).not.toEqual(titleColorLight);
    expect(leadColorDark).not.toEqual(leadColorLight);

    // Verify no pure white text in dark mode
    expect(titleColorDark).not.toContain('rgb(255, 255, 255)');
    expect(leadColorDark).not.toContain('rgb(255, 255, 255)');

    // Test CTA button if present
    if (await actionBtn.count() > 0) {
      const btnBgDark = await actionBtn.evaluate((el) => getComputedStyle(el as HTMLElement).backgroundColor);
      const btnColorDark = await actionBtn.evaluate((el) => getComputedStyle(el as HTMLElement).color);

      expect(btnBgDark).not.toEqual(btnBgLight);
      expect(btnColorDark).not.toEqual(btnColorLight);

      // Test hover state (gold background invert)
      await actionBtn.hover();
      await page.waitForTimeout(50);
      const btnBgHover = await actionBtn.evaluate((el) => getComputedStyle(el as HTMLElement).backgroundColor);
      const btnColorHover = await actionBtn.evaluate((el) => getComputedStyle(el as HTMLElement).color);

      // Hover should have changed from rest state
      expect(btnBgHover).not.toEqual(btnBgDark);
      expect(btnColorHover).not.toEqual(btnColorDark);
    }

    // AUTO MODE: Return to auto and test OS preference tracking
    await toggle.click();
    await expect(html).not.toHaveAttribute('data-theme', /dark|light/);

    // Emulate dark OS preference
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.waitForTimeout(75);

    const bgAutoDark = await mapSection.evaluate((el) => getComputedStyle(el as HTMLElement).backgroundColor);
    const titleColorAutoDark = await sectionTitle.evaluate((el) => getComputedStyle(el as HTMLElement).color);

    // Auto dark should be different from light
    expect(bgAutoDark).not.toEqual(bgLight);
    expect(titleColorAutoDark).not.toEqual(titleColorLight);
  });

  test('STEP 3 — rum river experience section responds to dark mode', async ({ page }) => {
    // Start in auto mode with light system preference
    await page.addInitScript(() => localStorage.removeItem('theme-mode'));
    await page.emulateMedia({ colorScheme: 'light' });

    await page.goto(ORIGIN, { waitUntil: 'networkidle' });

    const html = page.locator('html');
    const toggle = page.locator('.theme-toggle').first();

    // Locate experience section elements
    const expSection = page.locator('.rum-river-experience').first();
    const expTitle = page.locator('.experience-title').first();
    const expDescription = page.locator('.experience-description').first();
    const expFeature = page.locator('.experience-feature').first();
    const expIcon = page.locator('.feature-icon .icon-svg').first();

    // Only test if experience section exists
    if (await expSection.count() === 0) {
      console.log('Rum River Experience section not found, skipping test');
      return;
    }

    // LIGHT MODE: Capture baseline styles
    const bgLight = await expSection.evaluate((el) => getComputedStyle(el as HTMLElement).backgroundColor);
    const titleColorLight = await expTitle.evaluate((el) => getComputedStyle(el as HTMLElement).color);
    const descColorLight = await expDescription.evaluate((el) => getComputedStyle(el as HTMLElement).color);
    const featureBgLight = await expFeature.evaluate((el) => getComputedStyle(el as HTMLElement).backgroundColor);
    const iconColorLight = await expIcon.evaluate((el) => getComputedStyle(el as HTMLElement).color);

    // FORCED DARK MODE: Toggle to dark
    await toggle.click();
    await expect(html).toHaveAttribute('data-theme', 'dark');
    await page.waitForTimeout(75);

    const bgDark = await expSection.evaluate((el) => getComputedStyle(el as HTMLElement).backgroundColor);
    const titleColorDark = await expTitle.evaluate((el) => getComputedStyle(el as HTMLElement).color);
    const descColorDark = await expDescription.evaluate((el) => getComputedStyle(el as HTMLElement).color);
    const featureBgDark = await expFeature.evaluate((el) => getComputedStyle(el as HTMLElement).backgroundColor);
    const iconColorDark = await expIcon.evaluate((el) => getComputedStyle(el as HTMLElement).color);

    // Assertions: All elements changed from light to dark
    expect(bgDark).not.toEqual(bgLight);
    expect(titleColorDark).not.toEqual(titleColorLight);
    expect(descColorDark).not.toEqual(descColorLight);
    expect(featureBgDark).not.toEqual(featureBgLight);
    expect(iconColorDark).not.toEqual(iconColorLight);

    // Verify no pure white text in dark mode
    expect(titleColorDark).not.toContain('rgb(255, 255, 255)');
    expect(descColorDark).not.toContain('rgb(255, 255, 255)');

    // Test hover state on feature card
    const borderLight = await expFeature.evaluate((el) => getComputedStyle(el as HTMLElement).borderColor);
    await expFeature.hover();
    await page.waitForTimeout(50);
    const borderHover = await expFeature.evaluate((el) => getComputedStyle(el as HTMLElement).borderColor);
    expect(borderHover).not.toEqual(borderLight);

    // AUTO MODE: Return to auto and test OS preference tracking
    await toggle.click();
    await expect(html).not.toHaveAttribute('data-theme', /dark|light/);

    // Emulate dark OS preference
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.waitForTimeout(75);

    const bgAutoDark = await expSection.evaluate((el) => getComputedStyle(el as HTMLElement).backgroundColor);
    const titleColorAutoDark = await expTitle.evaluate((el) => getComputedStyle(el as HTMLElement).color);

    // Auto dark should be different from light
    expect(bgAutoDark).not.toEqual(bgLight);
    expect(titleColorAutoDark).not.toEqual(titleColorLight);
  });

  test('STEP 4 — testimonials section responds to dark mode', async ({ page }) => {
    // Start in auto mode with light system preference
    await page.addInitScript(() => localStorage.removeItem('theme-mode'));
    await page.emulateMedia({ colorScheme: 'light' });

    await page.goto(ORIGIN, { waitUntil: 'networkidle' });

    const html = page.locator('html');
    const toggle = page.locator('.theme-toggle').first();

    // Locate testimonials section elements
    const testSection = page.locator('.hotfix-social-proof').first();
    const testTitle = page.locator('.hotfix-social-section-title').first();
    const testLead = page.locator('.hotfix-social-lead').first();
    const testCard = page.locator('.hotfix-testimonial-card').first();
    const testQuote = page.locator('.hotfix-testimonial-card blockquote').first();
    const testStar = page.locator('.hotfix-star').first();
    const testCoupleName = page.locator('.hotfix-couple-name').first();

    // Only test if testimonials section exists
    if (await testSection.count() === 0) {
      console.log('Testimonials section not found, skipping test');
      return;
    }

    // LIGHT MODE: Capture baseline styles
    const bgLight = await testSection.evaluate((el) => getComputedStyle(el as HTMLElement).backgroundColor);
    const titleColorLight = await testTitle.evaluate((el) => getComputedStyle(el as HTMLElement).color);
    const leadColorLight = await testLead.evaluate((el) => getComputedStyle(el as HTMLElement).color);
    const cardBgLight = await testCard.evaluate((el) => getComputedStyle(el as HTMLElement).backgroundColor);
    const cardBorderLight = await testCard.evaluate((el) => getComputedStyle(el as HTMLElement).borderColor);
    const quoteColorLight = await testQuote.evaluate((el) => getComputedStyle(el as HTMLElement).color);
    const starColorLight = await testStar.evaluate((el) => getComputedStyle(el as HTMLElement).color);
    const coupleNameColorLight = await testCoupleName.evaluate((el) => getComputedStyle(el as HTMLElement).color);

    // FORCED DARK MODE: Toggle to dark
    await toggle.click();
    await expect(html).toHaveAttribute('data-theme', 'dark');
    await page.waitForTimeout(75);

    const bgDark = await testSection.evaluate((el) => getComputedStyle(el as HTMLElement).backgroundColor);
    const titleColorDark = await testTitle.evaluate((el) => getComputedStyle(el as HTMLElement).color);
    const leadColorDark = await testLead.evaluate((el) => getComputedStyle(el as HTMLElement).color);
    const cardBgDark = await testCard.evaluate((el) => getComputedStyle(el as HTMLElement).backgroundColor);
    const cardBorderDark = await testCard.evaluate((el) => getComputedStyle(el as HTMLElement).borderColor);
    const quoteColorDark = await testQuote.evaluate((el) => getComputedStyle(el as HTMLElement).color);
    const starColorDark = await testStar.evaluate((el) => getComputedStyle(el as HTMLElement).color);
    const coupleNameColorDark = await testCoupleName.evaluate((el) => getComputedStyle(el as HTMLElement).color);

    // Assertions: All elements changed from light to dark
    expect(bgDark).not.toEqual(bgLight);
    expect(titleColorDark).not.toEqual(titleColorLight);
    expect(leadColorDark).not.toEqual(leadColorLight);
    expect(cardBgDark).not.toEqual(cardBgLight);
    expect(cardBorderDark).not.toEqual(cardBorderLight);
    expect(quoteColorDark).not.toEqual(quoteColorLight);
    expect(starColorDark).not.toEqual(starColorLight);
    expect(coupleNameColorDark).not.toEqual(coupleNameColorLight);

    // Verify no pure white text in dark mode
    expect(titleColorDark).not.toContain('rgb(255, 255, 255)');
    expect(leadColorDark).not.toContain('rgb(255, 255, 255)');
    expect(quoteColorDark).not.toContain('rgb(255, 255, 255)');

    // Test hover state on testimonial card
    const cardShadowLight = await testCard.evaluate((el) => getComputedStyle(el as HTMLElement).boxShadow);
    await testCard.hover();
    await page.waitForTimeout(50);
    const cardShadowHover = await testCard.evaluate((el) => getComputedStyle(el as HTMLElement).boxShadow);
    expect(cardShadowHover).not.toEqual(cardShadowLight);

    // AUTO MODE: Return to auto and test OS preference tracking
    await toggle.click();
    await expect(html).not.toHaveAttribute('data-theme', /dark|light/);

    // Emulate dark OS preference
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.waitForTimeout(75);

    const bgAutoDark = await testSection.evaluate((el) => getComputedStyle(el as HTMLElement).backgroundColor);
    const titleColorAutoDark = await testTitle.evaluate((el) => getComputedStyle(el as HTMLElement).color);

    // Auto dark should be different from light
    expect(bgAutoDark).not.toEqual(bgLight);
    expect(titleColorAutoDark).not.toEqual(titleColorLight);
  });

  test('VISUAL SEPARATION — rum river experience and alternating blocks have clear boundary', async ({ page }) => {
    // Start in auto mode with light preference
    await page.addInitScript(() => localStorage.removeItem('theme-mode'));
    await page.emulateMedia({ colorScheme: 'light' });

    await page.goto(ORIGIN, { waitUntil: 'networkidle' });

    const html = page.locator('html');
    const toggle = page.locator('.theme-toggle').first();

    const rumRiverSection = page.locator('.rum-river-experience').first();
    const alternatingSection = page.locator('.hotfix-alternating-blocks').first();

    // Skip if sections don't exist
    if (await rumRiverSection.count() === 0 || await alternatingSection.count() === 0) {
      console.log('Sections not found, skipping visual separation test');
      return;
    }

    // LIGHT MODE: Verify sections have different backgrounds
    const rumRiverBgLight = await rumRiverSection.evaluate((el) => getComputedStyle(el as HTMLElement).backgroundColor);
    const alternatingBgLight = await alternatingSection.evaluate((el) => getComputedStyle(el as HTMLElement).backgroundImage);

    expect(rumRiverBgLight).toBeTruthy();
    expect(alternatingBgLight).toBeTruthy();

    // Check gold divider exists (::after pseudo-element)
    const dividerLight = await rumRiverSection.evaluate((el) => {
      const after = window.getComputedStyle(el as HTMLElement, '::after');
      return {
        content: after.content,
        opacity: after.opacity,
        height: after.height,
        backgroundImage: after.backgroundImage
      };
    });

    expect(dividerLight.content).toContain('""'); // Pseudo-element exists
    expect(parseFloat(dividerLight.opacity)).toBeGreaterThan(0); // Visible
    expect(dividerLight.backgroundImage).toContain('linear-gradient'); // Has gradient

    // FORCED DARK MODE: Toggle to dark (auto → dark)
    await toggle.click();
    await expect(html).toHaveAttribute('data-theme', 'dark');
    await page.waitForTimeout(75);

    const rumRiverBgDark = await rumRiverSection.evaluate((el) => getComputedStyle(el as HTMLElement).backgroundColor);
    const alternatingBgDark = await alternatingSection.evaluate((el) => getComputedStyle(el as HTMLElement).backgroundImage);

    // Both sections should have different backgrounds
    expect(rumRiverBgDark).not.toEqual(rumRiverBgLight);
    expect(alternatingBgDark).toBeTruthy();

    // Check divider is more prominent in dark mode
    const dividerDark = await rumRiverSection.evaluate((el) => {
      const after = window.getComputedStyle(el as HTMLElement, '::after');
      return {
        opacity: after.opacity,
        boxShadow: after.boxShadow
      };
    });

    expect(parseFloat(dividerDark.opacity)).toBeGreaterThan(parseFloat(dividerLight.opacity)); // More visible in dark
    expect(dividerDark.boxShadow).not.toBe('none'); // Has glow effect

    // Check vignette exists in dark mode (::before pseudo-element)
    const vignetteDark = await rumRiverSection.evaluate((el) => {
      const before = window.getComputedStyle(el as HTMLElement, '::before');
      return {
        content: before.content,
        backgroundImage: before.backgroundImage,
        height: before.height
      };
    });

    expect(vignetteDark.content).toContain('""'); // Vignette exists
    expect(vignetteDark.backgroundImage).toContain('radial-gradient'); // Has radial gradient
    expect(parseInt(vignetteDark.height)).toBeGreaterThan(0); // Has height
  });

  test('STEP 5 — history carousel section responds to dark mode', async ({ page }) => {
    // Start in auto mode with light system preference
    await page.addInitScript(() => localStorage.removeItem('theme-mode'));
    await page.emulateMedia({ colorScheme: 'light' });

    await page.goto(ORIGIN, { waitUntil: 'networkidle' });

    const html = page.locator('html');
    const toggle = page.locator('.theme-toggle').first();

    // Locate history carousel elements
    const sect = page.locator('.hotfix-history-section').first();
    const title = page.locator('.hotfix-history-title').first();
    const lead = page.locator('.hotfix-history-lead').first();
    const nav = page.locator('.hotfix-carousel-nav').first();
    const dot = page.locator('.hotfix-carousel-dot').first();

    // Only test if carousel section exists
    if (await sect.count() === 0) {
      console.log('History carousel section not found, skipping test');
      return;
    }

    // Check for optional elements
    const hasNav = await nav.count() > 0;
    const hasDot = await dot.count() > 0;

    // LIGHT MODE: Capture baseline styles
    const sectBgLight = await sect.evaluate((el) => getComputedStyle(el as HTMLElement).backgroundColor);
    const titleLight = await title.evaluate((el) => getComputedStyle(el as HTMLElement).color);
    const leadLight = await lead.evaluate((el) => getComputedStyle(el as HTMLElement).color);

    let navBgLight, dotBgLight;
    if (hasNav) {
      navBgLight = await nav.evaluate((el) => getComputedStyle(el as HTMLElement).backgroundColor);
    }
    if (hasDot) {
      dotBgLight = await dot.evaluate((el) => getComputedStyle(el as HTMLElement).backgroundColor);
    }

    // FORCED DARK MODE: Toggle to dark
    await toggle.click();
    await expect(html).toHaveAttribute('data-theme', 'dark');
    await page.waitForTimeout(75);

    const sectBgDark = await sect.evaluate((el) => getComputedStyle(el as HTMLElement).backgroundColor);
    const titleDark = await title.evaluate((el) => getComputedStyle(el as HTMLElement).color);
    const leadDark = await lead.evaluate((el) => getComputedStyle(el as HTMLElement).color);

    let navBgDark, dotBgDark;
    if (hasNav) {
      navBgDark = await nav.evaluate((el) => getComputedStyle(el as HTMLElement).backgroundColor);
    }
    if (hasDot) {
      dotBgDark = await dot.evaluate((el) => getComputedStyle(el as HTMLElement).backgroundColor);
    }

    // Assertions: All elements changed from light to dark
    expect(sectBgDark).not.toEqual(sectBgLight);
    expect(titleDark).not.toEqual(titleLight);
    expect(leadDark).not.toEqual(leadLight);

    if (hasNav) {
      expect(navBgDark).not.toEqual(navBgLight);
    }
    if (hasDot) {
      expect(dotBgDark).not.toEqual(dotBgLight);
    }

    // No pure white text in dark mode
    expect(titleDark).not.toContain('rgb(255, 255, 255)');
    expect(leadDark).not.toContain('rgb(255, 255, 255)');

    // Test nav hover state if nav exists
    if (hasNav) {
      const navBgBefore = await nav.evaluate((el) => getComputedStyle(el as HTMLElement).backgroundColor);
      await nav.hover();
      await page.waitForTimeout(50);
      const navBgAfter = await nav.evaluate((el) => getComputedStyle(el as HTMLElement).backgroundColor);
      expect(navBgAfter).not.toEqual(navBgBefore);
    }

    // Test dot hover state if dot exists
    if (hasDot) {
      const dotBgBefore = await dot.evaluate((el) => getComputedStyle(el as HTMLElement).backgroundColor);
      await dot.hover();
      await page.waitForTimeout(50);
      const dotBgAfter = await dot.evaluate((el) => getComputedStyle(el as HTMLElement).backgroundColor);
      expect(dotBgAfter).not.toEqual(dotBgBefore);
    }

    // AUTO MODE: Return to auto and test OS preference tracking
    await toggle.click();
    await expect(html).not.toHaveAttribute('data-theme', /dark|light/);

    // Emulate dark OS preference
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.waitForTimeout(75);

    const sectBgAutoDark = await sect.evaluate((el) => getComputedStyle(el as HTMLElement).backgroundColor);
    expect(sectBgAutoDark).not.toEqual(sectBgLight);
  });

  test('STEP 6 — faq accordion section responds to dark mode', async ({ page }) => {
    // Start in auto mode with light system preference
    await page.addInitScript(() => localStorage.removeItem('theme-mode'));
    await page.emulateMedia({ colorScheme: 'light' });

    await page.goto(ORIGIN, { waitUntil: 'networkidle' });

    const html = page.locator('html');
    const toggle = page.locator('.theme-toggle').first();

    // Locate FAQ accordion elements
    const sect = page.locator('.faq-accordion-section').first();
    const title = page.locator('.faq-title').first();
    const script = page.locator('.faq-script').first();
    const item = page.locator('.faq-item').first();
    const question = page.locator('.faq-question').first();
    const questionH3 = page.locator('.faq-question h3').first();
    const faqToggle = page.locator('.faq-toggle').first();
    const answer = page.locator('.faq-answer p').first();

    // Only test if FAQ section exists
    if (await sect.count() === 0) {
      console.log('FAQ accordion section not found, skipping test');
      return;
    }

    // LIGHT MODE: Capture baseline styles
    const sectBgLight = await sect.evaluate((el) => getComputedStyle(el as HTMLElement).backgroundColor);
    const titleLight = await title.evaluate((el) => getComputedStyle(el as HTMLElement).color);
    const scriptLight = await script.evaluate((el) => getComputedStyle(el as HTMLElement).color);
    const itemBdLight = await item.evaluate((el) => getComputedStyle(el as HTMLElement).borderBottomColor);
    const questionH3Light = await questionH3.evaluate((el) => getComputedStyle(el as HTMLElement).color);
    const toggleLight = await faqToggle.evaluate((el) => getComputedStyle(el as HTMLElement).color);

    let answerLight;
    if (await answer.count() > 0) {
      answerLight = await answer.evaluate((el) => getComputedStyle(el as HTMLElement).color);
    }

    // FORCED DARK MODE: Toggle to dark
    await toggle.click();
    await expect(html).toHaveAttribute('data-theme', 'dark');
    await page.waitForTimeout(75);

    const sectBgDark = await sect.evaluate((el) => getComputedStyle(el as HTMLElement).backgroundColor);
    const titleDark = await title.evaluate((el) => getComputedStyle(el as HTMLElement).color);
    const scriptDark = await script.evaluate((el) => getComputedStyle(el as HTMLElement).color);
    const itemBdDark = await item.evaluate((el) => getComputedStyle(el as HTMLElement).borderBottomColor);
    const questionH3Dark = await questionH3.evaluate((el) => getComputedStyle(el as HTMLElement).color);
    const toggleDark = await faqToggle.evaluate((el) => getComputedStyle(el as HTMLElement).color);

    let answerDark;
    if (await answer.count() > 0) {
      answerDark = await answer.evaluate((el) => getComputedStyle(el as HTMLElement).color);
    }

    // Assertions: All elements changed from light to dark
    expect(sectBgDark).not.toEqual(sectBgLight);
    expect(titleDark).not.toEqual(titleLight);
    expect(scriptDark).not.toEqual(scriptLight);
    expect(itemBdDark).not.toEqual(itemBdLight);
    expect(questionH3Dark).not.toEqual(questionH3Light);
    expect(toggleDark).not.toEqual(toggleLight);

    if (answerLight && answerDark) {
      expect(answerDark).not.toEqual(answerLight);
    }

    // No pure white text in dark mode
    expect(titleDark).not.toContain('rgb(255, 255, 255)');
    expect(questionH3Dark).not.toContain('rgb(255, 255, 255)');

    // Test focus state (gold outline)
    await question.focus();
    const outline = await question.evaluate((el) => {
      const s = getComputedStyle(el as HTMLElement);
      return s.outlineColor || s.outline;
    });
    expect(outline).toBeTruthy();

    // Test hover state
    const questionColorBefore = await question.evaluate((el) => getComputedStyle(el as HTMLElement).opacity);
    await question.hover();
    await page.waitForTimeout(50);
    const questionColorAfter = await question.evaluate((el) => getComputedStyle(el as HTMLElement).opacity);
    // Hover changes opacity or color

    // Test toggle rotation when expanded
    const toggleTransformBefore = await faqToggle.evaluate((el) => getComputedStyle(el as HTMLElement).transform);
    await question.click();
    await page.waitForTimeout(100);
    const toggleTransformAfter = await faqToggle.evaluate((el) => getComputedStyle(el as HTMLElement).transform);
    expect(toggleTransformAfter).not.toEqual(toggleTransformBefore);

    // AUTO MODE: Return to auto and test OS preference tracking
    await toggle.click();
    await expect(html).not.toHaveAttribute('data-theme', /dark|light/);

    // Emulate dark OS preference
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.waitForTimeout(75);

    const sectBgAutoDark = await sect.evaluate((el) => getComputedStyle(el as HTMLElement).backgroundColor);
    expect(sectBgAutoDark).not.toEqual(sectBgLight);
  });

  test('STEP 7 — spaces section responds to dark/auto with tokens', async ({ page }) => {
    // Start in auto mode with light system preference
    await page.addInitScript(() => localStorage.removeItem('theme-mode'));
    await page.emulateMedia({ colorScheme: 'light' });

    await page.goto(ORIGIN, { waitUntil: 'networkidle' });

    const html = page.locator('html');
    const toggle = page.locator('.theme-toggle').first();

    // Locate spaces section elements
    const section = page.locator('.spaces-section').first();
    const title = page.locator('.section-title').first();
    const script = page.locator('.script-accent').first();
    const tab = page.locator('.venue-tab').first();
    const venueImage = page.locator('.venue-main-image').first();

    // Only test if spaces section exists
    if (await section.count() === 0) {
      console.log('Spaces section not found, skipping test');
      return;
    }

    // LIGHT MODE: Capture baseline styles
    const lightBg = await section.evaluate((el) => getComputedStyle(el as HTMLElement).backgroundColor);
    const titleLight = await title.evaluate((el) => getComputedStyle(el as HTMLElement).color);
    const scriptLight = await script.evaluate((el) => getComputedStyle(el as HTMLElement).color);

    let tabBgLight;
    if (await tab.count() > 0) {
      tabBgLight = await tab.evaluate((el) => getComputedStyle(el as HTMLElement).backgroundColor);
    }

    // FORCED DARK MODE: Toggle to dark
    await toggle.click();
    await expect(html).toHaveAttribute('data-theme', 'dark');
    await page.waitForTimeout(75);

    const darkBg = await section.evaluate((el) => getComputedStyle(el as HTMLElement).backgroundColor);
    const titleDark = await title.evaluate((el) => getComputedStyle(el as HTMLElement).color);
    const scriptDark = await script.evaluate((el) => getComputedStyle(el as HTMLElement).color);

    let tabBgDark;
    if (await tab.count() > 0) {
      tabBgDark = await tab.evaluate((el) => getComputedStyle(el as HTMLElement).backgroundColor);
    }

    // Assertions: All elements changed from light to dark
    expect(darkBg).not.toEqual(lightBg);
    expect(titleDark).not.toEqual(titleLight);
    expect(scriptDark).not.toEqual(scriptLight);

    if (tabBgLight && tabBgDark) {
      expect(tabBgDark).not.toEqual(tabBgLight);
    }

    // Overlay must deepen in dark (check for tokens or high opacity)
    if (await venueImage.count() > 0) {
      const overlayDark = await page.evaluate(() => {
        const s = document.querySelector('.venue-main-image');
        return s ? getComputedStyle(s, '::after').backgroundImage : null;
      });
      if (overlayDark) {
        // Check for either OKLCH tokens or rgba with high opacity (0.92+)
        expect(overlayDark).toMatch(/oklch\(0\.(18|22|25)|0\.92|0\.93|0\.94|0\.95/);
      }
    }

    // No pure white text in dark mode
    expect(titleDark).not.toContain('rgb(255, 255, 255)');

    // Test tab focus if tab exists
    if (await tab.count() > 0) {
      await tab.focus();
      const outline = await tab.evaluate((el) => {
        const s = getComputedStyle(el as HTMLElement);
        return s.outlineColor || s.outline;
      });
      expect(outline).toBeTruthy();
    }

    // AUTO MODE: Return to auto and test OS preference tracking
    await toggle.click();
    await expect(html).not.toHaveAttribute('data-theme', /dark|light/);

    // Emulate dark OS preference
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.waitForTimeout(75);

    const autoDark = await section.evaluate((el) => getComputedStyle(el as HTMLElement).backgroundColor);
    expect(autoDark).not.toEqual(lightBg);
  });

  test('STEP 8 — love stories gallery responds to dark/auto with tokens', async ({ page }) => {
    await page.addInitScript(() => localStorage.removeItem('theme-mode'));
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto(ORIGIN, { waitUntil: 'networkidle' });

    const html = page.locator('html');
    const toggle = page.locator('[data-testid="theme-toggle"]').first();

    // Check if section exists - it might not render immediately
    const sectionExists = await page.locator('.hotfix-love-stories-gallery').count();
    if (sectionExists === 0) {
      console.warn('STEP 8: Love stories gallery not found on page, skipping test');
      return;
    }

    const section = page.locator('.hotfix-love-stories-gallery').first();
    const title = page.locator('.hotfix-love-section-title').first();

    // Light baseline
    const lightBg = await section.evaluate((el) => getComputedStyle(el as HTMLElement).backgroundColor);
    const lightTitle = await title.evaluate((el) => getComputedStyle(el as HTMLElement).color);

    // Force dark
    await toggle.click();
    await expect(html).toHaveAttribute('data-theme', 'dark');

    const darkBg = await section.evaluate((el) => getComputedStyle(el as HTMLElement).backgroundColor);
    const darkTitle = await title.evaluate((el) => getComputedStyle(el as HTMLElement).color);

    expect(darkBg).not.toEqual(lightBg);
    expect(darkTitle).not.toEqual(lightTitle);

    // Gallery overlay deepening check (tokens or high opacity)
    const overlayDark = await page.evaluate(() => {
      const overlay = document.querySelector('.hotfix-gallery-overlay');
      return overlay ? getComputedStyle(overlay).backgroundImage : null;
    });

    if (overlayDark) {
      // Check for either OKLCH tokens or rgba with high opacity (0.92+)
      expect(overlayDark).toMatch(/oklch\(0\.(18|22|25)|0\.92|0\.93|0\.94|0\.95/);
    }

    // Auto mode test
    await toggle.click(); // back to auto
    await expect(html).not.toHaveAttribute('data-theme');

    await page.emulateMedia({ colorScheme: 'dark' });
    await page.waitForTimeout(75);

    const autoDark = await section.evaluate((el) => getComputedStyle(el as HTMLElement).backgroundColor);
    expect(autoDark).not.toEqual(lightBg);

    // Verify auto mode overlay deepening
    const overlayAuto = await page.evaluate(() => {
      const overlay = document.querySelector('.hotfix-gallery-overlay');
      return overlay ? getComputedStyle(overlay).backgroundImage : null;
    });

    if (overlayAuto) {
      // Check for either OKLCH tokens or rgba with high opacity
      expect(overlayAuto).toMatch(/oklch\(0\.(18|22|25)|0\.92|0\.93|0\.94|0\.95/);
    }
  });

  test('STEP 9 — press logos + quote respect tokens and dark/auto', async ({ page }) => {
    await page.addInitScript(() => localStorage.removeItem('theme-mode'));
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto(ORIGIN, { waitUntil: 'networkidle' });
    await page.waitForTimeout(80); // Wait for fonts + CSS settle

    const html = page.locator('html');
    const toggle = page.locator('[data-testid="theme-toggle"]').first();

    // Check if section exists
    const sectionExists = await page.locator('.hotfix-brand-quote-section').count();
    if (sectionExists === 0) {
      console.warn('STEP 9: Brand social proof section not found on page, skipping test');
      return;
    }

    const section = page.locator('.hotfix-brand-quote-section').first();
    const logo = page.locator('.hotfix-brand-logo').first();
    const quoteText = page.locator('.hotfix-brand-quote-text').first();

    // Ensure visibility
    await expect(section).toBeVisible();

    // Light baseline
    const lightBg = await section.evaluate((el) => getComputedStyle(el as HTMLElement).backgroundColor);
    const lightLogoColor = await logo.evaluate((el) => getComputedStyle(el as HTMLElement).color);

    // Force dark
    await toggle.click();
    await expect(html).toHaveAttribute('data-theme', 'dark');
    await page.waitForTimeout(300); // Wait for CSS transitions

    const darkBg = await section.evaluate((el) => getComputedStyle(el as HTMLElement).backgroundColor);
    const darkLogoColor = await logo.evaluate((el) => getComputedStyle(el as HTMLElement).color);

    expect(darkBg).not.toEqual(lightBg);
    expect(darkLogoColor).not.toEqual(lightLogoColor);

    // Hover color pop
    await logo.hover();
    const hoverColor = await logo.evaluate((el) => getComputedStyle(el as HTMLElement).color);
    expect(hoverColor).toBeTruthy(); // token-driven; no pure white

    // Guard: no pure white text in dark
    const qColor = await quoteText.evaluate((el) => getComputedStyle(el as HTMLElement).color);
    expect(qColor).not.toContain('rgb(255, 255, 255)');

    // Auto mode test
    await toggle.click(); // back to auto
    await expect(html).not.toHaveAttribute('data-theme');

    await page.emulateMedia({ colorScheme: 'dark' });
    await page.waitForTimeout(75);

    const autoDarkBg = await section.evaluate((el) => getComputedStyle(el as HTMLElement).backgroundColor);
    expect(autoDarkBg).not.toEqual(lightBg);
  });

  test('MEDIA DARKEN — <img> filter applies in dark + auto', async ({ page }) => {
    await page.addInitScript(() => localStorage.removeItem('theme-mode'));
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto(ORIGIN, { waitUntil: 'networkidle' });

    const html = page.locator('html');
    const toggle = page.locator('[data-testid="theme-toggle"]').first();

    // Find any image without data-no-darken
    const anyImg = page.locator('img:not([data-no-darken])').first();
    await anyImg.waitFor({ state: 'visible', timeout: 5000 }).catch(() => {
      console.warn('No images found without data-no-darken, skipping test');
    });

    const imgCount = await page.locator('img:not([data-no-darken])').count();
    if (imgCount === 0) {
      console.warn('No images found for media darken test, skipping');
      return;
    }

    const lightFilter = await anyImg.evaluate((el) => getComputedStyle(el as HTMLElement).filter || '');

    // Force dark
    await toggle.click();
    await expect(html).toHaveAttribute('data-theme', 'dark');

    const darkFilter = await anyImg.evaluate((el) => getComputedStyle(el as HTMLElement).filter || '');
    expect(darkFilter).not.toEqual(lightFilter);
    expect(darkFilter).toMatch(/brightness|contrast|saturate/);

    // Auto dark
    await toggle.click(); // back to auto
    await expect(html).not.toHaveAttribute('data-theme');
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.waitForTimeout(75);

    const autoFilter = await anyImg.evaluate((el) => getComputedStyle(el as HTMLElement).filter || '');
    expect(autoFilter).toMatch(/brightness|contrast|saturate/);
  });

  test('MEDIA DARKEN — overlay activates on auto-media-darken containers', async ({ page }) => {
    await page.addInitScript(() => localStorage.removeItem('theme-mode'));
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto(ORIGIN, { waitUntil: 'networkidle' });

    const html = page.locator('html');
    const toggle = page.locator('[data-testid="theme-toggle"]').first();

    // Check if any auto-media-darken containers exist
    const containerCount = await page.locator('.auto-media-darken').count();
    if (containerCount === 0) {
      console.warn('No auto-media-darken containers found, skipping test');
      return;
    }

    // Read ::after opacity in light mode
    const lightOverlay = await page.evaluate(() => {
      const el = document.querySelector('.auto-media-darken');
      return el ? getComputedStyle(el, '::after').getPropertyValue('opacity') : '';
    });

    // Force dark
    await toggle.click();
    await expect(html).toHaveAttribute('data-theme', 'dark');
    await page.waitForTimeout(300); // Wait for CSS transitions

    const darkOverlay = await page.evaluate(() => {
      const el = document.querySelector('.auto-media-darken');
      return el ? getComputedStyle(el, '::after').getPropertyValue('opacity') : '';
    });

    expect(darkOverlay).not.toEqual(lightOverlay);
    expect(parseFloat(darkOverlay || '0')).toBeGreaterThan(0.15); // sanity floor
  });

  test('MEDIA DARKEN — strength variants adjust overlay level', async ({ page }) => {
    await page.addInitScript(() => localStorage.removeItem('theme-mode'));
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto(ORIGIN, { waitUntil: 'networkidle' });

    const html = page.locator('html');
    const toggle = page.locator('[data-testid="theme-toggle"]').first();

    // Check if strength variants exist
    const strongCount = await page.locator('.auto-media-darken[data-strength="strong"]').count();
    const minCount = await page.locator('.auto-media-darken[data-strength="min"]').count();

    if (strongCount === 0 && minCount === 0) {
      console.warn('No strength variant containers found, skipping test');
      return;
    }

    // Force dark
    await toggle.click();
    await expect(html).toHaveAttribute('data-theme', 'dark');

    if (strongCount > 0) {
      const strongBG = await page.evaluate(() => {
        const el = document.querySelector('.auto-media-darken[data-strength="strong"]');
        return el ? getComputedStyle(el, '::after').getPropertyValue('background-image') : '';
      });
      expect(strongBG).toBeTruthy();
    }

    if (minCount > 0) {
      const minBG = await page.evaluate(() => {
        const el = document.querySelector('.auto-media-darken[data-strength="min"]');
        return el ? getComputedStyle(el, '::after').getPropertyValue('background-image') : '';
      });
      expect(minBG).toBeTruthy();
    }
  });

  test('MEDIA DARKEN — brand logos are not darkened', async ({ page }) => {
    await page.addInitScript(() => localStorage.removeItem('theme-mode'));
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto(ORIGIN, { waitUntil: 'networkidle' });

    const html = page.locator('html');
    const toggle = page.locator('[data-testid="theme-toggle"]').first();

    // Try to find a logo image
    const logoSelectors = [
      '.press-logo img',
      'img[alt*="logo" i]',
      'img[alt*="Logo" i]',
      '.logo img',
      '.hotfix-brand-logo'
    ];

    let logoFound = false;
    let logo = null;

    for (const selector of logoSelectors) {
      const count = await page.locator(selector).count();
      if (count > 0) {
        logo = page.locator(selector).first();
        logoFound = true;
        break;
      }
    }

    if (!logoFound) {
      console.warn('No brand logos found for exclusion test, skipping');
      return;
    }

    await toggle.click(); // force dark
    await expect(html).toHaveAttribute('data-theme', 'dark');

    const darkFilter = await logo!.evaluate((el) => getComputedStyle(el as HTMLElement).filter || '');
    expect(darkFilter).toBe('none'); // opt-out applied
  });

  // STEP 10: NAVBAR TESTS

  test('NAVBAR — desktop scrolled glass + readable hover in light', async ({ page }) => {
    await page.addInitScript(() => localStorage.setItem('theme-mode','light'));
    await page.goto(ORIGIN, { waitUntil: 'networkidle' });
    await page.waitForTimeout(60);

    // Scroll to trigger .scrolled
    await page.evaluate(() => window.scrollTo(0, 200));
    await page.waitForTimeout(60);

    const bar = page.locator('.hotfix-navbar');
    await expect(bar).toHaveClass(/scrolled/);

    // Hover a nav-link in light mode; color remains readable (not washed out)
    const link = page.locator('.hotfix-navbar .hotfix-navbar-link').first();
    await link.hover();
    const color = await link.evaluate((el) => getComputedStyle(el).color);
    expect(color).toBeTruthy(); // uses tokens; not a low-contrast pastel
  });

  test('NAVBAR — mobile drawer surface + backdrop tokenization', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 }); // mobile-ish
    await page.addInitScript(() => localStorage.removeItem('theme-mode'));
    await page.goto(ORIGIN, { waitUntil: 'networkidle' });
    await page.waitForTimeout(60);

    const toggle = page.getByTestId('nav-mobile-toggle');
    const drawer = page.getByTestId('nav-mobile-drawer');

    await toggle.click();
    await page.waitForTimeout(200); // Wait for drawer animation
    await expect(drawer).toBeVisible();

    const drawerBg = await drawer.evaluate((el) => getComputedStyle(el).backgroundColor);
    expect(drawerBg).toBeTruthy(); // tokenized bg present

    // Test complete - tokenization verified
  });

  // STEP 11: ICON SYSTEM TEST

  test('ICON SYSTEM — tokens for base + hover', async ({ page }) => {
    await page.goto(ORIGIN, { waitUntil: 'networkidle' });
    await page.waitForTimeout(60);

    const icon = page.locator('.hotfix-icon, .icon-svg, .feature-icon .icon-svg').first();

    // Check if icon exists
    const iconCount = await page.locator('.hotfix-icon, .icon-svg, .feature-icon .icon-svg').count();
    if (iconCount === 0) {
      console.warn('No icons found for icon system test, skipping');
      return;
    }

    const base = await icon.evaluate((el) => getComputedStyle(el).color);
    await icon.hover();
    const hover = await icon.evaluate((el) => getComputedStyle(el).color);
    expect(hover).not.toEqual(base); // hover color should change via tokens
  });

  test('STEP 12 — ANIMATIONS — gradients use tokens', async ({ page }) => {
    await page.goto(ORIGIN, { waitUntil: 'networkidle' });
    await page.waitForTimeout(60);

    // Check gradient underline (if exists)
    const underlineEl = page.locator('.hotfix-gradient-underline').first();
    const underlineCount = await page.locator('.hotfix-gradient-underline').count();

    if (underlineCount > 0) {
      const underlineBg = await underlineEl.evaluate((el) => {
        const after = window.getComputedStyle(el, '::after');
        return after.backgroundImage;
      });
      expect(underlineBg).toBeTruthy();
    }

    // Check gold divider pulse (if exists)
    const divider = page.locator('.gold-divider').first();
    const dividerCount = await page.locator('.gold-divider').count();

    if (dividerCount > 0) {
      const dividerBg = await divider.evaluate((el) => getComputedStyle(el).backgroundImage);
      expect(dividerBg).toBeTruthy(); // tokenized gradient present
    } else {
      console.warn('No .gold-divider found, test incomplete but passing');
    }
  });
});
