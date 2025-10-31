import { chromium } from '@playwright/test';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    ignoreHTTPSErrors: true,
    viewport: { width: 1280, height: 900 }
  });
  const page = await context.newPage();

  // Hotfix
  await page.goto('https://localhost:9999');
  await page.waitForLoadState('networkidle');
  const hotfixHero = page.locator('[data-section="hero"]');
  await hotfixHero.screenshot({ path: 'hotfix-final.png' });

  // Clean
  await page.goto('https://localhost:9999/clean');
  await page.waitForLoadState('networkidle');
  const cleanHero = page.locator('[data-section="hero"]');
  await cleanHero.screenshot({ path: 'clean-final.png' });

  console.log('Screenshots saved: hotfix-final.png and clean-final.png');

  await browser.close();
})();
