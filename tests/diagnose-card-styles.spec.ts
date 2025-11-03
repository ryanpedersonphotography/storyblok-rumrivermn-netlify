import { test } from '@playwright/test'

test.describe('Card Diagnostic - primitives-migration page', () => {
  test('diagnose card styles and conflicts', async ({ page }) => {
    await page.goto('https://localhost:9999/primitives-migration', {
      waitUntil: 'networkidle'
    })

    // Scroll to the cards section
    await page.locator('[data-recipe="surface-rose"]').first().scrollIntoViewIfNeeded()

    // Get all cards in the first section
    const cards = page.locator('[data-recipe="surface-rose"] [data-card]')
    const cardCount = await cards.count()

    console.log(`\n═══════════════════════════════════════════════════════════`)
    console.log(`Found ${cardCount} cards in Surface Rose section`)
    console.log(`═══════════════════════════════════════════════════════════\n`)

    // Inspect first 3 cards
    for (let i = 0; i < Math.min(cardCount, 3); i++) {
      const card = cards.nth(i)

      const diagnostics = await card.evaluate((el) => {
        const computed = getComputedStyle(el)
        const classList = Array.from(el.classList)
        const dataAttrs = Array.from(el.attributes)
          .filter(attr => attr.name.startsWith('data-'))
          .map(attr => `${attr.name}="${attr.value}"`)

        return {
          classList,
          dataAttrs,
          display: computed.display,
          flexDirection: computed.flexDirection,
          gap: computed.gap,
          padding: computed.padding,
          background: computed.backgroundColor,
          border: computed.border,
          borderRadius: computed.borderRadius,
          boxShadow: computed.boxShadow,
          // Check for conflicting sources
          cardGapVar: computed.getPropertyValue('--card-gap'),
          stackGapVar: computed.getPropertyValue('--stack-gap')
        }
      })

      console.log(`Card ${i + 1}:`)
      console.log(`  Classes: ${diagnostics.classList.join(', ') || 'none'}`)
      console.log(`  Data attrs: ${diagnostics.dataAttrs.join(', ')}`)
      console.log(`  Display: ${diagnostics.display}`)
      console.log(`  Flex direction: ${diagnostics.flexDirection}`)
      console.log(`  Gap: ${diagnostics.gap}`)
      console.log(`  Padding: ${diagnostics.padding}`)
      console.log(`  --card-gap: ${diagnostics.cardGapVar || '(not set)'}`)
      console.log(`  --stack-gap: ${diagnostics.stackGapVar || '(not set)'}`)
      console.log(`  Background: ${diagnostics.background}`)
      console.log(`  Border: ${diagnostics.border}`)
      console.log(`  Border-radius: ${diagnostics.borderRadius}`)
      console.log(`  Box-shadow: ${diagnostics.boxShadow}`)

      // Check children
      const children = await card.locator('> *').all()
      console.log(`  Children count: ${children.length}`)

      for (let j = 0; j < children.length; j++) {
        const child = children[j]
        const childInfo = await child.evaluate((el) => {
          const computed = getComputedStyle(el)
          return {
            tag: el.tagName.toLowerCase(),
            classes: Array.from(el.classList).join(', '),
            dataUI: el.getAttribute('data-ui'),
            display: computed.display,
            margin: computed.margin,
            fontSize: computed.fontSize,
            color: computed.color
          }
        })

        console.log(`    Child ${j + 1}: <${childInfo.tag}> ${childInfo.classes ? `class="${childInfo.classes}"` : ''} ${childInfo.dataUI ? `data-ui="${childInfo.dataUI}"` : ''}`)
        console.log(`      Display: ${childInfo.display}, Margin: ${childInfo.margin}`)
        console.log(`      Font-size: ${childInfo.fontSize}, Color: ${childInfo.color}`)
      }
      console.log(`───────────────────────────────────────────────────────────\n`)
    }

    // Check for CSS layer ordering issues
    const layerInfo = await page.evaluate(() => {
      const sheets = Array.from(document.styleSheets)
      const layeredRules: string[] = []

      sheets.forEach((sheet) => {
        try {
          const rules = Array.from(sheet.cssRules || [])
          rules.forEach((rule) => {
            if (rule.constructor.name === 'CSSLayerBlockRule') {
              layeredRules.push(rule.cssText.substring(0, 100))
            }
          })
        } catch (e) {
          // Cross-origin sheets
        }
      })

      return layeredRules
    })

    console.log(`CSS Layers found:`)
    layerInfo.forEach(layer => console.log(`  ${layer}...`))
    console.log(`\n`)
  })
})
