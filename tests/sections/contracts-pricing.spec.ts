import { test, expect } from '@playwright/test';

test('pricing contracts: selectors, tap targets, theme tokens', async ({ page }) => {
  await page.goto('http://localhost:9999/clean');

  const root = page.locator('[data-section="pricing"]');
  await expect(root).toBeVisible();

  // At least 3 cards
  const cards = root.locator('.pricing-card');
  await expect(cards).toHaveCount(3);

  // CTA tap target & focus ring
  const cta = cards.first().locator('[data-testid="pricing-cta"]');
  const box = await cta.boundingBox();
  expect((box?.height ?? 0)).toBeGreaterThanOrEqual(44);

  // Theme flips color via tokens
  await page.evaluate(() => document.documentElement.setAttribute('data-theme','light'));
  const lightCtaBg = await cta.evaluate(el => getComputedStyle(el).backgroundImage || getComputedStyle(el).backgroundColor);

  await page.evaluate(() => document.documentElement.setAttribute('data-theme','dark'));
  const darkCtaBg = await cta.evaluate(el => getComputedStyle(el).backgroundImage || getComputedStyle(el).backgroundColor);

  expect(lightCtaBg).not.toBe(darkCtaBg);
});
