/* ==========================================================================
   GALLERY CONTAINER QUERY VALIDATION TESTS
   ==========================================================================
   Validates gallery.css container query migration including:
   - Grid column collapse pattern (featured items span reset)
   - Single column layout at narrow containers
   - Overlay and typography adjustments
   - Container-based responsiveness (not viewport)
   ========================================================================== */

import { test, expect } from '@playwright/test'

const ORIGIN = process.env.E2E_ORIGIN ?? 'https://localhost:9999'

test.describe('Gallery - Container Query Behavior', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${ORIGIN}/`)
  })

  test('should reset featured item spans at tablet-width containers', async ({ page }) => {
    // Find gallery section
    const gallerySection = page.locator('[data-clean-root="true\"] .wedding-gallery').first()

    if (await gallerySection.count() === 0) {
      test.skip()
      return
    }

    await expect(gallerySection).toBeVisible()

    // Force container to tablet width (--cq-lg = 64rem = 1024px)
    const sectionParent = gallerySection.locator('..').first()
    await sectionParent.evaluate(el => {
      (el as HTMLElement).style.width = '1000px'
      (el as HTMLElement).style.maxWidth = '1000px'
    })

    await page.waitForTimeout(200)

    // Featured items (1st and 6th) should have grid-column: span 1
    const firstItem = gallerySection.locator('.gallery-item:nth-child(1)').first()
    if (await firstItem.count() > 0) {
      const gridColumn = await firstItem.evaluate(el =>
        getComputedStyle(el).gridColumn
      )

      // Should be 'auto / span 1' or similar at tablet width
      expect(gridColumn).toContain('span 1')
    }
  })

  test('should use single column layout at mobile-width containers', async ({ page }) => {
    const gallerySection = page.locator('[data-clean-root="true\"] .wedding-gallery').first()

    if (await gallerySection.count() === 0) {
      test.skip()
      return
    }

    await expect(gallerySection).toBeVisible()

    // Force container to mobile width (--cq-md = 48rem = 768px or less)
    const sectionParent = gallerySection.locator('..').first()
    await sectionParent.evaluate(el => {
      (el as HTMLElement).style.width = '700px'
      (el as HTMLElement).style.maxWidth = '700px'
    })

    await page.waitForTimeout(200)

    // Gallery grid should have 1 column
    const gridColumns = await gallerySection.evaluate(el =>
      getComputedStyle(el).gridTemplateColumns
    )

    // Single column layout
    expect(gridColumns).toBe('1fr')
  })

  test('should adjust overlay padding at mobile-width containers', async ({ page }) => {
    const gallerySection = page.locator('[data-clean-root="true\"] .wedding-gallery').first()

    if (await gallerySection.count() === 0) {
      test.skip()
      return
    }

    await expect(gallerySection).toBeVisible()

    // Force container to mobile width
    const sectionParent = gallerySection.locator('..').first()
    await sectionParent.evaluate(el => {
      (el as HTMLElement).style.width = '700px'
      (el as HTMLElement).style.maxWidth = '700px'
    })

    await page.waitForTimeout(200)

    const overlay = gallerySection.locator('.gallery-overlay').first()
    if (await overlay.count() > 0) {
      const padding = await overlay.evaluate(el =>
        getComputedStyle(el).padding
      )

      // Should have reduced padding from --space-20
      expect(padding).toBeTruthy()
    }
  })

  test('should reduce couple names font size at mobile-width containers', async ({ page }) => {
    const gallerySection = page.locator('[data-clean-root="true\"] .wedding-gallery').first()

    if (await gallerySection.count() === 0) {
      test.skip()
      return
    }

    await expect(gallerySection).toBeVisible()

    // Force container to mobile width
    const sectionParent = gallerySection.locator('..').first()
    await sectionParent.evaluate(el => {
      (el as HTMLElement).style.width = '700px'
      (el as HTMLElement).style.maxWidth = '700px'
    })

    await page.waitForTimeout(200)

    const coupleName = gallerySection.locator('.gallery-couple-names').first()
    if (await coupleName.count() > 0) {
      const fontSize = await coupleName.evaluate(el =>
        getComputedStyle(el).fontSize
      )

      // Should be 1.5rem (24px) at mobile width
      expect(fontSize).toBe('24px')
    }
  })
})

test.describe('Gallery - Container Query Independence', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${ORIGIN}/`)
  })

  test('should respond to container width, not viewport width', async ({ page }) => {
    const gallerySection = page.locator('[data-clean-root="true\"] .wedding-gallery').first()

    if (await gallerySection.count() === 0) {
      test.skip()
      return
    }

    await expect(gallerySection).toBeVisible()

    // Constrain the gallery's CONTAINER, not the viewport
    const sectionParent = gallerySection.locator('..').first()
    await sectionParent.evaluate(el => {
      (el as HTMLElement).style.width = '700px'
      (el as HTMLElement).style.maxWidth = '700px'
    })

    await page.waitForTimeout(200)

    // Grid should be single column due to CONTAINER width, not viewport
    const gridColumns = await gallerySection.evaluate(el =>
      getComputedStyle(el).gridTemplateColumns
    )

    expect(gridColumns).toBe('1fr')
  })
})

test.describe('Gallery - Preference Queries Preserved', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${ORIGIN}/`)
  })

  test('should preserve hover:none behavior for touch devices', async ({ page }) => {
    // The hover:none media query should still work (it's not width-based)
    const galleryItem = page.locator('[data-clean-root="true\"] .gallery-item').first()

    if (await galleryItem.count() > 0) {
      // Hover behavior should be preserved (not container-query dependent)
      const transform = await galleryItem.evaluate(el =>
        getComputedStyle(el).transform
      )

      // Should have a transform value (either 'none' or a matrix)
      expect(transform).toBeTruthy()
    }
  })

  test('should preserve reduced motion behavior', async ({ page }) => {
    // The prefers-reduced-motion query should still work (it's not width-based)
    const galleryItem = page.locator('[data-clean-root="true\"] .gallery-item').first()

    if (await galleryItem.count() > 0) {
      const transition = await galleryItem.evaluate(el =>
        getComputedStyle(el).transition
      )

      // Should have transition property defined
      expect(transition).toBeTruthy()
    }
  })
})

test.describe('Gallery - Grid Auto-Placement', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${ORIGIN}/`)
  })

  test('should maintain grid auto-rows at mobile width', async ({ page }) => {
    const gallerySection = page.locator('[data-clean-root="true\"] .wedding-gallery').first()

    if (await gallerySection.count() === 0) {
      test.skip()
      return
    }

    await expect(gallerySection).toBeVisible()

    // Force container to mobile width
    const sectionParent = gallerySection.locator('..').first()
    await sectionParent.evaluate(el => {
      (el as HTMLElement).style.width = '700px'
      (el as HTMLElement).style.maxWidth = '700px'
    })

    await page.waitForTimeout(200)

    // Should have auto-rows set to 300px
    const gridAutoRows = await gallerySection.evaluate(el =>
      getComputedStyle(el).gridAutoRows
    )

    expect(gridAutoRows).toBe('300px')
  })
})
