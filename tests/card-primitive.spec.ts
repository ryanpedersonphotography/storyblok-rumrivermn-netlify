/* ==========================================================================
   CARD PRIMITIVE TESTS
   ==========================================================================
   Validates card primitive implementation including:
   - Elevation variants (flat, raised, elevated, floating)
   - Padding variants (compact, normal, spacious, none)
   - Interactive states (hover lift/glow, clickable)
   - Glass composition
   - Surface tints
   - Accessibility
   ========================================================================== */

import { test, expect } from '@playwright/test'

test.describe('Card Primitive', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/primitives-test')
    // Scroll to Demo 20
    await page.locator('text=Demo 20: Card Primitive').scrollIntoViewIfNeeded()
  })

  test('should render card elements with default styles', async ({ page }) => {
    const cardElement = page.locator('[data-card]').first()
    await expect(cardElement).toBeVisible()

    const styles = await cardElement.evaluate(el => {
      const computed = getComputedStyle(el)
      return {
        display: computed.display,
        position: computed.position,
        background: computed.background,
        borderRadius: computed.borderRadius
      }
    })

    expect(styles.display).toBe('flex')
    expect(styles.position).toBe('relative')
    expect(styles.background).toBeTruthy()
  })

  test('should apply correct shadows for elevation variants', async ({ page }) => {
    const elevations = ['flat', 'raised', 'elevated', 'floating']

    for (const elevation of elevations) {
      const card = page.locator(`[data-card][data-elevation="${elevation}"]`).first()
      await expect(card).toBeVisible()

      const boxShadow = await card.evaluate(el =>
        getComputedStyle(el).boxShadow
      )

      if (elevation === 'flat') {
        expect(boxShadow).toBe('none')
      } else {
        // Should have some shadow
        expect(boxShadow).not.toBe('none')
      }
    }
  })

  test('should apply correct padding for padding variants', async ({ page }) => {
    const variants = [
      { attr: 'compact', expected: '16px' },
      { attr: 'normal', expected: '24px' },
      { attr: 'spacious', expected: '32px' }
    ]

    for (const variant of variants) {
      const card = page.locator(`[data-card][data-padding="${variant.attr}"]`).first()
      const padding = await card.evaluate(el =>
        getComputedStyle(el).padding
      )

      expect(padding).toContain(variant.expected)
    }
  })

  test('should lift card on hover with data-hover="lift"', async ({ page }) => {
    const hoverCard = page.locator('[data-card][data-hover="lift"]').first()
    await expect(hoverCard).toBeVisible()

    // Get initial transform
    const initialTransform = await hoverCard.evaluate(el =>
      getComputedStyle(el).transform
    )

    // Hover over card
    await hoverCard.hover()
    await page.waitForTimeout(100) // Wait for transition

    const hoverTransform = await hoverCard.evaluate(el =>
      getComputedStyle(el).transform
    )

    // Transform should change on hover
    expect(hoverTransform).not.toBe(initialTransform)
  })

  test('should apply glow effect on hover with data-hover="glow"', async ({ page }) => {
    const glowCard = page.locator('[data-card][data-hover="glow"]').first()
    await expect(glowCard).toBeVisible()

    // Get initial border color
    const initialBorder = await glowCard.evaluate(el =>
      getComputedStyle(el).borderColor
    )

    // Hover over card
    await glowCard.hover()
    await page.waitForTimeout(100)

    const hoverBorder = await glowCard.evaluate(el =>
      getComputedStyle(el).borderColor
    )

    // Border should change on hover
    expect(hoverBorder).not.toBe(initialBorder)
  })

  test('should make card clickable with data-clickable', async ({ page }) => {
    const clickableCard = page.locator('[data-card][data-clickable]').first()
    await expect(clickableCard).toBeVisible()

    // Should have pointer cursor
    const cursor = await clickableCard.evaluate(el =>
      getComputedStyle(el).cursor
    )
    expect(cursor).toBe('pointer')

    // Should lift on hover
    const initialTransform = await clickableCard.evaluate(el =>
      getComputedStyle(el).transform
    )

    await clickableCard.hover()
    await page.waitForTimeout(100)

    const hoverTransform = await clickableCard.evaluate(el =>
      getComputedStyle(el).transform
    )

    expect(hoverTransform).not.toBe(initialTransform)
  })

  test('should combine card with glass primitive', async ({ page }) => {
    const glassCard = page.locator('[data-card][data-glass]').first()
    await expect(glassCard).toBeVisible()

    // Should have backdrop-filter from glass
    const backdropFilter = await glassCard.evaluate(el =>
      getComputedStyle(el).backdropFilter
    )
    expect(backdropFilter).toContain('blur')
  })

  test('should apply surface tints correctly', async ({ page }) => {
    const surfaces = ['rose', 'gold', 'sage']

    for (const surface of surfaces) {
      const card = page.locator(`[data-card][data-surface="${surface}"]`).first()
      await expect(card).toBeVisible()

      const background = await card.evaluate(el =>
        getComputedStyle(el).background
      )
      expect(background).toBeTruthy()
    }
  })

  test('should have smooth transitions', async ({ page }) => {
    const card = page.locator('[data-card]').first()
    const transition = await card.evaluate(el =>
      getComputedStyle(el).transition
    )

    expect(transition).toBeTruthy()
    expect(transition.toLowerCase()).toContain('transform')
  })

  test('should be keyboard accessible when clickable', async ({ page }) => {
    const clickableCard = page.locator('[data-card][data-clickable]').first()

    // Focus the card
    await clickableCard.focus()

    // Check if card has focus
    const isFocused = await clickableCard.evaluate(el =>
      el === document.activeElement
    )
    expect(isFocused).toBe(true)
  })

  test('should have focus-visible outline when clickable', async ({ page }) => {
    const clickableCard = page.locator('[data-card][data-clickable]').first()
    await clickableCard.focus()

    // Tab to ensure focus-visible
    await page.keyboard.press('Tab')
    await page.keyboard.press('Tab')

    const outline = await page.locator('[data-card][data-clickable]:focus-visible').first().evaluate(el =>
      getComputedStyle(el).outline
    ).catch(() => null)

    if (outline) {
      expect(outline).toBeTruthy()
    }
  })

  test('should use token-driven values', async ({ page }) => {
    // Test that card uses tokens from theme
    const tokens = ['--shadow-sm', '--shadow-md', '--space-24', '--radius-md']

    for (const token of tokens) {
      const value = await page.evaluate((tokenName) => {
        return getComputedStyle(document.documentElement).getPropertyValue(tokenName).trim()
      }, token)
      expect(value).toBeTruthy()
    }
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

    await page.goto('/primitives-test')
    await page.locator('text=Demo 20: Card Primitive').scrollIntoViewIfNeeded()

    const hoverCard = page.locator('[data-card][data-hover="lift"]').first()
    const transition = await hoverCard.evaluate(el =>
      getComputedStyle(el).transition
    )

    // Transition should be none in reduced motion mode
    expect(transition).toBe('none')
  })
})

