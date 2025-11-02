'use client'

import { useEffect, useState } from 'react'
import Section from '@/components/ui/SectionEnhanced'
import { Heading } from '@/components/ui/Heading'
import { Text } from '@/components/ui/Text'

interface TokenData {
  name: string
  hardcoded: string
  category: string
}

interface ColorTokenData {
  name: string
  hardcoded: string
  category: string
}

const COLOR_TOKENS: ColorTokenData[] = [
  // Surface Colors
  { name: '--surface-0', hardcoded: 'rgb(244 228 225) [light] / rgb(15 12 10) [dark]', category: 'Surfaces' },
  { name: '--surface-1', hardcoded: 'rgb(255 255 255) [light] / rgb(26 20 16) [dark]', category: 'Surfaces' },
  { name: '--surface-2', hardcoded: 'rgb(244 228 225) [light] / oklch walnut-750 [dark]', category: 'Surfaces' },
  { name: '--surface-3', hardcoded: 'rgb(250 246 242) [light] / rgb(44 36 22) [dark]', category: 'Surfaces' },
  { name: '--surface-4', hardcoded: 'rgb(246 240 234) [light] / rgb(55 45 27) [dark]', category: 'Surfaces' },

  // Text Colors
  { name: '--text-primary', hardcoded: 'rgb(107 78 61) [light] / rgb(255 255 255) [dark]', category: 'Text' },
  { name: '--text-secondary', hardcoded: 'rgb(68 57 50) [light] / color-mix [dark]', category: 'Text' },
  { name: '--text-inverse', hardcoded: 'rgb(255 255 255) [light] / rgb(26 20 16) [dark]', category: 'Text' },

  // Accent Colors
  { name: '--accent-rose', hardcoded: 'rgb(157 107 123) [light] / rgb(216 155 174) [dark]', category: 'Accents' },
  { name: '--accent-rose-soft', hardcoded: 'rgb(216 155 174)', category: 'Accents' },
  { name: '--accent-gold', hardcoded: 'rgb(240 217 168)', category: 'Accents' },

  // Border Colors
  { name: '--border-subtle', hardcoded: 'rgba(0, 0, 0, 0.08) [light] / rgba(255, 255, 255, 0.08) [dark]', category: 'Borders' },
  { name: '--border-medium', hardcoded: 'rgba(0, 0, 0, 0.16) [light] / rgba(255, 255, 255, 0.16) [dark]', category: 'Borders' },

  // Background Helpers
  { name: '--bg-surface', hardcoded: 'var(--theme-bg-primary, #FFFCF8)', category: 'Backgrounds' },
  { name: '--bg-tint-rose', hardcoded: 'color-mix(in srgb, surface 92%, rose 8%)', category: 'Backgrounds' },
  { name: '--bg-tint-sage', hardcoded: 'color-mix(in srgb, surface 92%, sage 8%)', category: 'Backgrounds' },
  { name: '--bg-dark-grad', hardcoded: 'linear-gradient(135deg, #2C2416, #3D2F22)', category: 'Backgrounds' },

  // Focus & States
  { name: '--focus-ring', hardcoded: 'rgb(107 78 61) [light] / var(--accent-gold) [dark]', category: 'States' },

  // Legacy Aliases
  { name: '--theme-bg-primary', hardcoded: 'var(--surface-1)', category: 'Legacy Aliases' },
  { name: '--theme-bg-secondary', hardcoded: 'var(--surface-2)', category: 'Legacy Aliases' },
  { name: '--theme-bg-card', hardcoded: 'var(--surface-1)', category: 'Legacy Aliases' },
  { name: '--theme-text-primary', hardcoded: 'var(--text-primary)', category: 'Legacy Aliases' },
  { name: '--theme-text-secondary', hardcoded: 'var(--text-secondary)', category: 'Legacy Aliases' },
  { name: '--theme-accent-rose', hardcoded: 'var(--accent-rose)', category: 'Legacy Aliases' },
  { name: '--theme-accent-gold', hardcoded: 'var(--accent-gold)', category: 'Legacy Aliases' },
  { name: '--theme-accent-sage', hardcoded: 'rgb(176 196 182)', category: 'Legacy Aliases' },
]

const SPACING_TOKENS: TokenData[] = [
  // Fixed Scale
  { name: '--space-0', hardcoded: '0', category: 'Fixed Scale' },
  { name: '--space-2', hardcoded: '0.125rem (2px)', category: 'Fixed Scale' },
  { name: '--space-4', hardcoded: '0.25rem (4px)', category: 'Fixed Scale' },
  { name: '--space-8', hardcoded: '0.5rem (8px)', category: 'Fixed Scale' },
  { name: '--space-12', hardcoded: '0.75rem (12px)', category: 'Fixed Scale' },
  { name: '--space-16', hardcoded: '1rem (16px)', category: 'Fixed Scale' },
  { name: '--space-20', hardcoded: '1.25rem (20px)', category: 'Fixed Scale' },
  { name: '--space-24', hardcoded: '1.5rem (24px)', category: 'Fixed Scale' },
  { name: '--space-32', hardcoded: '2rem (32px)', category: 'Fixed Scale' },
  { name: '--space-40', hardcoded: '2.5rem (40px)', category: 'Fixed Scale' },
  { name: '--space-48', hardcoded: '3rem (48px)', category: 'Fixed Scale' },
  { name: '--space-56', hardcoded: '3.5rem (56px)', category: 'Fixed Scale' },
  { name: '--space-64', hardcoded: '4rem (64px)', category: 'Fixed Scale' },
  { name: '--space-80', hardcoded: '5rem (80px)', category: 'Fixed Scale' },
  { name: '--space-96', hardcoded: '6rem (96px)', category: 'Fixed Scale' },

  // Legacy Aliases (backward compatibility)
  { name: '--space-2xs', hardcoded: 'var(--space-4)', category: 'Legacy Aliases' },
  { name: '--space-xs', hardcoded: 'var(--space-8)', category: 'Legacy Aliases' },
  { name: '--space-sm', hardcoded: 'var(--space-12)', category: 'Legacy Aliases' },
  { name: '--space-md', hardcoded: 'var(--space-16)', category: 'Legacy Aliases' },
  { name: '--space-lg', hardcoded: 'var(--space-20)', category: 'Legacy Aliases' },
  { name: '--space-xl', hardcoded: 'var(--space-32)', category: 'Legacy Aliases' },
  { name: '--space-2xl', hardcoded: 'var(--space-40)', category: 'Legacy Aliases' },
  { name: '--space-3xl', hardcoded: 'var(--space-48)', category: 'Legacy Aliases' },
  { name: '--space-4xl', hardcoded: 'var(--space-64)', category: 'Legacy Aliases' },
  { name: '--space-5xl', hardcoded: 'var(--space-96)', category: 'Legacy Aliases' },

  // Fluid Tokens
  { name: '--space-fluid-1', hardcoded: 'clamp(var(--space-16), 1.5vw, var(--space-24))', category: 'Fluid (Responsive)' },
  { name: '--space-fluid-2', hardcoded: 'clamp(var(--space-24), 2vw, var(--space-40))', category: 'Fluid (Responsive)' },
  { name: '--space-fluid-3', hardcoded: 'clamp(var(--space-32), 3vw, var(--space-56))', category: 'Fluid (Responsive)' },
  { name: '--space-fluid-4', hardcoded: 'clamp(var(--space-48), 5vw, var(--space-80))', category: 'Fluid (Responsive)' },
  { name: '--space-fluid-5', hardcoded: 'clamp(var(--space-64), 6vw, var(--space-96))', category: 'Fluid (Responsive)' },

  // Semantic Section Padding Tokens
  { name: '--space-section-xs', hardcoded: '35px', category: 'Semantic Section Padding' },
  { name: '--space-section-sm', hardcoded: '50px', category: 'Semantic Section Padding' },
  { name: '--space-section-md', hardcoded: '60px', category: 'Semantic Section Padding' },
  { name: '--space-section-lg', hardcoded: 'var(--space-80)', category: 'Semantic Section Padding' },
  { name: '--space-section-xl', hardcoded: 'var(--space-96)', category: 'Semantic Section Padding' },
  { name: '--space-section-fluid', hardcoded: 'var(--section-pad-fluid)', category: 'Semantic Section Padding' },

  // Semantic Fluid Tokens
  { name: '--section-pad-fluid', hardcoded: 'clamp(var(--space-48), 6vw, var(--space-96))', category: 'Semantic Fluid' },
  { name: '--stack-gap-fluid-lg', hardcoded: 'clamp(var(--space-24), 3vw, var(--space-40))', category: 'Semantic Fluid' },
  { name: '--hero-pad-fluid', hardcoded: 'clamp(var(--space-56), 8vw, var(--space-96))', category: 'Semantic Fluid' },
]

function TokenRow({ token }: { token: TokenData }) {
  const [computed, setComputed] = useState<string>('')
  const [isMatch, setIsMatch] = useState<boolean | null>(null)

  useEffect(() => {
    const value = getComputedStyle(document.documentElement).getPropertyValue(token.name).trim()
    setComputed(value)

    // Simple match check (normalize values for comparison)
    const normalizedHardcoded = token.hardcoded.replace(/\s+/g, '').toLowerCase()
    const normalizedComputed = value.replace(/\s+/g, '').toLowerCase()

    // For clamp/var values, just check if computed has a value
    if (token.hardcoded.includes('clamp') || token.hardcoded.includes('var(')) {
      setIsMatch(value.length > 0)
    } else {
      setIsMatch(normalizedComputed.includes(normalizedHardcoded.split('(')[0]))
    }
  }, [token])

  return (
    <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
      <td style={{
        padding: '0.75rem',
        fontFamily: 'monospace',
        fontSize: '0.875rem',
        background: 'var(--surface-2)'
      }}>
        {token.name}
      </td>
      <td style={{
        padding: '0.75rem',
        fontSize: '0.875rem',
        color: 'var(--text-secondary)'
      }}>
        {token.hardcoded}
      </td>
      <td style={{
        padding: '0.75rem',
        fontFamily: 'monospace',
        fontSize: '0.875rem',
        color: computed ? 'var(--text-primary)' : '#B00020',
        fontWeight: computed ? 400 : 600
      }}>
        {computed || '❌ NOT DEFINED'}
      </td>
      <td style={{ padding: '0.75rem', textAlign: 'center' }}>
        {isMatch === true && <span style={{ color: 'var(--schedule-success)', fontSize: '1.25rem' }}>✓</span>}
        {isMatch === false && <span style={{ color: 'var(--schedule-error)', fontSize: '1.25rem' }}>✗</span>}
      </td>
      <td style={{ padding: '0.75rem' }}>
        <div
          style={{
            height: '20px',
            background: 'var(--accent-rose)',
            width: `var(${token.name})`,
            borderRadius: '2px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            minWidth: '2px'
          }}
        />
      </td>
    </tr>
  )
}

