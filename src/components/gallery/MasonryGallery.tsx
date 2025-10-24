'use client'

import React, { useState, useRef, useEffect } from 'react'
import Lightbox from 'yet-another-react-lightbox'
import 'yet-another-react-lightbox/styles.css'

interface MasonryGalleryProps {
  images: Array<{
    src: string
    alt?: string
    width?: number
    height?: number
  }>
  columns?: number
  initialLoad?: number
}

export default function MasonryGallery({
  images,
  columns = 3,
  initialLoad = 12
}: MasonryGalleryProps) {
  const [visibleCount, setVisibleCount] = useState(initialLoad)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(0)
  const loadMoreRef = useRef<HTMLDivElement>(null)

  // Infinite scroll with Intersection Observer
  useEffect(() => {
    if (!loadMoreRef.current) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && visibleCount < images.length) {
          setVisibleCount(prev => Math.min(prev + 12, images.length))
        }
      },
      { threshold: 0.1 }
    )

    observer.observe(loadMoreRef.current)

    return () => observer.disconnect()
  }, [visibleCount, images.length])

  // Organize images into columns for masonry layout
  const visibleImages = images.slice(0, visibleCount)
  const columnArrays: typeof visibleImages[] = Array.from({ length: columns }, () => [])

  visibleImages.forEach((image, index) => {
    columnArrays[index % columns].push(image)
  })

  const openLightbox = (index: number) => {
    setLightboxIndex(index)
    setLightboxOpen(true)
  }

  return (
    <>
      <div className="masonry-gallery">
        {columnArrays.map((column, columnIndex) => (
          <div key={columnIndex} className="masonry-column">
            {column.map((image, imageIndex) => {
              const actualIndex = columnIndex + (imageIndex * columns)
              return (
                <div
                  key={actualIndex}
                  className="masonry-item"
                  onClick={() => openLightbox(actualIndex)}
                >
                  <img
                    src={image.src}
                    alt={image.alt || `Photo ${actualIndex + 1}`}
                    loading="lazy"
                    width={image.width || 800}
                    height={image.height || 600}
                  />
                </div>
              )
            })}
          </div>
        ))}
      </div>

      {/* Sentinel element for infinite scroll */}
      {visibleCount < images.length && (
        <div ref={loadMoreRef} className="masonry-load-more">
          <div className="spinner"></div>
        </div>
      )}

      {/* Lightbox */}
      <Lightbox
        open={lightboxOpen}
        close={() => setLightboxOpen(false)}
        index={lightboxIndex}
        slides={images.map(img => ({ src: img.src, alt: img.alt }))}
        noScroll={{ disabled: true }}
      />

      <style jsx>{`
        .masonry-gallery {
          display: flex;
          gap: 1rem;
          max-width: 100%;
          margin: 0 auto;
        }

        .masonry-column {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .masonry-item {
          cursor: pointer;
          overflow: hidden;
          border-radius: 8px;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          background: #f0f0f0;
        }

        .masonry-item:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
        }

        .masonry-item img {
          width: 100%;
          height: auto;
          display: block;
          transition: transform 0.3s ease;
        }

        .masonry-item:hover img {
          transform: scale(1.05);
        }

        .masonry-load-more {
          text-align: center;
          padding: 2rem;
          min-height: 100px;
        }

        .spinner {
          border: 4px solid rgba(0, 0, 0, 0.1);
          border-left-color: #333;
          border-radius: 50%;
          width: 40px;
          height: 40px;
          animation: spin 1s linear infinite;
          margin: 0 auto;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        /* Responsive: 2 columns on tablet */
        @media (max-width: 1024px) {
          .masonry-gallery {
            gap: 0.75rem;
          }
          .masonry-column {
            gap: 0.75rem;
          }
        }

        /* Responsive: 1 column on mobile */
        @media (max-width: 640px) {
          .masonry-gallery {
            flex-direction: column;
            gap: 0.5rem;
          }
          .masonry-column {
            gap: 0.5rem;
          }
        }
      `}</style>
    </>
  )
}
