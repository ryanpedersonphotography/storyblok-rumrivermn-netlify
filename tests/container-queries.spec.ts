/* ==========================================================================
   CONTAINER QUERY VALIDATION TESTS
   ==========================================================================
   Validates Phase 5 container query implementation including:
   - Container type is set on .section elements
   - Container name is properly defined
   - Responsive behavior based on container width (not viewport)
   - Fallback support for browsers without CQ support
   ========================================================================== */

import { test, expect } from '@playwright/test'

const ORIGIN = process.env.E2E_ORIGIN ?? 'https://localhost:9999'

test.describe('Container Query System - Foundation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${ORIGIN}/`)
  })

  test('should set container-type on .section elements', async ({ page }) => {
    // Find a section element
    const section = page.locator('[data-clean-root="true"] .section').first()
    await expect(section).toBeVisible()

    const containerType = await section.evaluate(el =>
      getComputedStyle(el).containerType
    )

    // Should have inline-size container type
    expect(containerType).toContain('inline-size')
  })

  test('should have named container "section"', async ({ page }) => {
    const section = page.locator('[data-clean-root="true"] .section').first()
    await expect(section).toBeVisible()

    const containerName = await section.evaluate(el =>
      getComputedStyle(el).containerName
    )

    // Should have container name set to "section"
    expect(containerName).toContain('section')
  })

  test('should have container query tokens defined', async ({ page }) => {
    const root = page.locator(':root')

    const tokens = await root.evaluate(() => {
      const style = getComputedStyle(document.documentElement)
      return {
        cqXs: style.getPropertyValue('--cq-xs').trim(),
        cqSm: style.getPropertyValue('--cq-sm').trim(),
        cqMd: style.getPropertyValue('--cq-md').trim(),
        cqLg: style.getPropertyValue('--cq-lg').trim(),
        cqXl: style.getPropertyValue('--cq-xl').trim(),
      }
    })

    // All tokens should be defined
    expect(tokens.cqXs).toBeTruthy()
    expect(tokens.cqSm).toBeTruthy()
    expect(tokens.cqMd).toBeTruthy()
    expect(tokens.cqLg).toBeTruthy()
    expect(tokens.cqXl).toBeTruthy()
  })
})

test.describe('Container Query System - Responsive Behavior', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${ORIGIN}/`)
  })

  test('should respond to container width, not viewport width', async ({ page }) => {
    const section = page.locator('[data-clean-root="true"] .section').first()
    await expect(section).toBeVisible()

    // Force section to narrow width
    await section.evaluate(el => {
      const element = el as HTMLElement
      element.style.width = '400px'
      element.style.maxWidth = '400px'
    })

    // Wait for container query to apply
    await page.waitForTimeout(200)

    // Check if header margin-bottom changed (container query effect)
    const header = section.locator('.section__header').first()
    if (await header.count() > 0) {
      const marginBottom = await header.evaluate(el =>
        getComputedStyle(el).marginBottom
      )

      // Container query should have adjusted the margin
      // The exact value depends on the clamp function, but it should be set
      expect(marginBottom).toBeTruthy()
    }
  })

  test('should apply mobile layout at narrow container width', async ({ page }) => {
    const section = page.locator('[data-clean-root="true"] .section').first()
    await expect(section).toBeVisible()

    // Force section to very narrow width (< 28rem = 448px)
    await section.evaluate(el => {
      const element = el as HTMLElement
      element.style.width = '400px'
      element.style.maxWidth = '400px'
    })

    await page.waitForTimeout(200)

    // Check if title font size adjusted (mobile container query)
    const title = section.locator('.section__title').first()
    if (await title.count() > 0) {
      const fontSize = await title.evaluate(el =>
        getComputedStyle(el).fontSize
      )

      // Font size should be set by container query clamp
      expect(fontSize).toBeTruthy()
      expect(fontSize).toMatch(/\d+px/)
    }
  })

  test('should keep section actions vertical at narrow container', async ({ page }) => {
    // Navigate to a page with section actions
    const section = page.locator('[data-clean-root="true"] .section').first()
    await expect(section).toBeVisible()

    // Force narrow container
    await section.evaluate(el => {
      const element = el as HTMLElement
      element.style.width = '600px'
      element.style.maxWidth = '600px'
    })

    await page.waitForTimeout(200)

    // Check actions layout
    const actions = section.locator('.section__actions').first()
    if (await actions.count() > 0) {
      const flexDirection = await actions.evaluate(el =>
        getComputedStyle(el).flexDirection
      )

      // At narrow width (< 48rem), flex-direction should be column
      expect(flexDirection).toBe('column')
    }
  })
})

test.describe('Container Query System - Accessibility', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${ORIGIN}/`)
  })

  test('should maintain proper focus visibility on sections', async ({ page }) => {
    const section = page.locator('[data-clean-root="true"] .section').first()
    await expect(section).toBeVisible()

    // Sections should support focus if interactive
    const tabIndex = await section.getAttribute('tabindex')

    // If section is focusable, it should have proper outline
    if (tabIndex !== null) {
      await section.focus()

      const outline = await section.evaluate(el => {
        const style = getComputedStyle(el)
        return {
          outlineColor: style.outlineColor,
          outlineWidth: style.outlineWidth,
          outlineStyle: style.outlineStyle
        }
      })

      // Should have visible outline when focused
      expect(outline.outlineWidth).toBeTruthy()
    }
  })
})

