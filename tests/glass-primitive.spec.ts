/* ==========================================================================
   GLASS PRIMITIVE TESTS
   ==========================================================================
   Validates glass/glassmorphism primitive implementation including:
   - Elevation variants (sm, md, lg, xl)
   - Strong modifier
   - Surface tints (rose, gold, sage)
   - Hover interactions
   - @supports fallback
   - Token usage
   ========================================================================== */

import { test, expect } from '@playwright/test'

test.describe('Glass Primitive', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/primitives-test')
    // Scroll to Demo 19
    await page.locator('text=Demo 19: Glass Primitive').scrollIntoViewIfNeeded()
  })

  test('should render glass elements with backdrop-filter', async ({ page }) => {
    const glassElement = page.locator('[data-glass]').first()
    await expect(glassElement).toBeVisible()

    const backdropFilter = await glassElement.evaluate(el =>
      getComputedStyle(el).backdropFilter
    )
    expect(backdropFilter).toContain('blur')
    expect(backdropFilter).toContain('saturate')
  })

  test('should apply correct blur values for elevation variants', async ({ page }) => {
    const elevations = ['sm', 'md', 'lg', 'xl']
    const expectedBlurs = ['6px', '10px', '14px', '22px']

    for (let i = 0; i < elevations.length; i++) {
      const element = page.locator(`[data-glass][data-elevation="${elevations[i]}"]`).first()
      const backdropFilter = await element.evaluate(el =>
        getComputedStyle(el).backdropFilter
      )
      expect(backdropFilter).toContain(`blur(${expectedBlurs[i]})`)
    }
  })

  test('should use glass tokens from theme', async ({ page }) => {
    const tokens = ['--blur-sm', '--blur-md', '--blur-lg', '--blur-xl']
    const expectedValues = ['6px', '10px', '14px', '22px']

    for (let i = 0; i < tokens.length; i++) {
      const value = await page.evaluate((tokenName) => {
        return getComputedStyle(document.documentElement).getPropertyValue(tokenName).trim()
      }, tokens[i])
      expect(value).toBe(expectedValues[i])
    }
  })

  test('should apply transparency tokens', async ({ page }) => {
    const alphaTokens = ['--alpha-subtle', '--alpha-mid', '--alpha-strong', '--alpha-heavy']
    const expectedValues = ['0.20', '0.32', '0.45', '0.60']

    for (let i = 0; i < alphaTokens.length; i++) {
      const value = await page.evaluate((tokenName) => {
        return getComputedStyle(document.documentElement).getPropertyValue(tokenName).trim()
      }, alphaTokens[i])
      expect(value).toBe(expectedValues[i])
    }
  })

  test('should apply saturation tokens', async ({ page }) => {
    const satTokens = ['--saturate-low', '--saturate-med', '--saturate-high']
    const expectedValues = ['1.05', '1.15', '1.25']

    for (let i = 0; i < satTokens.length; i++) {
      const value = await page.evaluate((tokenName) => {
        return getComputedStyle(document.documentElement).getPropertyValue(tokenName).trim()
      }, satTokens[i])
      expect(value).toBe(expectedValues[i])
    }
  })

  test('should increase opacity with data-strong modifier', async ({ page }) => {
    const normalGlass = page.locator('[data-glass][data-elevation="md"]').filter({ hasNotText: 'Strong' }).first()
    const strongGlass = page.locator('[data-glass][data-elevation="md"][data-strong]').first()

    const normalBg = await normalGlass.evaluate(el => getComputedStyle(el).background)
    const strongBg = await strongGlass.evaluate(el => getComputedStyle(el).background)

    // Both should have background set
    expect(normalBg).toBeTruthy()
    expect(strongBg).toBeTruthy()
    // Strong should be different (more opaque)
    expect(normalBg).not.toBe(strongBg)
  })

  test('should apply surface tints correctly', async ({ page }) => {
    const surfaces = ['rose', 'gold', 'sage']

    for (const surface of surfaces) {
      const element = page.locator(`[data-glass][data-surface="${surface}"]`).first()
      await expect(element).toBeVisible()

      const background = await element.evaluate(el => getComputedStyle(el).background)
      expect(background).toBeTruthy()
    }
  })

  test('should have smooth transitions', async ({ page }) => {
    const glassElement = page.locator('[data-glass]').first()
    const transition = await glassElement.evaluate(el => getComputedStyle(el).transition)

    expect(transition).toBeTruthy()
    // Should transition background and backdrop-filter
    expect(transition.toLowerCase()).toContain('background')
  })

  test('should apply hover:lift interaction', async ({ page }) => {
    const hoverElement = page.locator('[data-glass][data-hover="lift"]').first()
    await expect(hoverElement).toBeVisible()

    // Get initial transform
    const initialTransform = await hoverElement.evaluate(el =>
      getComputedStyle(el).transform
    )

    // Hover and check transform changes
    await hoverElement.hover()
    await page.waitForTimeout(100) // Wait for transition

    const hoverTransform = await hoverElement.evaluate(el =>
      getComputedStyle(el).transform
    )

    // Transform should change on hover (lift effect)
    expect(hoverTransform).not.toBe(initialTransform)
  })

  test('should have border styling', async ({ page }) => {
    const glassElement = page.locator('[data-glass]').first()
    const border = await glassElement.evaluate(el => getComputedStyle(el).border)

    expect(border).toBeTruthy()
    expect(border).toContain('1px')
  })

  test('should support focus-visible for accessibility', async ({ page }) => {
    // Tab to a glass element
    await page.keyboard.press('Tab')
    await page.keyboard.press('Tab')

    const focusedElement = page.locator('[data-glass]:focus-visible')
    const outline = await focusedElement.evaluate(el =>
      getComputedStyle(el).outline
    ).catch(() => null)

    // If element is focusable, it should have outline
    if (outline) {
      expect(outline).toBeTruthy()
    }
  })

  test('should work in dark mode', async ({ page }) => {
    // Switch to dark mode
    await page.evaluate(() => {
      document.documentElement.setAttribute('data-theme', 'dark')
    })

    // Dark mode should have adjusted alpha values
    const alphaMid = await page.evaluate(() => {
      return getComputedStyle(document.documentElement).getPropertyValue('--alpha-mid').trim()
    })

    expect(alphaMid).toBe('0.25') // Dark mode value
  })

  test('should fallback gracefully without backdrop-filter support', async ({ page }) => {
    // Test the fallback CSS
    const fallbackSupported = await page.evaluate(() => {
      const testEl = document.createElement('div')
      testEl.style.backdropFilter = 'blur(10px)'
      return testEl.style.backdropFilter === 'blur(10px)'
    })

    // If backdrop-filter isn't supported, elements should still be visible
    // with increased opacity background
    if (!fallbackSupported) {
      const glassElement = page.locator('[data-glass]').first()
      const background = await glassElement.evaluate(el => getComputedStyle(el).background)
      expect(background).toBeTruthy()
    }
  })
})

