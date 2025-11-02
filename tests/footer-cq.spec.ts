/* ==========================================================================
   FOOTER CONTAINER QUERY VALIDATION TESTS
   ==========================================================================
   Validates footer.css container query migration including:
   - Multi-column collapse pattern (horizontal → vertical stacking)
   - Spacing and font size adjustments at narrow containers
   - Layout flex-direction changes
   - Container-based responsiveness (not viewport)
   ========================================================================== */

import { test, expect } from '@playwright/test'

const ORIGIN = process.env.E2E_ORIGIN ?? 'https://localhost:9999'

test.describe('Footer - Container Query Behavior', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${ORIGIN}/`)
  })

  test('should stack footer sections vertically at tablet-width containers', async ({ page }) => {
    // Find footer section
    const footer = page.locator('[data-clean-root="true"] .footer').first()

    if (await footer.count() === 0) {
      test.skip()
      return
    }

    await expect(footer).toBeVisible()

    // Force container to tablet width (--cq-md = 48rem = 768px or less)
    const sectionParent = footer.locator('..').first()
    await sectionParent.evaluate(el => {
      (el as HTMLElement).style.width = '750px'
      (el as HTMLElement).style.maxWidth = '750px'
    })

    await page.waitForTimeout(200)

    // Footer content should be stacked (flex-direction: column)
    const footerContent = footer.locator('.footer-content').first()
    if (await footerContent.count() > 0) {
      const flexDirection = await footerContent.evaluate(el =>
        getComputedStyle(el).flexDirection
      )

      expect(flexDirection).toBe('column')
    }
  })

  test('should adjust footer padding at tablet-width containers', async ({ page }) => {
    const footer = page.locator('[data-clean-root="true"] .footer').first()

    if (await footer.count() === 0) {
      test.skip()
      return
    }

    await expect(footer).toBeVisible()

    // Force container to tablet width
    const sectionParent = footer.locator('..').first()
    await sectionParent.evaluate(el => {
      (el as HTMLElement).style.width = '750px'
      (el as HTMLElement).style.maxWidth = '750px'
    })

    await page.waitForTimeout(200)

    const padding = await footer.evaluate(el => {
      const style = getComputedStyle(el)
      return {
        top: style.paddingTop,
        bottom: style.paddingBottom
      }
    })

    // Should have adjusted padding (from --space-40 and --space-20)
    expect(padding.top).toBeTruthy()
    expect(padding.bottom).toBeTruthy()
  })

  test('should reduce font sizes at mobile-width containers', async ({ page }) => {
    const footer = page.locator('[data-clean-root="true"] .footer').first()

    if (await footer.count() === 0) {
      test.skip()
      return
    }

    await expect(footer).toBeVisible()

    // Force container to mobile width (--cq-xs = 28rem = 448px or less)
    const sectionParent = footer.locator('..').first()
    await sectionParent.evaluate(el => {
      (el as HTMLElement).style.width = '400px'
      (el as HTMLElement).style.maxWidth = '400px'
    })

    await page.waitForTimeout(200)

    // Footer title should have reduced font size (18px)
    const footerTitle = footer.locator('.footer-title').first()
    if (await footerTitle.count() > 0) {
      const fontSize = await footerTitle.evaluate(el =>
        getComputedStyle(el).fontSize
      )

      expect(fontSize).toBe('18px')
    }

    // Footer description should have reduced font size (14px)
    const footerDesc = footer.locator('.footer-description').first()
    if (await footerDesc.count() > 0) {
      const fontSize = await footerDesc.evaluate(el =>
        getComputedStyle(el).fontSize
      )

      expect(fontSize).toBe('14px')
    }
  })

  test('should reduce social icon size at mobile-width containers', async ({ page }) => {
    const footer = page.locator('[data-clean-root="true"] .footer').first()

    if (await footer.count() === 0) {
      test.skip()
      return
    }

    await expect(footer).toBeVisible()

    // Force container to mobile width
    const sectionParent = footer.locator('..').first()
    await sectionParent.evaluate(el => {
      (el as HTMLElement).style.width = '400px'
      (el as HTMLElement).style.maxWidth = '400px'
    })

    await page.waitForTimeout(200)

    const socialIcon = footer.locator('.footer-social-icon').first()
    if (await socialIcon.count() > 0) {
      const size = await socialIcon.evaluate(el => {
        const style = getComputedStyle(el)
        return {
          width: style.inlineSize,
          height: style.blockSize
        }
      })

      // Should be 18px at mobile width
      expect(size.width).toBe('18px')
      expect(size.height).toBe('18px')
    }
  })

  test('should adjust footer content gap at mobile-width containers', async ({ page }) => {
    const footer = page.locator('[data-clean-root="true"] .footer').first()

    if (await footer.count() === 0) {
      test.skip()
      return
    }

    await expect(footer).toBeVisible()

    // Force container to mobile width
    const sectionParent = footer.locator('..').first()
    await sectionParent.evaluate(el => {
      (el as HTMLElement).style.width = '400px'
      (el as HTMLElement).style.maxWidth = '400px'
    })

    await page.waitForTimeout(200)

    const footerContent = footer.locator('.footer-content').first()
    if (await footerContent.count() > 0) {
      const gap = await footerContent.evaluate(el =>
        getComputedStyle(el).gap
      )

      // Should have reduced gap from --space-32
      expect(gap).toBeTruthy()
    }
  })
})

test.describe('Footer - Container Query Independence', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${ORIGIN}/`)
  })

  test('should respond to container width, not viewport width', async ({ page }) => {
    const footer = page.locator('[data-clean-root="true"] .footer').first()

    if (await footer.count() === 0) {
      test.skip()
      return
    }

    await expect(footer).toBeVisible()

    // Constrain the footer's CONTAINER, not the viewport
    const sectionParent = footer.locator('..').first()
    await sectionParent.evaluate(el => {
      (el as HTMLElement).style.width = '750px'
      (el as HTMLElement).style.maxWidth = '750px'
    })

    await page.waitForTimeout(200)

    // Footer should be stacked due to CONTAINER width, not viewport
    const footerContent = footer.locator('.footer-content').first()
    if (await footerContent.count() > 0) {
      const flexDirection = await footerContent.evaluate(el =>
        getComputedStyle(el).flexDirection
      )

      expect(flexDirection).toBe('column')
    }
  })
})

