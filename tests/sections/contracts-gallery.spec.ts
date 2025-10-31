// FILE: tests/sections/contracts-gallery.spec.ts
import { test, expect } from '@playwright/test'

test('gallery contracts: items, keyboard overlay, theme flips', async ({ page }) => {
  await page.goto('http://localhost:9999/clean')
  const root = page.locator('[data-section="gallery"]')
  await expect(root).toBeVisible()

  const items = root.locator('[data-testid="gallery-item"]')
  await expect(items).toHaveCountGreaterThan(3)

  // keyboard focus reveals overlay
  const first = items.first()
  await first.focus()
  const overlayOpacity = await first.locator('.gallery-overlay').evaluate(el => getComputedStyle(el).opacity)
  expect(parseFloat(overlayOpacity)).toBeGreaterThan(0.1)

  // theme flip affects colors
  await page.evaluate(() => document.documentElement.setAttribute('data-theme','light'))
  const lightBg = await root.evaluate(el => getComputedStyle(el).backgroundColor)

  await page.evaluate(() => document.documentElement.setAttribute('data-theme','dark'))
  const darkBg = await root.evaluate(el => getComputedStyle(el).backgroundColor)

  expect(lightBg).not.toBe(darkBg)
})
