'use client'

import { Button } from '@/components/primitives/Button'

export default function HeroDemoPage() {
  return (
    <section
      data-recipe="hero-dark"
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundImage: 'url(https://a.storyblok.com/f/288003424841711/5184x3456/8fc0c5e5c5/img_9398.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        position: 'relative',
      }}
    >
      {/* Dark overlay for better text contrast */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(135deg, rgba(44, 36, 22, 0.7), rgba(61, 47, 34, 0.6))',
        }}
      />

      {/* Content - using Stack pattern */}
      <div
        className="stack"
        style={{
          position: 'relative',
          zIndex: 1,
          textAlign: 'center',
          maxWidth: '800px',
          padding: 'var(--space-32)',
          gap: 'var(--space-24)',
        }}
      >
        <h1
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(2.5rem, 5vw, 4rem)',
            fontWeight: 600,
            color: 'var(--rc-fg-hero)',
            margin: 0,
            lineHeight: 1.2,
          }}
        >
          Welcome to Rum River Barn
        </h1>

        <p
          style={{
            fontSize: 'clamp(1.125rem, 2vw, 1.5rem)',
            color: 'var(--rc-fg-muted, rgba(255, 255, 255, 0.9))',
            margin: 0,
            lineHeight: 1.6,
          }}
        >
          Where rustic charm meets modern elegance along Minnesota's scenic Rum River
        </p>

        <div style={{ marginTop: 'var(--space-16)' }}>
          <Button size="lg" onClick={() => alert('Schedule a tour!')}>
            Schedule Your Tour
          </Button>
        </div>
      </div>
    </section>
  )
}
