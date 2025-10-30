import { test } from '@playwright/test';

const ORIGIN = process.env.E2E_ORIGIN ?? 'https://localhost:9999';

test('debug hero title styles', async ({ page }) => {
  await page.goto(`${ORIGIN}/clean`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  const styles = await page.evaluate(() => {
    const title = document.querySelector('.hero__title');
    if (!title) return { error: 'Title not found' };

    const computed = getComputedStyle(title);
    const custom = getComputedStyle(document.documentElement);

    return {
      computedColor: computed.color,
      computedColorRaw: computed.getPropertyValue('color'),
      tokenValue: custom.getPropertyValue('--theme-text-on-dark'),
      allTokens: {
        'text-on-dark': custom.getPropertyValue('--theme-text-on-dark'),
        'text-primary': custom.getPropertyValue('--theme-text-primary'),
        'bg-primary': custom.getPropertyValue('--theme-bg-primary'),
      },
      cssText: (title as HTMLElement).style.cssText,
      className: title.className,
    };
  });

  console.log('\n=== Debug Clean Hero Title ===');
  console.log(JSON.stringify(styles, null, 2));

  // Check if CSS files are loaded
  const cssFiles = await page.evaluate(() => {
    const links = Array.from(document.querySelectorAll('link[rel="stylesheet"]'));
    return links.map((link) => (link as HTMLLinkElement).href);
  });

  console.log('\n=== Loaded CSS Files ===');
  cssFiles.forEach((href) => console.log(href));
});
