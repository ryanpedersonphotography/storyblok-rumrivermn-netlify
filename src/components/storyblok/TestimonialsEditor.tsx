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
  const [weddingStories, setWeddingStories] = useState<any[]>([])
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
                console.warn(`Failed to fetch deluxe wedding with UUID ${uuid}:`, response.status)
                return null
              }

              const data = await response.json()

              if (!data || !data.content) {
                console.warn(`Deluxe wedding ${uuid} has no content`)
                return null
              }

              if (!data.content.title || !data.content.gallery_photos?.length) {
                console.warn(`Deluxe wedding ${uuid} missing title or gallery photos`)
                return null
              }

              return data
            } catch (err) {
              console.warn(`Error fetching deluxe wedding ${uuid}:`, err)
              return null
            }
          })
        )

        const validWeddings = results.filter(s => s !== null)

        if (validWeddings.length === 0 && blok.deluxe_weddings.length > 0) {
          setHasError(true)
          return
        }

        setWeddingStories(validWeddings)
        setHasError(false)
      } catch (error) {
        console.error('Critical error fetching deluxe weddings:', error)
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

  // For deluxe weddings mode, hide section if error or no weddings
  if (useDeluxeWeddingsMode && (hasError || weddingStories.length === 0)) {
    // Fall back to regular testimonials if no deluxe weddings loaded
    if (blok.testimonials && blok.testimonials.length > 0) {
      // Continue to render testimonials below
    } else {
      return null
    }
  }

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
        {useDeluxeWeddingsMode && weddingStories.length > 0 && (
          <div className="hotfix-testimonials-grid">
            {weddingStories.map((story, index) => {
              const wedding = story.content
              const coverImage = wedding.cover_image?.filename || wedding.hero_image?.filename || wedding.gallery_photos?.[0]?.filename
              const avatarUrl = wedding.avatar_image?.filename || coverImage

              return (
                <div
                  key={story.uuid || index}
                  className="hotfix-testimonial-card"
                  onClick={() => openModal(wedding)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      openModal(wedding)
                    }
                  }}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="hotfix-card-underline"></div>
                  <blockquote>
                    &ldquo;{wedding.testimonial_text || 'Click to view wedding gallery...'}&rdquo;
                  </blockquote>

                  <StarRating />

                  <div style={{ paddingTop: '1rem', position: 'relative', zIndex: 1 }}>
                    <div className="hotfix-couple-avatar">
                      {avatarUrl && (
                        <>
                          <img
                            className="hotfix-avatar-image"
                            src={avatarUrl}
                            alt={wedding.title || 'Wedding'}
                          />
                          <div className="hotfix-avatar-overlay"></div>
                        </>
                      )}
                    </div>
                    <div className="hotfix-couple-name">{wedding.title || 'Wedding'}</div>
                    <div className="hotfix-wedding-gallery-cta">View Wedding Gallery →</div>
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
