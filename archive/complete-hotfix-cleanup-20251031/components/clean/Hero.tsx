// ───────────────────────────────────────────────────────────────────────────────
// 1) CLEAN HERO (Storyblok-ready)  src/components/clean/Hero.tsx
// - storyblokEditable(blok) for inline editing
// - Field shims to match hotfix keys (kicker/title/title_accent/description/bg_image)
// - Safe image handling (asset object or string)
// - Sets --hero-bg-url for CSS layer
// ───────────────────────────────────────────────────────────────────────────────
'use client'
import React from 'react'
import { storyblokEditable } from '@storyblok/react'

type SBAsset = { filename?: string; alt?: string } | string | undefined

interface HeroBlok {
  _uid?: string
  component?: string
  // common aliases we saw in hotfix:
  kicker?: string
  title?: string
  title_accent?: string
  description?: string
  background_image?: SBAsset
  hero_image?: SBAsset
  bg_image?: SBAsset
  primary_cta_text?: string
  scroll_text?: string
  [key: string]: any
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

export default function Hero({ blok }: { blok: HeroBlok }) {
  const bg =
    assetUrl(blok.background_image) ||
    assetUrl(blok.hero_image) ||
    assetUrl(blok.bg_image) ||
    '/images/barn-exterior-full-deck-view-evening.jpg'

  const bgAlt =
    assetAlt(blok.background_image, '') ||
    assetAlt(blok.hero_image, '') ||
    assetAlt(blok.bg_image, 'Rum River Wedding Barn')

  const style = { '--hero-bg-url': `url("${bg}")` } as React.CSSProperties

  const kicker = blok.kicker || 'Where Dreams Begin'
  const title = blok.title || 'Rum River'
  const titleAccent = blok.title_accent || 'Wedding Barn'
  const lead =
    blok.description ||
    "Nestled along Minnesota's scenic Rum River, our historic barn offers the perfect blend of rustic charm and modern elegance for your once-in-a-lifetime celebration."
  const ctaLabel = blok.primary_cta_text || 'Schedule Your Visit'
  const scrollText = blok.scroll_text || 'Discover Your Perfect Day'

  // smooth scroll (no Bridge conflicts)
  const onScrollClick = () => {
    const html = document.documentElement
    const prev = html.style.scrollBehavior
    html.style.scrollBehavior = 'auto'
    const start = window.pageYOffset
    const amount = window.innerHeight * 0.9
    const duration = 850
    const t0 = performance.now()
    const ease = (t: number) => t * (2 - t)
    const step = (t1: number) => {
      const p = Math.min((t1 - t0) / duration, 1)
      window.scrollTo({ top: start + amount * ease(p), behavior: 'auto' })
      if (p < 1) requestAnimationFrame(step)
      else html.style.scrollBehavior = prev
    }
    requestAnimationFrame(step)
  }

  return (
    <section className="hero" data-section="hero" style={style} {...storyblokEditable(blok)}>
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
          <a href="#contact" className="hero-cta hero-cta-secondary">
            {ctaLabel}
          </a>
        </div>
      </div>

      <div className="hero-scroll" onClick={onScrollClick}>
        <div className="hero-scroll-text">{scrollText}</div>
        <div className="hero-scroll-arrow">↓</div>
      </div>
    </section>
  )
}