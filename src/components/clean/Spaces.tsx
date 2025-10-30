'use client'

import React, { useState } from 'react'

export default function Spaces() {
  const [activeVenue, setActiveVenue] = useState('barn')
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  const venueData = {
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
      id="venue"
      className="spaces"
      data-discover="true"
    >
      <div className="spaces__container">
        <div className="spaces__header">
          <div className="spaces__script-accent">
            Your Perfect Setting
          </div>
          <h2 className="spaces__title">
            Discover Our Spaces
          </h2>
          <p className="spaces__lead">
            Every corner tells a story, every space creates memories
          </p>
        </div>

        <div className="spaces__tabs">
          {Object.entries(venueData).map(([key, venue]) => (
            <button
              key={key}
              className={`spaces__tab ${activeVenue === key ? 'spaces__tab--active' : ''}`}
              onClick={() => handleVenueChange(key)}
            >
              {venue.title}
            </button>
          ))}
        </div>

        <div className="spaces__content spaces__content--layout-classic">
          <div className="spaces__image">
            <img
              src={venueData[activeVenue as keyof typeof venueData].images[currentImageIndex]}
              alt={venueData[activeVenue as keyof typeof venueData].title}
            />
            <button className="spaces__arrow spaces__arrow--prev" onClick={prevImage}>←</button>
            <button className="spaces__arrow spaces__arrow--next" onClick={nextImage}>→</button>
          </div>

          <div className="spaces__details">
            <h3 className="spaces__details-title">{venueData[activeVenue as keyof typeof venueData].title}</h3>
            <p className="spaces__details-description">{venueData[activeVenue as keyof typeof venueData].description}</p>
            <div className="spaces__features">
              {venueData[activeVenue as keyof typeof venueData].features.map((feature, index) => (
                <div key={index} className="spaces__feature">
                  <h5 className="spaces__feature-label">{feature.label}</h5>
                  <p className="spaces__feature-value">{feature.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
