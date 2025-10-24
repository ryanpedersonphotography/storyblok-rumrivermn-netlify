'use client'

import React from 'react'
import { storyblokEditable } from '@storyblok/react'
import { render } from 'storyblok-rich-text-react-renderer'
import MasonryGallery from '../gallery/MasonryGallery'
import FooterEditor from './FooterEditor'

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
      <div className="vendor-item" key={label}>
        <h4 className="vendor-label">{label}</h4>
        <p className="vendor-name">{vendorData.name}</p>
        {vendorData.website && (
          <a href={vendorData.website} target="_blank" rel="noopener noreferrer" className="vendor-link">
            Visit Website →
          </a>
        )}
        {vendorData.phone && <p className="vendor-phone">📞 {vendorData.phone}</p>}
        {vendorData.description && <p className="vendor-description">{vendorData.description}</p>}
      </div>
    )
  }

  const hasVendors = blok.photo_vendor?.[0] || blok.dj_vendor?.[0] || blok.flowers_vendor?.[0] || blok.catering_vendor?.[0]

  // Prepare hero background style
  const heroImage = blok.hero_image?.filename || ''
  const heroStyle: React.CSSProperties = {}
  if (heroImage) {
    heroStyle['--hero-bg' as any] = `url("${heroImage}")`
  }

  return (
    <article className="real-wedding-page" {...storyblokEditable(blok)}>
      {/* Compact Hero Section - matching home page hero but smaller */}
      <section className="hotfix-hero-romantic hotfix-hero-compact" style={heroStyle}>
        <div className="hotfix-hero-content">
          <div className="hotfix-hero-kicker">Real Wedding</div>

          <h1 className="hotfix-hero-title">
            {blok.title}
          </h1>

          {blok.wedding_date && (
            <p className="hotfix-hero-description">
              {blok.wedding_date} • {blok.location || 'Rum River Barn'}
            </p>
          )}
        </div>
      </section>

      {/* Content Section - Matching Home Page Sections */}
      <section className="hotfix-alternating-blocks">
        <div className="hotfix-content-wrapper">
          <div className="wedding-content-grid">
            {/* Intro Text */}
            {blok.intro && (
              <div className="hotfix-section-intro">
                {render(blok.intro)}
              </div>
            )}

            {/* Vendors Sidebar - if present */}
            {hasVendors && (
              <aside className="wedding-vendors-box">
                <h3 className="vendors-title">Wedding Vendors</h3>
                <div className="vendors-list">
                  {renderVendor(blok.photo_vendor, 'Photography')}
                  {renderVendor(blok.dj_vendor, 'DJ & Entertainment')}
                  {renderVendor(blok.flowers_vendor, 'Floral Design')}
                  {renderVendor(blok.catering_vendor, 'Catering')}
                </div>
              </aside>
            )}
          </div>
        </div>
      </section>

      {/* Wedding Gallery Section - Full Width White Background */}
      {galleryPhotos.length > 0 && (
        <section className="hotfix-gallery-fullwidth">
          <div className="hotfix-gallery-content-container">
            <div className="hotfix-gallery-header">
              <h2 className="hotfix-section-title">{galleryPhotos.length} Photos</h2>
            </div>

            <div className="hotfix-masonry-wrapper">
              <MasonryGallery images={galleryPhotos} columns={3} initialLoad={12} />
            </div>
          </div>
        </section>
      )}

      {/* Footer - Using FooterEditor Component */}
      <FooterEditor blok={{
        _uid: 'footer-wedding',
        component: 'footer_section',
        brand_title: 'Rum River Wedding Barn',
        brand_description: "Where dreams come to life along Minnesota's scenic Rum River. Historic charm meets modern elegance for your perfect celebration.",
        address: '42618 78th Street, Hillman, MN 56338',
        phone: '612-801-0546',
        email: 'info@rumriverbarn.com',
        facebook_url: '',
        instagram_url: ''
      }} />

      <style jsx>{`
        .real-wedding-page {
          width: 100%;
        }

        /* Compact Hero - smaller version of home hero */
        :global(.hotfix-hero-compact) {
          min-height: 400px !important;
          height: 50vh !important;
        }

        :global(.hotfix-hero-compact .hotfix-hero-content) {
          padding: 2rem !important;
        }

        :global(.hotfix-hero-compact .hotfix-hero-title) {
          font-size: 3rem !important;
        }

        /* Content Grid - Uses blueprint's .hotfix-content-wrapper for width */
        .wedding-content-grid {
          display: grid;
          grid-template-columns: 1fr 300px;
          gap: 3rem;
          padding: 2rem 0;
        }

        .hotfix-section-intro {
          font-size: 1.125rem;
          line-height: 1.8;
          color: #333;
        }

        .hotfix-section-intro :global(p) {
          margin-bottom: 1rem;
        }

        /* Vendors Box */
        .wedding-vendors-box {
          background: #f9f9f9;
          border: 1px solid #e5e5e5;
          border-radius: 12px;
          padding: 2rem;
          height: fit-content;
          position: sticky;
          top: 2rem;
        }

        .vendors-title {
          font-family: 'Playfair Display', serif;
          font-size: 1.5rem;
          margin-bottom: 1.5rem;
          color: #2c2c2c;
        }

        .vendors-list {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .vendor-item {
          padding-bottom: 1.5rem;
          border-bottom: 1px solid #e5e5e5;
        }

        .vendor-item:last-child {
          border-bottom: none;
          padding-bottom: 0;
        }

        .vendor-label {
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: #8b7355;
          margin-bottom: 0.5rem;
          font-weight: 600;
        }

        .vendor-name {
          font-size: 1.125rem;
          font-weight: 500;
          margin-bottom: 0.5rem;
          color: #2c2c2c;
        }

        .vendor-link {
          display: inline-block;
          color: #8b7355;
          text-decoration: none;
          font-size: 0.875rem;
          margin-bottom: 0.5rem;
          transition: color 0.3s ease;
        }

        .vendor-link:hover {
          color: #6f5d47;
        }

        .vendor-phone {
          font-size: 0.875rem;
          color: #666;
          margin-bottom: 0.25rem;
        }

        .vendor-description {
          font-size: 0.875rem;
          line-height: 1.6;
          color: #555;
        }

        /* Gallery Section - Full Width White Background */
        .hotfix-gallery-fullwidth {
          width: 100%;
          background: #fff;
          padding: 5rem 0;
        }

        .hotfix-gallery-content-container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 2rem;
        }

        .hotfix-gallery-header {
          text-align: left;
          margin-bottom: 2.5rem;
          padding-bottom: 1.5rem;
          border-bottom: 2px solid #e5e5e5;
        }

        .hotfix-section-title {
          font-family: 'Playfair Display', serif;
          font-size: 2rem;
          font-weight: 500;
          color: #2c2c2c;
          margin: 0;
        }

        .hotfix-masonry-wrapper {
          margin-top: 0;
        }

        /* Responsive */
        @media (max-width: 1024px) {
          .wedding-content-grid {
            grid-template-columns: 1fr;
          }

          .wedding-vendors-box {
            position: static;
          }

          .hotfix-gallery-content-container {
            padding: 0 1.5rem;
          }
        }

        @media (max-width: 768px) {
          :global(.hotfix-hero-compact .hotfix-hero-title) {
            font-size: 2rem !important;
          }

          .hotfix-section-title {
            font-size: 1.5rem;
          }

          .hotfix-gallery-fullwidth {
            padding: 3rem 0;
          }

          .hotfix-gallery-content-container {
            padding: 0 1rem;
          }
        }
      `}</style>
    </article>
  )
}