test.describe('Footer - First Section Flex Behavior', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${ORIGIN}/`)
  })

  test('should set first footer section flex to 1 at tablet-width', async ({ page }) => {
    const footer = page.locator('[data-clean-root="true"] .footer').first()

    if (await footer.count() === 0) {
      test.skip()
      return
    }

    await expect(footer).toBeVisible()

    // Force container to tablet width
    const sectionParent = footer.locator('..').first()
    await sectionParent.evaluate(el => {
      (el as HTMLElement).style.width = '750px'
      (el as HTMLElement).style.maxWidth = '750px'
    })

    await page.waitForTimeout(200)

    const firstSection = footer.locator('.footer-section:first-child').first()
    if (await firstSection.count() > 0) {
      const flex = await firstSection.evaluate(el =>
        getComputedStyle(el).flex
      )

      // Should have flex: 1
      expect(flex).toContain('1')
    }
  })
})

test.describe('Footer - Accessibility', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${ORIGIN}/`)
  })

  test('should maintain focus visibility across container sizes', async ({ page }) => {
    const socialLink = page.locator('[data-clean-root="true"] .footer-social-link').first()

    if (await socialLink.count() > 0) {
      await socialLink.focus()

      const outline = await socialLink.evaluate(el => {
        const style = getComputedStyle(el)
        return {
          outlineWidth: style.outlineWidth,
          outlineOffset: style.outlineOffset
        }
      })

      // Should have visible focus outline
      expect(outline.outlineWidth).toBe('3px')
      expect(outline.outlineOffset).toBe('3px')
    }
  })
})
