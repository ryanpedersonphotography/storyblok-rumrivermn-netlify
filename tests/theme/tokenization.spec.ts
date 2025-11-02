import { test, expect } from '@playwright/test';

test('mix tokens resolve and theme flips base', async ({ page }) => {
  await page.goto('/primitives-test').catch(() => page.goto('/'));
  const getVar = (name: string) =>
    page.evaluate((n) => getComputedStyle(document.documentElement).getPropertyValue(n).trim(), name);

  const mixBaseLight = await getVar('--mix-base');
  expect(mixBaseLight).toBe('black');

  const mixSubtle = await getVar('--mix-subtle');
  expect(mixSubtle && mixSubtle.length > 0).toBeTruthy();

  await page.evaluate(() => document.documentElement.setAttribute('data-theme','dark'));
  const mixBaseDark = await getVar('--mix-base');
  expect(mixBaseDark).toBe('white');
});

test('navbar uses glass-backdrop tokens if navbar is present', async ({ page }) => {
  await page.goto('/').catch(() => {});
  const navbar = page.locator('.navbar');
  if (await navbar.count() === 0) test.skip(true, 'No .navbar on this route');
  const ok = await navbar.evaluate((el) => {
    const cs = getComputedStyle(el as HTMLElement);
    return cs.getPropertyValue('backdrop-filter').includes('var(--glass-backdrop)') ||
           cs.getPropertyValue('-webkit-backdrop-filter').includes('var(--glass-backdrop)');
  });
  expect(ok).toBeTruthy();
});
