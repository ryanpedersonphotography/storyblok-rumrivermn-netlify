'use client'

import React from 'react'
import { hotfixHero } from './hotfixStaticContent'

type Props = { data?: typeof hotfixHero }

export default function HeroHotfix({ data = hotfixHero }: Props) {
  console.log('HeroHotfix received data:', JSON.stringify(data, null, 2));
  
  // Only set CSS custom property if we have a CMS image, otherwise let CSS fallback handle it
  const style: React.CSSProperties = {};
  
  if (data.bgImage) {
    style['--hero-bg' as any] = `url("${data.bgImage}")`;
    console.log('✅ Setting CSS custom property with CMS image:', data.bgImage);
  } else {
    console.log('🎨 Using CSS fallback image - no custom property set');
  }

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