'use client'

import Image from 'next/image'
import React from 'react'
import { storyblokEditable } from '@storyblok/react/rsc'
import Section from '@/components/ui/SectionEnhanced'

interface AlternatingBlocksBlok {
  _uid?: string
  component?: string
  script_accent?: string
  title?: string
  description?: string
  background_variant?: 'surface' | 'tint-rose' | 'tint-sage' | 'dark-gradient'
  theme_override?: 'auto' | 'light' | 'dark'
  padding_size?: 'sm' | 'md' | 'lg' | 'xl' | 'fluid'
  blocks?: Array<{
    _uid?: string
    number?: string
    title?: string
    lead?: string
    content?: Array<{ text?: string } | string>
    image?: { filename?: string } | string
    image_alt?: string
    is_reverse?: boolean
  }>
  [key: string]: any
}

export default function AlternatingBlocks({ blok }: { blok: AlternatingBlocksBlok }) {
  // Fallback images to alternate between
  const fallbackImages = [
    '/images/barn-interior-ceiling-beams-lighting.jpg',
    '/images/property-field-wildflowers-natural.jpg',
  ]

  // Get styling from Storyblok or use defaults
  const backgroundVariant = blok.background_variant || 'tint-rose'
  const themeOverride = blok.theme_override || 'auto'
  const paddingSize = blok.padding_size || 'fluid'

  // Keep anchor targets clear of the fixed navbar when linking into this section.
  const headerSlotProps: React.HTMLAttributes<HTMLElement> & { 'data-testid': string } = {
    'data-testid': 'alternating-blocks-header',
    style: { scrollMarginTop: '96px' }
  }

  return (
    <Section
      align="center"
      contentWrapper={true}  // Use enhanced content wrapper
      background={backgroundVariant}
      tone={themeOverride}
      paddingY={paddingSize}
      divider="thread-gold"
      variant={[
        'alternating-blocks-luxe',  // Additional styling
        'header-center-wide',         // Remove max-width constraint on header
        'lead-full-width',            // Remove 48ch constraint on lead text
        'box-sizing-content'          // Override box-sizing if needed
      ]}
      header={{
        scriptAccent: blok.script_accent || 'Your Perfect Venue',
        title: blok.title || 'Why Choose Rum River Barn',
        lead: blok.description || 'Discover what makes our venue the perfect setting for your unforgettable celebration',
        align: 'center'
      }}
      headerSlotProps={headerSlotProps}
      className="alternating-blocks"
      data-section="alternating-blocks"
      {...storyblokEditable(blok)}
    >
      <div className="alternating-blocks__container">
        {(blok.blocks || []).map((block, index) => {
          // Use alternating fallback images based on index
          const fallbackImage = fallbackImages[index % fallbackImages.length]

          // Handle image field - could be Storyblok asset object, string, or empty
          const imageUrl = typeof block.image === 'object' && block.image?.filename
            ? block.image.filename
            : typeof block.image === 'string' && block.image.trim() !== ''
            ? block.image
            : fallbackImage

          return (
            <div
              key={block._uid || index}
              className={`alternating-blocks__item${block.is_reverse ? ' alternating-blocks__item--reverse' : ''}`}
              {...(block._uid ? storyblokEditable(block) : {})}
            >
              <div className="alternating-blocks__content">
                <div className="alternating-blocks__number">
                  {block.number || `0${index + 1}`}
                </div>
                <h3 className="alternating-blocks__title">
                  {block.title || 'Block Title'}
                </h3>
                <p className="alternating-blocks__lead">
                  {block.lead || 'Block lead text'}
                </p>
                {(block.content || []).map((paragraph, pIndex) => {
                  const text = typeof paragraph === 'object' && paragraph.text
                    ? paragraph.text
                    : String(paragraph)

                  return (
                    <p
                      key={pIndex}
                      className="alternating-blocks__paragraph"
                      dangerouslySetInnerHTML={{ __html: text }}
                    />
                  )
                })}
              </div>
              <div className="alternating-blocks__image">
                <Image
                  src={imageUrl}
                  alt={block.image_alt || 'Venue image'}
                  width={800}
                  height={500}
                  sizes="(min-width: 1024px) 40vw, (min-width: 768px) 60vw, 90vw"
                />
              </div>
            </div>
          )
        })}
      </div>
    </Section>
  )
}
