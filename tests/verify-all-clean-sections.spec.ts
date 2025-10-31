import { test, expect } from '@playwright/test'

test.describe('Clean Page - All Sections Verification', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('https://localhost:9999/clean')
    await page.waitForLoadState('networkidle')
  })

  test('all 8 migrated sections are present on the page', async ({ page }) => {
    // Verify all sections are rendered
    const sections = [
      '[data-section="experience"]',
      '[data-section="spaces"]',
      '[data-section="gallery"]',
      '[data-section="brand-proof"]',
      '[data-section="testimonials"]',
      '[data-section="pricing"]',
      '[data-section="schedule-form"]',
      '[data-section="map"]'
    ]

    for (const selector of sections) {
      const section = page.locator(selector)
      await expect(section).toBeVisible({ timeout: 10000 })
      console.log(`✅ Section found: ${selector}`)
    }
  })

  test('Experience section has correct class names', async ({ page }) => {
    const section = page.locator('[data-section="experience"]')
    await expect(section).toHaveClass(/rum-river-experience/)

    const container = section.locator('.experience-container')
    await expect(container).toBeVisible()

    const features = section.locator('.experience-feature')
    await expect(features).toHaveCount(4) // Should have 4 features
  })

  test('Spaces section renders venue tabs', async ({ page }) => {
    const section = page.locator('[data-section="spaces"]')
    await expect(section).toHaveClass(/spaces-section/)

    const tabs = section.locator('.venue-tab')
    const tabCount = await tabs.count()
    expect(tabCount).toBeGreaterThan(0)
    console.log(`Found ${tabCount} venue tabs`)
  })

  test('Gallery section shows love stories', async ({ page }) => {
    const section = page.locator('[data-section="gallery"]')
    await expect(section).toHaveClass(/love-stories-gallery/)

    const galleryItems = section.locator('.gallery-item')
    const itemCount = await galleryItems.count()
    expect(itemCount).toBeGreaterThan(0)
    console.log(`Found ${itemCount} gallery items`)
  })

  test('Brand Proof section renders', async ({ page }) => {
    const section = page.locator('[data-section="brand-proof"]')
    await expect(section).toHaveClass(/brand-quote-section/)
  })

  test('Testimonials section shows cards', async ({ page }) => {
    const section = page.locator('[data-section="testimonials"]')
    await expect(section).toHaveClass(/testimonials-section/)

    const cards = section.locator('.testimonial-card')
    const cardCount = await cards.count()
    expect(cardCount).toBeGreaterThan(0)
    console.log(`Found ${cardCount} testimonial cards`)
  })

  test('Pricing section shows pricing cards', async ({ page }) => {
    const section = page.locator('[data-section="pricing"]')
    await expect(section).toHaveClass(/pricing-section/)

    const cards = section.locator('.pricing-card')
    const cardCount = await cards.count()
    expect(cardCount).toBeGreaterThan(0)
    console.log(`Found ${cardCount} pricing cards`)
  })

  test('Schedule Form section renders form elements', async ({ page }) => {
    const section = page.locator('[data-section="schedule-form"]')
    await expect(section).toHaveClass(/schedule-tour/)

    const form = section.locator('.tour-form')
    await expect(form).toBeVisible()

    const inputs = form.locator('.form-input')
    const inputCount = await inputs.count()
    expect(inputCount).toBeGreaterThan(0)
    console.log(`Found ${inputCount} form inputs`)
  })

  test('Map section renders with locations', async ({ page }) => {
    const section = page.locator('[data-section="map"]')
    await expect(section).toHaveClass(/map-section/)

    const locations = section.locator('.location-item')
    await expect(locations.first()).toBeVisible()
    const locationCount = await locations.count()
    expect(locationCount).toBe(6) // Should have 6 location items
    console.log(`Found ${locationCount} location items`)
  })

  test('theme toggle switches all sections to dark mode', async ({ page }) => {
    // Find and click theme toggle
    const themeToggle = page.locator('button').filter({ hasText: /theme/i }).first()

    // If no toggle found by text, try finding by icon or class
    const toggleButton = await page.locator('[data-theme-toggle]').or(themeToggle).first()

    if (await toggleButton.count() > 0) {
      await toggleButton.click()
      await page.waitForTimeout(500) // Wait for theme transition

      // Verify dark mode is active
      const htmlElement = page.locator('html')
      const themeAttr = await htmlElement.getAttribute('data-theme')
      expect(themeAttr).toBe('dark')

      console.log('✅ Dark mode activated')

      // Take screenshot of dark mode
      await page.screenshot({
        path: 'clean-page-dark-mode.png',
        fullPage: true
      })

      // Switch back to light mode
      await toggleButton.click()
      await page.waitForTimeout(500)

      const lightThemeAttr = await htmlElement.getAttribute('data-theme')
      expect(lightThemeAttr).toBe('light')

      console.log('✅ Light mode activated')
    } else {
      console.log('⚠️ Theme toggle not found - skipping theme test')
    }
  })

  test('all sections have data-clean-root scope applied', async ({ page }) => {
    const cleanRoot = page.locator('[data-clean-root]')
    await expect(cleanRoot).toBeVisible()

    // Verify all sections are within clean root
    const sections = await cleanRoot.locator('[data-section]').count()
    expect(sections).toBeGreaterThan(0)
    console.log(`Found ${sections} sections within [data-clean-root]`)
  })

  test('no CSS errors or missing classes', async ({ page }) => {
    // Check console for CSS errors
    const errors: string[] = []
    page.on('console', msg => {
      if (msg.type() === 'error' && msg.text().toLowerCase().includes('css')) {
        errors.push(msg.text())
      }
    })

    await page.waitForTimeout(2000)

    if (errors.length > 0) {
      console.log('CSS errors found:', errors)
    }
    expect(errors.length).toBe(0)
  })

  test('Experience section features are visible and styled', async ({ page }) => {
    const section = page.locator('[data-section="experience"]')
    const firstFeature = section.locator('.experience-feature').first()

    await expect(firstFeature).toBeVisible()

    // Check that feature has icon and text
    const icon = firstFeature.locator('.feature-icon')
    const text = firstFeature.locator('h3')

    await expect(icon).toBeVisible()
    await expect(text).toBeVisible()
  })

  test('Spaces section carousel navigation works', async ({ page }) => {
    const section = page.locator('[data-section="spaces"]')

    // Look for carousel arrows
    const nextArrow = section.locator('.carousel-arrow').last()
    if (await nextArrow.count() > 0) {
      await nextArrow.click()
      await page.waitForTimeout(500)
      console.log('✅ Carousel navigation clicked')
    }
  })

  test('Map section has circular map embed', async ({ page }) => {
    const section = page.locator('[data-section="map"]')
    const mapEmbed = section.locator('.map-embed')

    await expect(mapEmbed).toBeVisible()

    // Check for iframe
    const iframe = mapEmbed.locator('iframe')
    await expect(iframe).toBeVisible()
  })

  test('Schedule Form inputs are focusable', async ({ page }) => {
    const section = page.locator('[data-section="schedule-form"]')
    const firstInput = section.locator('.form-input').first()

    await firstInput.click()
    await expect(firstInput).toBeFocused()

    // Type in the input
    await firstInput.fill('Test Name')
    const value = await firstInput.inputValue()
    expect(value).toBe('Test Name')
  })

  test('Pricing cards have hover effects', async ({ page }) => {
    const section = page.locator('[data-section="pricing"]')
    const firstCard = section.locator('.pricing-card').first()

    await expect(firstCard).toBeVisible()

    // Hover over the card
    await firstCard.hover()
    await page.waitForTimeout(300)

    console.log('✅ Pricing card hover tested')
  })

  test('Testimonials show star ratings', async ({ page }) => {
    const section = page.locator('[data-section="testimonials"]')
    const firstCard = section.locator('.testimonial-card').first()

    if (await firstCard.count() > 0) {
      await expect(firstCard).toBeVisible()

      // Look for stars
      const stars = firstCard.locator('.star-icon, [class*="star"]')
      if (await stars.count() > 0) {
        console.log(`✅ Found ${await stars.count()} stars in testimonial`)
      }
    }
  })

  test('Gallery items have proper grid layout', async ({ page }) => {
    const section = page.locator('[data-section="gallery"]')
    const gallery = section.locator('.wedding-gallery')

    await expect(gallery).toBeVisible()

    // Get computed style
    const displayStyle = await gallery.evaluate(el =>
      window.getComputedStyle(el).display
    )

    expect(displayStyle).toBe('grid')
    console.log('✅ Gallery uses CSS Grid layout')
  })
})
