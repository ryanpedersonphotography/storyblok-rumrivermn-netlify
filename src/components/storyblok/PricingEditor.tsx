'use client'

import React from 'react'
import { storyblokEditable } from '@storyblok/react'
import { Check, Calendar, Star } from 'lucide-react'

interface PricingEditorProps {
  blok: {
    _uid: string;
    component: string;
    script_accent?: string;
    title?: string;
    hero_line?: string;
    description?: string;
    [key: string]: any;
  };
}

export default function PricingEditor({ blok }: PricingEditorProps) {
  const packages = [
    {
      name: 'Essentials',
      label: 'Perfect Start',
      price: '$4,500',
      weekdayPrice: '$3,800',
      popular: false,
      features: [
        'Venue rental for 8 hours',
        'Tables, chairs & linens included',
        'Setup & breakdown service',
        'On-site coordination',
        'Bridal suite access',
        'Sound system & microphones',
        'Basic lighting package'
      ]
    },
    {
      name: 'Celebration',
      label: 'Most Popular',
      price: '$6,200',
      weekdayPrice: '$5,500',
      popular: true,
      features: [
        'Everything in Essentials',
        'Extended 10-hour venue rental',
        'Upgraded lighting & ambiance',
        'Groom\'s quarters access',
        'Complimentary rehearsal',
        'Premium bar setup included',
        'Vendor coordination service',
        'Late-night snack station'
      ]
    },
    {
      name: 'Luxe Experience',
      label: 'Ultimate Celebration',
      price: '$8,800',
      weekdayPrice: '$7,900',
      popular: false,
      features: [
        'Everything in Celebration',
        'Full weekend access',
        'Garden pavilion ceremony',
        'Professional photography areas',
        'Premium floral arrangements',
        'Champagne welcome service',
        'Dedicated day-of planner',
        'Transportation coordination'
      ]
    }
  ]

  return (
      <section
        id="packages"
      className="pricing-section"
      data-section="pricing" 
      {...storyblokEditable(blok)}
      data-discover="true"
    >
      <div className="content-wrapper">
        <div className="section-header">
          <div className="script-accent">
            {blok.script_accent || 'Investment in Forever'}
          </div>
          <h2 className="section-title">
            {blok.title || 'Wedding Packages & Pricing'}
          </h2>
          <div className="hero-pricing-line">
            {blok.hero_line || 'Saturdays from $6,200 • Fridays/Sundays from $5,500 • Weekdays from $4,500'}
          </div>
          <p className="lead">
            {blok.description || 'Transparent pricing with no hidden fees. Every package includes tables, chairs, setup, teardown, and on-site coordination.'}
          </p>
        </div>

        <div className="pricing-grid">
          {packages.map((pkg, index) => (
            <div key={index} className={`pricing-card ${pkg.popular ? 'popular' : ''}`}>
              {pkg.popular && (
                <div className="popular-badge">
                  <Star size={14} />
                  {pkg.label}
                </div>
              )}
              
              <div className="pricing-header">
                <h3 className="package-name">{pkg.name}</h3>
                <div className="pricing-display">
                  <div className="weekend-price">{pkg.price}</div>
                  <div className="price-label">Fri-Sun</div>
                  <div className="weekday-price">
                    <span className="price">{pkg.weekdayPrice}</span>
                    <span className="label">Weekdays</span>
                  </div>
                </div>
              </div>

              <div className="features-list">
                {pkg.features.map((feature, featureIndex) => (
                  <div key={featureIndex} className="feature-item">
                    <Check size={16} className="check-icon" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>

              <div className="pricing-actions">
                <button className={`cta-button ${pkg.popular ? 'primary' : 'secondary'}`}>
                  <Calendar size={16} />
                  Check Your Date
                </button>
                <button className="link-button">
                  Book a Tour
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}