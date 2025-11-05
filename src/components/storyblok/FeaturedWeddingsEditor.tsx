'use client'

import React, { useEffect, useState } from 'react'
import { storyblokEditable } from '@storyblok/react'
import Image from 'next/image'
import Link from 'next/link'
import WeddingGalleryModal from '../gallery/WeddingGalleryModal'

interface FeaturedWeddingsEditorProps {
  blok: any
}

export default function FeaturedWeddingsEditor({ blok }: FeaturedWeddingsEditorProps) {
  const [weddingStories, setWeddingStories] = useState<any[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedWedding, setSelectedWedding] = useState<any>(null)
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    // Fetch the featured wedding stories
    const fetchWeddings = async () => {
      if (!blok.featured_weddings || blok.featured_weddings.length === 0) {
        return
      }

      try {
        const results = await Promise.all(
          blok.featured_weddings.map(async (uuid: string) => {
            try {
              const response = await fetch(
                `/api/storyblok-story?uuid=${uuid}&version=draft`
              )

              // Handle individual wedding fetch errors
              if (!response.ok) {
                console.warn(`Failed to fetch wedding with UUID ${uuid}:`, response.status)
                return null
              }

              const data = await response.json()

              // Validate wedding has required data
              if (!data || !data.content) {
                console.warn(`Wedding ${uuid} has no content`)
                return null
              }

              // Validate has title and images
              if (!data.content.title || !data.content.gallery_photos?.length) {
                console.warn(`Wedding ${uuid} missing title or gallery photos`)
                return null
              }

              return data
            } catch (err) {
              // Individual wedding error - log but don't fail entire section
              console.warn(`Error fetching wedding ${uuid}:`, err)
              return null
            }
          })
        )

        // Filter out failed weddings
        const validWeddings = results.filter(s => s !== null)

        // If ALL weddings failed to load, this is a severe error
        if (validWeddings.length === 0 && blok.featured_weddings.length > 0) {
          setHasError(true)
          return
        }

        setWeddingStories(validWeddings)
        setHasError(false)
      } catch (error) {
        // Severe error (API endpoint unreachable, auth failure, etc.)
        console.error('Critical error fetching featured weddings:', error)
        setHasError(true)
      }
    }

    fetchWeddings()
  }, [blok.featured_weddings])

  const openModal = (wedding: any) => {
    setSelectedWedding(wedding)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    // Force unlock body scroll BEFORE unmounting modal
    document.body.style.overflow = ''
    setIsModalOpen(false)
    setSelectedWedding(null)
  }

  // Hide entire section if severe error or no valid weddings
  if (hasError || weddingStories.length === 0) {
    return null
  }

  return (
    <section className="featured-weddings" {...storyblokEditable(blok)}>
      <div className="featured-weddings-content">
        <div className="featured-weddings-header">
          <div className="script-accent">
            {blok.script_accent || 'Love Stories'}
          </div>
          <h2 className="section-title">
            {blok.section_title || 'Real Weddings at the Barn'}
          </h2>
          {blok.section_description && (
            <p className="section-description">{blok.section_description}</p>
          )}
        </div>

        <div className="weddings-grid">
          {weddingStories.map((story, index) => {
            const wedding = story.content
            const coverImage = wedding.cover_image?.filename || wedding.hero_image?.filename || wedding.gallery_photos?.[0]?.filename

            return (
              <div
                key={story.uuid || index}
                className="wedding-card"
                onClick={() => openModal(wedding)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    openModal(wedding)
                  }
                }}
              >
                {coverImage && (
                  <div className="wedding-image">
                    <Image
                      src={coverImage}
                      alt={`${wedding.title} wedding at Rum River Barn`}
                      fill
                      sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                      loading="lazy"
                    />
                  </div>
                )}
                <div className="wedding-overlay">
                  <div className="wedding-couple-names">
                    {wedding.title}
                  </div>
                  {wedding.wedding_date && (
                    <div className="wedding-date">{wedding.wedding_date}</div>
                  )}
                  {wedding.location && (
                    <div className="wedding-location">{wedding.location}</div>
                  )}
                  <div className="view-gallery-hint">View Gallery →</div>
                </div>
              </div>
            )
          })}
        </div>

        {blok.cta_text && blok.cta_url && (
          <div className="featured-weddings-cta">
            <Link href={blok.cta_url} className="cta-button">
              {blok.cta_text}
            </Link>
          </div>
        )}
      </div>

      {/* Wedding Gallery Modal */}
      <WeddingGalleryModal
        isOpen={isModalOpen}
        onClose={closeModal}
        wedding={selectedWedding}
      />

      <style jsx>{`
        .featured-weddings {
          padding: 4rem 2rem;
          background: #f9f9f9;
        }

        .featured-weddings-content {
          max-width: 1400px;
          margin: 0 auto;
        }

        .featured-weddings-header {
          text-align: center;
          margin-bottom: 3rem;
        }

        .script-accent {
          font-family: 'Dancing Script', cursive;
          font-size: 1.5rem;
          color: #8b7355;
          margin-bottom: 0.5rem;
        }

        .section-title {
          font-family: 'Playfair Display', serif;
          font-size: 2.5rem;
          font-weight: 600;
          margin-bottom: 1rem;
        }

        .section-description {
          font-size: 1.125rem;
          color: #666;
          max-width: 700px;
          margin: 0 auto;
        }

        .weddings-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.5rem;
          margin-bottom: 3rem;
        }

        .wedding-card {
          position: relative;
          aspect-ratio: 4/5;
          border-radius: 12px;
          overflow: hidden;
          cursor: pointer;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          text-decoration: none;
        }

        .wedding-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
        }

        .wedding-image {
          position: absolute;
          inset: 0;
        }

        .wedding-image :global(img) {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s ease;
        }

        .wedding-card:hover .wedding-image :global(img) {
          transform: scale(1.05);
        }

        .wedding-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(0,0,0,0.8), transparent);
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          padding: 1.5rem;
          color: white;
        }

        .wedding-couple-names {
          font-family: 'Playfair Display', serif;
          font-size: 1.5rem;
          font-weight: 600;
          margin-bottom: 0.25rem;
        }

        .wedding-date,
        .wedding-location {
          font-size: 0.9rem;
          opacity: 0.9;
        }

        .view-gallery-hint {
          font-size: 0.85rem;
          margin-top: 0.5rem;
          opacity: 0.8;
          font-weight: 500;
          transition: opacity 0.3s ease;
        }

        .wedding-card:hover .view-gallery-hint {
          opacity: 1;
        }

        .featured-weddings-cta {
          text-align: center;
        }

        .cta-button {
          display: inline-block;
          padding: 1rem 2.5rem;
          background: #8b7355;
          color: white;
          text-decoration: none;
          border-radius: 8px;
          font-weight: 500;
          transition: background 0.3s ease;
        }

        .cta-button:hover {
          background: #6f5d47;
        }

        /* Responsive: 2 columns on tablet */
        @media (max-width: 1024px) {
          .weddings-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        /* Responsive: 1 column on mobile */
        @media (max-width: 640px) {
          .featured-weddings {
            padding: 3rem 1rem;
          }

          .section-title {
            font-size: 2rem;
          }

          .weddings-grid {
            grid-template-columns: 1fr;
            gap: 1rem;
          }

          .wedding-couple-names {
            font-size: 1.25rem;
          }
        }
      `}</style>
    </section>
  )
}
