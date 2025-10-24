'use client'

import React from 'react'
import { storyblokEditable } from '@storyblok/react'

interface HeroEditorProps {
  blok: any
}

export default function HeroEditor({ blok }: HeroEditorProps) {
  // Handle background image (string or asset object)
  const bgImage = typeof blok.bg_image === 'string'
    ? blok.bg_image
    : blok.bg_image?.filename || '/images/barn-exterior-full-deck-view-evening.jpg'

  const style: React.CSSProperties = {}
  style['--hero-bg' as any] = `url("${bgImage}")`

  return (
    <section
      className="hotfix-hero-romantic"
      {...storyblokEditable(blok)}
      style={style}
      key={bgImage}
    >
      <div className="hotfix-hero-content">
        {/* Script accent kicker */}
        <div className="hotfix-hero-kicker">
          {blok.kicker || 'Where Dreams Begin'}
        </div>
        
        {/* Main hero title with accent */}
        <h1 className="hotfix-hero-title">
          {blok.title || 'Rum River'}
          <br />
          <span className="hotfix-hero-title-accent">
            {blok.title_accent || 'Wedding Barn'}
          </span>
        </h1>
        
        {/* Hero description */}
        <p className="hotfix-hero-description">
          {blok.description || 'Nestled along Minnesota\'s scenic Rum River, our historic barn offers the perfect blend of rustic charm and modern elegance for your once-in-a-lifetime celebration.'}
        </p>
        
        {/* Hero action buttons */}
        <div className="hotfix-hero-buttons">
          <a href="/contact" className="hotfix-btn-romantic-secondary">
            {blok.primary_cta_text || 'Schedule Your Visit'}
          </a>
        </div>
      </div>
      
      {/* Scroll indicator */}
      <div className="hotfix-hero-scroll">
        <div className="hotfix-hero-scroll-text">
          {blok.scroll_text || 'Discover Your Perfect Day'}
        </div>
        <div className="hotfix-hero-scroll-arrow">↓</div>
      </div>
    </section>
  )
}