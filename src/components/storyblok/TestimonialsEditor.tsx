'use client';

import React, { useEffect, useState } from 'react'
import { storyblokEditable } from '@storyblok/react/rsc';
import WeddingGalleryModal from '../gallery/WeddingGalleryModal'

interface TestimonialItemProps {
  _uid: string;
  component: string;
  quote?: string;
  customer_name?: string;
  avatar_image?: any;
  gallery_link?: string;
  cta_text?: string;
  [key: string]: any;
}

interface TestimonialsSectionProps {
  blok: {
    _uid: string;
    component: string;
    script_accent?: string;
    section_title?: string;
    lead_text?: string;
    testimonials?: TestimonialItemProps[];
    deluxe_weddings?: string[]; // UUIDs of deluxe weddings
    [key: string]: any;
  };
}

// 5-star rating component
const StarRating = () => (
  <div className="hotfix-star-rating">
    {[...Array(5)].map((_, i) => (
      <svg key={i} xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="hotfix-star">
        <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z" clipRule="evenodd" />
      </svg>
    ))}
  </div>
);

// Testimonial Item Component (nested block)
export function TestimonialItem({ blok }: { blok: TestimonialItemProps }) {
  const avatarUrl = typeof blok.avatar_image === 'string'
    ? blok.avatar_image
    : blok.avatar_image?.filename || 'https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=300&h=300&fit=crop&crop=face&auto=format&q=80';

  return (
    <a
      href={blok.gallery_link || '/gallery'}
      className="hotfix-testimonial-card"
      {...storyblokEditable(blok)}
    >
      <div className="hotfix-card-underline"></div>
      <blockquote>
        &ldquo;{blok.quote || 'Testimonial quote goes here...'}&rdquo;
      </blockquote>

      <StarRating />

      <div style={{ paddingTop: '1rem', position: 'relative', zIndex: 1 }}>
        <div className="hotfix-couple-avatar">
          <img
            className="hotfix-avatar-image"
            src={avatarUrl}
            alt={blok.customer_name || 'Customer'}
          />
          <div className="hotfix-avatar-overlay"></div>
        </div>
        <div className="hotfix-couple-name">{blok.customer_name || 'Customer Name'}</div>
        <div className="hotfix-wedding-gallery-cta">{blok.cta_text || 'View Their Wedding Gallery'}</div>
      </div>
    </a>
  );
}