export default function PrimitivesTestPage() {
  const categories = ['Fixed Scale', 'Legacy Aliases', 'Fluid (Responsive)', 'Semantic Section Padding', 'Semantic Fluid']

  return (
    <div data-clean-root="true">
      {/* Token Verification Table */}
      <Section
        variant="centered"
        paddingY="lg"
        background="surface"
        header={{
          scriptAccent: 'Token Verification',
          title: 'Spacing Tokens: Hardcoded vs Computed',
          lead: 'Verify all tokens are loading correctly',
        }}
      >
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <p style={{ marginBottom: '2rem', color: 'var(--text-secondary)' }}>
            <strong>Legend:</strong> ✓ = Token loads correctly | ✗ = Mismatch or missing | Visual bar shows actual rendered width
          </p>

          {categories.map(category => {
            const tokens = SPACING_TOKENS.filter(t => t.category === category)
            return (
              <div key={category} style={{ marginBottom: '3rem' }}>
                <h3 style={{
                  fontSize: '1.25rem',
                  fontWeight: 600,
                  marginBottom: '1rem',
                  color: 'var(--accent-rose)'
                }}>
                  {category}
                </h3>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{
                    width: '100%',
                    borderCollapse: 'collapse',
                    background: 'var(--surface-1)',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
                  }}>
                    <thead>
                      <tr style={{ background: 'var(--surface-3)' }}>
                        <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600 }}>Token Name</th>
                        <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600 }}>Hardcoded Value</th>
                        <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600 }}>Computed Value</th>
                        <th style={{ padding: '1rem', textAlign: 'center', fontWeight: 600 }}>OK?</th>
                        <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600 }}>Visual</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tokens.map(token => (
                        <TokenRow key={token.name} token={token} />
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )
          })}
        </div>
      </Section>

      {/* Stack: Default Spacing */}
      <Section
        variant="centered"
        paddingY="lg"
        background="tint-rose"
        header={{
          scriptAccent: 'Layout Primitives',
          title: 'Stack: Default Spacing',
          lead: 'Using .stack with default 32px gap',
        }}
      >
        <div className="stack" style={{ maxWidth: '600px', margin: '0 auto' }}>
          <div style={{ padding: '1rem', background: 'var(--surface-2)', borderRadius: '8px' }}>Item 1</div>
          <div style={{ padding: '1rem', background: 'var(--surface-2)', borderRadius: '8px' }}>Item 2</div>
          <div style={{ padding: '1rem', background: 'var(--surface-2)', borderRadius: '8px' }}>Item 3</div>
        </div>
      </Section>

      {/* Stack: Density Variants */}
      <Section
        variant="centered"
        paddingY="lg"
        background="tint-sage"
        header={{
          title: 'Stack: Density Variants',
          lead: 'Tight (16px) → Compact (24px) → Loose (40px) → Airy (56px)',
        }}
      >
        <div className="cluster" data-justify="center" style={{ gap: 'var(--space-40)' }}>
          <div>
            <p style={{ marginBottom: '1rem', fontWeight: 600 }}>is-tight</p>
            <div className="stack is-tight">
              <div style={{ padding: '0.5rem', background: 'var(--surface-1)', borderRadius: '4px', fontSize: '0.875rem' }}>A</div>
              <div style={{ padding: '0.5rem', background: 'var(--surface-1)', borderRadius: '4px', fontSize: '0.875rem' }}>B</div>
              <div style={{ padding: '0.5rem', background: 'var(--surface-1)', borderRadius: '4px', fontSize: '0.875rem' }}>C</div>
            </div>
          </div>

          <div>
            <p style={{ marginBottom: '1rem', fontWeight: 600 }}>is-compact</p>
            <div className="stack is-compact">
              <div style={{ padding: '0.5rem', background: 'var(--surface-1)', borderRadius: '4px', fontSize: '0.875rem' }}>A</div>
              <div style={{ padding: '0.5rem', background: 'var(--surface-1)', borderRadius: '4px', fontSize: '0.875rem' }}>B</div>
              <div style={{ padding: '0.5rem', background: 'var(--surface-1)', borderRadius: '4px', fontSize: '0.875rem' }}>C</div>
            </div>
          </div>

          <div>
            <p style={{ marginBottom: '1rem', fontWeight: 600 }}>is-loose</p>
            <div className="stack is-loose">
              <div style={{ padding: '0.5rem', background: 'var(--surface-1)', borderRadius: '4px', fontSize: '0.875rem' }}>A</div>
              <div style={{ padding: '0.5rem', background: 'var(--surface-1)', borderRadius: '4px', fontSize: '0.875rem' }}>B</div>
              <div style={{ padding: '0.5rem', background: 'var(--surface-1)', borderRadius: '4px', fontSize: '0.875rem' }}>C</div>
            </div>
          </div>

          <div>
            <p style={{ marginBottom: '1rem', fontWeight: 600 }}>is-airy</p>
            <div className="stack is-airy">
              <div style={{ padding: '0.5rem', background: 'var(--surface-1)', borderRadius: '4px', fontSize: '0.875rem' }}>A</div>
              <div style={{ padding: '0.5rem', background: 'var(--surface-1)', borderRadius: '4px', fontSize: '0.875rem' }}>B</div>
              <div style={{ padding: '0.5rem', background: 'var(--surface-1)', borderRadius: '4px', fontSize: '0.875rem' }}>C</div>
            </div>
          </div>
        </div>
      </Section>

      {/* Grid: Auto-fit */}
      <Section
        variant="centered"
        paddingY="lg"
        background="surface"
        header={{
          title: 'Grid: Auto-fit Layout',
          lead: 'Responsive grid without media queries',
        }}
      >
        <div className="grid is-auto-fit" style={{ ['--grid-min' as any]: '200px' }}>
          <div style={{ padding: '2rem', background: 'var(--surface-2)', borderRadius: '8px', textAlign: 'center' }}>Card 1</div>
          <div style={{ padding: '2rem', background: 'var(--surface-2)', borderRadius: '8px', textAlign: 'center' }}>Card 2</div>
          <div style={{ padding: '2rem', background: 'var(--surface-2)', borderRadius: '8px', textAlign: 'center' }}>Card 3</div>
          <div style={{ padding: '2rem', background: 'var(--surface-2)', borderRadius: '8px', textAlign: 'center' }}>Card 4</div>
        </div>
      </Section>

      {/* ========================================
          SECTION DEMOS - BACKGROUNDS & STYLES
          ======================================== */}

      {/* Demo 1: Surface Background + Centered + Prose Width */}
      <Section
        align="center"
        width="prose"
        paddingY="lg"
        background="surface"
        header={{
          scriptAccent: 'Demo 1',
          title: 'Surface Background, Centered, Prose Width',
          lead: 'Props: align="center" | width="prose" | paddingY="lg" | background="surface"',
        }}
      >
        <div className="stack is-compact">
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7 }}>
            This section demonstrates the default prose width (48ch) optimized for reading. The content is centered and uses surface background.
          </p>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7 }}>
            Perfect for text-heavy content like blog posts or documentation. Notice the comfortable reading width.
          </p>
        </div>
      </Section>

      {/* Demo 2: Tint-Rose Background + Content Width */}
      <Section
        align="center"
        width="content"
        paddingY="lg"
        background="tint-rose"
        header={{
          scriptAccent: 'Demo 2',
          title: 'Tint-Rose Background, Content Width',
          lead: 'Props: align="center" | width="content" | paddingY="lg" | background="tint-rose"',
        }}
      >
        <div className="stack is-rhythm-prose">
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, maxWidth: '65ch', margin: '0 auto' }}>
            Using the tint-rose background creates a warm, elegant feel. The content width provides more horizontal space than prose while still maintaining structure.
          </p>
          <div className="cluster" data-justify="center" style={{ marginTop: 'var(--space-24)' }}>
            <button style={{ padding: 'var(--space-12) var(--space-24)', background: 'var(--accent-rose)', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
              Primary Action
            </button>
            <button style={{ padding: 'var(--space-12) var(--space-24)', background: 'transparent', color: 'var(--accent-rose)', border: '2px solid var(--accent-rose)', borderRadius: '8px', cursor: 'pointer' }}>
              Secondary
            </button>
          </div>
        </div>
      </Section>

      {/* Demo 3: Tint-Sage Background + Wide Width */}
      <Section
        align="center"
        width="wide"
        paddingY="xl"
        background="tint-sage"
        header={{
          scriptAccent: 'Demo 3',
          title: 'Tint-Sage Background, Wide Layout',
          lead: 'Props: align="center" | width="wide" | paddingY="xl" | background="tint-sage"',
        }}
      >
        <div className="grid is-auto-fit" style={{ ['--grid-min' as any]: '250px', marginTop: 'var(--space-40)' }}>
          {[1, 2, 3].map(i => (
            <div key={i} className="stack is-tight" style={{ padding: 'var(--space-32)', background: 'var(--surface-1)', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
              <div style={{ width: '48px', height: '48px', background: 'var(--accent-sage)', borderRadius: '50%', display: 'grid', placeItems: 'center', color: 'white', fontWeight: 600 }}>
                {i}
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-primary)' }}>Feature {i}</h3>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, fontSize: '0.9375rem' }}>
                The sage tint provides a calming, natural aesthetic. Wide layout gives cards breathing room.
              </p>
            </div>
          ))}
        </div>
      </Section>

      {/* Demo 4: Dark Gradient + Full Width + Screen Height */}
      <Section
        align="center"
        width="full"
        paddingY="fluid"
        height="screen"
        background="dark-gradient"
        tone="dark"
        divider="thread-gold"
        header={{
          scriptAccent: 'Demo 4',
          title: 'Dark Gradient Hero',
          lead: 'Props: width="full" | height="screen" | background="dark-gradient" | tone="dark" | divider="thread-gold"',
        }}
      >
        <div className="stack is-rhythm-section" style={{ maxWidth: '700px', margin: '0 auto', textAlign: 'center' }}>
          <p style={{ fontSize: '1.125rem', lineHeight: 1.8, opacity: 0.9 }}>
            Full-screen hero section with dark gradient background. Perfect for landing pages and impactful opening sections.
          </p>
          <div className="cluster" data-justify="center" style={{ marginTop: 'var(--space-32)' }}>
            <button style={{ padding: 'var(--space-16) var(--space-40)', background: 'white', color: '#2C2416', border: 'none', borderRadius: '8px', fontSize: '1.0625rem', fontWeight: 600, cursor: 'pointer' }}>
              Get Started
            </button>
            <button style={{ padding: 'var(--space-16) var(--space-40)', background: 'transparent', color: 'var(--text-on-dark)', border: '2px solid var(--text-on-dark)', borderRadius: '8px', fontSize: '1.0625rem', fontWeight: 600, cursor: 'pointer' }}>
              Learn More
            </button>
          </div>
        </div>
      </Section>

      {/* Demo 5: Header Center, Content Left */}
      <Section
        variant="header-center-content-left"
        paddingY="lg"
        background="surface"
        header={{
          scriptAccent: 'Demo 5',
          title: 'Header Centered, Content Left-Aligned',
          lead: 'Variant: "header-center-content-left" — Great for lists, features, or structured content',
        }}
      >
        <div className="stack">
          {['First Point', 'Second Point', 'Third Point'].map((point, i) => (
            <div key={i} className="cluster" data-align="start" style={{ gap: 'var(--space-16)' }}>
              <div style={{ width: '32px', height: '32px', background: 'var(--accent-rose)', borderRadius: '50%', display: 'grid', placeItems: 'center', color: 'white', fontSize: '0.875rem', fontWeight: 600, flexShrink: 0 }}>
                ✓
              </div>
              <div>
                <h3 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: 'var(--space-8)', color: 'var(--text-primary)' }}>
                  {point}
                </h3>
                <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                  This layout works well for features, benefits, or any structured list content where you want to center attention on the header but keep content scannable.
                </p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Demo 6: Alternating Blocks - Real Implementation */}
      <Section
        align="center"
        contentWrapper={true}
        background="tint-rose"
        paddingY="fluid"
        divider="thread-gold"
        variant={[
          'alternating-blocks-luxe',
          'header-center-wide',
          'lead-full-width',
          'box-sizing-content'
        ]}
        header={{
          scriptAccent: 'Demo 6',
          title: 'Alternating Blocks - Real Implementation',
          lead: 'Using actual .alternating-blocks__* classes and --why-* tokens with zigzag alignment, direction RTL reversal, and hover effects',
        }}
      >
        <div className="alternating-blocks__container">
          {[
            {
              number: '01',
              title: 'A Picturesque Location',
              lead: 'Near Milaca, Saint Paul, St Cloud, and Brainerd MN',
              paragraphs: [
                'When it comes to special occasions such as weddings, birthday parties, or other events, it is important to have the perfect setting. You want to ensure that your event is at a location that people will remember.',
                'Here at Rum River Barn, we understand the importance of your special occasion. We are different from other special event venues because we allow you to pretty much run the show.'
              ],
              isReverse: false,
              imageUrl: '/images/barn-interior-ceiling-beams-lighting.jpg'
            },
            {
              number: '02',
              title: 'Rum River Barn & Vineyard',
              lead: 'Milaca, St. Cloud, Saint Paul, and Brainerd MN',
              paragraphs: [
                'Our goal is to help you have your perfect day. The barn features beautiful exposed beam architecture, elegant lighting, and a warm, inviting atmosphere that creates the perfect backdrop for your celebration.',
                'From intimate gatherings to grand celebrations, our versatile space adapts to your vision while maintaining its rustic charm and natural beauty.'
              ],
              isReverse: true,
              imageUrl: '/images/property-field-wildflowers-natural.jpg'
            }
          ].map((block, index) => (
            <div
              key={index}
              className={`alternating-blocks__item${block.isReverse ? ' alternating-blocks__item--reverse' : ''}`}
            >
              <div className="alternating-blocks__content">
                <div className="alternating-blocks__number">
                  {block.number}
                </div>
                <h3 className="alternating-blocks__title">
                  {block.title}
                </h3>
                <p className="alternating-blocks__lead">
                  {block.lead}
                </p>
                {block.paragraphs.map((paragraph, pIndex) => (
                  <p key={pIndex} className="alternating-blocks__paragraph">
                    {paragraph}
                  </p>
                ))}
              </div>
              <div className="alternating-blocks__image">
                <img
                  src={block.imageUrl}
                  alt={`Venue image ${index + 1}`}
                  width="800"
                  height="500"
                />
              </div>
            </div>
          ))}
        </div>

        {/* Documentation Card */}
        <div style={{
          marginTop: 'clamp(3rem, 6vw, 5rem)',
          background: 'var(--surface-1)',
          padding: 'var(--space-32)',
          borderRadius: '12px',
          border: '2px solid var(--border-subtle)'
        }}>
          <h4 style={{
            fontSize: '1.125rem',
            fontWeight: 600,
            marginBottom: 'var(--space-16)',
            color: 'var(--text-primary)'
          }}>
            Real Implementation Features
          </h4>
          <div className="stack is-compact" style={{ gap: 'var(--space-12)' }}>
            <div style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.8125rem',
              lineHeight: 1.6,
              color: 'var(--text-secondary)'
            }}>
              <div>✓ Uses .alternating-blocks__container wrapper</div>
              <div>✓ Each block: .alternating-blocks__item (with --reverse modifier)</div>
              <div>✓ Zigzag alignment via nth-child(odd) left, nth-child(even) right</div>
              <div>✓ Direction RTL trick for image/content reversal</div>
              <div>✓ Semantic classes: __number, __title, __lead, __paragraph, __image</div>
              <div>✓ Token system: --why-card, --why-border, --why-shadow, --why-number, --why-text</div>
              <div>✓ Hover effect: transform scale(1.02) on image</div>
              <div>✓ Responsive: 2-column grid → 1-column on mobile</div>
              <div>✓ Dark mode: glassmorphism cards with backdrop-filter</div>
            </div>
          </div>
        </div>
      </Section>

      {/* Demo 7: FAQ-Style with Stack Tight */}
      <Section
        align="center"
        width="prose"
        paddingY="lg"
        background="surface"
        header={{
          scriptAccent: 'Demo 7',
          title: 'FAQ-Style Accordion',
          lead: 'Props: align="center" | width="prose" | background="surface" — Using .stack for vertical flow',
        }}
      >
        <div className="stack" style={{ borderTop: '2px solid var(--border-subtle)' }}>
          {['How does it work?', 'What are the benefits?', 'Is it customizable?'].map((q, i) => (
            <div key={i} style={{ borderBottom: '2px solid var(--border-subtle)', padding: 'var(--space-24) 0' }}>
              <div className="cluster" data-justify="between">
                <h3 style={{ fontSize: '1.125rem', fontWeight: 500, color: 'var(--text-primary)', margin: 0 }}>
                  {q}
                </h3>
                <span style={{ color: 'var(--accent-rose)', fontSize: '1.25rem' }}>↓</span>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Demo 8: Gallery-Style Grid */}
      <Section
        align="center"
        contentWrapper={true}
        paddingY="lg"
        background="surface"
        header={{
          scriptAccent: 'Demo 8',
          title: 'Gallery Grid Layout',
          lead: 'Using .grid primitive with auto-fit for responsive image gallery',
        }}
      >
        <div className="grid is-auto-fit" style={{ ['--grid-min' as any]: '200px', ['--grid-gap' as any]: 'var(--space-16)' }}>
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} style={{
              aspectRatio: '1',
              background: `linear-gradient(135deg, var(--accent-rose) 0%, var(--accent-gold) 100%)`,
              borderRadius: '8px',
              display: 'grid',
              placeItems: 'center',
              color: 'white',
              fontSize: '2rem',
              fontWeight: 600,
              opacity: 0.9,
              cursor: 'pointer',
              transition: 'opacity 200ms ease'
            }}>
              {i}
            </div>
          ))}
        </div>
      </Section>

      {/* Demo 9: Cluster with Different Justify */}
      <Section
        align="center"
        width="content"
        paddingY="md"
        background="tint-sage"
        header={{
          scriptAccent: 'Demo 9',
          title: 'Cluster Primitive Variants',
          lead: 'Demonstrating .cluster with different justify and align attributes',
        }}
      >
        <div className="stack is-loose">
          <div>
            <p style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: 'var(--space-12)', color: 'var(--text-primary)' }}>
              data-justify="between"
            </p>
            <div className="cluster" data-justify="between" style={{ padding: 'var(--space-16)', background: 'var(--surface-1)', borderRadius: '8px' }}>
              <span style={{ padding: 'var(--space-8) var(--space-16)', background: 'var(--surface-2)', borderRadius: '6px' }}>Left</span>
              <span style={{ padding: 'var(--space-8) var(--space-16)', background: 'var(--surface-2)', borderRadius: '6px' }}>Middle</span>
              <span style={{ padding: 'var(--space-8) var(--space-16)', background: 'var(--surface-2)', borderRadius: '6px' }}>Right</span>
            </div>
          </div>

          <div>
            <p style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: 'var(--space-12)', color: 'var(--text-primary)' }}>
              data-justify="center"
            </p>
            <div className="cluster" data-justify="center" style={{ padding: 'var(--space-16)', background: 'var(--surface-1)', borderRadius: '8px' }}>
              <span style={{ padding: 'var(--space-8) var(--space-16)', background: 'var(--surface-2)', borderRadius: '6px' }}>Tag 1</span>
              <span style={{ padding: 'var(--space-8) var(--space-16)', background: 'var(--surface-2)', borderRadius: '6px' }}>Tag 2</span>
              <span style={{ padding: 'var(--space-8) var(--space-16)', background: 'var(--surface-2)', borderRadius: '6px' }}>Tag 3</span>
            </div>
          </div>

          <div>
            <p style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: 'var(--space-12)', color: 'var(--text-primary)' }}>
              data-justify="end"
            </p>
            <div className="cluster" data-justify="end" style={{ padding: 'var(--space-16)', background: 'var(--surface-1)', borderRadius: '8px' }}>
              <span style={{ padding: 'var(--space-8) var(--space-16)', background: 'var(--surface-2)', borderRadius: '6px' }}>Action 1</span>
              <span style={{ padding: 'var(--space-8) var(--space-16)', background: 'var(--surface-2)', borderRadius: '6px' }}>Action 2</span>
            </div>
          </div>
        </div>
      </Section>

      {/* Demo 10: Padding Size Comparison */}
      <Section
        align="center"
        width="content"
        paddingY="sm"
        background="surface"
        header={{
          scriptAccent: 'Demo 10',
          title: 'Section Padding Sizes (Visual)',
          lead: 'Each box below uses different padding to show actual size differences',
        }}
      >
        <div className="stack is-loose">
          {[
            { size: 'xs', token: '--space-section-xs', desc: '35px' },
            { size: 'sm', token: '--space-section-sm', desc: '50px' },
            { size: 'md', token: '--space-section-md', desc: '60px' },
            { size: 'lg', token: '--space-section-lg', desc: 'var(--space-80) = 80px' },
            { size: 'xl', token: '--space-section-xl', desc: 'var(--space-96) = 96px' },
            { size: 'fluid', token: '--space-section-fluid', desc: 'clamp(48px, 6vw, 96px)' }
          ].map(({ size, token, desc }) => (
            <div key={size} style={{
              background: 'var(--surface-2)',
              borderRadius: '8px',
              padding: 'var(--space-8)',
              border: '1px solid var(--border-subtle)'
            }}>
              <div style={{
                paddingTop: `var(${token})`,
                paddingBottom: `var(${token})`,
                paddingLeft: 'var(--space-32)',
                paddingRight: 'var(--space-32)',
                background: 'var(--surface-0)',
                borderRadius: '6px',
                border: '2px solid var(--accent-rose)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center'
              }}>
                <div className="cluster" data-justify="between" data-align="baseline">
                  <span style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: '1rem' }}>
                    paddingY="{size}"
                  </span>
                  <span style={{ fontSize: '0.875rem', opacity: 0.7 }}>
                    {desc}
                  </span>
                </div>
                <p style={{ margin: 'var(--space-4) 0 0 0', fontSize: '0.75rem', color: 'var(--text-secondary)', fontFamily: 'monospace', opacity: 0.7 }}>
                  token: {token}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Demo 11: Combined Primitives - Real-world Pattern */}
      <Section
        align="center"
        contentWrapper={true}
        paddingY="xl"
        background="tint-rose"
        header={{
          scriptAccent: 'Demo 11',
          title: 'Combined Primitives Pattern',
          lead: 'Stack + Cluster + Grid working together like real site sections',
        }}
      >
        <div className="stack is-rhythm-section">
          {/* Stats Row - Cluster */}
          <div className="cluster" data-justify="center" style={{ padding: 'var(--space-40)', background: 'var(--surface-1)', borderRadius: '12px' }}>
            {[
              { number: '200+', label: 'Weddings' },
              { number: '5⭐', label: 'Rating' },
              { number: '10', label: 'Acres' }
            ].map((stat, i) => (
              <div key={i} className="stack is-tight" style={{ textAlign: 'center', minWidth: '120px' }}>
                <Heading as={3} size="lg" style={{ color: 'var(--accent-rose)' }}>
                  {stat.number}
                </Heading>
                <Text size="sm" muted style={{ textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  {stat.label}
                </Text>
              </div>
            ))}
          </div>

          {/* Features Grid */}
          <div className="grid is-auto-fit" style={{ ['--grid-min' as any]: '240px' }}>
            {['Flexible', 'Beautiful', 'Professional'].map((feature, i) => (
              <div key={i} className="stack is-compact" style={{ padding: 'var(--space-24)', background: 'var(--surface-1)', borderRadius: '12px', textAlign: 'center' }}>
                <div style={{ width: '56px', height: '56px', background: 'var(--accent-rose)', borderRadius: '50%', margin: '0 auto', display: 'grid', placeItems: 'center', fontSize: '1.5rem' }}>
                  ✨
                </div>
                <Heading as={3} size="sm">
                  {feature}
                </Heading>
                <Text size="md" muted>
                  This card demonstrates Stack primitive for vertical spacing inside Grid primitive for responsive layout.
                </Text>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* Demo 12: Real Section - BrandProof Recreated */}
      <Section
        align="center"
        width="full"
        paddingY="md"
        background="tint-rose"
        header={{
          scriptAccent: 'Demo 12',
          title: 'Real Section: Brand Proof (Recreated)',
          lead: 'Recreating the actual BrandProof section using only primitives - no component CSS needed!',
        }}
      >
        <div className="stack is-rhythm-prose" style={{ textAlign: 'center' }}>
          {/* Brand Logos - using .cluster */}
          <div className="cluster" data-justify="center" style={{
            gap: 'clamp(var(--space-24), 3vw, var(--space-48))',
            flexWrap: 'wrap',
            padding: 'var(--space-24) var(--space-32)',
            background: 'var(--surface-1)',
            borderRadius: '12px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
          }}>
            {['THE KNOT', 'WEDDINGWIRE', 'MARTHA STEWART', 'MINNESOTA BRIDE'].map((brand, i) => (
              <span key={i} style={{
                fontFamily: 'var(--font-serif, serif)',
                fontSize: 'clamp(0.875rem, 2vw, 1.125rem)',
                fontWeight: 400,
                letterSpacing: '0.15em',
                color: 'var(--text-secondary)',
                opacity: 0.85,
                textTransform: 'uppercase'
              }}>
                {brand}
              </span>
            ))}
          </div>

          {/* Testimonial Quote - with background card */}
          <div style={{
            background: 'linear-gradient(135deg, var(--surface-1) 0%, color-mix(in srgb, var(--surface-1) 95%, var(--accent-rose) 5%) 100%)',
            padding: 'clamp(var(--space-40), 5vw, var(--space-56))',
            borderRadius: '16px',
            boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
            border: '1px solid var(--border-subtle)'
          }}>
            <blockquote style={{
              fontSize: 'clamp(1.125rem, 2.5vw, 1.5rem)',
              lineHeight: 1.6,
              color: 'var(--text-primary)',
              fontStyle: 'italic',
              margin: 0
            }}>
              "Rum River Barn isn't just a venue—it's{' '}
              <span style={{
                color: 'var(--accent-rose)',
                fontWeight: 600,
                fontStyle: 'normal'
              }}>
                where dreams come to life
              </span>
              . Their commitment to saying 'yes' to every couple's vision sets them apart as{' '}
              <span style={{
                color: 'var(--accent-rose)',
                fontWeight: 600,
                fontStyle: 'normal'
              }}>
                Minnesota's most accommodating wedding destination
              </span>
              ."
            </blockquote>

            <Text as="p" size="sm" muted style={{
              fontStyle: 'italic',
              margin: 'var(--space-24) 0 0 0'
            }}>
              — Featured in leading wedding publications
            </Text>
          </div>
        </div>
      </Section>

      {/* Demo 13: True Edge-to-Edge Full Width (Flush) */}
      <Section
        align="center"
        width="full"
        container="wrapper"
        paddingY="lg"
        background="dark-gradient"
        tone="dark"
        header={{
          scriptAccent: 'Demo 13',
          title: '100vw Edge-to-Edge (Truly Flush)',
          lead: 'Props: width="full" | container="wrapper"',
        }}
      >
        <div className="stack is-rhythm-prose" style={{
          textAlign: 'center',
          maxWidth: 'none',  // Remove any max-width constraints
        }}>
          {/* Full-width visual bar to prove it's flush */}
          <div style={{
            background: 'linear-gradient(90deg, var(--accent-rose) 0%, var(--accent-gold) 50%, var(--accent-rose) 100%)',
            height: '4px',
            width: '100%',
            margin: '0',
          }} />

          <p style={{
            fontSize: '1rem',
            lineHeight: 1.8,
            opacity: 0.95,
            padding: '0 var(--space-24)',  // Add some breathing room for text readability
            maxWidth: '65ch',
            margin: '0 auto'
          }}>
            This section is truly flush on both sides. The gradient line above extends all the way to the viewport edges with zero horizontal padding or margin. Perfect for full-width image carousels, video heroes, or dramatic visual breaks.
          </p>

          {/* Grid that extends full width */}
          <div className="grid" style={{
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '0',  // No gap for flush tiles
            width: '100%',
            margin: '0'
          }}>
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} style={{
                aspectRatio: '16/9',
                background: `linear-gradient(135deg,
                  color-mix(in srgb, var(--accent-rose) ${20 + i * 10}%, transparent) 0%,
                  color-mix(in srgb, var(--accent-gold) ${15 + i * 8}%, transparent) 100%)`,
                display: 'grid',
                placeItems: 'center',
                fontSize: '2rem',
                fontWeight: 700,
                color: 'white',
                borderRight: i < 6 ? '1px solid rgba(255,255,255,0.1)' : 'none'
              }}>
                {i}
              </div>
            ))}
          </div>

          {/* Another flush element */}
          <div style={{
            background: 'rgba(255,255,255,0.05)',
            padding: 'var(--space-40) var(--space-24)',
            borderTop: '1px solid rgba(255,255,255,0.1)',
            borderBottom: '1px solid rgba(255,255,255,0.1)',
          }}>
            <p style={{
              fontFamily: 'var(--font-serif, serif)',
              fontSize: 'clamp(1.125rem, 2.5vw, 1.5rem)',
              fontStyle: 'italic',
              margin: '0 auto',
              maxWidth: '60ch',
              lineHeight: 1.6
            }}>
              "The background, borders, and grid tiles all extend to the absolute edges of the viewport. No gutters, no margins—just pure full-width design."
            </p>
          </div>
        </div>
      </Section>

      {/* Button System Demo */}
      <Section
        align="center"
        width="content"
        paddingY="xl"
        background="surface"
        header={{
          scriptAccent: 'Demo 14',
          title: 'Button System & Tokens',
          lead: 'Complete button styles using design tokens - no custom CSS needed',
          align: 'center'
        }}
      >
        <div className="stack is-rhythm-section">
          {/* Button Token Reference */}
          <div style={{
            background: 'var(--surface-2)',
            padding: 'var(--space-32)',
            borderRadius: '12px',
            border: '2px solid var(--border-subtle)'
          }}>
            <Heading as={3} size="xs" style={{ marginBottom: 'var(--space-16)' }}>
              Button Design Tokens
            </Heading>
            <div style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.8125rem',
              lineHeight: 1.8,
              color: 'var(--text-secondary)',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: 'var(--space-16)'
            }}>
              <div>
                <div style={{ color: 'var(--text-primary)', fontWeight: 600, marginBottom: 'var(--space-8)' }}>Shape & Spacing:</div>
                <div>--btn-radius: 9999px</div>
                <div>--btn-pad-y: 0.9rem</div>
                <div>--btn-pad-x: 2.25rem</div>
              </div>
              <div>
                <div style={{ color: 'var(--text-primary)', fontWeight: 600, marginBottom: 'var(--space-8)' }}>Primary (Gold):</div>
                <div>--btn-bg-gold: #E4C896</div>
                <div>--btn-fg-on-gold: #2C241A</div>
                <div>--btn-bg-gold-hover: (darker)</div>
              </div>
              <div>
                <div style={{ color: 'var(--text-primary)', fontWeight: 600, marginBottom: 'var(--space-8)' }}>Outline:</div>
                <div>--btn-outline-fg: #FFF8E7</div>
                <div>--btn-outline-border: #E4C896</div>
              </div>
            </div>
          </div>

          {/* Primary Buttons */}
          <div>
            <Heading as={4} size="sm" style={{ marginBottom: 'var(--space-16)' }}>
              Primary Buttons (Gold)
            </Heading>
            <div className="cluster" data-justify="center" style={{ flexWrap: 'wrap' }}>
              <button style={{
                padding: 'var(--btn-pad-y) var(--btn-pad-x)',
                background: 'var(--btn-bg-gold)',
                color: 'var(--btn-fg-on-gold)',
                border: 'none',
                borderRadius: 'var(--btn-radius)',
                fontSize: '1rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all var(--duration-fast) ease',
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'var(--btn-bg-gold-hover)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'var(--btn-bg-gold)'}
              >
                Book Your Tour
              </button>

              <button style={{
                padding: 'calc(var(--btn-pad-y) * 0.75) calc(var(--btn-pad-x) * 0.9)',
                background: 'var(--btn-bg-gold)',
                color: 'var(--btn-fg-on-gold)',
                border: 'none',
                borderRadius: 'var(--btn-radius)',
                fontSize: '0.9375rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all var(--duration-fast) ease',
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'var(--btn-bg-gold-hover)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'var(--btn-bg-gold)'}
              >
                Medium Size
              </button>

              <button style={{
                padding: 'calc(var(--btn-pad-y) * 0.6) calc(var(--btn-pad-x) * 0.75)',
                background: 'var(--btn-bg-gold)',
                color: 'var(--btn-fg-on-gold)',
                border: 'none',
                borderRadius: 'var(--btn-radius)',
                fontSize: '0.875rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all var(--duration-fast) ease',
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'var(--btn-bg-gold-hover)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'var(--btn-bg-gold)'}
              >
                Small
              </button>
            </div>
          </div>

          {/* Outline Buttons */}
          <div>
            <Heading as={4} size="sm" style={{ marginBottom: 'var(--space-16)' }}>
              Outline Buttons
            </Heading>
            <div className="cluster" data-justify="center" style={{ flexWrap: 'wrap' }}>
              <button style={{
                padding: 'var(--btn-pad-y) var(--btn-pad-x)',
                background: 'transparent',
                color: 'var(--text-primary)',
                border: '2px solid var(--btn-outline-border)',
                borderRadius: 'var(--btn-radius)',
                fontSize: '1rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all var(--duration-fast) ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'var(--btn-bg-gold)'
                e.currentTarget.style.color = 'var(--btn-fg-on-gold)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent'
                e.currentTarget.style.color = 'var(--text-primary)'
              }}
              >
                Learn More
              </button>

              <button style={{
                padding: 'var(--btn-pad-y) var(--btn-pad-x)',
                background: 'transparent',
                color: 'var(--accent-rose)',
                border: '2px solid var(--accent-rose)',
                borderRadius: 'var(--btn-radius)',
                fontSize: '1rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all var(--duration-fast) ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'var(--accent-rose)'
                e.currentTarget.style.color = 'white'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent'
                e.currentTarget.style.color = 'var(--accent-rose)'
              }}
              >
                Rose Variant
              </button>
            </div>
          </div>

          {/* Buttons on Image Background */}
          <div>
            <Heading as={4} size="sm" style={{ marginBottom: 'var(--space-16)' }}>
              Buttons on Image Backgrounds (with safety mat)
            </Heading>
            <div style={{
              background: 'linear-gradient(135deg, rgba(0,0,0,0.3), rgba(0,0,0,0.5)), url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Crect width=\'60\' height=\'60\' fill=\'%23d4a373\'/%3E%3Cpath d=\'M0 0L60 60M60 0L0 60\' stroke=\'%23c49563\' stroke-width=\'1\'/%3E%3C/svg%3E")',
              padding: 'var(--space-56)',
              borderRadius: '12px',
              textAlign: 'center'
            }}>
              <div className="cluster" data-justify="center" style={{ flexWrap: 'wrap' }}>
                <button style={{
                  padding: 'var(--btn-pad-y) var(--btn-pad-x)',
                  background: 'var(--btn-outline-on-image-bg)',
                  color: 'var(--btn-outline-fg)',
                  border: '2px solid var(--btn-outline-border)',
                  borderRadius: 'var(--btn-radius)',
                  fontSize: '1rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all var(--duration-fast) ease',
                  backdropFilter: 'blur(4px)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'var(--btn-outline-on-image-bg-hover)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'var(--btn-outline-on-image-bg)'
                }}
                >
                  Explore Gallery
                </button>

                <button style={{
                  padding: 'var(--btn-pad-y) var(--btn-pad-x)',
                  background: 'var(--btn-bg-gold)',
                  color: 'var(--btn-fg-on-gold)',
                  border: 'none',
                  borderRadius: 'var(--btn-radius)',
                  fontSize: '1rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all var(--duration-fast) ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'var(--btn-bg-gold-hover)'
                  e.currentTarget.style.transform = 'translateY(-2px)'
                  e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.3)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'var(--btn-bg-gold)'
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = 'none'
                }}
                >
                  Get Started
                </button>
              </div>
            </div>
          </div>

          {/* Button Groups using Cluster */}
          <div>
            <Heading as={4} size="sm" style={{ marginBottom: 'var(--space-16)' }}>
              Button Groups (using .cluster primitive)
            </Heading>

            <div className="stack is-compact">
              <p style={{
                fontSize: '0.875rem',
                color: 'var(--text-secondary)',
                marginBottom: 'var(--space-8)'
              }}>
                Centered group:
              </p>
              <div className="cluster" data-justify="center">
                <button style={{
                  padding: 'var(--btn-pad-y) var(--btn-pad-x)',
                  background: 'var(--btn-bg-gold)',
                  color: 'var(--btn-fg-on-gold)',
                  border: 'none',
                  borderRadius: 'var(--btn-radius)',
                  fontSize: '1rem',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}>
                  Primary
                </button>
                <button style={{
                  padding: 'var(--btn-pad-y) var(--btn-pad-x)',
                  background: 'transparent',
                  color: 'var(--text-primary)',
                  border: '2px solid var(--border-medium)',
                  borderRadius: 'var(--btn-radius)',
                  fontSize: '1rem',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}>
                  Secondary
                </button>
              </div>

              <Text size="sm" muted style={{
                marginTop: 'var(--space-24)',
                marginBottom: 'var(--space-8)'
              }}>
                Space between (toolbar style):
              </Text>
              <div className="cluster" data-justify="between" style={{
                padding: 'var(--space-16)',
                background: 'var(--surface-2)',
                borderRadius: '8px'
              }}>
                <button style={{
                  padding: 'calc(var(--btn-pad-y) * 0.6) calc(var(--btn-pad-x) * 0.75)',
                  background: 'transparent',
                  color: 'var(--text-primary)',
                  border: '1px solid var(--border-medium)',
                  borderRadius: 'var(--btn-radius)',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  cursor: 'pointer'
                }}>
                  Cancel
                </button>
                <div className="cluster">
                  <button style={{
                    padding: 'calc(var(--btn-pad-y) * 0.6) calc(var(--btn-pad-x) * 0.75)',
                    background: 'transparent',
                    color: 'var(--text-primary)',
                    border: '1px solid var(--border-medium)',
                    borderRadius: 'var(--btn-radius)',
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    cursor: 'pointer'
                  }}>
                    Save Draft
                  </button>
                  <button style={{
                    padding: 'calc(var(--btn-pad-y) * 0.6) calc(var(--btn-pad-x) * 0.75)',
                    background: 'var(--btn-bg-gold)',
                    color: 'var(--btn-fg-on-gold)',
                    border: 'none',
                    borderRadius: 'var(--btn-radius)',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}>
                    Publish
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Code Example */}
          <div style={{
            background: 'var(--surface-1)',
            padding: 'var(--space-32)',
            borderRadius: '12px',
            border: '2px solid var(--border-subtle)'
          }}>
            <Heading as={4} size="sm" style={{ marginBottom: 'var(--space-16)' }}>
              Usage Example
            </Heading>
            <pre style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.8125rem',
              lineHeight: 1.6,
              color: 'var(--text-secondary)',
              margin: 0,
              overflow: 'auto'
            }}>{`<button style={{
  padding: 'var(--btn-pad-y) var(--btn-pad-x)',
  background: 'var(--btn-bg-gold)',
  color: 'var(--btn-fg-on-gold)',
  border: 'none',
  borderRadius: 'var(--btn-radius)',
  fontSize: '1rem',
  fontWeight: 600,
  cursor: 'pointer',
  transition: 'all var(--duration-fast) ease'
}}>
  Book Your Tour
</button>`}</pre>
          </div>
        </div>
      </Section>

      {/* Hero Button Migration Demo */}
      <Section
        align="center"
        width="content"
        paddingY="xl"
        background="dark-gradient"
        tone="dark"
        header={{
          scriptAccent: 'Demo 15',
          title: 'Hero Button Migration',
          lead: 'Home hero button recreated using only primitives and design tokens',
          align: 'center'
        }}
      >
        <div className="stack is-rhythm-section">
          {/* Hero Button Token Reference */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.05)',
            padding: 'var(--space-32)',
            borderRadius: '12px',
            border: '2px solid rgba(255, 255, 255, 0.1)'
          }}>
            <Heading as={3} size="xs" style={{
              marginBottom: 'var(--space-16)',
              color: '#FFF8E7'
            }}>
              Hero Button Contract Requirements
            </Heading>
            <div style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.8125rem',
              lineHeight: 1.8,
              color: 'rgba(255, 248, 231, 0.8)',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: 'var(--space-16)'
            }}>
              <div>
                <div style={{ color: '#FFF8E7', fontWeight: 600, marginBottom: 'var(--space-8)' }}>Layout:</div>
                <div>border-radius: var(--btn-radius)</div>
                <div>padding: var(--space-md) var(--space-2xl)</div>
                <div>background: transparent</div>
              </div>
              <div>
                <div style={{ color: '#FFF8E7', fontWeight: 600, marginBottom: 'var(--space-8)' }}>Typography:</div>
                <div>font-family: var(--font-sans)</div>
                <div>font-weight: 500 (medium)</div>
                <div>font-size: var(--size-sm)</div>
                <div>text-transform: uppercase</div>
                <div>letter-spacing: 0.08em</div>
              </div>
              <div>
                <div style={{ color: '#FFF8E7', fontWeight: 600, marginBottom: 'var(--space-8)' }}>Colors:</div>
                <div>color: var(--btn-outline-fg)</div>
                <div>border: 2px solid var(--btn-outline-border)</div>
                <div>hover-bg: var(--btn-bg-gold)</div>
                <div>hover-color: var(--btn-fg-on-gold)</div>
              </div>
            </div>
          </div>

          {/* Hero Button Demo - Dark Background */}
          <div>
            <Heading as={4} size="sm" style={{
              marginBottom: 'var(--space-16)',
              color: '#FFF8E7'
            }}>
              Hero Button (Recreated with Primitives)
            </Heading>
            <div style={{
              background: 'linear-gradient(135deg, rgba(44, 36, 22, 0.85), rgba(107, 78, 61, 0.75) 50%, rgba(58, 74, 60, 0.80))',
              backgroundImage: 'linear-gradient(135deg, rgba(44, 36, 22, 0.85), rgba(107, 78, 61, 0.75) 50%, rgba(58, 74, 60, 0.80)), url("/images/barn-exterior-full-deck-view-evening.jpg")',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              padding: 'var(--space-64)',
              borderRadius: '12px',
              textAlign: 'center',
              position: 'relative'
            }}>
              <div className="cluster" data-justify="center">
                <a
                  href="#contact"
                  className="hero-cta hero-cta-secondary"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: 'var(--space-md) var(--space-2xl)',
                    background: 'transparent',
                    color: 'var(--btn-outline-fg)',
                    border: '2px solid var(--btn-outline-border)',
                    borderRadius: 'var(--btn-radius)',
                    fontFamily: 'var(--font-sans)',
                    fontWeight: 500,
                    fontSize: 'var(--size-sm)',
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    textDecoration: 'none',
                    cursor: 'pointer',
                    transition: 'transform var(--duration-normal) ease, box-shadow var(--duration-normal) ease, background-color var(--duration-normal) ease, color var(--duration-normal) ease',
                    boxShadow: '0 4px 15px rgba(157, 107, 123, 0.15)',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'var(--btn-bg-gold)'
                    e.currentTarget.style.color = 'var(--btn-fg-on-gold)'
                    e.currentTarget.style.transform = 'translateY(-2px)'
                    e.currentTarget.style.boxShadow = '0 8px 25px rgba(228, 200, 150, 0.4)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent'
                    e.currentTarget.style.color = 'var(--btn-outline-fg)'
                    e.currentTarget.style.transform = 'translateY(0)'
                    e.currentTarget.style.boxShadow = '0 4px 15px rgba(157, 107, 123, 0.15)'
                  }}
                >
                  Schedule Your Visit
                </a>
              </div>
            </div>
          </div>

          {/* Comparison with Standard Button Tokens */}
          <div>
            <Heading as={4} size="sm" style={{
              marginBottom: 'var(--space-16)',
              color: '#FFF8E7'
            }}>
              Side-by-Side Comparison
            </Heading>
            <div style={{
              background: 'linear-gradient(135deg, rgba(44, 36, 22, 0.85), rgba(107, 78, 61, 0.75) 50%, rgba(58, 74, 60, 0.80))',
              backgroundImage: 'linear-gradient(135deg, rgba(44, 36, 22, 0.85), rgba(107, 78, 61, 0.75) 50%, rgba(58, 74, 60, 0.80)), url("/images/barn-exterior-full-deck-view-evening.jpg")',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              padding: 'var(--space-48)',
              borderRadius: '12px'
            }}>
              <div className="stack is-compact" data-align="center">
                <Text size="sm" style={{
                  color: '#FFF8E7',
                  marginBottom: 'var(--space-16)',
                  opacity: 0.9
                }}>
                  Original Hero Button (using hero.css):
                </Text>
                <a
                  href="#contact"
                  className="hero-cta hero-cta-secondary"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: 'var(--space-md) var(--space-2xl)',
                    background: 'transparent',
                    color: 'var(--btn-outline-fg)',
                    border: '2px solid var(--btn-outline-border)',
                    borderRadius: 'var(--btn-radius)',
                    fontFamily: 'var(--font-sans)',
                    fontWeight: 500,
                    fontSize: 'var(--size-sm)',
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    textDecoration: 'none',
                    cursor: 'pointer',
                    transition: 'transform var(--duration-normal) ease, box-shadow var(--duration-normal) ease, background-color var(--duration-normal) ease, color var(--duration-normal) ease',
                    boxShadow: '0 4px 15px rgba(157, 107, 123, 0.15)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'var(--btn-bg-gold)'
                    e.currentTarget.style.color = 'var(--btn-fg-on-gold)'
                    e.currentTarget.style.transform = 'translateY(-2px)'
                    e.currentTarget.style.boxShadow = '0 8px 25px rgba(228, 200, 150, 0.4)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent'
                    e.currentTarget.style.color = 'var(--btn-outline-fg)'
                    e.currentTarget.style.transform = 'translateY(0)'
                    e.currentTarget.style.boxShadow = '0 4px 15px rgba(157, 107, 123, 0.15)'
                  }}
                >
                  Schedule Your Visit
                </a>

                <div style={{
                  width: '2px',
                  height: '24px',
                  background: 'rgba(228, 200, 150, 0.3)',
                  margin: 'var(--space-16) 0'
                }} />

                <Text size="sm" style={{
                  color: '#FFF8E7',
                  marginBottom: 'var(--space-16)',
                  opacity: 0.9
                }}>
                  Alternative with Standard Button Tokens:
                </Text>
                <button style={{
                  padding: 'var(--btn-pad-y) var(--btn-pad-x)',
                  background: 'transparent',
                  color: 'var(--btn-outline-fg)',
                  border: '2px solid var(--btn-outline-border)',
                  borderRadius: 'var(--btn-radius)',
                  fontFamily: 'var(--font-sans)',
                  fontWeight: 600,
                  fontSize: '0.875rem',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                  transition: 'all var(--duration-fast) ease',
                  boxShadow: '0 4px 15px rgba(157, 107, 123, 0.15)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'var(--btn-bg-gold)'
                  e.currentTarget.style.color = 'var(--btn-fg-on-gold)'
                  e.currentTarget.style.transform = 'translateY(-2px)'
                  e.currentTarget.style.boxShadow = '0 8px 25px rgba(228, 200, 150, 0.4)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent'
                  e.currentTarget.style.color = 'var(--btn-outline-fg)'
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = '0 4px 15px rgba(157, 107, 123, 0.15)'
                }}
                >
                  Schedule Your Visit
                </button>
              </div>
            </div>
          </div>

          {/* Code Example */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.05)',
            padding: 'var(--space-32)',
            borderRadius: '12px',
            border: '2px solid rgba(255, 255, 255, 0.1)'
          }}>
            <Heading as={4} size="sm" style={{
              marginBottom: 'var(--space-16)',
              color: '#FFF8E7'
            }}>
              Usage Example (Primitives Only)
            </Heading>
            <pre style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.8125rem',
              lineHeight: 1.6,
              color: 'rgba(255, 248, 231, 0.8)',
              margin: 0,
              overflow: 'auto'
            }}>{`<a
  href="#contact"
  className="hero-cta hero-cta-secondary"
  style={{
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 'var(--space-md) var(--space-2xl)', // 1rem 2.5rem
    background: 'transparent',
    color: 'var(--btn-outline-fg)',
    border: '2px solid var(--btn-outline-border)',
    borderRadius: 'var(--btn-radius)',
    fontFamily: 'var(--font-sans)',
    fontWeight: 500,
    fontSize: 'var(--size-sm)',
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    textDecoration: 'none',
    cursor: 'pointer',
    transition: 'transform var(--duration-normal) ease, background-color var(--duration-normal) ease',
    boxShadow: '0 4px 15px rgba(157, 107, 123, 0.15)'
  }}
>
  Schedule Your Visit
</a>`}</pre>
          </div>

          {/* Test Contract Verification */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.05)',
            padding: 'var(--space-32)',
            borderRadius: '12px',
            border: '2px solid rgba(255, 255, 255, 0.1)'
          }}>
            <Heading as={4} size="sm" style={{
              marginBottom: 'var(--space-16)',
              color: '#FFF8E7'
            }}>
              Playwright Test Contract Compliance
            </Heading>
            <div style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.8125rem',
              lineHeight: 1.8,
              color: 'rgba(255, 248, 231, 0.8)'
            }}>
              <div style={{ marginBottom: 'var(--space-12)' }}>
                <span style={{ color: 'var(--schedule-success)' }}>✓</span> border-radius: var(--btn-radius) = 9999px ✓
              </div>
              <div style={{ marginBottom: 'var(--space-12)' }}>
                <span style={{ color: 'var(--schedule-success)' }}>✓</span> padding-y: var(--space-md) = 1rem (16px) ✓
              </div>
              <div style={{ marginBottom: 'var(--space-12)' }}>
                <span style={{ color: 'var(--schedule-success)' }}>✓</span> padding-x: var(--space-2xl) = 2.5rem (40px) ✓
              </div>
              <div style={{ marginBottom: 'var(--space-12)' }}>
                <span style={{ color: 'var(--schedule-success)' }}>✓</span> font-family: var(--font-sans) ✓
              </div>
              <div style={{ marginBottom: 'var(--space-12)' }}>
                <span style={{ color: 'var(--schedule-success)' }}>✓</span> font-weight: 500 (≥ 400 required) ✓
              </div>
              <div style={{ marginBottom: 'var(--space-12)' }}>
                <span style={{ color: 'var(--schedule-success)' }}>✓</span> color: var(--btn-outline-fg) ✓
              </div>
              <div style={{ marginBottom: 'var(--space-12)' }}>
                <span style={{ color: 'var(--schedule-success)' }}>✓</span> border: 2px solid var(--btn-outline-border) ✓
              </div>
              <div>
                <span style={{ color: 'var(--schedule-success)' }}>✓</span> background: transparent ✓
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* Color Token Verification Section */}
      <Section
        align="center"
        width="wide"
        paddingY="xl"
        background="surface"
        header={{
          scriptAccent: 'Theme Colors',
          title: 'Color Token System',
          lead: 'Complete color palette with automatic light/dark mode support',
          align: 'center'
        }}
      >
        <div className="stack is-rhythm-section">
          {/* Color Token Table */}
          <div style={{
            background: 'var(--surface-1)',
            border: '2px solid var(--border-subtle)',
            borderRadius: '12px',
            overflow: 'hidden',
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
          }}>
            {/* Table Header */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '200px 80px minmax(300px, 1fr) 80px',
              gap: '16px',
              padding: '20px 24px',
              background: 'var(--accent-rose)',
              color: 'white',
              fontWeight: 600,
              fontSize: '0.875rem',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              <div>Token Name</div>
              <div>Swatch</div>
              <div>Definition</div>
              <div>Category</div>
            </div>

            {/* Group by category */}
            {['Surfaces', 'Text', 'Accents', 'Borders', 'Backgrounds', 'States', 'Legacy Aliases'].map(category => {
              const tokensInCategory = COLOR_TOKENS.filter(t => t.category === category)
              return (
                <div key={category}>
                  <div style={{
                    padding: '12px 24px',
                    background: 'var(--bg-tint-rose)',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    color: 'var(--text-primary)',
                    borderTop: '1px solid var(--border-subtle)',
                  }}>
                    {category} ({tokensInCategory.length})
                  </div>
                  {tokensInCategory.map((token, idx) => (
                    <div
                      key={token.name}
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '200px 80px minmax(300px, 1fr) 80px',
                        gap: '16px',
                        padding: '16px 24px',
                        borderTop: idx === 0 ? 'none' : '1px solid var(--border-subtle)',
                        fontSize: '0.875rem',
                        alignItems: 'center'
                      }}
                    >
                      <code style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.8125rem',
                        color: 'var(--text-primary)',
                        fontWeight: 500
                      }}>
                        {token.name}
                      </code>
                      <div style={{
                        width: '60px',
                        height: '40px',
                        background: `var(${token.name})`,
                        border: '2px solid var(--border-medium)',
                        borderRadius: '6px',
                        boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.1)'
                      }} />
                      <div style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.75rem',
                        color: 'var(--text-secondary)',
                        lineHeight: 1.5
                      }}>
                        {token.hardcoded}
                      </div>
                      <div style={{
                        fontSize: '0.75rem',
                        color: 'var(--text-secondary)',
                        textAlign: 'right'
                      }}>
                        {category}
                      </div>
                    </div>
                  ))}
                </div>
              )
            })}
          </div>
        </div>
      </Section>

      {/* Background Options - Light Mode */}
      <Section
        align="center"
        width="content"
        paddingY="lg"
        background="surface"
        header={{
          scriptAccent: 'Light Mode',
          title: 'Background Color Options',
          lead: 'Section background variants available via the background prop',
          align: 'center'
        }}
      >
        <div className="stack is-loose">
          {/* surface */}
          <div style={{
            background: 'var(--bg-surface)',
            padding: 'var(--space-48) var(--space-32)',
            borderRadius: '12px',
            border: '2px solid var(--border-medium)',
            textAlign: 'center'
          }}>
            <h3 style={{
              fontSize: '1.5rem',
              fontWeight: 600,
              marginBottom: 'var(--space-12)',
              color: 'var(--text-primary)'
            }}>
              background=&quot;surface&quot;
            </h3>
            <p style={{
              fontSize: '0.875rem',
              color: 'var(--text-secondary)',
              fontFamily: 'var(--font-mono)'
            }}>
              var(--bg-surface) = var(--theme-bg-primary, #FFFCF8)
            </p>
          </div>

          {/* tint-rose */}
          <div style={{
            background: 'var(--bg-tint-rose)',
            padding: 'var(--space-48) var(--space-32)',
            borderRadius: '12px',
            border: '2px solid var(--border-medium)',
            textAlign: 'center'
          }}>
            <h3 style={{
              fontSize: '1.5rem',
              fontWeight: 600,
              marginBottom: 'var(--space-12)',
              color: 'var(--text-primary)'
            }}>
              background=&quot;tint-rose&quot;
            </h3>
            <p style={{
              fontSize: '0.875rem',
              color: 'var(--text-secondary)',
              fontFamily: 'var(--font-mono)'
            }}>
              var(--bg-tint-rose) = color-mix(in srgb, surface 92%, rose 8%)
            </p>
          </div>

          {/* tint-sage */}
          <div style={{
            background: 'var(--bg-tint-sage)',
            padding: 'var(--space-48) var(--space-32)',
            borderRadius: '12px',
            border: '2px solid var(--border-medium)',
            textAlign: 'center'
          }}>
            <h3 style={{
              fontSize: '1.5rem',
              fontWeight: 600,
              marginBottom: 'var(--space-12)',
              color: 'var(--text-primary)'
            }}>
              background=&quot;tint-sage&quot;
            </h3>
            <p style={{
              fontSize: '0.875rem',
              color: 'var(--text-secondary)',
              fontFamily: 'var(--font-mono)'
            }}>
              var(--bg-tint-sage) = color-mix(in srgb, surface 92%, sage 8%)
            </p>
          </div>

          {/* dark-gradient */}
          <div style={{
            background: 'var(--bg-dark-grad)',
            padding: 'var(--space-48) var(--space-32)',
            borderRadius: '12px',
            border: '2px solid var(--accent-gold)',
            textAlign: 'center'
          }}>
            <h3 style={{
              fontSize: '1.5rem',
              fontWeight: 600,
              marginBottom: 'var(--space-12)',
              color: 'white'
            }}>
              background=&quot;dark-gradient&quot;
            </h3>
            <p style={{
              fontSize: '0.875rem',
              color: 'rgba(255,255,255,0.85)',
              fontFamily: 'var(--font-mono)'
            }}>
              var(--bg-dark-grad) = linear-gradient(135deg, #2C2416, #3D2F22)
            </p>
          </div>
        </div>
      </Section>

      {/* Section Background Prop Demo */}
      <Section
        align="center"
        width="content"
        paddingY="lg"
        background="tint-rose"
        header={{
          scriptAccent: 'Component Integration',
          title: 'Using Section Background Props',
          lead: 'How to use background color options in the Section component',
          align: 'center'
        }}
      >
        <div className="stack is-rhythm-prose">
          <div style={{
            background: 'var(--surface-1)',
            padding: 'var(--space-32)',
            borderRadius: '12px',
            border: '2px solid var(--border-subtle)'
          }}>
            <h3 style={{
              fontSize: '1.25rem',
              fontWeight: 600,
              marginBottom: 'var(--space-16)',
              color: 'var(--text-primary)'
            }}>
              Section Component Props
            </h3>
            <div style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.875rem',
              lineHeight: 1.8,
              color: 'var(--text-secondary)'
            }}>
              <div>&lt;Section background=&quot;surface&quot;&gt;</div>
              <div>&lt;Section background=&quot;tint-rose&quot;&gt;</div>
              <div>&lt;Section background=&quot;tint-sage&quot;&gt;</div>
              <div>&lt;Section background=&quot;dark-gradient&quot;&gt;</div>
              <div style={{ marginTop: 'var(--space-16)', color: 'var(--text-primary)' }}>
                {/* With image background */}
              </div>
              <div>&lt;Section background=&quot;image&quot; image=&#123;&#123; src: &quot;/path.jpg&quot; &#125;&#125;&gt;</div>
            </div>
          </div>

          <div style={{
            background: 'linear-gradient(135deg, var(--accent-rose) 0%, var(--accent-gold) 100%)',
            padding: 'var(--space-40)',
            borderRadius: '12px',
            color: 'white',
            textAlign: 'center'
          }}>
            <p style={{
              fontSize: '1.125rem',
              fontWeight: 500,
              margin: 0,
              lineHeight: 1.6
            }}>
              All background options automatically adapt to light and dark themes, ensuring consistent visual hierarchy and readability across theme modes.
            </p>
          </div>
        </div>
      </Section>

      {/* Dark Mode Preview Note */}
      <Section
        align="center"
        width="prose"
        paddingY="md"
        background="dark-gradient"
        tone="dark"
      >
        <div style={{
          textAlign: 'center',
          padding: 'var(--space-32)',
          border: '2px dashed var(--accent-gold)',
          borderRadius: '12px',
          background: 'rgba(0,0,0,0.2)'
        }}>
          <p style={{
            fontSize: '1.125rem',
            color: 'var(--accent-gold)',
            fontWeight: 600,
            margin: 0,
            marginBottom: 'var(--space-12)'
          }}>
            Dark Mode Preview
          </p>
          <p style={{
            fontSize: '0.9375rem',
            color: 'rgba(255,255,255,0.85)',
            margin: 0,
            lineHeight: 1.6
          }}>
            To see dark mode colors in action, add <code style={{
              fontFamily: 'var(--font-mono)',
              background: 'rgba(255,255,255,0.1)',
              padding: '2px 8px',
              borderRadius: '4px',
              fontSize: '0.875rem'
            }}>data-theme=&quot;dark&quot;</code> to the <code style={{
              fontFamily: 'var(--font-mono)',
              background: 'rgba(255,255,255,0.1)',
              padding: '2px 8px',
              borderRadius: '4px',
              fontSize: '0.875rem'
            }}>&lt;html&gt;</code> element or use your browser&apos;s DevTools to toggle the OS color scheme preference.
          </p>
        </div>
      </Section>

      {/* Demo 16: Measure Utilities - Readable Line Lengths */}
      <Section
        align="center"
        width="content"
        paddingY="lg"
        background="surface"
        header={{
          scriptAccent: 'Demo 16',
          title: 'Measure Utilities',
          lead: 'Control line length for optimal readability using .measure classes',
          align: 'center'
        }}
      >
        <div className="stack is-rhythm-section">
          {/* Measure Tight (52ch) */}
          <div style={{
            background: 'var(--surface-1)',
            padding: 'var(--space-32)',
            borderRadius: '12px',
            border: '2px solid var(--border-subtle)'
          }}>
            <h3 style={{
              fontWeight: 600,
              marginBottom: 'var(--space-16)',
              color: 'var(--accent-rose)',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.875rem'
            }}>
              .measure--tight (52ch)
            </h3>
            <div className="measure--tight">
              <Text size="sm">
                This paragraph demonstrates the tight measure utility, which limits line length to 52 characters. This is ideal for shorter text blocks, captions, or sidebars where a narrower column creates better readability. The tight measure prevents lines from becoming too long and helps maintain reader focus on compact content areas.
              </Text>
            </div>
            <div style={{
              marginTop: 'var(--space-16)',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.75rem',
              color: 'var(--text-secondary)'
            }}>
              max-width: var(--measure-tight) = 52ch
            </div>
          </div>

          {/* Measure Default (66ch) */}
          <div style={{
            background: 'var(--surface-1)',
            padding: 'var(--space-32)',
            borderRadius: '12px',
            border: '2px solid var(--border-subtle)'
          }}>
            <h3 style={{
              fontWeight: 600,
              marginBottom: 'var(--space-16)',
              color: 'var(--accent-rose)',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.875rem'
            }}>
              .measure (66ch) - Optimal Reading Width
            </h3>
            <div className="measure">
              <Text size="md">
                This paragraph uses the default measure utility, set at 66 characters per line. Research shows this is the optimal line length for body text, balancing readability with efficient use of space. Lines that are too long cause readers to lose their place when moving to the next line, while lines that are too short create choppy, inefficient reading. The 66-character measure hits the sweet spot for comfortable, sustained reading of longer content like blog posts, articles, or documentation.
              </Text>
            </div>
            <div style={{
              marginTop: 'var(--space-16)',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.75rem',
              color: 'var(--text-secondary)'
            }}>
              max-width: var(--measure) = 66ch
            </div>
          </div>

          {/* Measure Loose (72ch) */}
          <div style={{
            background: 'var(--surface-1)',
            padding: 'var(--space-32)',
            borderRadius: '12px',
            border: '2px solid var(--border-subtle)'
          }}>
            <h3 style={{
              fontWeight: 600,
              marginBottom: 'var(--space-16)',
              color: 'var(--accent-rose)',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.875rem'
            }}>
              .measure--loose (72ch)
            </h3>
            <div className="measure--loose">
              <Text size="lg">
                This paragraph demonstrates the loose measure utility at 72 characters. This wider measure is appropriate for larger text sizes where the increased font size naturally improves readability even with longer lines. Use this for text that needs to feel more spacious or for larger type where the standard measure might feel cramped. The loose measure also works well for text with generous line-height where the vertical spacing helps guide the eye back to the start of each line.
              </Text>
            </div>
            <div style={{
              marginTop: 'var(--space-16)',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.75rem',
              color: 'var(--text-secondary)'
            }}>
              max-width: var(--measure-loose) = 72ch
            </div>
          </div>

          {/* Usage Example */}
          <div style={{
            background: 'var(--bg-tint-sage)',
            padding: 'var(--space-32)',
            borderRadius: '12px',
            border: '2px solid var(--border-medium)'
          }}>
            <h3 style={{
              fontSize: '1.125rem',
              fontWeight: 600,
              marginBottom: 'var(--space-16)',
              color: 'var(--text-primary)'
            }}>
              Usage in JSX
            </h3>
            <pre style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.8125rem',
              lineHeight: 1.6,
              color: 'var(--text-secondary)',
              margin: 0,
              whiteSpace: 'pre-wrap'
            }}>{`<div className="measure">
  <Text size="md">
    Long paragraph text that needs optimal reading width (66ch)
  </Text>
</div>

<div className="measure--tight">
  <Text size="sm">Shorter text with tight measure (52ch)</Text>
</div>

<div className="measure--loose">
  <Text size="lg">Large text with loose measure (72ch)</Text>
</div>`}</pre>
          </div>
        </div>
      </Section>

      {/* Demo 17: Muted Text Variants */}
      <Section
        align="center"
        width="content"
        paddingY="lg"
        background="tint-rose"
        header={{
          scriptAccent: 'Demo 17',
          title: 'Muted Text Variants',
          lead: 'Reduce emphasis with automatic opacity adjustment for secondary content',
          align: 'center'
        }}
      >
        <div className="stack is-rhythm-section">
          {/* Heading Comparison */}
          <div style={{
            background: 'var(--surface-1)',
            padding: 'var(--space-32)',
            borderRadius: '12px',
            border: '2px solid var(--border-subtle)'
          }}>
            <h3 style={{
              fontSize: '1.125rem',
              fontWeight: 600,
              marginBottom: 'var(--space-24)',
              color: 'var(--text-primary)'
            }}>
              Heading Variants
            </h3>

            <div style={{ marginBottom: 'var(--space-32)' }}>
              <div style={{
                marginBottom: 'var(--space-8)',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.75rem',
                color: 'var(--text-secondary)'
              }}>
                Normal (100% opacity):
              </div>
              <Heading as={2} size="lg">
                Primary Heading - Full Emphasis
              </Heading>
            </div>

            <div>
              <div style={{
                marginBottom: 'var(--space-8)',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.75rem',
                color: 'var(--text-secondary)'
              }}>
                Muted (70% opacity):
              </div>
              <Heading as={2} size="lg" muted>
                Secondary Heading - Reduced Emphasis
              </Heading>
            </div>

            <div style={{
              marginTop: 'var(--space-24)',
              padding: 'var(--space-16)',
              background: 'var(--bg-tint-sage)',
              borderRadius: '8px',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.75rem',
              color: 'var(--text-secondary)'
            }}>
              <div>--text-muted: color-mix(in oklch, var(--text-primary) 70%, transparent)</div>
              <div style={{ marginTop: '8px' }}>Dark mode: 65% opacity for better contrast</div>
            </div>
          </div>

          {/* Text Comparison */}
          <div style={{
            background: 'var(--surface-1)',
            padding: 'var(--space-32)',
            borderRadius: '12px',
            border: '2px solid var(--border-subtle)'
          }}>
            <h3 style={{
              fontSize: '1.125rem',
              fontWeight: 600,
              marginBottom: 'var(--space-24)',
              color: 'var(--text-primary)'
            }}>
              Body Text Variants
            </h3>

            <div style={{ marginBottom: 'var(--space-32)' }}>
              <div style={{
                marginBottom: 'var(--space-8)',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.75rem',
                color: 'var(--text-secondary)'
              }}>
                Normal text:
              </div>
              <Text size="md">
                This is standard body text with full color emphasis. Use this for primary content that needs maximum readability and prominence. Perfect for main paragraphs, important announcements, or key information.
              </Text>
            </div>

            <div>
              <div style={{
                marginBottom: 'var(--space-8)',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.75rem',
                color: 'var(--text-secondary)'
              }}>
                Muted text:
              </div>
              <Text size="md" muted>
                This is muted body text with reduced color emphasis. Use this for secondary information like descriptions, captions, metadata, or supporting details that complement but don&apos;t compete with primary content.
              </Text>
            </div>
          </div>

          {/* Use Cases */}
          <div style={{
            background: 'var(--surface-1)',
            padding: 'var(--space-32)',
            borderRadius: '12px',
            border: '2px solid var(--border-subtle)'
          }}>
            <h3 style={{
              fontSize: '1.125rem',
              fontWeight: 600,
              marginBottom: 'var(--space-16)',
              color: 'var(--text-primary)'
            }}>
              Common Use Cases
            </h3>

            <div className="stack is-rhythm-prose" style={{ gap: 'var(--space-24)' }}>
              {/* Card Example */}
              <div style={{
                padding: 'var(--space-24)',
                border: '1px solid var(--border-medium)',
                borderRadius: '8px'
              }}>
                <Heading as={3} size="md">
                  Article Title
                </Heading>
                <Heading as={4} size="sm" muted style={{ marginTop: 'var(--space-8)' }}>
                  Subtitle or Secondary Information
                </Heading>
                <Text size="md" style={{ marginTop: 'var(--space-16)' }}>
                  Main article content goes here with full emphasis...
                </Text>
                <Text size="sm" muted style={{ marginTop: 'var(--space-12)' }}>
                  Posted 2 days ago · 5 min read
                </Text>
              </div>

              {/* Code Example */}
              <div style={{
                background: 'var(--bg-tint-sage)',
                padding: 'var(--space-24)',
                borderRadius: '8px'
              }}>
                <pre style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.8125rem',
                  lineHeight: 1.6,
                  margin: 0,
                  whiteSpace: 'pre-wrap'
                }}>{`<Heading as={3} size="sm" muted>
  Secondary Heading (70% opacity)
</Heading>

<Text size="sm" muted>
  Muted body text for less emphasis
</Text>`}</pre>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* Demo 18: Text Balance Control */}
      <Section
        align="center"
        width="content"
        paddingY="lg"
        background="surface"
        header={{
          scriptAccent: 'Demo 18',
          title: 'Text Balance Control',
          lead: 'Prevent orphaned words and create visually balanced headings',
          align: 'center'
        }}
      >
        <div className="stack is-rhythm-section">
          {/* Balanced (Default) */}
          <div style={{
            background: 'var(--surface-1)',
            padding: 'var(--space-32)',
            borderRadius: '12px',
            border: '2px solid var(--border-subtle)'
          }}>
            <h3 style={{
              fontWeight: 600,
              marginBottom: 'var(--space-16)',
              color: 'var(--accent-rose)',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.875rem'
            }}>
              Balanced (Default) - text-wrap: balance
            </h3>

            <div style={{
              maxWidth: '600px',
              margin: '0 auto',
              padding: 'var(--space-24)',
              background: 'var(--bg-tint-rose)',
              borderRadius: '8px'
            }}>
              <Heading as={2} size="xl">
                This Heading Uses Text Wrap Balance for Better Typography
              </Heading>
            </div>

            <div style={{
              marginTop: 'var(--space-16)',
              padding: 'var(--space-16)',
              background: 'var(--bg-tint-sage)',
              borderRadius: '8px'
            }}>
              <div style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.75rem',
                color: 'var(--text-secondary)',
                lineHeight: 1.6
              }}>
                <div>✓ Lines have similar length</div>
                <div>✓ No orphaned words</div>
                <div>✓ Visually balanced appearance</div>
                <div style={{ marginTop: '12px', color: 'var(--text-primary)' }}>
                  text-wrap: balance (browser automatically balances line breaks)
                </div>
              </div>
            </div>
          </div>

          {/* Not Balanced */}
          <div style={{
            background: 'var(--surface-1)',
            padding: 'var(--space-32)',
            borderRadius: '12px',
            border: '2px solid var(--border-subtle)'
          }}>
            <h3 style={{
              fontWeight: 600,
              marginBottom: 'var(--space-16)',
              color: 'var(--accent-rose)',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.875rem'
            }}>
              Not Balanced - balance=&#123;false&#125;
            </h3>

            <div style={{
              maxWidth: '600px',
              margin: '0 auto',
              padding: 'var(--space-24)',
              background: 'var(--bg-tint-rose)',
              borderRadius: '8px'
            }}>
              <Heading as={2} size="xl" balance={false}>
                This Heading Uses Text Wrap Balance for Better Typography
              </Heading>
            </div>

            <div style={{
              marginTop: 'var(--space-16)',
              padding: 'var(--space-16)',
              background: 'rgba(180, 0, 32, 0.1)',
              borderRadius: '8px',
              border: '1px solid rgba(180, 0, 32, 0.2)'
            }}>
              <div style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.75rem',
                color: 'var(--text-secondary)',
                lineHeight: 1.6
              }}>
                <div>✗ Uneven line lengths</div>
                <div>✗ May have orphaned words</div>
                <div>✗ Natural browser wrapping (less visually balanced)</div>
                <div style={{ marginTop: '12px', color: 'var(--text-primary)' }}>
                  text-wrap: normal (standard browser line breaking)
                </div>
              </div>
            </div>
          </div>

          {/* When to Use Each */}
          <div style={{
            background: 'var(--surface-1)',
            padding: 'var(--space-32)',
            borderRadius: '12px',
            border: '2px solid var(--border-subtle)'
          }}>
            <h3 style={{
              fontSize: '1.125rem',
              fontWeight: 600,
              marginBottom: 'var(--space-24)',
              color: 'var(--text-primary)'
            }}>
              When to Use Each Variant
            </h3>

            <div className="stack is-rhythm-prose" style={{ gap: 'var(--space-24)' }}>
              <div>
                <Heading as={4} size="sm" style={{ color: 'var(--accent-rose)' }}>
                  Use Balance (Default)
                </Heading>
                <Text size="sm" muted style={{ marginTop: 'var(--space-8)' }}>
                  ✓ Headlines and page titles<br/>
                  ✓ Card titles and section headers<br/>
                  ✓ Any heading where visual balance matters<br/>
                  ✓ Marketing copy and hero text
                </Text>
              </div>

              <div>
                <Heading as={4} size="sm" style={{ color: 'var(--accent-rose)' }}>
                  Use balance=&#123;false&#125;
                </Heading>
                <Text size="sm" muted style={{ marginTop: 'var(--space-8)' }}>
                  ✓ Very long headings (6+ words)<br/>
                  ✓ Headings that need natural flow<br/>
                  ✓ Technical documentation titles<br/>
                  ✓ When you specifically want natural wrapping
                </Text>
              </div>
            </div>
          </div>

          {/* Progressive Enhancement Note */}
          <div style={{
            background: 'linear-gradient(135deg, var(--accent-rose) 0%, var(--accent-gold) 100%)',
            padding: 'var(--space-32)',
            borderRadius: '12px',
            color: 'white',
            textAlign: 'center'
          }}>
            <h3 style={{
              fontSize: '1.125rem',
              fontWeight: 600,
              marginBottom: 'var(--space-12)'
            }}>
              Progressive Enhancement
            </h3>
            <p style={{
              fontSize: '0.9375rem',
              margin: 0,
              lineHeight: 1.6,
              opacity: 0.95
            }}>
              For browsers that don&apos;t support <code style={{
                fontFamily: 'var(--font-mono)',
                background: 'rgba(255,255,255,0.2)',
                padding: '2px 6px',
                borderRadius: '4px'
              }}>text-wrap: balance</code>, headings automatically enable <code style={{
                fontFamily: 'var(--font-mono)',
                background: 'rgba(255,255,255,0.2)',
                padding: '2px 6px',
                borderRadius: '4px'
              }}>hyphens: auto</code> as a fallback to prevent orphaned words.
            </p>
          </div>

          {/* Usage Example */}
          <div style={{
            background: 'var(--bg-tint-sage)',
            padding: 'var(--space-32)',
            borderRadius: '12px',
            border: '2px solid var(--border-medium)'
          }}>
            <h3 style={{
              fontSize: '1.125rem',
              fontWeight: 600,
              marginBottom: 'var(--space-16)',
              color: 'var(--text-primary)'
            }}>
              Usage in JSX
            </h3>
            <pre style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.8125rem',
              lineHeight: 1.6,
              color: 'var(--text-secondary)',
              margin: 0,
              whiteSpace: 'pre-wrap'
            }}>{`{/* Default: balanced text wrapping */}
<Heading as={2} size="lg">
  This heading will use text-wrap: balance
</Heading>

{/* Opt out of text balancing */}
<Heading as={2} size="lg" balance={false}>
  This heading will NOT use text-wrap: balance
</Heading>`}</pre>
          </div>
        </div>
      </Section>

      {/* Demo 19: Glass Primitive - Glassmorphism Effects */}
      <Section
        background="tint-rose"
        paddingY="lg"
        contentWrapper={false}
        header={{
          title: 'Demo 19: Glass Primitive',
          lead: 'Glassmorphism effects with token-driven blur, transparency, and elevation variants',
          align: 'center'
        }}
      >
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 var(--gutter)'
        }}>
          {/* Glass elevation demo */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: 'var(--space-24)',
            marginBottom: 'var(--space-48)'
          }}>
            <div data-glass data-elevation="sm" style={{
              padding: 'var(--space-24)',
              borderRadius: '12px'
            }}>
              <h4 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: 'var(--space-8)' }}>
                Small Elevation
              </h4>
              <p style={{ fontSize: '0.875rem', lineHeight: 1.6, margin: 0 }}>
                data-glass data-elevation=&quot;sm&quot;
              </p>
            </div>

            <div data-glass data-elevation="md" style={{
              padding: 'var(--space-24)',
              borderRadius: '12px'
            }}>
              <h4 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: 'var(--space-8)' }}>
                Medium (Default)
              </h4>
              <p style={{ fontSize: '0.875rem', lineHeight: 1.6, margin: 0 }}>
                data-glass data-elevation=&quot;md&quot;
              </p>
            </div>

            <div data-glass data-elevation="lg" style={{
              padding: 'var(--space-24)',
              borderRadius: '12px'
            }}>
              <h4 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: 'var(--space-8)' }}>
                Large Elevation
              </h4>
              <p style={{ fontSize: '0.875rem', lineHeight: 1.6, margin: 0 }}>
                data-glass data-elevation=&quot;lg&quot;
              </p>
            </div>

            <div data-glass data-elevation="xl" style={{
              padding: 'var(--space-24)',
              borderRadius: '12px'
            }}>
              <h4 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: 'var(--space-8)' }}>
                Extra Large
              </h4>
              <p style={{ fontSize: '0.875rem', lineHeight: 1.6, margin: 0 }}>
                data-glass data-elevation=&quot;xl&quot;
              </p>
            </div>
          </div>

          {/* Strong variant demo */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: 'var(--space-24)',
            marginBottom: 'var(--space-48)'
          }}>
            <div data-glass data-elevation="md" style={{
              padding: 'var(--space-24)',
              borderRadius: '12px'
            }}>
              <h4 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: 'var(--space-8)' }}>
                Normal Opacity
              </h4>
              <p style={{ fontSize: '0.875rem', lineHeight: 1.6, margin: 0 }}>
                data-glass data-elevation=&quot;md&quot;
              </p>
            </div>

            <div data-glass data-elevation="md" data-strong style={{
              padding: 'var(--space-24)',
              borderRadius: '12px'
            }}>
              <h4 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: 'var(--space-8)' }}>
                Strong (More Opaque)
              </h4>
              <p style={{ fontSize: '0.875rem', lineHeight: 1.6, margin: 0 }}>
                data-glass data-elevation=&quot;md&quot; data-strong
              </p>
            </div>
          </div>

          {/* Tinted glass demo */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: 'var(--space-24)',
            marginBottom: 'var(--space-48)'
          }}>
            <div data-glass data-surface="rose" style={{
              padding: 'var(--space-24)',
              borderRadius: '12px'
            }}>
              <h4 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: 'var(--space-8)' }}>
                Rose Tint
              </h4>
              <p style={{ fontSize: '0.875rem', lineHeight: 1.6, margin: 0 }}>
                data-glass data-surface=&quot;rose&quot;
              </p>
            </div>

            <div data-glass data-surface="gold" style={{
              padding: 'var(--space-24)',
              borderRadius: '12px'
            }}>
              <h4 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: 'var(--space-8)' }}>
                Gold Tint
              </h4>
              <p style={{ fontSize: '0.875rem', lineHeight: 1.6, margin: 0 }}>
                data-glass data-surface=&quot;gold&quot;
              </p>
            </div>

            <div data-glass data-surface="sage" style={{
              padding: 'var(--space-24)',
              borderRadius: '12px'
            }}>
              <h4 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: 'var(--space-8)' }}>
                Sage Tint
              </h4>
              <p style={{ fontSize: '0.875rem', lineHeight: 1.6, margin: 0 }}>
                data-glass data-surface=&quot;sage&quot;
              </p>
            </div>
          </div>

          {/* Interactive hover demo */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: 'var(--space-24)',
            marginBottom: 'var(--space-48)'
          }}>
            <div data-glass data-elevation="lg" data-hover="lift" style={{
              padding: 'var(--space-24)',
              borderRadius: '12px',
              cursor: 'pointer'
            }}>
              <h4 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: 'var(--space-8)' }}>
                Hover to Lift
              </h4>
              <p style={{ fontSize: '0.875rem', lineHeight: 1.6, margin: 0 }}>
                data-glass data-hover=&quot;lift&quot;
              </p>
            </div>
          </div>

          {/* Documentation card */}
          <div style={{
            background: 'var(--surface-1)',
            padding: 'var(--space-32)',
            borderRadius: '12px',
            border: '2px solid var(--border-medium)'
          }}>
            <h3 style={{
              fontSize: '1.125rem',
              fontWeight: 600,
              marginBottom: 'var(--space-16)',
              color: 'var(--text-primary)'
            }}>
              Glass Primitive Usage
            </h3>
            <pre style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.8125rem',
              lineHeight: 1.6,
              color: 'var(--text-secondary)',
              margin: 0,
              whiteSpace: 'pre-wrap'
            }}>{`// HTML with data attributes
<div data-glass data-elevation="lg" data-strong>
  Glass effect with large blur
</div>

// React component (optional)
import Glass from '@/components/primitives/Glass'

<Glass elevation="lg" strong surface="rose">
  Type-safe glass component
</Glass>

// Tokens used:
--blur-sm: 6px
--blur-md: 10px
--blur-lg: 14px
--blur-xl: 22px
--alpha-subtle: 0.20
--alpha-mid: 0.32
--alpha-strong: 0.45
--saturate-low/med/high: 1.05 - 1.25`}</pre>
          </div>
        </div>
      </Section>

      {/* Demo 20: Card Primitive - Flexible Containers with Elevation */}
      <Section
        background="tint-sage"
        paddingY="lg"
        contentWrapper={false}
        header={{
          title: 'Demo 20: Card Primitive',
          lead: 'Flexible container primitive with elevation, padding, and interactive variants',
          align: 'center'
        }}
      >
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 var(--gutter)'
        }}>
          {/* Elevation variants */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: 'var(--space-24)',
            marginBottom: 'var(--space-48)'
          }}>
            <div data-card data-elevation="flat" style={{ minHeight: '140px' }}>
              <h4 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: 'var(--space-8)' }}>
                Flat (Default)
              </h4>
              <p style={{ fontSize: '0.875rem', lineHeight: 1.6, margin: 0, color: 'var(--text-secondary)' }}>
                No shadow, minimal border. Best for subtle containers.
              </p>
            </div>

            <div data-card data-elevation="raised" style={{ minHeight: '140px' }}>
              <h4 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: 'var(--space-8)' }}>
                Raised
              </h4>
              <p style={{ fontSize: '0.875rem', lineHeight: 1.6, margin: 0, color: 'var(--text-secondary)' }}>
                Subtle shadow for lifted appearance.
              </p>
            </div>

            <div data-card data-elevation="elevated" style={{ minHeight: '140px' }}>
              <h4 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: 'var(--space-8)' }}>
                Elevated
              </h4>
              <p style={{ fontSize: '0.875rem', lineHeight: 1.6, margin: 0, color: 'var(--text-secondary)' }}>
                Medium shadow for clear elevation.
              </p>
            </div>

            <div data-card data-elevation="floating" style={{ minHeight: '140px' }}>
              <h4 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: 'var(--space-8)' }}>
                Floating
              </h4>
              <p style={{ fontSize: '0.875rem', lineHeight: 1.6, margin: 0, color: 'var(--text-secondary)' }}>
                Large shadow for dramatic elevation.
              </p>
            </div>
          </div>

          {/* Padding variants */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: 'var(--space-24)',
            marginBottom: 'var(--space-48)'
          }}>
            <div data-card data-elevation="raised" data-padding="compact">
              <h4 style={{ fontSize: '0.875rem', fontWeight: 600, margin: 0 }}>
                Compact Padding
              </h4>
            </div>

            <div data-card data-elevation="raised" data-padding="normal">
              <h4 style={{ fontSize: '0.875rem', fontWeight: 600, margin: 0 }}>
                Normal (Default)
              </h4>
            </div>

            <div data-card data-elevation="raised" data-padding="spacious">
              <h4 style={{ fontSize: '0.875rem', fontWeight: 600, margin: 0 }}>
                Spacious Padding
              </h4>
            </div>
          </div>

          {/* Interactive variants */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: 'var(--space-24)',
            marginBottom: 'var(--space-48)'
          }}>
            <div data-card data-elevation="raised" data-hover="lift" style={{ cursor: 'pointer' }}>
              <h4 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: 'var(--space-8)' }}>
                Hover: Lift
              </h4>
              <p style={{ fontSize: '0.875rem', lineHeight: 1.6, margin: 0, color: 'var(--text-secondary)' }}>
                Elevates on hover for interactive feedback
              </p>
            </div>

            <div data-card data-elevation="raised" data-hover="glow" style={{ cursor: 'pointer' }}>
              <h4 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: 'var(--space-8)' }}>
                Hover: Glow
              </h4>
              <p style={{ fontSize: '0.875rem', lineHeight: 1.6, margin: 0, color: 'var(--text-secondary)' }}>
                Glows on hover with accent color
              </p>
            </div>

            <div data-card data-elevation="raised" data-clickable tabIndex={0}>
              <h4 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: 'var(--space-8)' }}>
                Clickable
              </h4>
              <p style={{ fontSize: '0.875rem', lineHeight: 1.6, margin: 0, color: 'var(--text-secondary)' }}>
                Fully interactive with keyboard support
              </p>
            </div>
          </div>

          {/* Glass composition */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: 'var(--space-24)',
            marginBottom: 'var(--space-48)'
          }}>
            <div data-card data-glass data-elevation="raised" data-padding="spacious">
              <h4 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: 'var(--space-8)' }}>
                Card + Glass
              </h4>
              <p style={{ fontSize: '0.875rem', lineHeight: 1.6, margin: 0 }}>
                Combines card structure with glassmorphism
              </p>
            </div>

            <div data-card data-glass data-elevation="elevated" data-strong data-padding="spacious">
              <h4 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: 'var(--space-8)' }}>
                Glass + Strong
              </h4>
              <p style={{ fontSize: '0.875rem', lineHeight: 1.6, margin: 0 }}>
                More opaque for better readability
              </p>
            </div>

            <div data-card data-glass data-surface="rose" data-elevation="elevated" data-padding="spacious">
              <h4 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: 'var(--space-8)' }}>
                Glass + Tint
              </h4>
              <p style={{ fontSize: '0.875rem', lineHeight: 1.6, margin: 0 }}>
                Tinted glassmorphism with accent color
              </p>
            </div>
          </div>

          {/* Surface tints */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: 'var(--space-24)',
            marginBottom: 'var(--space-48)'
          }}>
            <div data-card data-elevation="raised" data-surface="rose" data-padding="spacious">
              <h4 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: 'var(--space-8)' }}>
                Rose Surface
              </h4>
              <p style={{ fontSize: '0.875rem', lineHeight: 1.6, margin: 0 }}>
                Tinted background with rose accent
              </p>
            </div>

            <div data-card data-elevation="raised" data-surface="gold" data-padding="spacious">
              <h4 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: 'var(--space-8)' }}>
                Gold Surface
              </h4>
              <p style={{ fontSize: '0.875rem', lineHeight: 1.6, margin: 0 }}>
                Tinted background with gold accent
              </p>
            </div>

            <div data-card data-elevation="raised" data-surface="sage" data-padding="spacious">
              <h4 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: 'var(--space-8)' }}>
                Sage Surface
              </h4>
              <p style={{ fontSize: '0.875rem', lineHeight: 1.6, margin: 0 }}>
                Tinted background with sage accent
              </p>
            </div>
          </div>

          {/* Documentation */}
          <div style={{
            background: 'var(--surface-1)',
            padding: 'var(--space-32)',
            borderRadius: '12px',
            border: '2px solid var(--border-medium)'
          }}>
            <h3 style={{
              fontSize: '1.125rem',
              fontWeight: 600,
              marginBottom: 'var(--space-16)',
              color: 'var(--text-primary)'
            }}>
              Card Primitive Usage
            </h3>
            <pre style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.8125rem',
              lineHeight: 1.6,
              color: 'var(--text-secondary)',
              margin: 0,
              whiteSpace: 'pre-wrap'
            }}>{`// HTML with data attributes
<div data-card data-elevation="raised" data-padding="spacious">
  <h3>Card Title</h3>
  <p>Card content</p>
</div>

// Interactive card
<div data-card data-elevation="elevated" data-clickable>
  Clickable with keyboard support
</div>

// Glass composition
<div data-card data-glass data-elevation="raised">
  Card structure + glassmorphism
</div>

// React component (optional)
import Card, { CardHeader, CardFooter } from '@/components/primitives/Card'

<Card elevation="raised" padding="spacious" hover="lift">
  <CardHeader>Header</CardHeader>
  <p>Content</p>
  <CardFooter>Footer</CardFooter>
</Card>

// Tokens used:
Elevation: --shadow-sm/md/lg/xl
Padding: --space-16/24/32
Borders: --border-subtle/medium/strong
Radius: --radius-md`}</pre>
          </div>
        </div>
      </Section>

      {/* Demo 21: Reel Primitive - Horizontal Snap Scrolling */}
      <Section
        background="surface"
        paddingY="lg"
        contentWrapper={false}
        header={{
          title: 'Demo 21: Reel Primitive',
          lead: 'Horizontal snap-scrolling container without JavaScript',
          align: 'center'
        }}
      >
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 var(--gutter)'
        }}>
          <div className="reel" style={{ marginBottom: 'var(--space-48)' }}>
            {[...Array(10)].map((_, i) => (
              <div
                key={i}
                data-card
                data-elevation="raised"
                data-padding="compact"
                style={{ minWidth: '220px' }}
              >
                <div data-card-header style={{ fontWeight: 600 }}>
                  Item {i + 1}
                </div>
                <div
                  data-card-media
                  style={{
                    aspectRatio: '16/9',
                    background: i % 3 === 0 ? 'var(--bg-tint-rose)' : i % 3 === 1 ? 'var(--bg-tint-gold)' : 'var(--bg-tint-sage)',
                    borderRadius: '8px'
                  }}
                />
                <div data-card-footer style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                  Snap scroll →
                </div>
              </div>
            ))}
          </div>

          {/* Usage documentation */}
          <div style={{
            background: 'var(--surface-2)',
            padding: 'var(--space-24)',
            borderRadius: '8px',
            border: '1px solid var(--border-subtle)'
          }}>
            <h4 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: 'var(--space-16)' }}>
              Usage
            </h4>
            <pre style={{
              background: 'var(--surface-1)',
              padding: 'var(--space-16)',
              borderRadius: '6px',
              overflow: 'auto',
              fontSize: '0.875rem',
              lineHeight: 1.6
            }}>{`<div className="reel">
  <Card />
  <Card />
  <Card />
</div>

Features:
- Horizontal scroll with snap points
- Touch-friendly overflow scrolling
- Container query responsive gaps
- Reduced motion support
- No JavaScript required

Tokens used:
Gap: --reel-gap (default: --space-24)
Padding: --space-8
Container breakpoint: 700px → --space-16`}</pre>
          </div>
        </div>
      </Section>

      {/* Demo 22: Sidebar Primitive - Two-Column Layout */}
      <Section
        background="tint-sage"
        paddingY="lg"
        contentWrapper={false}
        header={{
          title: 'Demo 22: Sidebar Primitive',
          lead: 'Responsive main + rail layout using container queries',
          align: 'center'
        }}
      >
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 var(--gutter)'
        }}>
          <div className="sidebar" style={{ marginBottom: 'var(--space-48)' }}>
            <div data-card data-elevation="elevated" data-padding="spacious">
              <h3 style={{ marginTop: 0, marginBottom: 'var(--space-16)' }}>
                Main Content
              </h3>
              <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-24)' }}>
                This area stretches to fill available space and is first in source order.
                Resize your browser to see it collapse to a single column layout.
              </p>
              <div className="grid is-auto-fit" style={{ ['--grid-min' as any]: '220px' }}>
                {[1, 2, 3].map(n => (
                  <div
                    key={n}
                    data-card
                    data-padding="compact"
                    style={{ background: 'var(--surface-2)' }}
                  >
                    <div data-card-header style={{ fontWeight: 600 }}>
                      Feature {n}
                    </div>
                    <p style={{
                      color: 'var(--text-secondary)',
                      fontSize: '0.875rem',
                      margin: 0
                    }}>
                      Token-driven spacing and borders.
                    </p>
                  </div>
                ))}
              </div>
            </div>
            <aside data-card data-elevation="raised" data-padding="normal">
              <h4 style={{ marginTop: 0, marginBottom: 'var(--space-16)' }}>
                Sidebar Rail
              </h4>
              <ul className="stack is-compact" style={{
                listStyle: 'none',
                padding: 0,
                margin: 0
              }}>
                <li>
                  <a href="#" style={{
                    color: 'var(--accent-rose)',
                    textDecoration: 'none'
                  }}>
                    Getting Started Guide
                  </a>
                </li>
                <li>
                  <a href="#" style={{
                    color: 'var(--accent-rose)',
                    textDecoration: 'none'
                  }}>
                    Pricing & Plans
                  </a>
                </li>
                <li>
                  <a href="#" style={{
                    color: 'var(--accent-rose)',
                    textDecoration: 'none'
                  }}>
                    Frequently Asked Questions
                  </a>
                </li>
                <li>
                  <a href="#" style={{
                    color: 'var(--accent-rose)',
                    textDecoration: 'none'
                  }}>
                    Contact Support
                  </a>
                </li>
              </ul>
            </aside>
          </div>

          {/* Usage documentation */}
          <div style={{
            background: 'var(--surface-2)',
            padding: 'var(--space-24)',
            borderRadius: '8px',
            border: '1px solid var(--border-subtle)'
          }}>
            <h4 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: 'var(--space-16)' }}>
              Usage
            </h4>
            <pre style={{
              background: 'var(--surface-1)',
              padding: 'var(--space-16)',
              borderRadius: '6px',
              overflow: 'auto',
              fontSize: '0.875rem',
              lineHeight: 1.6
            }}>{`<div className="sidebar">
  <main>
    Main content area
  </main>
  <aside>
    Sidebar rail
  </aside>
</div>

<!-- Reverse variant (rail comes first) -->
<div className="sidebar" data-reverse="true">
  <aside>Rail</aside>
  <main>Main</main>
</div>

Features:
- Two-column grid layout
- Fixed sidebar width (28rem max, 32vw)
- Container query responsive collapse
- Source order independence
- Token-based gaps

Tokens used:
Gap: --sidebar-gap (default: --space-32)
Rail width: min(28rem, 32vw)
Container breakpoint: 980px collapse`}</pre>
          </div>
        </div>
      </Section>
    </div>
  )
}
