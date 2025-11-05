/* EXPERIENCE SECTION - Clean Version
 * Two-column layout with feature grid and image
 * Dependencies: experience.css
 * Storyblok-compatible with blok prop
 * MIGRATED to unified Section component
 */

'use client'

import Image from 'next/image'
import { storyblokEditable } from '@storyblok/react'
import type { SbBlokData } from '@storyblok/react'
import { SparklesIcon, HeartIcon, CheckBadgeIcon, HomeModernIcon } from '@heroicons/react/24/outline'
import ExperienceLayout from '@/components/layouts/ExperienceLayout'

interface ExperienceStoryblok extends SbBlokData {
  title?: string
  subtitle?: string
  description?: string
  features?: Array<{
    icon?: string
    title?: string
    description?: string
  }>
  image?: {
    filename?: string
    alt?: string
  }
}

export default function Experience({ blok }: { blok: ExperienceStoryblok }) {
  // Icon mapping
  const iconMap: { [key: string]: React.ComponentType<{ className?: string }> } = {
    sparkles: SparklesIcon,
    home: HomeModernIcon,
    heart: HeartIcon,
    check: CheckBadgeIcon
  }

  // Default fallbacks
  const defaultFeatures = [
    {
      icon: 'sparkles',
      title: 'Natural Beauty',
      description: 'Surrounded by pristine woodlands and the scenic Rum River'
    },
    {
      icon: 'home',
      title: 'Authentic Charm',
      description: 'Rustic elegance that captures the spirit of Minnesota'
    },
    {
      icon: 'heart',
      title: 'Personal Touch',
      description: 'Dedicated team committed to bringing your vision to life'
    },
    {
      icon: 'check',
      title: 'Complete Experience',
      description: 'Everything you need for an unforgettable celebration'
    }
  ]

  const features = blok.features && blok.features.length > 0 ? blok.features : defaultFeatures
  const title = blok.title || 'More Than a Venue'
  const subtitle = blok.subtitle || 'The Rum River Experience'
  const description = blok.description || "At Rum River Barn, we believe your wedding day should be more than just beautiful—it should be unforgettable. Nestled along the banks of the historic Rum River, our venue offers a unique blend of rustic charm and natural elegance that creates the perfect backdrop for your love story."

  return (
    <ExperienceLayout
      {...storyblokEditable(blok)}
      header={{
        scriptAccent: subtitle,
        title: title,
        lead: description
      }}
      // Styling kept in code for consistency
      background="surface"     // Clean, professional
      paddingY="xl"           // Generous spacing
      useContentWrapper={true} // Consistent width
      data-section="experience"
    >
      <div className="experience-container">
        <div className="experience-content">
          <div className="experience-header">
            <p className="experience-script">{subtitle}</p>
            <h2 className="experience-title">{title}</h2>
            <p className="experience-description">{description}</p>
          </div>

          <div className="experience-features">
            {features.map((feature, index) => {
              const IconComponent = iconMap[feature.icon || 'sparkles'] || SparklesIcon
              return (
                <div key={index} className="experience-feature">
                  <div className="feature-icon">
                    <IconComponent className="icon-svg" />
                  </div>
                  <div className="feature-text">
                    <h3 className="feature-title">{feature.title}</h3>
                    <p className="feature-description">{feature.description}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <div className="experience-image">
          <Image
            src={blok.image?.filename || 'https://a.storyblok.com/f/296659/1920x1280/c5c8e1e5c0/placeholder-barn.jpg'}
            alt={blok.image?.alt || 'Rum River Barn Experience'}
            className="experience-img"
            width={960}
            height={640}
            priority
          />
        </div>
      </div>
    </ExperienceLayout>
  )
}
