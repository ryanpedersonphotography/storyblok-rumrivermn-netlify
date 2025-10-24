'use client'

import React from 'react'
import { storyblokEditable } from '@storyblok/react'

interface AlternatingBlocksEditorProps {
  blok: any
}

export default function AlternatingBlocksEditor({ blok }: AlternatingBlocksEditorProps) {
  // Fallback images to alternate between
  const fallbackImages = [
    '/hotfix-assets/barn-interior-ceiling-beams-lighting.jpg',
    '/hotfix-assets/property-field-wildflowers-natural.jpg',
  ]

  return (
    <section className="hotfix-alternating-blocks" {...storyblokEditable(blok)}>
      <div className="hotfix-content-wrapper">
        <div className="hotfix-section-header">
          <div className="hotfix-script-accent">
            {blok.script_accent || 'Your Perfect Venue'}
          </div>
          <h2 className="hotfix-section-title">
            {blok.title || 'Why Choose Rum River Barn'}
          </h2>
          <p className="hotfix-lead">
            {blok.description || 'Discover what makes our venue the perfect setting for your unforgettable celebration'}
          </p>
        </div>

        <div className="hotfix-blocks-container">
          {(blok.blocks || []).map((block: any, index: number) => {
            // Use alternating fallback images based on index
            const fallbackImage = fallbackImages[index % fallbackImages.length]

            return (
              <div
                key={block._uid || index}
                className={`hotfix-block-item${block.is_reverse ? ' reverse' : ''}`}
                {...storyblokEditable(block)}
              >
                <div className="hotfix-block-content">
                  <div className="hotfix-number">{block.number || `0${index + 1}`}</div>
                  <h3>{block.title || 'Block Title'}</h3>
                  <p className="hotfix-block-lead">{block.lead || 'Block lead text'}</p>
                  {(block.content || []).map((paragraph: any, pIndex: number) => (
                    <p
                      key={paragraph._uid || pIndex}
                      dangerouslySetInnerHTML={{ __html: paragraph.text || String(paragraph) }}
                    />
                  ))}
                </div>
                <div className="hotfix-block-image">
                  <img
                    src={block.image?.filename || block.image || fallbackImage}
                    alt={block.image_alt || 'Venue image'}
                    width="800"
                    height="500"
                  />
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}