'use client'

import React, { useState, useEffect } from 'react'
import { storyblokEditable } from '@storyblok/react'
import WeddingGalleryModal from '../gallery/WeddingGalleryModal'

interface LoveStoriesGalleryEditorProps {
  blok: any
}

export default function LoveStoriesGalleryEditor({ blok }: LoveStoriesGalleryEditorProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedGallery, setSelectedGallery] = useState<any>(null)
  const [weddingStories, setWeddingStories] = useState<Map<string, any>>(new Map())
  const [fetchError, setFetchError] = useState(false)

  // Fetch linked wedding stories
  useEffect(() => {
    const fetchWeddingStories = async () => {
      if (!blok.galleries || blok.galleries.length === 0) {
        return
      }

      // Get unique wedding_story UUIDs from gallery items
      const weddingUUIDs = blok.galleries
        .map((gallery: any) => gallery.wedding_story)
        .filter((uuid: string) => uuid) // Filter out null/undefined

      if (weddingUUIDs.length === 0) {
        console.warn('[LoveStoriesGalleryEditor] No wedding stories linked')
        return
      }

      try {
        const results = await Promise.all(
          weddingUUIDs.map(async (uuid: string) => {
            try {
              const response = await fetch(
                `/api/storyblok-story?uuid=${uuid}&version=draft`
              )

              if (!response.ok) {
                console.warn(`[LoveStoriesGalleryEditor] Failed to fetch wedding ${uuid}:`, response.status)
                return null
              }

              const story = await response.json()
              return { uuid, story }
            } catch (error) {
              console.error(`[LoveStoriesGalleryEditor] Error fetching wedding ${uuid}:`, error)
              return null
            }
          })
        )

        // Create map of UUID -> story
        const storiesMap = new Map()
        results.forEach(result => {
          if (result && result.story) {
            storiesMap.set(result.uuid, result.story)
          }
        })

        setWeddingStories(storiesMap)

        // If no stories fetched successfully, set error
        if (storiesMap.size === 0 && weddingUUIDs.length > 0) {
          setFetchError(true)
          console.error('[LoveStoriesGalleryEditor] Failed to fetch any wedding stories')
        }
      } catch (error) {
        console.error('[LoveStoriesGalleryEditor] Error fetching wedding stories:', error)
        setFetchError(true)
      }
    }

    fetchWeddingStories()
  }, [blok.galleries])

  const openModal = (gallery: any, weddingStory: any) => {
    // Merge gallery overrides with wedding story data
    // Priority: gallery overrides -> wedding story -> graceful defaults
    const weddingData = {
      title: gallery.modal_title || weddingStory?.content?.title || gallery.couple_names || 'Wedding',
      wedding_date: gallery.modal_date || weddingStory?.content?.wedding_date || gallery.season || '',
      location: gallery.modal_location || weddingStory?.content?.location || gallery.venue || '',
      gallery_photos: weddingStory?.content?.gallery_photos || []
    }

    setSelectedGallery(weddingData)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setSelectedGallery(null)
  }

  // Note: Removed section-hiding logic - show cards even if wedding fetch fails
  // Cards will display using gallery_item data, modal opens once weddings load

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
            // Get linked wedding story (if exists)
            const weddingStory = gallery.wedding_story ? weddingStories.get(gallery.wedding_story) : null

            // Don't skip - show card even if wedding not loaded yet
            // Log when wedding story is linked but not available
            if (gallery.wedding_story && !weddingStory) {
              console.warn(`[LoveStoriesGalleryEditor] Wedding story not loaded yet, showing card with gallery data:`, gallery.wedding_story)
            }

            // Determine which image to use as the cover
            // Priority: card_cover_image -> gallery.image -> wedding hero -> wedding first photo -> placeholder
            let imageUrl = '/wedding-photos/placeholder.jpg'

            if (gallery.card_cover_image) {
              // Use custom card cover image (override)
              imageUrl = typeof gallery.card_cover_image === 'string'
                ? gallery.card_cover_image
                : gallery.card_cover_image?.filename || imageUrl
            } else if (gallery.image) {
              // Use original gallery.image field
              imageUrl = typeof gallery.image === 'string'
                ? gallery.image
                : gallery.image?.filename || imageUrl
            } else if (weddingStory?.content?.hero_image) {
              // Fall back to wedding hero image
              imageUrl = typeof weddingStory.content.hero_image === 'string'
                ? weddingStory.content.hero_image
                : weddingStory.content.hero_image?.filename || imageUrl
            } else if (weddingStory?.content?.gallery_photos?.[0]) {
              // Fall back to first gallery photo from wedding
              const firstPhoto = weddingStory.content.gallery_photos[0]
              imageUrl = firstPhoto.filename || firstPhoto || imageUrl
            }

            // Get card display data
            // Priority: card overrides -> wedding story -> gallery fields -> defaults
            const cardTitle = gallery.card_title || weddingStory?.content?.title || gallery.couple_names || 'Couple Names'
            const cardSubtitle = gallery.card_subtitle || weddingStory?.content?.wedding_date || gallery.season || 'Summer 2024'
            const cardLocation = gallery.card_location || weddingStory?.content?.location || gallery.venue || 'Rum River Barn'
            const photoCount = weddingStory?.content?.gallery_photos?.length || gallery.photo_count || 0

            // Determine if modal can open (only if weddingStory has photos)
            const hasPhotos = weddingStory?.content?.gallery_photos?.length > 0
            const canOpenModal = hasPhotos

            return (
              <div
                key={gallery._uid || index}
                className="hotfix-gallery-item"
                onClick={() => {
                  if (canOpenModal) {
                    openModal(gallery, weddingStory)
                  } else {
                    console.warn('[LoveStoriesGalleryEditor] Wedding photos not loaded yet - modal unavailable')
                  }
                }}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    if (canOpenModal) {
                      openModal(gallery, weddingStory)
                    }
                  }
                }}
                {...storyblokEditable(gallery)}
                data-discover="true"
                style={{ cursor: canOpenModal ? 'pointer' : 'default', opacity: canOpenModal ? 1 : 0.9 }}
              >
                <img
                  src={imageUrl}
                  alt={`${cardTitle} at ${cardLocation}`}
                  width="800"
                  height="800"
                />
                <div className="hotfix-gallery-overlay">
                  <div className="hotfix-gallery-couple-names">
                    {cardTitle}
                  </div>
                  <div className="hotfix-gallery-season">
                    {cardSubtitle}
                  </div>
                  <div className="hotfix-gallery-details">
                    {photoCount} Photos {canOpenModal ? '• View Gallery →' : '• Loading...'}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Wedding Gallery Modal */}
      <WeddingGalleryModal
        isOpen={isModalOpen}
        onClose={closeModal}
        wedding={selectedGallery}
        variant="standard"
      />
    </section>
  )
}
