'use client'

import React, { useEffect, useState } from 'react'
import { storyblokEditable } from '@storyblok/react'
import Link from 'next/link'

interface FeaturedWeddingsEditorProps {
  blok: any
}

export default function FeaturedWeddingsEditor({ blok }: FeaturedWeddingsEditorProps) {
  const [weddingStories, setWeddingStories] = useState<any[]>([])

  useEffect(() => {
    // Fetch the featured wedding stories
    const fetchWeddings = async () => {
      if (!blok.featured_weddings || blok.featured_weddings.length === 0) {
        return
      }

      try {
        const stories = await Promise.all(
          blok.featured_weddings.map(async (uuid: string) => {
            const response = await fetch(
              `/api/storyblok-story?uuid=${uuid}&version=draft`
            )
            return response.json()
          })
        )
        setWeddingStories(stories.filter(s => s && s.content))
      } catch (error) {
        console.error('Error fetching featured weddings:', error)
      }
    }

    fetchWeddings()
  }, [blok.featured_weddings])

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
            const coverImage = wedding.cover_image?.filename || wedding.hero_image?.filename
            const slug = story.full_slug?.replace('real-weddings/', '') || story.slug

            return (
              <Link
                key={story.uuid || index}
                href={`/real-weddings/${slug}`}
                className="wedding-card"
              >
                {coverImage && (
                  <div className="wedding-image">
                    <img
                      src={coverImage}
                      alt={`${wedding.title} wedding at Rum River Barn`}
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
                </div>
              </Link>
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

        .wedding-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s ease;
        }

        .wedding-card:hover .wedding-image img {
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
