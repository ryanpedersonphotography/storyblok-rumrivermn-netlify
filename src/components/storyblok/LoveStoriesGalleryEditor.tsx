'use client'

import React from 'react'
import { storyblokEditable } from '@storyblok/react'

interface LoveStoriesGalleryEditorProps {
  blok: any
}

export default function LoveStoriesGalleryEditor({ blok }: LoveStoriesGalleryEditorProps) {
  return (
    <section className="hotfix-love-stories-gallery" {...storyblokEditable(blok)}>
      <div className="hotfix-love-stories-content">
        <div className="hotfix-love-stories-header">
          <div className="hotfix-script-accent">
            {blok.script_accent || 'Real Love Stories'}
          </div>
          <h2 className="hotfix-love-section-title">
            {blok.title || 'Weddings at the Barn'}
          </h2>
          <p className="hotfix-love-lead">
            {blok.description || 'Every celebration tells a unique story of love, laughter, and happily ever after.'}
          </p>
        </div>

        <div className="hotfix-wedding-gallery">
          {(blok.galleries || []).map((gallery: any, index: number) => {
            // Determine which image to use as the cover
            let imageUrl = '/wedding-photos/placeholder.jpg'

            // Check if we should use a gallery photo as cover
            if (
              typeof gallery.cover_image_index === 'number' &&
              gallery.cover_image_index >= 0 &&
              gallery.gallery_photos &&
              gallery.gallery_photos[gallery.cover_image_index]
            ) {
              // Use gallery photo at specified index
              const photo = gallery.gallery_photos[gallery.cover_image_index]
              imageUrl = photo.filename || photo
            } else if (gallery.image) {
              // Fall back to uploaded cover image
              imageUrl = typeof gallery.image === 'string'
                ? gallery.image
                : gallery.image?.filename || '/wedding-photos/placeholder.jpg'
            }

            return (
              <a
                key={gallery._uid || index}
                href={gallery.href || '#'}
                className="hotfix-gallery-item"
                {...storyblokEditable(gallery)}
                data-discover="true"
              >
                <img
                  src={imageUrl}
                  alt={`${gallery.couple_names || 'Wedding'} at Rum River Barn`}
                  width="800"
                  height="800"
                />
                <div className="hotfix-gallery-overlay">
                  <div className="hotfix-gallery-couple-names">
                    {gallery.couple_names || 'Couple Names'}
                  </div>
                  <div className="hotfix-gallery-season">
                    {gallery.season || 'Summer 2024'}
                  </div>
                  <div className="hotfix-gallery-details">
                    {gallery.photo_count || 0} Photos • {gallery.venue || 'Rum River Barn'}
                  </div>
                </div>
              </a>
            )
          })}
        </div>
      </div>
    </section>
  )
}
