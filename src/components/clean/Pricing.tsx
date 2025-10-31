'use client'
import { storyblokEditable } from '@storyblok/react'
import type { SbBlokData } from '@storyblok/react'
import { Check, Calendar, Star } from 'lucide-react'

interface PricingTierStoryblok extends SbBlokData {
  name?: string
  label?: string
  price?: string
  weekday_price?: string
  is_popular?: boolean
  features?: string[]
  cta_url?: string
  tour_url?: string
}

interface PricingStoryblok extends SbBlokData {
  script_accent?: string
  title?: string
  hero_line?: string
  description?: string
  tiers?: PricingTierStoryblok[]
}

export default function Pricing({ blok }: { blok: PricingStoryblok }) {
  const defaultTiers: PricingTierStoryblok[] = [
    {
      name: 'Essentials',
      label: 'Perfect Start',
      price: '$4,500',
      weekday_price: '$3,800',
      is_popular: false,
      features: [
        'Venue rental for 8 hours',
        'Tables, chairs & linens included',
        'Setup & breakdown service',
        'On-site coordination',
        'Bridal suite access',
        'Sound system & microphones',
        'Basic lighting package'
      ],
      cta_url: '#schedule',
      tour_url: '#contact'
    },
    {
      name: 'Celebration',
      label: 'Most Popular',
      price: '$6,200',
      weekday_price: '$5,500',
      is_popular: true,
      features: [
        'Everything in Essentials',
        'Extended 10-hour venue rental',
        'Upgraded lighting & ambiance',
        "Groom's quarters access",
        'Complimentary rehearsal',
        'Premium bar setup included',
        'Vendor coordination service',
        'Late-night snack station'
      ],
      cta_url: '#schedule',
      tour_url: '#contact'
    },
    {
      name: 'Luxe Experience',
      label: 'Ultimate Celebration',
      price: '$8,800',
      weekday_price: '$7,900',
      is_popular: false,
      features: [
        'Everything in Celebration',
        'Full weekend access',
        'Garden pavilion ceremony',
        'Professional photography areas',
        'Premium floral arrangements',
        'Champagne welcome service',
        'Dedicated day-of planner',
        'Transportation coordination'
      ],
      cta_url: '#schedule',
      tour_url: '#contact'
    }
  ]

  const tiers = blok?.tiers?.length ? blok.tiers : defaultTiers

  return (
    <section
      id="packages"
      className="pricing-section"
      data-section="pricing"
      {...storyblokEditable(blok)}
    >
      <div className="content-wrapper">
        <div className="section-header">
          <div className="script-accent">
            {blok?.script_accent || 'Investment in Forever'}
          </div>
          <h2 className="section-title">
            {blok?.title || 'Wedding Packages & Pricing'}
          </h2>
          <div className="hero-pricing-line">
            {blok?.hero_line || 'Saturdays from $6,200 • Fridays/Sundays from $5,500 • Weekdays from $4,500'}
          </div>
          <p className="lead">
            {blok?.description || 'Transparent pricing with no hidden fees. Every package includes tables, chairs, setup, teardown, and on-site coordination.'}
          </p>
        </div>

        <div className="pricing-grid">
          {tiers.map((tier, index) => (
            <article
              key={tier._uid || index}
              className={`pricing-card ${tier.is_popular ? 'popular' : ''}`}
              aria-label={`${tier.name} package`}
            >
              {tier.is_popular && (
                <div className="popular-badge" aria-label="Most popular">
                  <Star size={14} aria-hidden="true" />
                  <span className="sr-only">Most Popular: </span>{tier.label}
                </div>
              )}

              <header className="pricing-header">
                <h3 className="package-name">{tier.name}</h3>
                <div className="pricing-display" aria-describedby={`price-desc-${index}`}>
                  <div className="weekend-price" role="text">
                    <span className="amount">{tier.price}</span>
                    <span className="price-label">Fri–Sun</span>
                  </div>
                  <div className="weekday-price" role="text">
                    <span className="amount">{tier.weekday_price}</span>
                    <span className="label">Weekdays</span>
                  </div>
                </div>
                <p id={`price-desc-${index}`} className="sr-only">
                  Weekend price listed for Friday through Sunday; weekday price listed for Monday through Thursday.
                </p>
              </header>

              <ul className="features-list">
                {(tier.features || []).map((feature, featureIndex) => (
                  <li key={featureIndex} className="feature-item">
                    <Check size={16} className="check-icon" aria-hidden="true" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <div className="pricing-actions">
                <a
                  href={tier.cta_url || '#schedule'}
                  className={`cta-button ${tier.is_popular ? 'primary' : 'secondary'}`}
                  data-testid="pricing-cta"
                >
                  <Calendar size={16} aria-hidden="true" />
                  <span>Check Your Date</span>
                </a>
                <a
                  href={tier.tour_url || '#contact'}
                  className="link-button"
                  data-testid="pricing-tour"
                >
                  Book a Tour
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
