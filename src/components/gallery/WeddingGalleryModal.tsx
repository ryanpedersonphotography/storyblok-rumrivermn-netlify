'use client'

import React, { useEffect } from 'react'
import MasonryGallery from './MasonryGallery'

interface WeddingData {
  title?: string
  wedding_date?: string
  location?: string
  gallery_photos?: Array<{
    filename?: string
    alt?: string
  }>
  testimonial_text?: string
  testimonial_author?: string
}

interface WeddingGalleryModalProps {
  isOpen: boolean
  onClose: () => void
  wedding: WeddingData | null
  // Future customization props (not yet implemented)
  variant?: 'standard' | 'deluxe'
  showTestimonial?: boolean
  testimonialText?: string
  testimonialAuthor?: string
}

export default function WeddingGalleryModal({
  isOpen,
  onClose,
  wedding,
  variant = 'standard', // Future: 'deluxe' will have different layout
  showTestimonial = false, // Future: display testimonial in modal
  testimonialText,
  testimonialAuthor
}: WeddingGalleryModalProps) {
  // Note: variant, showTestimonial, testimonialText, and testimonialAuthor props
  // are prepared for future Phase 2 enhancements but not yet used in rendering.
  // See FUTURE_IDEAS.md for implementation details.

  // Close modal on ESC key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  if (!isOpen || !wedding) return null

  // Prepare gallery images
  const galleryImages = wedding.gallery_photos?.map((photo, index) => ({
    src: photo.filename || photo,
    alt: photo.alt || `${wedding.title || 'Wedding'} photo ${index + 1}`,
    width: 800,
    height: 600
  })) || []

  // If no images, don't show modal
  if (galleryImages.length === 0) return null

  return (
    <>
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-container" onClick={(e) => e.stopPropagation()}>
          {/* Close button */}
          <button className="modal-close" onClick={onClose} aria-label="Close modal">
            ×
          </button>

          {/* Wedding Info Header */}
          <div className="modal-header">
            {wedding.title && (
              <h2 className="wedding-title">{wedding.title}</h2>
            )}
            {(wedding.wedding_date || wedding.location) && (
              <p className="wedding-meta">
                {wedding.wedding_date && <span>{wedding.wedding_date}</span>}
                {wedding.wedding_date && wedding.location && <span className="separator"> • </span>}
                {wedding.location && <span>{wedding.location}</span>}
              </p>
            )}
          </div>

          {/* Gallery */}
          <div className="modal-gallery">
            <MasonryGallery images={galleryImages} columns={3} initialLoad={15} />
          </div>
        </div>
      </div>

      <style jsx>{`
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.85);
          z-index: 9999;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1rem;
          animation: fadeIn 0.2s ease-out;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .modal-container {
          background: white;
          border-radius: 16px;
          max-width: 1400px;
          width: 100%;
          max-height: 90vh;
          overflow-y: auto;
          position: relative;
          animation: slideUp 0.3s ease-out;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        }

        @keyframes slideUp {
          from {
            transform: translateY(20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        .modal-close {
          position: absolute;
          top: 1rem;
          right: 1rem;
          background: rgba(255, 255, 255, 0.9);
          border: none;
          border-radius: 50%;
          width: 40px;
          height: 40px;
          font-size: 2rem;
          line-height: 1;
          cursor: pointer;
          z-index: 10;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #333;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
        }

        .modal-close:hover {
          background: white;
          transform: scale(1.1);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        }

        .modal-header {
          padding: 2rem 2rem 1rem;
          text-align: center;
          border-bottom: 1px solid #e5e5e5;
          background: #f9f9f9;
          border-radius: 16px 16px 0 0;
        }

        .wedding-title {
          font-family: 'Playfair Display', serif;
          font-size: 2rem;
          font-weight: 600;
          color: #333;
          margin: 0 0 0.5rem;
        }

        .wedding-meta {
          font-size: 1rem;
          color: #666;
          margin: 0;
        }

        .separator {
          color: #999;
        }

        .modal-gallery {
          padding: 2rem;
        }

        /* Responsive adjustments */
        @media (max-width: 768px) {
          .modal-container {
            max-height: 95vh;
            border-radius: 12px;
          }

          .modal-header {
            padding: 1.5rem 1rem 0.75rem;
            border-radius: 12px 12px 0 0;
          }

          .wedding-title {
            font-size: 1.5rem;
          }

          .wedding-meta {
            font-size: 0.875rem;
          }

          .modal-gallery {
            padding: 1rem;
          }

          .modal-close {
            width: 36px;
            height: 36px;
            font-size: 1.75rem;
            top: 0.75rem;
            right: 0.75rem;
          }
        }

        /* Smooth scrolling */
        .modal-container {
          scroll-behavior: smooth;
        }

        /* Custom scrollbar for webkit browsers */
        .modal-container::-webkit-scrollbar {
          width: 8px;
        }

        .modal-container::-webkit-scrollbar-track {
          background: #f1f1f1;
        }

        .modal-container::-webkit-scrollbar-thumb {
          background: #888;
          border-radius: 4px;
        }

        .modal-container::-webkit-scrollbar-thumb:hover {
          background: #555;
        }
      `}</style>
    </>
  )
}