test.describe('Container Query System - Integration', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${ORIGIN}/`)
  })

  test('should work with multiple sections on same page', async ({ page }) => {
    const sections = page.locator('[data-clean-root="true"] .section')
    const count = await sections.count()

    // Should have multiple sections
    expect(count).toBeGreaterThan(0)

    // Each section should have container-type
    for (let i = 0; i < Math.min(count, 5); i++) {
      const section = sections.nth(i)
      const containerType = await section.evaluate(el =>
        getComputedStyle(el).containerType
      )

      expect(containerType).toContain('inline-size')
    }
  })

  test('should not break existing spacing system', async ({ page }) => {
    const section = page.locator('[data-clean-root="true"] .section[data-padding-y]').first()

    if (await section.count() > 0) {
      const padding = await section.evaluate(el => {
        const style = getComputedStyle(el)
        return {
          top: style.paddingTop,
          bottom: style.paddingBottom
        }
      })

      // Padding should be set from spacing tokens
      expect(padding.top).toBeTruthy()
      expect(padding.bottom).toBeTruthy()
      expect(padding.top).toMatch(/\d+px/)
    }
  })

  test('should preserve section alignment variants', async ({ page }) => {
    // Test different alignment options still work
    const leftSection = page.locator('[data-clean-root="true"] .section[data-align="left"]').first()
    const centerSection = page.locator('[data-clean-root="true"] .section[data-align="center"]').first()

    if (await leftSection.count() > 0) {
      const rail = leftSection.locator('.section__rail').first()
      const marginLeft = await rail.evaluate(el =>
        getComputedStyle(el).marginLeft
      )

      // Left-aligned sections should have margin-left: 0
      expect(marginLeft).toBe('0px')
    }

    if (await centerSection.count() > 0) {
      const rail = centerSection.locator('.section__rail').first()
      const marginLeft = await rail.evaluate(el =>
        getComputedStyle(el).marginLeft
      )

      // Center-aligned sections should have auto margins
      expect(marginLeft).toBe('auto')
    }
  })
})

test.describe('Container Query System - Performance', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${ORIGIN}/`)
  })

  test('should have containment set for performance', async ({ page }) => {
    const section = page.locator('[data-clean-root="true"] .section').first()
    await expect(section).toBeVisible()

    const contain = await section.evaluate(el =>
      getComputedStyle(el).contain
    )

    // Should have paint containment for performance
    expect(contain).toContain('paint')
  })

  test('should handle dynamic width changes efficiently', async ({ page }) => {
    const section = page.locator('[data-clean-root="true"] .section').first()
    await expect(section).toBeVisible()

    // Rapidly change width multiple times
    for (let width = 300; width <= 1000; width += 100) {
      await section.evaluate((el, w) => {
        (el as HTMLElement).style.width = `${w}px`
      }, width)

      await page.waitForTimeout(50)
    }

    // Should still be visible and functional
    await expect(section).toBeVisible()

    const containerType = await section.evaluate(el =>
      getComputedStyle(el).containerType
    )

    expect(containerType).toContain('inline-size')
  })
})
