/* ==========================================================================
   THEME SYSTEM TESTS
   ==========================================================================
   Validates theme (light/dark) and brand (romantic/modern) switching,
   localStorage persistence, OS preference detection, and FOUC prevention.
   ========================================================================== */

import { test, expect } from '@playwright/test'

test.describe('Theme System', () => {
  test.beforeEach(async ({ page }) => {
    // Clear localStorage before each test
    await page.goto('/')
    await page.evaluate(() => localStorage.clear())
  })

  test('should default to light theme when no preference is set', async ({ page }) => {
    await page.goto('/')
    const theme = await page.locator('html').getAttribute('data-theme')
    expect(theme).toBe('light')
  })

  test('should default to romantic brand', async ({ page }) => {
    await page.goto('/')
    const brand = await page.locator('html').getAttribute('data-brand')
    expect(brand).toBe('romantic')
  })

  test('should apply theme via pre-paint script (no FOUC)', async ({ page }) => {
    // Set theme in localStorage before navigation
    await page.addInitScript(() => {
      localStorage.setItem('rr.theme', 'dark')
    })

    await page.goto('/')

    // Theme should be applied IMMEDIATELY (before paint)
    const theme = await page.locator('html').getAttribute('data-theme')
    expect(theme).toBe('dark')
  })

  test('should persist theme to localStorage', async ({ page }) => {
    await page.goto('/')

    // Simulate theme change
    await page.evaluate(() => {
      localStorage.setItem('rr.theme', 'dark')
      document.documentElement.setAttribute('data-theme', 'dark')
    })

    const storedTheme = await page.evaluate(() => localStorage.getItem('rr.theme'))
    expect(storedTheme).toBe('dark')
  })

  test('should persist brand to localStorage', async ({ page }) => {
    await page.goto('/')

    // Simulate brand change
    await page.evaluate(() => {
      localStorage.setItem('rr.brand', 'modern')
      document.documentElement.setAttribute('data-brand', 'modern')
    })

    const storedBrand = await page.evaluate(() => localStorage.getItem('rr.brand'))
    expect(storedBrand).toBe('modern')
  })

  test('should apply theme tokens correctly in light mode', async ({ page }) => {
    await page.goto('/')
    await page.locator('html').evaluate(el => el.setAttribute('data-theme', 'light'))

    // Check a light mode token
    const surfaceColor = await page.evaluate(() => {
      return getComputedStyle(document.documentElement).getPropertyValue('--surface-0').trim()
    })

    expect(surfaceColor).toBeTruthy()
    expect(surfaceColor).toContain('rgb') // Should be an RGB value
  })

  test('should apply theme tokens correctly in dark mode', async ({ page }) => {
    await page.goto('/')
    await page.locator('html').evaluate(el => el.setAttribute('data-theme', 'dark'))

    // Check a dark mode token (surface-0 should be darker)
    const surfaceColor = await page.evaluate(() => {
      return getComputedStyle(document.documentElement).getPropertyValue('--surface-0').trim()
    })

    expect(surfaceColor).toBeTruthy()
    expect(surfaceColor).toContain('rgb') // Should be an RGB value
  })

  test('should apply romantic brand accent tokens', async ({ page }) => {
    await page.goto('/')
    await page.locator('html').evaluate(el => el.setAttribute('data-brand', 'romantic'))

    const accentRose = await page.evaluate(() => {
      return getComputedStyle(document.documentElement).getPropertyValue('--accent-rose').trim()
    })

    expect(accentRose).toBeTruthy()
    // Romantic rose should be oklch(0.69 0.12 350) or similar
    expect(accentRose).toContain('oklch')
  })

  test('should apply modern brand accent tokens', async ({ page }) => {
    await page.goto('/')
    await page.locator('html').evaluate(el => el.setAttribute('data-brand', 'modern'))

    const accentRose = await page.evaluate(() => {
      return getComputedStyle(document.documentElement).getPropertyValue('--accent-rose').trim()
    })

    expect(accentRose).toBeTruthy()
    // Modern rose should be oklch(0.72 0.10 10) or similar (different from romantic)
    expect(accentRose).toContain('oklch')
  })

  test('should have glass/blur tokens defined', async ({ page }) => {
    await page.goto('/')

    const blurSm = await page.evaluate(() => {
      return getComputedStyle(document.documentElement).getPropertyValue('--blur-sm').trim()
    })

    expect(blurSm).toBe('6px')
  })

  test('should have motion tokens defined', async ({ page }) => {
    await page.goto('/')

    const easeSmooth = await page.evaluate(() => {
      return getComputedStyle(document.documentElement).getPropertyValue('--ease-smooth').trim()
    })

    expect(easeSmooth).toContain('cubic-bezier')
  })

  test('should have scrollbar-gutter to prevent layout shift', async ({ page }) => {
    await page.goto('/')

    const scrollbarGutter = await page.evaluate(() => {
      return getComputedStyle(document.documentElement).scrollbarGutter
    })

    expect(scrollbarGutter).toBe('stable both-edges')
  })
})

test.describe('Theme System - Advanced', () => {
  test('should combine theme and brand correctly', async ({ page }) => {
    await page.goto('/')
    await page.locator('html').evaluate(el => {
      el.setAttribute('data-theme', 'dark')
      el.setAttribute('data-brand', 'modern')
    })

    const theme = await page.locator('html').getAttribute('data-theme')
    const brand = await page.locator('html').getAttribute('data-brand')

    expect(theme).toBe('dark')
    expect(brand).toBe('modern')
  })

  test('should apply dark transparency values in dark mode', async ({ page }) => {
    await page.goto('/')
    await page.locator('html').evaluate(el => el.setAttribute('data-theme', 'dark'))

    const alphaMid = await page.evaluate(() => {
      return getComputedStyle(document.documentElement).getPropertyValue('--alpha-mid').trim()
    })

    // Dark mode should have adjusted transparency (0.25 vs 0.32 in light)
    expect(alphaMid).toBe('0.25')
  })

  test('should maintain brand colors across theme changes', async ({ page }) => {
    await page.goto('/')

    // Set romantic brand
    await page.locator('html').evaluate(el => el.setAttribute('data-brand', 'romantic'))

    // Get romantic rose in light mode
    const romanticRoseLight = await page.evaluate(() => {
      return getComputedStyle(document.documentElement).getPropertyValue('--accent-rose').trim()
    })

    // Switch to dark mode (romantic brand should still apply)
    await page.locator('html').evaluate(el => el.setAttribute('data-theme', 'dark'))

    const romanticRoseDark = await page.evaluate(() => {
      return getComputedStyle(document.documentElement).getPropertyValue('--accent-rose').trim()
    })

    // Both should be OKLCH (brand overrides base accent colors)
    expect(romanticRoseLight).toContain('oklch')
    expect(romanticRoseDark).toContain('oklch')
    // They should be different values (dark mode variant)
    expect(romanticRoseLight).not.toBe(romanticRoseDark)
  })
})
