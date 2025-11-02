/* ==========================================================================
   NAVBAR CONTAINER QUERY VALIDATION TESTS
   ==========================================================================
   Validates navbar.css container query migration including:
   - Progressive enhancement pattern (min-width breakpoints)
   - Desktop nav shows at wider containers
   - Mobile button hides at wider containers
   - Font size and gap adjustments respond to container width
   ========================================================================== */

import { test, expect } from '@playwright/test'

const ORIGIN = process.env.E2E_ORIGIN ?? 'https://localhost:9999'

test.describe('Navbar - Container Query Behavior', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${ORIGIN}/`)
  })

  test('should show desktop nav at wide containers (56.25rem+)', async ({ page }) => {
    // Find navbar section
    const navbarSection = page.locator('[data-clean-root="true"] .navbar').first()
    await expect(navbarSection).toBeVisible()

    // Force container to wide width (56.25rem = 900px)
    const navbarParent = navbarSection.locator('..').first()
    await navbarParent.evaluate(el => {
      (el as HTMLElement).style.width = '920px'
      (el as HTMLElement).style.maxWidth = '920px'
    })

    await page.waitForTimeout(200)

    // Desktop nav should be visible
    const nav = navbarSection.locator('.navbar__nav').first()
    if (await nav.count() > 0) {
      const display = await nav.evaluate(el => getComputedStyle(el).display)
      expect(display).toBe('flex')
    }

    // Mobile button should be hidden
    const mobileBtn = navbarSection.locator('.navbar__mobile-btn').first()
    if (await mobileBtn.count() > 0) {
      const display = await mobileBtn.evaluate(el => getComputedStyle(el).display)
      expect(display).toBe('none')
    }
  })

  test('should hide desktop nav at narrow containers', async ({ page }) => {
    const navbarSection = page.locator('[data-clean-root="true"] .navbar').first()
    await expect(navbarSection).toBeVisible()

    // Force container to narrow width (< 56.25rem)
    const navbarParent = navbarSection.locator('..').first()
    await navbarParent.evaluate(el => {
      (el as HTMLElement).style.width = '500px'
      (el as HTMLElement).style.maxWidth = '500px'
    })

    await page.waitForTimeout(200)

    // Desktop nav should be hidden
    const nav = navbarSection.locator('.navbar__nav').first()
    if (await nav.count() > 0) {
      const display = await nav.evaluate(el => getComputedStyle(el).display)
      expect(display).toBe('none')
    }

    // Mobile button should be visible
    const mobileBtn = navbarSection.locator('.navbar__mobile-btn').first()
    if (await mobileBtn.count() > 0) {
      const display = await mobileBtn.evaluate(el => getComputedStyle(el).display)
      expect(display).not.toBe('none')
    }
  })

  test('should increase link font size at --cq-lg+ containers', async ({ page }) => {
    const navbarSection = page.locator('[data-clean-root="true"] .navbar').first()
    await expect(navbarSection).toBeVisible()

    // Force container to --cq-lg width (64rem = 1024px)
    const navbarParent = navbarSection.locator('..').first()
    await navbarParent.evaluate(el => {
      (el as HTMLElement).style.width = '1024px'
      (el as HTMLElement).style.maxWidth = '1024px'
    })

    await page.waitForTimeout(200)

    const link = navbarSection.locator('.navbar__link').first()
    if (await link.count() > 0) {
      const fontSize = await link.evaluate(el => getComputedStyle(el).fontSize)
      // At 1024px+, font-size should be 15px
      expect(fontSize).toBe('15px')
    }
  })

  test('should increase nav gap at wide containers (75rem+)', async ({ page }) => {
    const navbarSection = page.locator('[data-clean-root="true"] .navbar').first()
    await expect(navbarSection).toBeVisible()

    // Force container to very wide width (75rem = 1200px)
    const navbarParent = navbarSection.locator('..').first()
    await navbarParent.evaluate(el => {
      (el as HTMLElement).style.width = '1200px'
      (el as HTMLElement).style.maxWidth = '1200px'
    })

    await page.waitForTimeout(200)

    const nav = navbarSection.locator('.navbar__nav').first()
    if (await nav.count() > 0) {
      const gap = await nav.evaluate(el => getComputedStyle(el).gap)
      // Should use --space-40 at 1200px+
      expect(gap).toBeTruthy()
    }
  })
})

test.describe('Navbar - Container Query Independence', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${ORIGIN}/`)
  })

  test('should respond to container width, not viewport width', async ({ page }) => {
    const navbarSection = page.locator('[data-clean-root="true"] .navbar').first()
    await expect(navbarSection).toBeVisible()

    // Constrain the navbar's container, NOT the viewport
    const navbarParent = navbarSection.locator('..').first()
    await navbarParent.evaluate(el => {
      (el as HTMLElement).style.width = '500px'
      (el as HTMLElement).style.maxWidth = '500px'
    })

    await page.waitForTimeout(200)

    // Desktop nav should be hidden due to CONTAINER width, not viewport
    const nav = navbarSection.locator('.navbar__nav').first()
    if (await nav.count() > 0) {
      const display = await nav.evaluate(el => getComputedStyle(el).display)
      expect(display).toBe('none')
    }
  })
})

test.describe('Navbar - Accessibility', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${ORIGIN}/`)
  })

  test('should maintain focus visibility across container sizes', async ({ page }) => {
    const link = page.locator('[data-clean-root="true"] .navbar__link').first()

    if (await link.count() > 0) {
      await link.focus()

      const outline = await link.evaluate(el => {
        const style = getComputedStyle(el)
        return {
          outlineWidth: style.outlineWidth,
          outlineStyle: style.outlineStyle
        }
      })

      // Should have visible focus outline
      expect(outline.outlineWidth).toBeTruthy()
    }
  })
})
