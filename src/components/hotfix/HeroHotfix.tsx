'use client'

import React from 'react'
import { hotfixHero } from './hotfixStaticContent'

type Props = { data?: typeof hotfixHero }

export default function HeroHotfix({ data = hotfixHero }: Props) {
  // Get background image URL from data, handling both asset objects and string URLs
  const bgImageUrl = (data.bgImage as any)?.filename || data.bgImage || hotfixHero.bgImage
  
  // Set CSS custom property for dynamic background
  const style = { 
    ['--hero-bg' as any]: bgImageUrl ? `url("${bgImageUrl}")` : undefined 
  } as React.CSSProperties

  return (
    <section className="hotfix-hero-romantic" style={style}>
      <div className="hotfix-hero-content">
        {/* HOTFIX: Script accent kicker */}
        <div className="hotfix-hero-kicker">
          {data.kicker}
        </div>
        
        {/* HOTFIX: Main hero title with accent */}
        <h1 className="hotfix-hero-title">
          {data.title}<br />
          <span className="hotfix-hero-title-accent">{data.titleAccent}</span>
        </h1>
        
        {/* HOTFIX: Hero description */}
        <p className="hotfix-hero-description">
          {data.description}
        </p>
        
        {/* HOTFIX: Hero action buttons */}
        <div className="hotfix-hero-buttons">
          <a href={data.primaryCta.url} className="hotfix-btn-romantic-secondary">
            {data.primaryCta.label}
          </a>
        </div>
      </div>
      
      {/* HOTFIX: Scroll indicator */}
      <div className="hotfix-hero-scroll">
        <div className="hotfix-hero-scroll-text">Discover Your Perfect Day</div>
        <div className="hotfix-hero-scroll-arrow">↓</div>
      </div>
    </section>
  )
}