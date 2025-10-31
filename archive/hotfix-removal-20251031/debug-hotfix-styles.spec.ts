import { test } from '@playwright/test';

const ORIGIN = process.env.E2E_ORIGIN ?? 'https://localhost:9999';

test('debug HOTFIX hero title styles', async ({ page }) => {
  await page.goto(`${ORIGIN}/`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  const styles = await page.evaluate(() => {
    const title = document.querySelector('.hotfix-hero-title');
    if (!title) return { error: 'Title not found' };

    const computed = getComputedStyle(title);
    const custom = getComputedStyle(document.documentElement);

    return {
      computedColor: computed.color,
      tokenValue: custom.getPropertyValue('--theme-text-on-dark'),
      allTokens: {
        'text-on-dark': custom.getPropertyValue('--theme-text-on-dark'),
        'text-primary': custom.getPropertyValue('--theme-text-primary'),
        'bg-primary': custom.getPropertyValue('--theme-bg-primary'),
      },
    };
  });

  console.log('\n=== Debug HOTFIX Hero Title ===');
  console.log(JSON.stringify(styles, null, 2));
});
