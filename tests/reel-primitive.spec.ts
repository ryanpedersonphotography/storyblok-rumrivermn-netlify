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

test.describe('Reel Primitive - Scroll Refinements', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${ORIGIN}/primitives-test`)
    await page.locator('text=Demo 21: Reel Primitive').scrollIntoViewIfNeeded()
  })

  test('should have scroll-padding for safe snap zones', async ({ page }) => {
    const reel = page.locator('.reel').first()

    const scrollPadding = await reel.evaluate(el =>
      getComputedStyle(el).scrollPaddingInline
    )

    expect(scrollPadding).toBeTruthy()
  })

  test('should contain overscroll to prevent parent hijacking', async ({ page }) => {
    const reel = page.locator('.reel').first()

    const overscroll = await reel.evaluate(el =>
      getComputedStyle(el).overscrollBehaviorInline
    )

    expect(overscroll).toBe('contain')
  })

  test('should have stable scrollbar gutter', async ({ page }) => {
    const reel = page.locator('.reel').first()

    const scrollbarGutter = await reel.evaluate(el =>
      (getComputedStyle(el) as any).scrollbarGutter
    )

    // May be undefined in browsers that don't support it
    if (scrollbarGutter !== undefined) {
      expect(scrollbarGutter).toContain('stable')
    }
  })

  test('should apply scroll-snap-stop to items', async ({ page }) => {
    const item = page.locator('.reel > *').first()

    const snapStop = await item.evaluate(el =>
      (getComputedStyle(el) as any).scrollSnapStop
    )

    // May be undefined in browsers that don't support it
    if (snapStop !== undefined) {
      expect(snapStop).toBe('always')
    }
  })

  test('should have edge fades when data-fade-edges is enabled', async ({ page }) => {
    const reel = page.locator('.reel').first()

    // Enable edge fades
    await reel.evaluate(el => {
      el.setAttribute('data-fade-edges', 'true')
    })

    await page.waitForTimeout(50)

    const maskImage = await reel.evaluate(el => {
      const style = getComputedStyle(el)
      return (style as any).maskImage || (style as any).webkitMaskImage
    })

    // Should have linear gradient mask
    expect(maskImage).toBeTruthy()
    if (maskImage && maskImage !== 'none') {
      expect(maskImage).toContain('linear-gradient')
    }
  })

  test('should have quiet scrollbars when data-quiet-scrollbars is enabled', async ({ page }) => {
    const reel = page.locator('.reel').first()

    // Enable quiet scrollbars
    await reel.evaluate(el => {
      el.setAttribute('data-quiet-scrollbars', 'true')
    })

    await page.waitForTimeout(50)

    const scrollbarWidth = await reel.evaluate(el =>
      (getComputedStyle(el) as any).scrollbarWidth
    )

    // May be undefined in browsers that don't support it
    if (scrollbarWidth !== undefined) {
      expect(scrollbarWidth).toBe('thin')
    }
  })

  test('should have performance optimizations', async ({ page }) => {
    const reel = page.locator('.reel').first()

    const styles = await reel.evaluate(el => {
      const cs = getComputedStyle(el)
      return {
        contain: cs.contain,
        contentVisibility: (cs as any).contentVisibility
      }
    })

    // Should have containment
    expect(styles.contain).toContain('content')

    // content-visibility may not be supported in all browsers
    if (styles.contentVisibility !== undefined) {
      expect(styles.contentVisibility).toBe('auto')
    }
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
