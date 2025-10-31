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

  // Scroll to next section when arrow is clicked
  const handleScrollClick = () => {
    // Temporarily disable smooth scroll behavior to prevent conflicts
    const htmlElement = document.documentElement
    const originalScrollBehavior = htmlElement.style.scrollBehavior
    htmlElement.style.scrollBehavior = 'auto'

    // Scroll to just above the next section (90% of viewport height)
    const scrollAmount = window.innerHeight * 0.90
    const start = window.pageYOffset
    const startTime = performance.now()
    const duration = 850 // 0.85 seconds - balanced speed

    // Smooth ease-out-quad for buttery smooth motion
    const easeOutQuad = (t: number) => {
      return t * (2 - t)
    }

    const animateScroll = (currentTime: number) => {
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / duration, 1)
      const easeProgress = easeOutQuad(progress)

      window.scrollTo({
        top: start + scrollAmount * easeProgress,
        behavior: 'auto'
      })

      if (progress < 1) {
        requestAnimationFrame(animateScroll)
      } else {
        // Restore original scroll behavior
        htmlElement.style.scrollBehavior = originalScrollBehavior
      }
    }

    requestAnimationFrame(animateScroll)
  }

  return (
      <section
        id="hero"
        data-section="hero"
        className="hotfix-hero-romantic"
      {...storyblokEditable(blok)}
      style={style}
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
          <a href="#contact" className="hotfix-btn-romantic-secondary">
            {blok.primary_cta_text || 'Schedule Your Visit'}
          </a>
        </div>
      </div>
      
      {/* Scroll indicator */}
      <div
        className="hotfix-hero-scroll"
        onClick={handleScrollClick}
        style={{ cursor: 'pointer' }}
      >
        <div className="hotfix-hero-scroll-text">
          {blok.scroll_text || 'Discover Your Perfect Day'}
        </div>
        <div className="hotfix-hero-scroll-arrow">↓</div>
      </div>
    </section>
  )
}