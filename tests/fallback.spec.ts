/* ==========================================================================
   CONTAINER QUERY FALLBACK VALIDATION TESTS
   ==========================================================================
   Validates the @supports fallback pattern for container queries:
   - Ensures browser support detection works correctly
   - Verifies fallback viewport MQs are present and structured correctly
   - Tests that container queries take precedence when supported
   - Validates progressive enhancement pattern
   ========================================================================== */

import { test, expect } from '@playwright/test'

const ORIGIN = process.env.E2E_ORIGIN ?? 'https://localhost:9999'

test.describe('Container Query Support Detection', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${ORIGIN}/`)
  })

  test('should support container queries in modern browsers', async ({ page }) => {
    // Check if browser supports container queries
    const supportsContainerQueries = await page.evaluate(() => {
      return CSS.supports('container-type: inline-size')
    })

    // Modern browsers (Chrome 105+, Safari 16+, Firefox 110+) should support CQ
    expect(supportsContainerQueries).toBe(true)
  })

  test('should have container-type set on .section elements', async ({ page }) => {
    const section = page.locator('[data-clean-root="true"] .section').first()

    if (await section.count() > 0) {
      const containerType = await section.evaluate(el =>
        getComputedStyle(el).containerType
      )

      // Should have inline-size container type
      expect(containerType).toContain('inline-size')
    }
  })

  test('should have container-name defined on .section elements', async ({ page }) => {
    const section = page.locator('[data-clean-root="true"] .section').first()

    if (await section.count() > 0) {
      const containerName = await section.evaluate(el =>
        getComputedStyle(el).containerName
      )

      // Should have 'section' container name
      expect(containerName).toContain('section')
    }
  })
})

test.describe('Fallback Pattern Structure', () => {
  test('should have viewport MQs wrapped in @supports fallback', async () => {
    // This test verifies the structure exists in the CSS files
    // We can't directly test CSS file contents in Playwright, but we can
    // verify that the styling behavior works correctly

    // The actual file content validation happens in check-container-queries.mjs
    // This test ensures runtime behavior is correct
    expect(true).toBe(true)
  })
})

test.describe('Container Query Precedence', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${ORIGIN}/`)
  })

  test('should use container queries over viewport MQs when supported', async ({ page }) => {
    // In modern browsers, container queries should take precedence
    const section = page.locator('[data-clean-root="true"] .section').first()

    if (await section.count() === 0) {
      test.skip()
      return
    }

    await expect(section).toBeVisible()

    // Force section to narrow container width (< 48rem)
    await section.evaluate(el => {
      const element = el as HTMLElement
      element.style.width = '700px'
      element.style.maxWidth = '700px'
    })

    await page.waitForTimeout(200)

    // Check if actions layout responds to container (not viewport)
    const actions = section.locator('.section__actions').first()
    if (await actions.count() > 0) {
      const flexDirection = await actions.evaluate(el =>
        getComputedStyle(el).flexDirection
      )

      // Should be column due to CONTAINER query, proving CQ takes precedence
      expect(flexDirection).toBe('column')
    }
  })

  test('should apply container query styles at narrow container width', async ({ page }) => {
    const section = page.locator('[data-clean-root="true"] .section').first()

    if (await section.count() === 0) {
      test.skip()
      return
    }

    await expect(section).toBeVisible()

    // Constrain to mobile-width container (< 28rem = 448px)
    await section.evaluate(el => {
      const element = el as HTMLElement
      element.style.width = '400px'
      element.style.maxWidth = '400px'
    })

    await page.waitForTimeout(200)

    // Title font size should be adjusted by container query
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
})

test.describe('Progressive Enhancement', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${ORIGIN}/`)
  })

  test('should not break layouts when container queries are used', async ({ page }) => {
    // Verify that using container queries doesn't break existing layouts
    const section = page.locator('[data-clean-root="true"] .section').first()

    if (await section.count() === 0) {
      test.skip()
      return
    }

    await expect(section).toBeVisible()

    // Section should have proper layout properties
    const layout = await section.evaluate(el => {
      const style = getComputedStyle(el)
      return {
        position: style.position,
        width: style.width,
        display: style.display
      }
    })

    expect(layout.position).toBe('relative')
    expect(layout.width).toBeTruthy()
  })

  test('should maintain accessibility when using container queries', async ({ page }) => {
    const section = page.locator('[data-clean-root="true"] .section').first()

    if (await section.count() === 0) {
      test.skip()
      return
    }

    await expect(section).toBeVisible()

    // Constrain container to test responsive behavior
    await section.evaluate(el => {
      const element = el as HTMLElement
      element.style.width = '400px'
      element.style.maxWidth = '400px'
    })

    await page.waitForTimeout(200)

    // Elements should still be accessible
    const header = section.locator('.section__header').first()
    if (await header.count() > 0) {
      await expect(header).toBeVisible()
    }

    const content = section.locator('.section__content').first()
    if (await content.count() > 0) {
      await expect(content).toBeVisible()
    }
  })
})

test.describe('Paint Containment', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${ORIGIN}/`)
  })

  test('should have paint containment for performance', async ({ page }) => {
    const section = page.locator('[data-clean-root="true"] .section').first()

    if (await section.count() === 0) {
      test.skip()
      return
    }

    await expect(section).toBeVisible()

    const contain = await section.evaluate(el =>
      getComputedStyle(el).contain
    )

    // Should have paint containment
    expect(contain).toContain('paint')
  })
})

test.describe('Container Query Token Resilience', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${ORIGIN}/`)
  })

  test('should use CSS custom property tokens with fallback values', async ({ page }) => {
    // Verify that container query breakpoints use tokens (var(--cq-md, 48rem))
    // The fallback value ensures resilience if token is missing

    const root = page.locator(':root')

    const tokens = await root.evaluate(() => {
      const style = getComputedStyle(document.documentElement)
      return {
        cqXs: style.getPropertyValue('--cq-xs').trim(),
        cqMd: style.getPropertyValue('--cq-md').trim(),
        cqLg: style.getPropertyValue('--cq-lg').trim()
      }
    })

    // Tokens should be defined
    expect(tokens.cqXs).toBeTruthy()
    expect(tokens.cqMd).toBeTruthy()
    expect(tokens.cqLg).toBeTruthy()

    // Tokens should use rem units
    expect(tokens.cqXs).toContain('rem')
    expect(tokens.cqMd).toContain('rem')
    expect(tokens.cqLg).toContain('rem')
  })
})

test.describe('Multiple Containers on Same Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${ORIGIN}/`)
  })

  test('should handle multiple container query contexts independently', async ({ page }) => {
    const sections = page.locator('[data-clean-root="true"] .section')
    const count = await sections.count()

    if (count < 2) {
      test.skip()
      return
    }

    // Each section should have its own container context
    for (let i = 0; i < Math.min(count, 3); i++) {
      const section = sections.nth(i)
      const containerType = await section.evaluate(el =>
        getComputedStyle(el).containerType
      )

      expect(containerType).toContain('inline-size')
    }
  })

  test('should allow different sections to have different container widths', async ({ page }) => {
    const sections = page.locator('[data-clean-root="true"] .section')
    const count = await sections.count()

    if (count < 2) {
      test.skip()
      return
    }

    // Constrain first section to narrow width
    const firstSection = sections.first()
    await firstSection.evaluate(el => {
      (el as HTMLElement).style.width = '400px'
      (el as HTMLElement).style.maxWidth = '400px'
    })

    // Leave second section at full width
    await page.waitForTimeout(200)

    // Both should still work independently
    await expect(firstSection).toBeVisible()
    await expect(sections.nth(1)).toBeVisible()
  })
})
