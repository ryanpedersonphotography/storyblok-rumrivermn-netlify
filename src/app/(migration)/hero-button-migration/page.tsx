'use client'

import { useState } from 'react'
import '@/styles/components/hero.css'

export default function HeroButtonMigrationPage() {
  const [hoveredOriginal, setHoveredOriginal] = useState(false)
  const [hoveredPrimitives, setHoveredPrimitives] = useState(false)

  return (
    <div data-clean-root="true" style={{
      minHeight: '100vh',
      background: 'var(--surface-1)',
      padding: 'var(--space-64) var(--space-32)'
    }}>
      {/* Page Header */}
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        marginBottom: 'var(--space-64)'
      }}>
        <h1 style={{
          fontSize: 'var(--size-4xl)',
          fontWeight: 600,
          marginBottom: 'var(--space-16)',
          color: 'var(--text-primary)'
        }}>
          Hero Button Migration Demo
        </h1>
        <p style={{
          fontSize: 'var(--size-lg)',
          color: 'var(--text-secondary)',
          marginBottom: 'var(--space-32)'
        }}>
          Side-by-side comparison: Original (component CSS) vs Primitives-Only (tokens + inline styles)
        </p>

        <div style={{
          background: 'var(--surface-2)',
          padding: 'var(--space-24)',
          borderRadius: '8px',
          border: '1px solid var(--border-subtle)'
        }}>
          <h3 style={{
            fontSize: 'var(--size-md)',
            fontWeight: 600,
            marginBottom: 'var(--space-12)',
            color: 'var(--text-primary)'
          }}>
            Goal: 95%+ Visual Similarity
          </h3>
          <p style={{
            fontSize: 'var(--size-sm)',
            color: 'var(--text-secondary)',
            lineHeight: 1.6
          }}>
            Both buttons should be pixel-perfect matches. The primitives version uses ZERO component CSS classes,
            relying entirely on design tokens and inline styles.
          </p>
        </div>
      </div>

      {/* Side-by-Side Comparison */}
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(600px, 1fr))',
        gap: 'var(--space-48)'
      }}>

        {/* Original Button (Component CSS) */}
        <div style={{
          background: 'var(--surface-1)',
          borderRadius: '12px',
          overflow: 'hidden',
          border: '2px solid var(--border-medium)'
        }}>
          <div style={{
            background: 'var(--surface-3)',
            padding: 'var(--space-24)',
            borderBottom: '1px solid var(--border-subtle)'
          }}>
            <h2 style={{
              fontSize: 'var(--size-xl)',
              fontWeight: 600,
              color: 'var(--text-primary)',
              marginBottom: 'var(--space-8)'
            }}>
              Original (Component CSS)
            </h2>
            <p style={{
              fontSize: 'var(--size-sm)',
              color: 'var(--text-secondary)'
            }}>
              Uses: <code>.hero-cta</code> + <code>.hero-cta-secondary</code> from hero.css
            </p>
          </div>

          {/* Hero Background Replica */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(44, 36, 22, 0.85), rgba(107, 78, 61, 0.75) 50%, rgba(58, 74, 60, 0.80))',
            backgroundImage: 'linear-gradient(135deg, rgba(44, 36, 22, 0.85), rgba(107, 78, 61, 0.75) 50%, rgba(58, 74, 60, 0.80)), url("/images/barn-exterior-full-deck-view-evening.jpg")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            padding: 'var(--space-96)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '400px'
          }}>
            <a
              href="#contact"
              className="hero-cta hero-cta-secondary"
              data-testid="hero-button-original"
            >
              Schedule Your Visit
            </a>
          </div>

          {/* Code Example */}
          <div style={{
            background: 'var(--surface-2)',
            padding: 'var(--space-24)'
          }}>
            <h3 style={{
              fontSize: 'var(--size-sm)',
              fontWeight: 600,
              marginBottom: 'var(--space-12)',
              color: 'var(--text-primary)'
            }}>
              Code:
            </h3>
            <pre style={{
              fontSize: '0.8125rem',
              fontFamily: 'var(--font-mono)',
              color: 'var(--text-secondary)',
              overflow: 'auto',
              padding: 'var(--space-16)',
              background: 'var(--surface-1)',
              borderRadius: '6px'
            }}>{`<a
  href="#contact"
  className="hero-cta hero-cta-secondary"
>
  Schedule Your Visit
</a>`}</pre>
          </div>
        </div>

        {/* Primitives-Only Button */}
        <div style={{
          background: 'var(--surface-1)',
          borderRadius: '12px',
          overflow: 'hidden',
          border: '2px solid var(--accent-gold)'
        }}>
          <div style={{
            background: 'var(--surface-3)',
            padding: 'var(--space-24)',
            borderBottom: '1px solid var(--border-subtle)'
          }}>
            <h2 style={{
              fontSize: 'var(--size-xl)',
              fontWeight: 600,
              color: 'var(--text-primary)',
              marginBottom: 'var(--space-8)'
            }}>
              Primitives-Only Version
            </h2>
            <p style={{
              fontSize: 'var(--size-sm)',
              color: 'var(--text-secondary)'
            }}>
              Uses: Design tokens + inline styles only (zero CSS classes)
            </p>
          </div>

          {/* Hero Background Replica (Identical) */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(44, 36, 22, 0.85), rgba(107, 78, 61, 0.75) 50%, rgba(58, 74, 60, 0.80))',
            backgroundImage: 'linear-gradient(135deg, rgba(44, 36, 22, 0.85), rgba(107, 78, 61, 0.75) 50%, rgba(58, 74, 60, 0.80)), url("/images/barn-exterior-full-deck-view-evening.jpg")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            padding: 'var(--space-96)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '400px'
          }}>
            <a
              href="#contact"
              data-testid="hero-button-primitives"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 'var(--space-md) var(--space-2xl)',
                background: hoveredPrimitives
                  ? 'color-mix(in srgb, var(--btn-outline-border) 90%, white 10%)'
                  : 'transparent',
                color: hoveredPrimitives ? 'var(--btn-fg-on-gold)' : 'var(--btn-outline-fg)',
                border: '2px solid var(--btn-outline-border)',
                borderRadius: '9999px', // --btn-radius token value
                fontFamily: 'var(--font-sans)',
                fontWeight: 500,
                fontSize: 'var(--size-sm)',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                textDecoration: 'none',
                cursor: 'pointer',
                transition: 'transform 200ms ease, box-shadow 200ms ease, background-color 200ms ease, color 200ms ease',
                boxShadow: hoveredPrimitives
                  ? '0 8px 25px rgba(228, 200, 150, 0.4)'
                  : '0 4px 15px rgba(157, 107, 123, 0.15)',
                ...(hoveredPrimitives && { transform: 'translateY(-2px)' }),
                position: 'relative',
                overflow: 'hidden'
              }}
              onMouseEnter={() => setHoveredPrimitives(true)}
              onMouseLeave={() => setHoveredPrimitives(false)}
            >
              Schedule Your Visit
            </a>
          </div>

          {/* Code Example */}
          <div style={{
            background: 'var(--surface-2)',
            padding: 'var(--space-24)'
          }}>
            <h3 style={{
              fontSize: 'var(--size-sm)',
              fontWeight: 600,
              marginBottom: 'var(--space-12)',
              color: 'var(--text-primary)'
            }}>
              Code:
            </h3>
            <pre style={{
              fontSize: '0.8125rem',
              fontFamily: 'var(--font-mono)',
              color: 'var(--text-secondary)',
              overflow: 'auto',
              padding: 'var(--space-16)',
              background: 'var(--surface-1)',
              borderRadius: '6px',
              whiteSpace: 'pre-wrap'
            }}>{`<a
  href="#contact"
  style={{
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
    // ... hover states handled via onMouseEnter/Leave
  }}
>
  Schedule Your Visit
</a>`}</pre>
          </div>
        </div>
      </div>

      {/* Token Mapping Documentation */}
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        marginTop: 'var(--space-96)'
      }}>
        <h2 style={{
          fontSize: 'var(--size-2xl)',
          fontWeight: 600,
          marginBottom: 'var(--space-32)',
          color: 'var(--text-primary)'
        }}>
          Design Token Mapping
        </h2>

        <div style={{
          background: 'var(--surface-2)',
          borderRadius: '8px',
          overflow: 'hidden',
          border: '1px solid var(--border-subtle)'
        }}>
          <table style={{
            width: '100%',
            borderCollapse: 'collapse'
          }}>
            <thead>
              <tr style={{
                background: 'var(--surface-3)',
                borderBottom: '2px solid var(--border-medium)'
              }}>
                <th style={{ padding: 'var(--space-16)', textAlign: 'left', fontWeight: 600 }}>CSS Property</th>
                <th style={{ padding: 'var(--space-16)', textAlign: 'left', fontWeight: 600 }}>Design Token</th>
                <th style={{ padding: 'var(--space-16)', textAlign: 'left', fontWeight: 600 }}>Computed Value</th>
              </tr>
            </thead>
            <tbody style={{ fontFamily: 'var(--font-mono)', fontSize: '0.875rem' }}>
              <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                <td style={{ padding: 'var(--space-12)' }}>padding</td>
                <td style={{ padding: 'var(--space-12)', color: 'var(--accent-rose)' }}>var(--space-md) var(--space-2xl)</td>
                <td style={{ padding: 'var(--space-12)' }}>16px 40px</td>
              </tr>
              <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                <td style={{ padding: 'var(--space-12)' }}>border-radius</td>
                <td style={{ padding: 'var(--space-12)', color: 'var(--accent-rose)' }}>var(--btn-radius)</td>
                <td style={{ padding: 'var(--space-12)' }}>9999px</td>
              </tr>
              <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                <td style={{ padding: 'var(--space-12)' }}>color</td>
                <td style={{ padding: 'var(--space-12)', color: 'var(--accent-rose)' }}>var(--btn-outline-fg)</td>
                <td style={{ padding: 'var(--space-12)' }}>#FFF8E7</td>
              </tr>
              <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                <td style={{ padding: 'var(--space-12)' }}>border</td>
                <td style={{ padding: 'var(--space-12)', color: 'var(--accent-rose)' }}>2px solid var(--btn-outline-border)</td>
                <td style={{ padding: 'var(--space-12)' }}>2px solid #E4C896</td>
              </tr>
              <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                <td style={{ padding: 'var(--space-12)' }}>font-family</td>
                <td style={{ padding: 'var(--space-12)', color: 'var(--accent-rose)' }}>var(--font-sans)</td>
                <td style={{ padding: 'var(--space-12)' }}>ui-sans-serif, system-ui...</td>
              </tr>
              <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                <td style={{ padding: 'var(--space-12)' }}>font-size</td>
                <td style={{ padding: 'var(--space-12)', color: 'var(--accent-rose)' }}>var(--size-sm)</td>
                <td style={{ padding: 'var(--space-12)' }}>0.875rem (14px)</td>
              </tr>
              <tr>
                <td style={{ padding: 'var(--space-12)' }}>transition</td>
                <td style={{ padding: 'var(--space-12)', color: 'var(--accent-rose)' }}>200ms ease (var(--duration-normal))</td>
                <td style={{ padding: 'var(--space-12)' }}>200ms</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Test Instructions */}
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        marginTop: 'var(--space-64)',
        marginBottom: 'var(--space-96)'
      }}>
        <div style={{
          background: 'var(--accent-rose)',
          padding: 'var(--space-32)',
          borderRadius: '8px',
          color: 'white'
        }}>
          <h3 style={{
            fontSize: 'var(--size-xl)',
            fontWeight: 600,
            marginBottom: 'var(--space-16)'
          }}>
            Run Playwright Test
          </h3>
          <code style={{
            display: 'block',
            background: 'rgba(0,0,0,0.2)',
            padding: 'var(--space-16)',
            borderRadius: '4px',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.9375rem'
          }}>
            npx playwright test tests/hero-button-migration.spec.ts
          </code>
          <p style={{
            marginTop: 'var(--space-16)',
            fontSize: 'var(--size-sm)',
            opacity: 0.9
          }}>
            This will compare both buttons and generate a similarity report. Target: 95%+ match.
          </p>
        </div>
      </div>
    </div>
  )
}
