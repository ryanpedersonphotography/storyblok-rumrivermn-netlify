/**
 * HeroShell - Server Component (RSC)
 * Renders the static hero structure and content
 * No client-side JavaScript needed for this part
 */

import React from 'react'

type SBAsset = { filename?: string; alt?: string } | string | undefined

interface HeroData {
  kicker?: string
  title?: string
  title_accent?: string
  description?: string
  background_image?: SBAsset
  hero_image?: SBAsset
  bg_image?: SBAsset
  primary_cta_text?: string
  primary_cta_url?: string
  scroll_text?: string
}

function assetUrl(a: SBAsset): string | undefined {
  if (!a) return undefined
  if (typeof a === 'string') return a
  return a.filename
}

function assetAlt(a: SBAsset, fallback: string): string {
  if (!a) return fallback
  if (typeof a === 'string') return fallback
  return a.alt || fallback
}

export default function HeroShell({ data }: { data: HeroData }) {
  const bg =
    assetUrl(data.background_image) ||
    assetUrl(data.hero_image) ||
    assetUrl(data.bg_image) ||
    '/images/barn-exterior-full-deck-view-evening.jpg'

  const bgAlt =
    assetAlt(data.background_image, '') ||
    assetAlt(data.hero_image, '') ||
    assetAlt(data.bg_image, 'Rum River Wedding Barn')

  const style = { '--hero-bg-url': `url("${bg}")` } as React.CSSProperties

  const kicker = data.kicker || 'Where Dreams Begin'
  const title = data.title || 'Rum River'
  const titleAccent = data.title_accent || 'Wedding Barn'
  const lead =
    data.description ||
    "Nestled along Minnesota's scenic Rum River, our historic barn offers the perfect blend of rustic charm and modern elegance for your once-in-a-lifetime celebration."
  const ctaLabel = data.primary_cta_text || 'Schedule Your Visit'
  const ctaUrl = data.primary_cta_url || '#contact'
  const scrollText = data.scroll_text || 'Discover Your Perfect Day'

  return (
    <section className="hero" data-section="hero" style={style}>
      <span className="sr-only">{bgAlt}</span>

      <div className="hero-content">
        <div className="hero-eyebrow">{kicker}</div>

        <h1 className="hero-title">
          {title}
          <br />
          <span className="hero-title-accent">{titleAccent}</span>
        </h1>

        <p className="hero-lead">{lead}</p>

        <div className="hero-ctas">
          <a href={ctaUrl} className="hero-cta hero-cta-secondary">
            {ctaLabel}
          </a>
        </div>

        {/* Scroll indicator will be added by client component */}
        <div id="hero-scroll-mount" />
      </div>
    </section>
  )
}