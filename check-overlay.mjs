import { chromium } from '@playwright/test';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    ignoreHTTPSErrors: true,
    viewport: { width: 1280, height: 900 }
  });
  const page = await context.newPage();

  // Check hotfix
  console.log('=== HOTFIX ===');
  await page.goto('https://localhost:9999');
  await page.waitForLoadState('networkidle');

  const hotfixOverlay = await page.evaluate(() => {
    const hero = document.querySelector('[data-section="hero"]');
    const afterStyles = window.getComputedStyle(hero, '::after');
    return {
      background: afterStyles.background,
      backgroundImage: afterStyles.backgroundImage,
      dataTheme: document.documentElement.getAttribute('data-theme'),
      prefersColorScheme: window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    };
  });
  console.log('Hotfix overlay:', hotfixOverlay);

  // Check clean
  console.log('\n=== CLEAN ===');
  await page.goto('https://localhost:9999/clean');
  await page.waitForLoadState('networkidle');

  const cleanOverlay = await page.evaluate(() => {
    const hero = document.querySelector('[data-section="hero"]');
    const afterStyles = window.getComputedStyle(hero, '::after');
    const htmlStyles = window.getComputedStyle(document.documentElement);
    const heroElement = window.getComputedStyle(hero);
    return {
      background: afterStyles.background,
      backgroundImage: afterStyles.backgroundImage,
      dataTheme: document.documentElement.getAttribute('data-theme'),
      prefersColorScheme: window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light',
      overlayStartFromRoot: htmlStyles.getPropertyValue('--hero-overlay-start'),
      overlayMidFromRoot: htmlStyles.getPropertyValue('--hero-overlay-mid'),
      overlayEndFromRoot: htmlStyles.getPropertyValue('--hero-overlay-end'),
      overlayStartFromHero: heroElement.getPropertyValue('--hero-overlay-start'),
      overlayMidFromHero: heroElement.getPropertyValue('--hero-overlay-mid'),
      overlayEndFromHero: heroElement.getPropertyValue('--hero-overlay-end'),
      privateOverlayStart: heroElement.getPropertyValue('--_overlay-start'),
      privateOverlayMid: heroElement.getPropertyValue('--_overlay-mid'),
      privateOverlayEnd: heroElement.getPropertyValue('--_overlay-end')
    };
  });
  console.log('Clean overlay:', cleanOverlay);

  await browser.close();
})();
