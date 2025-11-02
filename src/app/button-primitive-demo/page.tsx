'use client'

import { Button } from '@/components/primitives/Button'
import Link from 'next/link'
import { useState } from 'react'

export default function ButtonPrimitiveDemo() {
  const [isLoading, setIsLoading] = useState(false)
  const [loadingState, setLoadingState] = useState<Record<string, boolean>>({})

  const simulateLoading = (key: string) => {
    setLoadingState(prev => ({ ...prev, [key]: true }))
    setTimeout(() => {
      setLoadingState(prev => ({ ...prev, [key]: false }))
    }, 2000)
  }

  return (
    <div style={{ padding: '60px 40px', maxWidth: '1400px', margin: '0 auto' }}>
      <header style={{ marginBottom: '60px' }}>
        <h1 style={{
          marginBottom: '16px',
          fontFamily: 'var(--font-serif)',
          fontSize: '3rem',
          color: 'var(--text-primary)'
        }}>
          Button Primitive - Production Ready
        </h1>
        <p style={{ fontSize: '1.125rem', color: '#666', lineHeight: '1.6' }}>
          Comprehensive button component with variants, sizes, loading states, and full WCAG 2.1 AA accessibility.
        </p>
      </header>

      {/* Section 1: Variants */}
      <section style={{ marginBottom: '80px' }}>
        <h2 style={{ marginBottom: '24px', fontFamily: 'var(--font-sans)', fontSize: '1.75rem' }}>
          1. Variants (Behavioral Styling)
        </h2>
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginBottom: '20px' }}>
          <Button variant="solid">Solid (Default)</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="subtle">Subtle</Button>
          <Button variant="ghost">Ghost</Button>
        </div>
        <p style={{ color: '#666', fontSize: '0.875rem' }}>
          Variants are token-driven and themeable via CSS custom properties.
        </p>
      </section>

      {/* Section 2: Sizes */}
      <section style={{ marginBottom: '80px' }}>
        <h2 style={{ marginBottom: '24px', fontFamily: 'var(--font-sans)', fontSize: '1.75rem' }}>
          2. Size Scale (WCAG 44×44px Minimum)
        </h2>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap', marginBottom: '20px' }}>
          <Button variant="solid" size="xs">Extra Small</Button>
          <Button variant="solid" size="sm">Small</Button>
          <Button variant="solid" size="md">Medium (Default)</Button>
          <Button variant="solid" size="lg">Large</Button>
        </div>
        <p style={{ color: '#666', fontSize: '0.875rem' }}>
          All sizes meet WCAG 2.5.5 minimum hit target requirements (44×44px).
        </p>
      </section>

      {/* Section 3: Corners */}
      <section style={{ marginBottom: '80px' }}>
        <h2 style={{ marginBottom: '24px', fontFamily: 'var(--font-sans)', fontSize: '1.75rem' }}>
          3. Corner Radius Options
        </h2>
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginBottom: '20px' }}>
          <Button variant="solid" corner="round">Round (8px)</Button>
          <Button variant="solid" corner="pill">Pill (Default - 9999px)</Button>
          <Button variant="solid" corner="square">Square (0px)</Button>
        </div>
        <p style={{ color: '#666', fontSize: '0.875rem' }}>
          Corner prop provides semantic control over border-radius.
        </p>
      </section>

      {/* Section 4: Variant × Size Matrix */}
      <section style={{ marginBottom: '80px' }}>
        <h2 style={{ marginBottom: '24px', fontFamily: 'var(--font-sans)', fontSize: '1.75rem' }}>
          4. Variant × Size Matrix
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px' }}>
          {(['solid', 'outline', 'subtle', 'ghost'] as const).map(variant => (
            <div key={variant} style={{
              padding: '20px',
              background: '#F9F9F9',
              borderRadius: '8px'
            }}>
              <h3 style={{
                marginBottom: '16px',
                fontSize: '0.875rem',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                color: '#999'
              }}>
                {variant}
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <Button variant={variant} size="xs">XS</Button>
                <Button variant={variant} size="sm">Small</Button>
                <Button variant={variant} size="md">Medium</Button>
                <Button variant={variant} size="lg">Large</Button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Section 5: Icon-Only Buttons */}
      <section style={{ marginBottom: '80px' }}>
        <h2 style={{ marginBottom: '24px', fontFamily: 'var(--font-sans)', fontSize: '1.75rem' }}>
          5. Icon-Only Buttons (Square Aspect Ratio)
        </h2>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap', marginBottom: '20px' }}>
          <Button aria-label="Close" iconOnly variant="solid" size="xs">✕</Button>
          <Button aria-label="Settings" iconOnly variant="outline" size="sm">⚙</Button>
          <Button aria-label="Search" iconOnly variant="subtle" size="md">🔍</Button>
          <Button aria-label="Menu" iconOnly variant="ghost" size="lg">☰</Button>
        </div>
        <p style={{ color: '#666', fontSize: '0.875rem' }}>
          Icon-only buttons require <code>aria-label</code> for accessibility.
        </p>
      </section>

      {/* Section 6: Loading States */}
      <section style={{ marginBottom: '80px' }}>
        <h2 style={{ marginBottom: '24px', fontFamily: 'var(--font-sans)', fontSize: '1.75rem' }}>
          6. Loading States with Spinner
        </h2>

        <h3 style={{ marginBottom: '16px', fontSize: '1.125rem', color: '#666' }}>
          Spinner Position: End (Default)
        </h3>
        <div style={{ display: 'flex', gap: '16px', marginBottom: '32px', flexWrap: 'wrap' }}>
          <Button
            variant="solid"
            loading={loadingState['end-1']}
            onClick={() => simulateLoading('end-1')}
          >
            Click to Load
          </Button>
          <Button variant="outline" loading>
            Loading...
          </Button>
          <Button variant="subtle" loading loadingText="Saving...">
            Save Changes
          </Button>
        </div>

        <h3 style={{ marginBottom: '16px', fontSize: '1.125rem', color: '#666' }}>
          Spinner Position: Start
        </h3>
        <div style={{ display: 'flex', gap: '16px', marginBottom: '32px', flexWrap: 'wrap' }}>
          <Button
            variant="solid"
            spinnerPosition="start"
            loading={loadingState['start-1']}
            onClick={() => simulateLoading('start-1')}
          >
            Click to Process
          </Button>
          <Button variant="outline" spinnerPosition="start" loading>
            Processing...
          </Button>
          <Button variant="subtle" spinnerPosition="start" loading loadingText="Uploading...">
            Upload Files
          </Button>
        </div>

        <h3 style={{ marginBottom: '16px', fontSize: '1.125rem', color: '#666' }}>
          Spinner Position: Overlay (Centered, Preserves Width)
        </h3>
        <div style={{ display: 'flex', gap: '16px', marginBottom: '20px', flexWrap: 'wrap' }}>
          <Button
            variant="solid"
            spinnerPosition="overlay"
            loading={loadingState['overlay-1']}
            onClick={() => simulateLoading('overlay-1')}
          >
            Click to Submit
          </Button>
          <Button variant="outline" spinnerPosition="overlay" loading>
            Submit Form
          </Button>
          <Button variant="solid" spinnerPosition="overlay" loading loadingText="Submitting">
            Create Account
          </Button>
        </div>

        <p style={{ color: '#666', fontSize: '0.875rem' }}>
          Loading state sets <code>aria-busy="true"</code> and disables interaction.
          Spinner uses <code>currentColor</code> to match button variant.
        </p>
      </section>

      {/* Section 7: asChild Pattern */}
      <section style={{ marginBottom: '80px' }}>
        <h2 style={{ marginBottom: '24px', fontFamily: 'var(--font-sans)', fontSize: '1.75rem' }}>
          7. asChild Pattern (Composition)
        </h2>
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginBottom: '20px' }}>
          <Button asChild variant="solid" size="lg">
            <Link href="/">Next.js Link (Home)</Link>
          </Button>
          <Button asChild variant="outline" size="md">
            <a href="#section-8">Anchor Link (#section-8)</a>
          </Button>
          <Button asChild variant="subtle">
            <a href="https://example.com" target="_blank" rel="noopener noreferrer">
              External Link →
            </a>
          </Button>
        </div>
        <p style={{ color: '#666', fontSize: '0.875rem' }}>
          asChild maintains semantic honesty - links stay links with full navigation semantics.
          Styling applies via <code>[data-ui="button"]</code> selector.
        </p>
      </section>

      {/* Section 8: Disabled States */}
      <section style={{ marginBottom: '80px' }} id="section-8">
        <h2 style={{ marginBottom: '24px', fontFamily: 'var(--font-sans)', fontSize: '1.75rem' }}>
          8. Disabled States (Native + asChild Parity)
        </h2>
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginBottom: '20px' }}>
          <Button variant="solid" disabled>Disabled Native</Button>
          <Button variant="outline" disabled>Disabled Outline</Button>
          <Button asChild variant="subtle">
            <a href="#" onClick={(e) => e.preventDefault()} aria-disabled="true" style={{ pointerEvents: 'none', opacity: 0.55 }}>
              Disabled Link (asChild)
            </a>
          </Button>
        </div>
        <p style={{ color: '#666', fontSize: '0.875rem' }}>
          Native buttons use <code>disabled</code> attribute.
          asChild elements use <code>aria-disabled</code> + <code>pointer-events: none</code>.
        </p>
      </section>

      {/* Section 9: Accessibility Features */}
      <section style={{ marginBottom: '80px' }}>
        <h2 style={{ marginBottom: '24px', fontFamily: 'var(--font-sans)', fontSize: '1.75rem' }}>
          9. Accessibility Features (WCAG 2.1 AA)
        </h2>
        <div style={{
          padding: '32px',
          background: '#F0F7FF',
          borderRadius: '12px',
          borderLeft: '4px solid #3B82F6'
        }}>
          <h3 style={{ marginBottom: '16px', fontSize: '1.125rem', fontWeight: 600 }}>
            ✅ Accessibility Checklist
          </h3>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {[
              '44×44px minimum hit target (WCAG 2.5.5)',
              'Focus-visible outline for keyboard navigation',
              'High Contrast Mode support (@media forced-colors)',
              'Motion preferences respect (prefers-reduced-motion)',
              'aria-busy during loading states',
              'aria-disabled for non-button disabled elements',
              'aria-label required for icon-only buttons',
              'Screen reader announcements for loading text',
              'Semantic HTML (native <button> by default)',
              'Keyboard accessible (Space + Enter)',
            ].map((item, i) => (
              <li key={i} style={{
                padding: '8px 0',
                fontSize: '0.9375rem',
                color: '#1E40AF',
                display: 'flex',
                alignItems: 'start',
                gap: '8px'
              }}>
                <span style={{ flexShrink: 0 }}>✓</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Section 10: Hero Button Replicas */}
      <section style={{ marginBottom: '80px' }}>
        <h2 style={{ marginBottom: '24px', fontFamily: 'var(--font-sans)', fontSize: '1.75rem' }}>
          10. Production Example: Hero CTAs
        </h2>
        <div style={{
          padding: '60px 40px',
          background: 'linear-gradient(135deg, #9D6B7B 0%, #6B4E3D 100%)',
          borderRadius: '16px',
          display: 'flex',
          gap: '20px',
          flexWrap: 'wrap',
          justifyContent: 'center'
        }}>
          <Button variant="solid" size="lg" corner="pill">
            Book Your Event
          </Button>
          <Button variant="outline" size="lg" corner="pill">
            Schedule Your Visit
          </Button>
        </div>
        <p style={{ marginTop: '20px', color: '#666', fontSize: '0.875rem' }}>
          Hero buttons use design tokens directly - no custom CSS required.
        </p>
      </section>

      {/* Section 11: Code Examples */}
      <section>
        <h2 style={{ marginBottom: '24px', fontFamily: 'var(--font-sans)', fontSize: '1.75rem' }}>
          11. Code Examples
        </h2>
        <pre style={{
          background: '#1E1E1E',
          color: '#D4D4D4',
          padding: '32px',
          borderRadius: '12px',
          overflow: 'auto',
          fontSize: '0.875rem',
          lineHeight: '1.6'
        }}>
{`// Basic variants
<Button variant="solid">Primary CTA</Button>
<Button variant="outline">Secondary</Button>
<Button variant="subtle">Tertiary</Button>
<Button variant="ghost">Low emphasis</Button>

// Sizes
<Button size="xs">Extra Small</Button>
<Button size="sm">Small</Button>
<Button size="md">Medium</Button>
<Button size="lg">Large</Button>

// Corners
<Button corner="round">Round (8px)</Button>
<Button corner="pill">Pill (9999px)</Button>
<Button corner="square">Square (0px)</Button>

// Icon-only (requires aria-label)
<Button aria-label="Close" iconOnly>✕</Button>

// Loading states
<Button loading>Processing...</Button>
<Button loading loadingText="Saving...">Save</Button>
<Button loading spinnerPosition="start">Upload</Button>
<Button loading spinnerPosition="overlay">Submit</Button>

// asChild (composition)
<Button asChild variant="outline">
  <Link href="/page">Navigate</Link>
</Button>

// Disabled
<Button disabled>Can't click</Button>

// Combined
<Button
  variant="solid"
  size="lg"
  corner="pill"
  loading={isLoading}
  loadingText="Booking..."
>
  Book Now
</Button>`}
        </pre>
      </section>
    </div>
  )
}