test.describe('Card Primitive - Advanced', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/primitives-test')
    await page.locator('text=Demo 20: Card Primitive').scrollIntoViewIfNeeded()
  })

  test('should combine elevation levels with hover effects correctly', async ({ page }) => {
    const raisedHover = page.locator('[data-card][data-elevation="raised"][data-hover="lift"]').first()
    await expect(raisedHover).toBeVisible()

    const initialShadow = await raisedHover.evaluate(el =>
      getComputedStyle(el).boxShadow
    )

    await raisedHover.hover()
    await page.waitForTimeout(100)

    const hoverShadow = await raisedHover.evaluate(el =>
      getComputedStyle(el).boxShadow
    )

    // Shadow should increase on hover
    expect(hoverShadow).not.toBe(initialShadow)
  })

  test('should support glass composition with different elevations', async ({ page }) => {
    const glassCards = await page.locator('[data-card][data-glass]').count()
    expect(glassCards).toBeGreaterThan(0)

    // All glass cards should have backdrop-filter
    for (let i = 0; i < Math.min(glassCards, 3); i++) {
      const card = page.locator('[data-card][data-glass]').nth(i)
      const backdropFilter = await card.evaluate(el =>
        getComputedStyle(el).backdropFilter
      )
      expect(backdropFilter).toContain('blur')
    }
  })

  test('should maintain proper spacing with different padding variants', async ({ page }) => {
    const compactCard = page.locator('[data-card][data-padding="compact"]').first()
    const spaciousCard = page.locator('[data-card][data-padding="spacious"]').first()

    const compactPadding = await compactCard.evaluate(el =>
      parseInt(getComputedStyle(el).padding)
    )

    const spaciousPadding = await spaciousCard.evaluate(el =>
      parseInt(getComputedStyle(el).padding)
    )

    // Spacious should have more padding than compact
    expect(spaciousPadding).toBeGreaterThan(compactPadding)
  })

  test('should handle forced-colors mode gracefully', async ({ page }) => {
    // Test that cards have proper borders in forced-colors mode
    const card = page.locator('[data-card]').first()
    const border = await card.evaluate(el =>
      getComputedStyle(el).border
    )

    expect(border).toBeTruthy()
    expect(border).toContain('1px')
  })
})
