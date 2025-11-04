'use client'
import { MapPinIcon, ClockIcon, PhoneIcon, EnvelopeIcon, HomeIcon, CakeIcon } from '@heroicons/react/24/outline'
import { storyblokEditable } from '@storyblok/react'
import type { SbBlokData } from '@storyblok/react'
import Section from '@/components/ui/SectionEnhanced'

interface LocationStoryblok {
  icon?: string
  title?: string
  description?: string
}

interface MapStoryblok extends SbBlokData {
  title?: string
  subtitle?: string
  description?: string
  locations?: LocationStoryblok[]
  map_embed_url?: string
}

export default function Map({ blok }: { blok: MapStoryblok }) {
  const iconMap: { [key: string]: React.ComponentType<{ className?: string }> } = {
    map: MapPinIcon,
    clock: ClockIcon,
    phone: PhoneIcon,
    email: EnvelopeIcon,
    home: HomeIcon,
    cake: CakeIcon
  }

  const defaultLocations = [
    {
      icon: 'map',
      title: 'Our Location',
      description: '12345 Rum River Road, Princeton, MN 55371'
    },
    {
      icon: 'clock',
      title: 'Tour Hours',
      description: 'Mon-Sat: 10am - 5pm, Sun: By Appointment'
    },
    {
      icon: 'phone',
      title: 'Call Us',
      description: '(763) 555-0123'
    },
    {
      icon: 'email',
      title: 'Email',
      description: 'info@rumriverbarn.com'
    },
    {
      icon: 'home',
      title: 'Indoor & Outdoor',
      description: 'Beautiful spaces for any weather'
    },
    {
      icon: 'cake',
      title: 'Full Catering',
      description: 'Professional kitchen and dining facilities'
    }
  ]

  const locations = blok.locations && blok.locations.length > 0 ? blok.locations : defaultLocations
  const title = blok.title || 'Visit Rum River Barn'
  const subtitle = blok.subtitle || 'Find Us'
  const description = blok.description || 'Located in the heart of Minnesota, easily accessible from the Twin Cities'
  const mapEmbedUrl = blok.map_embed_url || 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2810.5!2d-93.5!3d45.5!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDXCsDMwJzAwLjAiTiA5M8KwMzAnMDAuMCJX!5e0!3m2!1sen!2sus!4v1234567890'

  return (
    <Section
      as="section"
      align="center"
      contentWrapper={true}  // Use enhanced content wrapper for consistent width
      paddingY="lg"
      background="surface"
      header={{
        scriptAccent: subtitle,
        title: title,
        lead: description,
        align: 'center'
      }}
      headerSlotProps={{
        'data-test-id': 'map-header',
        'aria-label': 'Location and contact information'
      }}
      contentSlotProps={{
        'data-test-id': 'map-content',
        style: { position: 'relative' }  // For map overlay positioning
      }}
      className="map-section"
      data-section="map"
      {...storyblokEditable(blok)}
    >
      <div className="map-content-grid">
        {locations.slice(0, 3).map((location, index) => {
          const IconComponent = iconMap[location.icon || 'map'] || MapPinIcon
          return (
            <div key={index} className="location-item">
              <div className="location-icon">
                <IconComponent className="icon" />
              </div>
              <div className="location-text">
                <h4>{location.title}</h4>
                <p>{location.description}</p>
              </div>
            </div>
          );
        })}

        <div className="map-embed">
          <iframe
            src={mapEmbedUrl}
            width="650"
            height="650"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Rum River Barn Location"
          />
        </div>

        {locations.slice(3).map((location, index) => {
          const IconComponent = iconMap[location.icon || 'map'] || MapPinIcon
          return (
            <div key={index + 3} className="location-item">
              <div className="location-icon">
                <IconComponent className="icon" />
              </div>
              <div className="location-text">
                <h4>{location.title}</h4>
                <p>{location.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </Section>
  );
}
