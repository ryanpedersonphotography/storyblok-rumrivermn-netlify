/* BRAND PROOF SECTION - Clean Version
 * Brand logos and social proof quote
 * Dependencies: brand-proof.css
 * Storyblok-compatible with blok prop
 * MIGRATED to unified Section component
 */

'use client'

import { storyblokEditable } from '@storyblok/react'
import type { SbBlokData } from '@storyblok/react'
import Section from '@/components/ui/SectionEnhanced'

interface BrandProofStoryblok extends SbBlokData {
  brands?: string
  quote_text?: string
  highlight_1?: string
  highlight_2?: string
}

export default function BrandProof({ blok }: { blok: BrandProofStoryblok }) {
  // Parse brands from textarea (one per line)
  const brandsList = (blok.brands || 'THE KNOT\nWEDDINGWIRE\nMARTHA STEWART\nMINNESOTA BRIDE')
    .split('\n')
    .filter(brand => brand.trim())

  // Parse quote text and replace placeholders with highlighted spans
  const quoteText = blok.quote_text ||
    'Rum River Barn isn\'t just a venue—it\'s {highlight_1}. Their commitment to saying \'yes\' to every couple\'s vision sets them apart as {highlight_2}.'

  const highlight1 = blok.highlight_1 || 'where dreams come to life'
  const highlight2 = blok.highlight_2 || 'Minnesota\'s most accommodating wedding destination'

  // Replace placeholders with span elements
  const renderQuoteText = () => {
    const parts = quoteText.split(/(\{highlight_1\}|\{highlight_2\})/g)

    return parts.map((part, index) => {
      if (part === '{highlight_1}') {
        return (
          <span key={index} className="highlight">
            {highlight1}
          </span>
        )
      }
      if (part === '{highlight_2}') {
        return (
          <span key={index} className="highlight">
            {highlight2}
          </span>
        )
      }
      return part
    })
  }

  return (
    <Section
      as="section"
      align="center"
      contentWrapper={true}  // Use legacy wrapper for consistent content width
      paddingY="md"
      background="tint-rose"
      className="brand-quote-section"
      data-section="brand-proof"
      data-discover="true"
      contentSlotProps={{
        'data-test-id': 'brand-proof-content',
        'aria-label': 'Brand endorsements and testimonial'
      }}
      {...storyblokEditable(blok)}
    >
      <div className="brand-quote-content">
        {/* Brand Logos Section */}
        <div className="brand-logos">
          {brandsList.map((brand, index) => (
            <span key={index} className="brand-logo">
              {brand.trim()}
            </span>
          ))}
        </div>

        {/* Testimonial Quote with Highlighted Text */}
        <p className="brand-quote-text">
          &ldquo;{renderQuoteText()}&rdquo;
        </p>
      </div>
    </Section>
  )
}