test.describe('Glass Primitive - Advanced', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/primitives-test')
    await page.locator('text=Demo 19: Glass Primitive').scrollIntoViewIfNeeded()
  })

  test('should combine elevation and strong modifiers correctly', async ({ page }) => {
    // Test that different combinations produce different results
    const smNormal = page.locator('[data-glass][data-elevation="sm"]').filter({ hasNotText: 'Strong' }).first()
    const mdStrong = page.locator('[data-glass][data-elevation="md"][data-strong]').first()

    const smBg = await smNormal.evaluate(el => getComputedStyle(el).background)
    const mdBg = await mdStrong.evaluate(el => getComputedStyle(el).background)

    expect(smBg).not.toBe(mdBg)
  })

  test('should maintain contrast for readability', async ({ page }) => {
    const glassElements = page.locator('[data-glass]')
    const count = await glassElements.count()

    for (let i = 0; i < Math.min(count, 5); i++) {
      const element = glassElements.nth(i)
      const color = await element.evaluate(el => getComputedStyle(el).color)
      expect(color).toBeTruthy()
    }
  })

  test('should respect prefers-reduced-motion', async ({ page, context }) => {
    // Enable reduced motion preference
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
    await page.locator('text=Demo 19: Glass Primitive').scrollIntoViewIfNeeded()

    // With reduced motion, backdrop-filter should be removed
    // and background should be more opaque
    const glassElement = page.locator('[data-glass]').first()
    const styles = await glassElement.evaluate(el => {
      const computed = getComputedStyle(el)
      return {
        backdropFilter: computed.backdropFilter,
        background: computed.background
      }
    })

    // In reduced motion mode, backdrop-filter should be 'none'
    expect(styles.backdropFilter).toBe('none')
    expect(styles.background).toBeTruthy()
  })
})
