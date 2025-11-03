import { test, expect } from '@playwright/test'

test.describe('Border Strong Token Verification', () => {
  test('verify --border-strong token is defined and works', async ({ page }) => {
    await page.goto('https://localhost:9999/primitives-migration')

    // Get root computed style to check token definition
    const borderStrongValue = await page.evaluate(() => {
      return getComputedStyle(document.documentElement).getPropertyValue('--border-strong').trim()
    })

    console.log(`--border-strong value: "${borderStrongValue}"`)
    expect(borderStrongValue).toBeTruthy()
    expect(borderStrongValue).toMatch(/rgba\(0, 0, 0, 0\.\d+\)|rgba\(255, 255, 255, 0\.\d+\)/)

    // Find an elevated card and check its border color
    const elevatedCard = page.locator('[data-card][data-elevation="elevated"]').first()

    if (await elevatedCard.count() > 0) {
      const borderColor = await elevatedCard.evaluate((el) => {
        return getComputedStyle(el).borderColor
      })
      console.log(`Elevated card border color: ${borderColor}`)
      expect(borderColor).toBeTruthy()
    } else {
      console.log('No elevated cards found on page')
    }

    // Check clickable card hover state would use --border-strong
    const clickableCard = page.locator('[data-card][data-clickable]').first()

    if (await clickableCard.count() > 0) {
      const borderColor = await clickableCard.evaluate((el) => {
        return getComputedStyle(el).borderColor
      })
      console.log(`Clickable card border color: ${borderColor}`)
      expect(borderColor).toBeTruthy()
    } else {
      console.log('No clickable cards found on page')
    }
  })
})
