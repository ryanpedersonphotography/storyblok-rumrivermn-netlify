'use client'

import React from 'react'
import { storyblokEditable } from '@storyblok/react'
import { render } from 'storyblok-rich-text-react-renderer'
import MasonryGallery from '../gallery/MasonryGallery'

interface VendorInfo {
  name?: string
  website?: string
  phone?: string
  description?: string
}

interface RealWeddingEditorProps {
  blok: any
}

export default function RealWeddingEditor({ blok }: RealWeddingEditorProps) {
  // Extract gallery photos from blok
  const galleryPhotos = blok.gallery_photos?.map((photo: any) => ({
    src: photo.filename || photo,
    alt: photo.alt || blok.title,
    width: 800,
    height: 600
  })) || []

  // Helper to render vendor info
  const renderVendor = (vendor: any, label: string) => {
    if (!vendor || !vendor[0]) return null

    const vendorData: VendorInfo = vendor[0]

    if (!vendorData.name) return null

    return (
      <div className="wedding-vendor" key={label}>
        <h4>{label}</h4>
        <p className="vendor-name">{vendorData.name}</p>
        {vendorData.website && (
          <a href={vendorData.website} target="_blank" rel="noopener noreferrer" className="vendor-link">
            Visit Website
          </a>
        )}
        {vendorData.phone && <p className="vendor-phone">{vendorData.phone}</p>}
        {vendorData.description && <p className="vendor-description">{vendorData.description}</p>}
      </div>
    )
  }

  const hasVendors = blok.photo_vendor?.[0] || blok.dj_vendor?.[0] || blok.flowers_vendor?.[0] || blok.catering_vendor?.[0]

  return (
    <article className="real-wedding" {...storyblokEditable(blok)}>
      {/* Hero Section */}
      <section className="wedding-hero">
        {blok.hero_image?.filename && (
          <div className="hero-image-container">
            <img
              src={blok.hero_image.filename}
              alt={`${blok.title} wedding at Rum River Barn`}
              className="hero-image"
            />
          </div>
        )}
        <div className="hero-content">
          <h1 className="wedding-title">{blok.title}</h1>
          {blok.wedding_date && <p className="wedding-date">{blok.wedding_date}</p>}
          {blok.location && <p className="wedding-location">{blok.location}</p>}
        </div>
      </section>

      {/* Wedding Info */}
      <section className="wedding-info">
        <div className="wedding-container">
          <div className="wedding-main">
            {blok.intro && (
              <div className="wedding-intro">
                {render(blok.intro)}
              </div>
            )}

            {/* Photo Gallery */}
            {galleryPhotos.length > 0 && (
              <div className="wedding-gallery-section">
                <h2>Wedding Gallery</h2>
                <MasonryGallery images={galleryPhotos} columns={3} initialLoad={12} />
              </div>
            )}
          </div>

          {/* Sidebar with vendors */}
          {hasVendors && (
            <aside className="wedding-sidebar">
              <h3>Wedding Vendors</h3>
              <div className="wedding-vendors">
                {renderVendor(blok.photo_vendor, 'Photographer')}
                {renderVendor(blok.dj_vendor, 'DJ & Entertainment')}
                {renderVendor(blok.flowers_vendor, 'Florist')}
                {renderVendor(blok.catering_vendor, 'Catering')}
              </div>
            </aside>
          )}
        </div>
      </section>

      <style jsx>{`
        .real-wedding {
          width: 100%;
        }

        .wedding-hero {
          position: relative;
          width: 100%;
          min-height: 500px;
          display: flex;
          align-items: flex-end;
          margin-bottom: 3rem;
        }

        .hero-image-container {
          position: absolute;
          inset: 0;
          z-index: 0;
        }

        .hero-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .hero-content {
          position: relative;
          z-index: 1;
          background: linear-gradient(to top, rgba(0,0,0,0.8), transparent);
          width: 100%;
          padding: 3rem 2rem;
          color: white;
        }

        .wedding-title {
          font-family: 'Playfair Display', serif;
          font-size: 3rem;
          font-weight: 600;
          margin: 0 0 0.5rem 0;
        }

        .wedding-date,
        .wedding-location {
          font-size: 1.125rem;
          margin: 0.25rem 0;
          opacity: 0.9;
        }

        .wedding-info {
          padding: 0 2rem 4rem;
        }

        .wedding-container {
          max-width: 1400px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1fr 350px;
          gap: 3rem;
        }

        .wedding-main {
          min-width: 0;
        }

        .wedding-intro {
          font-size: 1.125rem;
          line-height: 1.8;
          margin-bottom: 3rem;
          color: #333;
        }

        .wedding-intro :global(p) {
          margin-bottom: 1rem;
        }

        .wedding-gallery-section h2 {
          font-family: 'Playfair Display', serif;
          font-size: 2rem;
          margin-bottom: 2rem;
        }

        .wedding-sidebar {
          background: #f9f9f9;
          padding: 2rem;
          border-radius: 12px;
          height: fit-content;
          position: sticky;
          top: 2rem;
        }

        .wedding-sidebar h3 {
          font-family: 'Playfair Display', serif;
          font-size: 1.5rem;
          margin-bottom: 1.5rem;
        }

        .wedding-vendors {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .wedding-vendor h4 {
          font-size: 0.875rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: #666;
          margin-bottom: 0.5rem;
        }

        .vendor-name {
          font-size: 1.125rem;
          font-weight: 500;
          margin-bottom: 0.5rem;
        }

        .vendor-link {
          display: inline-block;
          color: #2563eb;
          text-decoration: none;
          font-size: 0.9rem;
          margin-bottom: 0.25rem;
        }

        .vendor-link:hover {
          text-decoration: underline;
        }

        .vendor-phone {
          font-size: 0.9rem;
          color: #666;
          margin-bottom: 0.25rem;
        }

        .vendor-description {
          font-size: 0.875rem;
          line-height: 1.6;
          color: #555;
        }

        /* Responsive */
        @media (max-width: 1024px) {
          .wedding-container {
            grid-template-columns: 1fr;
          }

          .wedding-sidebar {
            position: static;
          }
        }

        @media (max-width: 768px) {
          .wedding-title {
            font-size: 2rem;
          }

          .hero-content {
            padding: 2rem 1rem;
          }

          .wedding-info {
            padding: 0 1rem 3rem;
          }
        }
      `}</style>
    </article>
  )
}
