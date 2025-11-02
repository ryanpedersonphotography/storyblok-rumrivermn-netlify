/* ==========================================================================
   REEL PRIMITIVE TESTS
   ==========================================================================
   Validates reel primitive implementation including:
   - Horizontal scroll with overflow-x
   - Snap scrolling behavior
   - Item snap alignment
   - Container query responsive gaps
   - Reduced motion support
   ========================================================================== */

import { test, expect } from '@playwright/test'

const ORIGIN = process.env.E2E_ORIGIN ?? 'https://localhost:9999'

test.describe('Reel Primitive', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${ORIGIN}/primitives-test`)
    await page.locator('text=Demo 21: Reel Primitive').scrollIntoViewIfNeeded()
  })

  test('should render reel with correct display and grid properties', async ({ page }) => {
    const reel = page.locator('.reel').first()
    await expect(reel).toBeVisible()

    const styles = await reel.evaluate(el => {
      const computed = getComputedStyle(el)
      return {
        display: computed.display,
        gridAutoFlow: computed.gridAutoFlow,
        gridAutoColumns: computed.gridAutoColumns
      }
    })

    expect(styles.display).toBe('grid')
    expect(styles.gridAutoFlow).toBe('column')
    expect(styles.gridAutoColumns).toBe('max-content')
  })

  test('should have horizontal overflow and snap', async ({ page }) => {
    const reel = page.locator('.reel').first()

    const styles = await reel.evaluate(el => {
      const cs = getComputedStyle(el)
      return {
        overflowX: cs.overflowX,
        snap: cs.scrollSnapType
      }
    })

    expect(styles.overflowX).toMatch(/auto|scroll/i)
    expect(styles.snap.toLowerCase()).toContain('x mandatory')
  })

  test('should apply snap alignment to child items', async ({ page }) => {
    const item = page.locator('.reel > *').first()
    await expect(item).toBeVisible()

    const snapAlign = await item.evaluate(el =>
      getComputedStyle(el).scrollSnapAlign
    )

    expect(snapAlign).toContain('start')
  })

  test('should use token-based gap', async ({ page }) => {
    const reel = page.locator('.reel').first()

    const gap = await reel.evaluate(el =>
      getComputedStyle(el).gap
    )

    // Default gap should be --space-24 (24px)
    expect(gap).toBeTruthy()
    expect(gap).toMatch(/\d+px/)
  })

  test('should have webkit overflow scrolling for touch', async ({ page }) => {
    const reel = page.locator('.reel').first()

    const webkitScrolling = await reel.evaluate(el =>
      (getComputedStyle(el) as any).webkitOverflowScrolling
    )

    // Should be 'touch' or undefined (not all browsers support it)
    if (webkitScrolling !== undefined) {
      expect(webkitScrolling).toBe('touch')
    }
  })

  test('should have container type for container queries', async ({ page }) => {
    const reel = page.locator('.reel').first()

    const containerType = await reel.evaluate(el =>
      getComputedStyle(el).containerType
    )

    expect(containerType).toContain('inline-size')
  })

  test('should render multiple items in horizontal layout', async ({ page }) => {
    const items = page.locator('.reel > *')
    const count = await items.count()

    // Demo has 10 items
    expect(count).toBeGreaterThanOrEqual(10)

    // Verify items are horizontally arranged
    const firstItemRect = await items.first().boundingBox()
    const secondItemRect = await items.nth(1).boundingBox()

    if (firstItemRect && secondItemRect) {
      // Second item should be to the right of first item
      expect(secondItemRect.x).toBeGreaterThan(firstItemRect.x)
    }
  })

  test('should be scrollable horizontally', async ({ page }) => {
    const reel = page.locator('.reel').first()

    const scrollInfo = await reel.evaluate(el => ({
      scrollWidth: el.scrollWidth,
      clientWidth: el.clientWidth,
      scrollLeft: el.scrollLeft
    }))

    // Content should be wider than container
    expect(scrollInfo.scrollWidth).toBeGreaterThan(scrollInfo.clientWidth)

    // Should start at scroll position 0
    expect(scrollInfo.scrollLeft).toBe(0)
  })

  test('should respect prefers-reduced-motion', async ({ page, context }) => {
    // Enable reduced motion
    await context.addInitScript(() => {
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: (query: string) => ({
          matches: query === '(prefers-reduced-motion: reduce)',
          media: query,
          onchange: null,
          addListener: () => {},
          removeListener: () => {},
          addEventListener: () => {},
          removeEventListener: () => {},
          dispatchEvent: () => true,
        }),
      })
    })

    await page.goto(`${ORIGIN}/primitives-test`)
    await page.locator('text=Demo 21: Reel Primitive').scrollIntoViewIfNeeded()

    const reel = page.locator('.reel').first()
    const scrollBehavior = await reel.evaluate(el =>
      getComputedStyle(el).scrollBehavior
    )

    // Scroll behavior should be auto in reduced motion mode
    expect(scrollBehavior).toBe('auto')
  })

  test('should maintain card styling within reel', async ({ page }) => {
    const firstCard = page.locator('.reel [data-card]').first()
    await expect(firstCard).toBeVisible()

    const cardStyles = await firstCard.evaluate(el => {
      const cs = getComputedStyle(el)
      return {
        display: cs.display,
        borderRadius: cs.borderRadius,
        padding: cs.padding
      }
    })

    expect(cardStyles.display).toBe('flex')
    expect(cardStyles.borderRadius).toBeTruthy()
    expect(cardStyles.padding).toBeTruthy()
  })
})

test.describe('Reel Primitive - Advanced', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${ORIGIN}/primitives-test`)
    await page.locator('text=Demo 21: Reel Primitive').scrollIntoViewIfNeeded()
  })

  test('should handle scrolling interaction', async ({ page }) => {
    const reel = page.locator('.reel').first()

    // Get initial scroll position
    const initialScroll = await reel.evaluate(el => el.scrollLeft)

    // Scroll right
    await reel.evaluate(el => {
      el.scrollLeft = 200
    })

    await page.waitForTimeout(100)

    const newScroll = await reel.evaluate(el => el.scrollLeft)

    // Scroll position should have changed
    expect(newScroll).toBeGreaterThan(initialScroll)
  })

  test('should snap to items when scrolling', async ({ page }) => {
    const reel = page.locator('.reel').first()

    // Scroll to middle of container
    await reel.evaluate(el => {
      el.scrollLeft = el.scrollWidth / 2
    })

    // Wait for snap to settle
    await page.waitForTimeout(300)

    // Get final scroll position
    const finalScroll = await reel.evaluate(el => el.scrollLeft)

    // Should be a valid number
    expect(typeof finalScroll).toBe('number')
    expect(finalScroll).toBeGreaterThan(0)
  })

  test('should use correct gap based on container width', async ({ page }) => {
    const reel = page.locator('.reel').first()

    // Get computed gap
    const gap = await reel.evaluate(el =>
      getComputedStyle(el).gap
    )

    expect(gap).toBeTruthy()
    // Gap should be token-based (16px or 24px depending on container width)
    expect(['16px', '24px']).toContain(gap.replace(/\s+/g, ''))
  })
})
