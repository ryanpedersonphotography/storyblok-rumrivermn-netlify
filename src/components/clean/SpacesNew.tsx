'use client'

import React, { useState } from 'react'
import { storyblokEditable } from '@storyblok/react/rsc'
import type { SbBlokData } from '@storyblok/react/rsc'

interface VenueFeatureStoryblok {
  label?: string
  value?: string
}

interface VenueStoryblok {
  title?: string
  images?: Array<{ filename?: string; alt?: string }>
  description?: string
  features?: VenueFeatureStoryblok[]
}

interface SpacesStoryblok extends SbBlokData {
  title?: string
  subtitle?: string
  description?: string
  barn?: VenueStoryblok
  bridal?: VenueStoryblok
  groom?: VenueStoryblok
  pavilion?: VenueStoryblok
}

export default function SpacesNew({ blok }: { blok: SpacesStoryblok }) {
  const [activeVenue, setActiveVenue] = useState('barn')
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  const defaultVenueData = {
    barn: {
      title: 'The Historic Barn',
      images: [
        '/images/barn-exterior-full-deck-view-evening.jpg',
        '/images/real-weddings/anthony-and-linnea/photos/001.jpg',
        '/images/real-weddings/kyle-carrie/photos/015.jpg'
      ],
      description: 'Our crown jewel, this beautifully restored barn features soaring ceilings, original timber beams, and modern amenities seamlessly integrated into its historic charm.',
      features: [
        { label: 'Capacity', value: 'Up to 300 guests' },
        { label: 'Built', value: '1920s architecture' },
        { label: 'Features', value: 'Climate controlled' },
        { label: 'Style', value: 'Rustic elegance' }
      ]
    },
    bridal: {
      title: 'Bridal Suite',
      images: [
        '/images/real-weddings/emily-and-barron-nixon/photos/020.jpg',
        '/images/real-weddings/mattea-courtney-photo-gallery/photos/015.jpg'
      ],
      description: 'A luxurious private space for the bride and bridal party to prepare for the big day.',
      features: [
        { label: 'Capacity', value: 'Up to 8 people' },
        { label: 'Amenities', value: 'Full mirror, seating' },
        { label: 'Natural Light', value: 'Large windows' },
        { label: 'Privacy', value: 'Separate entrance' }
      ]
    },
    groom: {
      title: "Groom's Quarters",
      images: [
        '/images/real-weddings/joshua-and-teri/photos/008.jpg',
        '/images/real-weddings/anthony-and-linnea/photos/025.jpg'
      ],
      description: 'A comfortable retreat for the groom and groomsmen.',
      features: [
        { label: 'Capacity', value: 'Up to 6 people' },
        { label: 'Atmosphere', value: 'Relaxed and private' },
        { label: 'Amenities', value: 'Comfortable seating' },
        { label: 'Access', value: 'Separate entrance' }
      ]
    },
    pavilion: {
      title: 'Garden Pavilion',
      images: [
        '/images/real-weddings/loria-and-jason-rolstad-agape/photos/010.jpg',
        '/images/real-weddings/kyle-carrie/photos/040.jpg'
      ],
      description: 'An enchanting outdoor space perfect for ceremonies or cocktail hours.',
      features: [
        { label: 'Setting', value: 'Outdoor garden' },
        { label: 'Use', value: 'Ceremonies, cocktails' },
        { label: 'Atmosphere', value: 'Natural beauty' },
        { label: 'Capacity', value: 'Up to 200 guests' }
      ]
    }
  }

  // Merge Storyblok data with defaults
  const venueData = {
    barn: blok.barn || defaultVenueData.barn,
    bridal: blok.bridal || defaultVenueData.bridal,
    groom: blok.groom || defaultVenueData.groom,
    pavilion: blok.pavilion || defaultVenueData.pavilion
  }

  // Convert Storyblok image format to simple string array for compatibility
  const getVenueImages = (venue: VenueStoryblok | typeof defaultVenueData.barn) => {
    if ('images' in venue && Array.isArray(venue.images)) {
      if (venue.images.length > 0 && typeof venue.images[0] === 'object' && 'filename' in venue.images[0]) {
        // Storyblok format
        return venue.images.map(img => img.filename || '')
      }
    }
    // Default format (already strings)
    return venue.images as string[]
  }

  const title = blok.title || 'Discover Our Spaces'
  const subtitle = blok.subtitle || 'Your Perfect Setting'
  const description = blok.description || 'Every corner tells a story, every space creates memories'

  const handleVenueChange = (venue: string) => {
    setActiveVenue(venue)
    setCurrentImageIndex(0)
  }

  const nextImage = () => {
    setCurrentImageIndex((prev) =>
      (prev + 1) % venueData[activeVenue as keyof typeof venueData].images.length
    )
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? venueData[activeVenue as keyof typeof venueData].images.length - 1 : prev - 1
    )
  }

  return (
    <section
      {...storyblokEditable(blok)}
      id="venue"
      className="spaces-section"
      data-discover="true"
      data-section="spaces-new"
    >
      <div className="content-wrapper">
        <div className="section-header">
          <div className="script-accent">
            {subtitle}
          </div>
          <h2 className="section-title">
            {title}
          </h2>
          <p className="lead">
            {description}
          </p>
        </div>

        <div className="venue-tabs">
          {Object.entries(venueData).map(([key, venue]) => (
            <button
              key={key}
              className={`venue-tab ${activeVenue === key ? 'active' : ''}`}
              onClick={() => handleVenueChange(key)}
            >
              {venue.title}
            </button>
          ))}
        </div>

        <div className="spaces-content layout-classic">
          <div className="venue-main-image">
            <img
              src={getVenueImages(venueData[activeVenue as keyof typeof venueData])[currentImageIndex]}
              alt={venueData[activeVenue as keyof typeof venueData].title}
            />
            <button className="carousel-arrow prev" onClick={prevImage}>←</button>
            <button className="carousel-arrow next" onClick={nextImage}>→</button>
          </div>

          <div className="venue-details">
            <h3>{venueData[activeVenue as keyof typeof venueData].title}</h3>
            <p>{venueData[activeVenue as keyof typeof venueData].description}</p>
            <div className="venue-features">
              {venueData[activeVenue as keyof typeof venueData].features.map((feature, index) => (
                <div key={index} className="venue-feature">
                  <h5>{feature.label}</h5>
                  <p>{feature.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
