import { Page } from '@playwright/test';

export async function stabilize(page: Page) {
  // Block analytics / random beacons that change render timing
  await page.route('**/*', route => {
    const url = route.request().url();
    if (/\b(googletagmanager|google-analytics|segment|sentry|hotjar|clarity)\b/.test(url)) {
      return route.abort();
    }
    return route.continue();
  });

  await page.addStyleTag({
    content: `
      *, *::before, *::after {
        animation: none !important;
        transition: none !important;
        caret-color: transparent !important;
      }
      /* Optional: prevent flashing focus rings mid-snapshot */
      :focus { outline: none !important; }
    `
  });

  // Wait for fonts to settle and network to calm
  await page.waitForLoadState('domcontentloaded');
  await page.waitForLoadState('networkidle');
  await page.evaluate(async () => {
    // @ts-ignore
    if (document?.fonts?.ready) await (document as any).fonts.ready;
  });
}