// Main Testimonials Section Component
export default function TestimonialsEditor({ blok }: TestimonialsSectionProps) {
  const [weddingStories, setWeddingStories] = useState<Map<string, any>>(new Map())
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedWedding, setSelectedWedding] = useState<any>(null)
  const [hasError, setHasError] = useState(false)

  // Fetch deluxe weddings if deluxe_weddings field is populated
  useEffect(() => {
    const fetchDeluxeWeddings = async () => {
      if (!blok.deluxe_weddings || blok.deluxe_weddings.length === 0) {
        return
      }

      try {
        const results = await Promise.all(
          blok.deluxe_weddings.map(async (uuid: string) => {
            try {
              const response = await fetch(
                `/api/storyblok-story?uuid=${uuid}&version=draft`
              )

              if (!response.ok) {
                console.warn(`[TestimonialsEditor] Failed to fetch deluxe wedding ${uuid}:`, response.status)
                return null
              }

              const data = await response.json()

              if (!data || !data.content) {
                console.warn(`[TestimonialsEditor] Deluxe wedding ${uuid} has no content`)
                return null
              }

              return { uuid, data }
            } catch (err) {
              console.warn(`[TestimonialsEditor] Error fetching deluxe wedding ${uuid}:`, err)
              return null
            }
          })
        )

        // Create map of UUID -> wedding data
        const storiesMap = new Map()
        results.forEach(result => {
          if (result && result.data) {
            storiesMap.set(result.uuid, result.data)
          }
        })

        setWeddingStories(storiesMap)

        // If no stories fetched successfully, set error
        if (storiesMap.size === 0 && blok.deluxe_weddings.length > 0) {
          setHasError(true)
          console.error('[TestimonialsEditor] Failed to fetch any deluxe wedding stories')
        } else {
          setHasError(false)
        }
      } catch (error) {
        console.error('[TestimonialsEditor] Critical error fetching deluxe weddings:', error)
        setHasError(true)
      }
    }

    fetchDeluxeWeddings()
  }, [blok.deluxe_weddings])

  const openModal = (wedding: any) => {
    setSelectedWedding(wedding)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setSelectedWedding(null)
  }

  // If using deluxe weddings modal system
  const useDeluxeWeddingsMode = blok.deluxe_weddings && blok.deluxe_weddings.length > 0

  // Note: Removed section-hiding logic - show cards even if wedding fetch fails
  // Cards will display using deluxe_weddings UUIDs, modal opens once weddings load

  return (
    <section
      className="hotfix-social-proof"
      {...storyblokEditable(blok)}
      data-discover="true"
    >
      <div className="hotfix-social-proof-content">
        <div className="hotfix-social-proof-header">
          <div className="hotfix-script-accent">{blok.script_accent || 'Love Letters'}</div>
          <h2 className="hotfix-social-section-title">{blok.section_title || 'What Couples Say'}</h2>
          <p className="hotfix-social-lead">
            {blok.lead_text || 'Real stories from real couples who celebrated at Rum River Barn'}
          </p>
        </div>

        {/* Deluxe Weddings Mode: Show wedding cards with modal */}
        {useDeluxeWeddingsMode && (
          <div className="hotfix-testimonials-grid">
            {blok.deluxe_weddings.map((uuid: string, index: number) => {
              // Get wedding data from map (if loaded)
              const story = weddingStories.get(uuid)
              const wedding = story?.content

              // Don't skip - show card even if wedding not loaded yet
              if (uuid && !wedding) {
                console.warn(`[TestimonialsEditor] Deluxe wedding not loaded yet, showing placeholder card:`, uuid)
              }

              // Get display data (with fallbacks)
              const coverImage = wedding?.cover_image?.filename || wedding?.hero_image?.filename || wedding?.gallery_photos?.[0]?.filename
              const avatarUrl = wedding?.avatar_image?.filename || coverImage
              const testimonialText = wedding?.testimonial_text || 'Celebrating love at Rum River Barn...'
              const title = wedding?.title || 'Wedding'

              // Determine if modal can open (if UUID exists, even without photos)
              const hasPhotos = wedding?.gallery_photos?.length > 0
              const hasWeddingUuid = Boolean(uuid)
              const canOpenModal = hasWeddingUuid  // Allow opening if UUID exists

              return (
                <div
                  key={uuid || index}
                  className="hotfix-testimonial-card"
                  onClick={() => {
                    if (canOpenModal) {
                      openModal(wedding)
                    } else {
                      console.warn('[TestimonialsEditor] Wedding photos not loaded yet - modal unavailable')
                    }
                  }}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      if (canOpenModal) {
                        openModal(wedding)
                      }
                    }
                  }}
                  style={{ cursor: canOpenModal ? 'pointer' : 'default', opacity: canOpenModal ? 1 : 0.9 }}
                >
                  <div className="hotfix-card-underline"></div>
                  <blockquote>
                    &ldquo;{testimonialText}&rdquo;
                  </blockquote>

                  <StarRating />

                  <div style={{ paddingTop: '1rem', position: 'relative', zIndex: 1 }}>
                    <div className="hotfix-couple-avatar">
                      {avatarUrl && (
                        <>
                          <img
                            className="hotfix-avatar-image"
                            src={avatarUrl}
                            alt={title}
                          />
                          <div className="hotfix-avatar-overlay"></div>
                        </>
                      )}
                    </div>
                    <div className="hotfix-couple-name">{title}</div>
                    <div className="hotfix-wedding-gallery-cta">
                      {wedding && 'View Wedding Gallery →'}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Regular Testimonials Mode: Show old testimonial cards */}
        {!useDeluxeWeddingsMode && blok.testimonials && (
          <div className="hotfix-testimonials-grid">
            {blok.testimonials.map((testimonial) => (
              <TestimonialItem blok={testimonial} key={testimonial._uid} />
            ))}
          </div>
        )}
      </div>

      {/* Wedding Gallery Modal */}
      {useDeluxeWeddingsMode && (
        <WeddingGalleryModal
          isOpen={isModalOpen}
          onClose={closeModal}
          wedding={selectedWedding}
          variant="deluxe"
        />
      )}
    </section>
  );
}
