'use client';

import { useEffect } from 'react';

/**
 * Comprehensive Primitives Demo Page
 * Showcases all available primitive components with examples
 */
export default function PrimitivesDemo() {
  useEffect(() => {
    // Initialize dialog event listeners
    import('@/scripts/dialog').then(({ initDialogs }) => {
      initDialogs();
    });
  }, []);

  return (
    <main data-clean-root="true" style={{ padding: '2rem', maxWidth: '1400px', margin: '0 auto' }}>
      <div className="stack" style={{ '--stack-gap': 'var(--space-fluid-5)' } as React.CSSProperties}>

        {/* Header */}
        <header>
          <h1 data-ui="heading" data-size="xl" data-align="center">
            Primitives Showcase
          </h1>
          <p data-ui="text" data-size="lg" data-align="center" data-muted="true" className="measure" style={{ margin: '0 auto' }}>
            A comprehensive demonstration of all primitive components: Typography, Buttons, Cards, Glass, Layout, Forms, and Dialogs
          </p>
        </header>

        {/* Typography Primitives */}
        <section className="section" style={{ containerType: 'inline-size', containerName: 'section' }}>
          <div className="stack" style={{ '--stack-gap': 'var(--space-24)' } as React.CSSProperties}>
            <h2 data-ui="heading" data-size="lg">Typography Primitives</h2>

            <div className="stack" style={{ '--stack-gap': 'var(--space-16)' } as React.CSSProperties}>
              <div>
                <p className="t-eyebrow">Eyebrow Text</p>
                <h3 data-ui="heading" data-size="xl">Extra Large Heading</h3>
              </div>

              <div>
                <h4 data-ui="heading" data-size="lg">Large Heading</h4>
                <h5 data-ui="heading" data-size="md">Medium Heading</h5>
                <h6 data-ui="heading" data-size="sm">Small Heading</h6>
                <h6 data-ui="heading" data-size="xs">Extra Small Heading</h6>
              </div>

              <div>
                <p data-ui="text" data-size="lg">Large text with loose line height (1.7)</p>
                <p data-ui="text" data-size="md">Medium text - default body size</p>
                <p data-ui="text" data-size="sm">Small text for captions</p>
                <p data-ui="text" data-size="xs">Extra small text for fine print</p>
              </div>

              <div className="measure">
                <p data-ui="text" data-size="md">
                  This paragraph demonstrates the <code>.measure</code> utility which constrains line length to 66 characters for optimal readability.
                  Long lines of text can be difficult to read, so constraining the measure improves the reading experience significantly.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Button Primitives */}
        <section className="section" style={{ containerType: 'inline-size', containerName: 'section' }}>
          <div className="stack" style={{ '--stack-gap': 'var(--space-24)' } as React.CSSProperties}>
            <h2 data-ui="heading" data-size="lg">Button Primitives</h2>

            <div className="stack" style={{ '--stack-gap': 'var(--space-20)' } as React.CSSProperties}>
              <div>
                <h3 data-ui="heading" data-size="sm" style={{ marginBottom: 'var(--space-12)' }}>Variants</h3>
                <div className="cluster" style={{ '--cluster-gap': 'var(--space-12)' } as React.CSSProperties}>
                  <button data-ui="button" data-variant="solid" data-size="md" data-corner="pill">
                    Solid
                  </button>
                  <button data-ui="button" data-variant="outline" data-size="md" data-corner="pill">
                    Outline
                  </button>
                  <button data-ui="button" data-variant="subtle" data-size="md" data-corner="pill">
                    Subtle
                  </button>
                  <button data-ui="button" data-variant="ghost" data-size="md" data-corner="pill">
                    Ghost
                  </button>
                </div>
              </div>

              <div>
                <h3 data-ui="heading" data-size="sm" style={{ marginBottom: 'var(--space-12)' }}>Sizes</h3>
                <div className="cluster" style={{ '--cluster-gap': 'var(--space-12)', alignItems: 'center' } as React.CSSProperties}>
                  <button data-ui="button" data-variant="solid" data-size="xs" data-corner="round">XS</button>
                  <button data-ui="button" data-variant="solid" data-size="sm" data-corner="round">Small</button>
                  <button data-ui="button" data-variant="solid" data-size="md" data-corner="round">Medium</button>
                  <button data-ui="button" data-variant="solid" data-size="lg" data-corner="round">Large</button>
                </div>
              </div>

              <div>
                <h3 data-ui="heading" data-size="sm" style={{ marginBottom: 'var(--space-12)' }}>Corners</h3>
                <div className="cluster" style={{ '--cluster-gap': 'var(--space-12)' } as React.CSSProperties}>
                  <button data-ui="button" data-variant="solid" data-size="md" data-corner="square">Square</button>
                  <button data-ui="button" data-variant="solid" data-size="md" data-corner="round">Round</button>
                  <button data-ui="button" data-variant="solid" data-size="md" data-corner="pill">Pill</button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Card Primitives */}
        <section className="section" style={{ containerType: 'inline-size', containerName: 'section' }}>
          <div className="stack" style={{ '--stack-gap': 'var(--space-24)' } as React.CSSProperties}>
            <h2 data-ui="heading" data-size="lg">Card Primitives</h2>

            <div className="grid" style={{ '--grid-cols': 'repeat(auto-fit, minmax(280px, 1fr))', '--grid-gap': 'var(--space-20)' } as React.CSSProperties}>
              <div data-card data-elevation="flat" data-padding="normal">
                <h3 data-ui="heading" data-size="sm">Flat Card</h3>
                <p data-ui="text" data-size="sm" data-muted="true">No shadow, minimal border</p>
              </div>

              <div data-card data-elevation="raised" data-padding="normal">
                <h3 data-ui="heading" data-size="sm">Raised Card</h3>
                <p data-ui="text" data-size="sm" data-muted="true">Subtle shadow, lifted</p>
              </div>

              <div data-card data-elevation="elevated" data-padding="normal">
                <h3 data-ui="heading" data-size="sm">Elevated Card</h3>
                <p data-ui="text" data-size="sm" data-muted="true">Medium shadow, clear elevation</p>
              </div>

              <div data-card data-elevation="floating" data-padding="normal">
                <h3 data-ui="heading" data-size="sm">Floating Card</h3>
                <p data-ui="text" data-size="sm" data-muted="true">Large shadow, dramatic</p>
              </div>
            </div>

            <div className="cluster" style={{ '--cluster-gap': 'var(--space-20)' } as React.CSSProperties}>
              <div data-card data-elevation="raised" data-padding="compact" data-hover="lift" style={{ flex: '1' }}>
                <h3 data-ui="heading" data-size="sm">Compact Padding</h3>
                <p data-ui="text" data-size="sm" data-muted="true">Hover to lift</p>
              </div>

              <div data-card data-elevation="raised" data-padding="spacious" data-hover="glow" style={{ flex: '1' }}>
                <h3 data-ui="heading" data-size="sm">Spacious Padding</h3>
                <p data-ui="text" data-size="sm" data-muted="true">Hover for glow</p>
              </div>
            </div>
          </div>
        </section>

        {/* Glass Primitives */}
        <section className="section" style={{ containerType: 'inline-size', containerName: 'section' }}>
          <div className="stack" style={{ '--stack-gap': 'var(--space-24)' } as React.CSSProperties}>
            <h2 data-ui="heading" data-size="lg">Glass Primitives</h2>

            <div
              style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                padding: 'var(--space-32)',
                borderRadius: 'var(--radius-lg)'
              }}
            >
              <div className="grid" style={{ '--grid-cols': 'repeat(auto-fit, minmax(240px, 1fr))', '--grid-gap': 'var(--space-16)' } as React.CSSProperties}>
                <div data-glass data-elevation="sm" style={{ padding: 'var(--space-20)' }}>
                  <h3 data-ui="heading" data-size="sm">Small Glass</h3>
                  <p data-ui="text" data-size="sm">Subtle blur effect</p>
                </div>

                <div data-glass data-elevation="md" style={{ padding: 'var(--space-20)' }}>
                  <h3 data-ui="heading" data-size="sm">Medium Glass</h3>
                  <p data-ui="text" data-size="sm">Default blur level</p>
                </div>

                <div data-glass data-elevation="lg" style={{ padding: 'var(--space-20)' }}>
                  <h3 data-ui="heading" data-size="sm">Large Glass</h3>
                  <p data-ui="text" data-size="sm">More pronounced</p>
                </div>

                <div data-glass data-elevation="xl" data-strong style={{ padding: 'var(--space-20)' }}>
                  <h3 data-ui="heading" data-size="sm">XL Strong</h3>
                  <p data-ui="text" data-size="sm">Maximum effect</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Layout Primitives */}
        <section className="section" style={{ containerType: 'inline-size', containerName: 'section' }}>
          <div className="stack" style={{ '--stack-gap': 'var(--space-24)' } as React.CSSProperties}>
            <h2 data-ui="heading" data-size="lg">Layout Primitives</h2>

            <div className="stack" style={{ '--stack-gap': 'var(--space-32)' } as React.CSSProperties}>
              {/* Stack */}
              <div>
                <h3 data-ui="heading" data-size="sm" style={{ marginBottom: 'var(--space-12)' }}>Stack (Vertical Flow)</h3>
                <div data-card data-elevation="flat" data-padding="normal">
                  <div className="stack is-compact">
                    <div style={{ padding: 'var(--space-12)', background: 'var(--mix-subtle)', borderRadius: 'var(--radius-md)' }}>Item 1</div>
                    <div style={{ padding: 'var(--space-12)', background: 'var(--mix-subtle)', borderRadius: 'var(--radius-md)' }}>Item 2</div>
                    <div style={{ padding: 'var(--space-12)', background: 'var(--mix-subtle)', borderRadius: 'var(--radius-md)' }}>Item 3</div>
                  </div>
                </div>
              </div>

              {/* Cluster */}
              <div>
                <h3 data-ui="heading" data-size="sm" style={{ marginBottom: 'var(--space-12)' }}>Cluster (Wrapping Row)</h3>
                <div data-card data-elevation="flat" data-padding="normal">
                  <div className="cluster">
                    {[1,2,3,4,5,6,7,8].map(i => (
                      <div key={i} style={{ padding: 'var(--space-12)', background: 'var(--mix-subtle)', borderRadius: 'var(--radius-md)' }}>
                        Item {i}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Grid */}
              <div>
                <h3 data-ui="heading" data-size="sm" style={{ marginBottom: 'var(--space-12)' }}>Grid (Auto-fit)</h3>
                <div className="grid is-auto-fit" style={{ '--grid-min': '200px' } as React.CSSProperties}>
                  {[1,2,3,4,5,6].map(i => (
                    <div key={i} data-card data-elevation="raised" data-padding="normal">
                      <h4 data-ui="heading" data-size="xs">Grid Item {i}</h4>
                      <p data-ui="text" data-size="sm" data-muted="true">Auto-fit responsive</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Reel */}
              <div>
                <h3 data-ui="heading" data-size="sm" style={{ marginBottom: 'var(--space-12)' }}>Reel (Horizontal Scroll)</h3>
                <div className="reel" style={{ '--reel-gap': 'var(--space-16)' } as React.CSSProperties}>
                  {[1,2,3,4,5,6,7,8].map(i => (
                    <div key={i} data-card data-elevation="raised" data-padding="normal" style={{ minWidth: '280px' }}>
                      <h4 data-ui="heading" data-size="xs">Card {i}</h4>
                      <p data-ui="text" data-size="sm" data-muted="true">Scroll to see more</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Dialog Primitive */}
        <section className="section" style={{ containerType: 'inline-size', containerName: 'section' }}>
          <div className="stack" style={{ '--stack-gap': 'var(--space-16)' } as React.CSSProperties}>
            <h2 data-ui="heading" data-size="lg">Dialog Primitive</h2>
            <p data-ui="text" data-size="md" data-muted="true">
              Click the button below to open a modal dialog with focus trap, ESC close, and outside-click close.
            </p>
            <button
              data-ui="button"
              data-variant="solid"
              data-size="md"
              data-corner="pill"
              data-dialog-open="contact"
            >
              Open Contact Dialog
            </button>
          </div>
        </section>

        {/* Form Field Primitives */}
        <section className="section" style={{ containerType: 'inline-size', containerName: 'section' }}>
          <div className="stack" style={{ '--stack-gap': 'var(--space-24)' } as React.CSSProperties}>
            <h2 data-ui="heading" data-size="lg">Form Field Primitives</h2>

            <div className="grid" style={{ '--grid-cols': 'repeat(auto-fit, minmax(400px, 1fr))', '--grid-gap': 'var(--space-20)' } as React.CSSProperties}>
              <div className="stack" style={{ '--stack-gap': 'var(--space-16)' } as React.CSSProperties}>
                <h3 data-ui="heading" data-size="sm">Stack Layout</h3>

                <div className="field" data-clean-root="true" data-size="sm" data-layout="stack">
                  <label htmlFor="f1" className="field__label">Small Size</label>
                  <div className="field__control">
                    <input id="f1" className="field__input" />
                  </div>
                </div>

                <div className="field" data-clean-root="true" data-size="md" data-layout="stack">
                  <label htmlFor="f2" className="field__label">
                    Medium Size <span className="field__required">*</span>
                  </label>
                  <div className="field__control">
                    <input id="f2" className="field__input" required aria-describedby="f2-hint" />
                  </div>
                  <p id="f2-hint" className="field__hint">This is a hint message</p>
                </div>

                <div className="field" data-clean-root="true" data-size="lg" data-layout="stack">
                  <label htmlFor="f3" className="field__label">Large Size</label>
                  <div className="field__control">
                    <input id="f3" className="field__input" />
                  </div>
                </div>
              </div>

              <div className="stack" style={{ '--stack-gap': 'var(--space-16)' } as React.CSSProperties}>
                <h3 data-ui="heading" data-size="sm">States</h3>

                <div className="field" data-clean-root="true" data-size="md" aria-invalid="true">
                  <label htmlFor="f4" className="field__label">Invalid State</label>
                  <div className="field__control">
                    <input id="f4" className="field__input" defaultValue="invalid@" aria-describedby="f4-err" />
                  </div>
                  <p id="f4-err" className="field__error">Please enter a valid email</p>
                </div>

                <div className="field" data-clean-root="true" data-size="md" aria-disabled="true">
                  <label htmlFor="f5" className="field__label">Disabled State</label>
                  <div className="field__control">
                    <input id="f5" className="field__input" disabled />
                  </div>
                </div>

                <div className="field" data-clean-root="true" data-size="md">
                  <label htmlFor="f6" className="field__label">Textarea</label>
                  <div className="field__control">
                    <textarea id="f6" className="field__textarea" rows={4} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* NEW: Inline Primitive */}
        <section>
          <div className="stack" style={{ '--stack-gap': 'var(--space-24)' } as React.CSSProperties}>
            <h2 data-ui="heading" data-size="lg">Inline Primitive</h2>
            <p data-ui="text" data-muted="true">Wraps inline elements like tags/badges with consistent gap</p>

            <div className="card" data-clean-root="true" data-elevation="raised" data-padding="lg">
              <div className="stack" style={{ '--stack-gap': 'var(--space-16)' } as React.CSSProperties}>
                <h3 data-ui="heading" data-size="sm">Tag Cloud Example</h3>
                <div className="inline" style={{ '--gap': 'var(--space-12)' } as React.CSSProperties}>
                  <span style={{
                    padding: 'var(--space-8) var(--space-16)',
                    background: 'var(--mix-soft)',
                    borderRadius: 'var(--radius-full)',
                    fontSize: 'var(--ts-sm)'
                  }}>Rustic</span>
                  <span style={{
                    padding: 'var(--space-8) var(--space-16)',
                    background: 'var(--mix-soft)',
                    borderRadius: 'var(--radius-full)',
                    fontSize: 'var(--ts-sm)'
                  }}>Romantic</span>
                  <span style={{
                    padding: 'var(--space-8) var(--space-16)',
                    background: 'var(--mix-soft)',
                    borderRadius: 'var(--radius-full)',
                    fontSize: 'var(--ts-sm)'
                  }}>Outdoor</span>
                  <span style={{
                    padding: 'var(--space-8) var(--space-16)',
                    background: 'var(--mix-soft)',
                    borderRadius: 'var(--radius-full)',
                    fontSize: 'var(--ts-sm)'
                  }}>Vineyard</span>
                  <span style={{
                    padding: 'var(--space-8) var(--space-16)',
                    background: 'var(--mix-soft)',
                    borderRadius: 'var(--radius-full)',
                    fontSize: 'var(--ts-sm)'
                  }}>Barn</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* NEW: Switcher Primitive */}
        <section>
          <div className="stack" style={{ '--stack-gap': 'var(--space-24)' } as React.CSSProperties}>
            <h2 data-ui="heading" data-size="lg">Switcher Primitive</h2>
            <p data-ui="text" data-muted="true">Auto-switches from horizontal to vertical layout based on container width</p>

            <div className="switcher" style={{ '--switcher-threshold': '320px', '--gap': 'var(--space-24)' } as React.CSSProperties}>
              <div className="card" data-clean-root="true" data-elevation="raised" data-padding="lg">
                <h3 data-ui="heading" data-size="sm">Card A</h3>
                <p data-ui="text" data-size="sm">Switches to vertical when narrow</p>
              </div>
              <div className="card" data-clean-root="true" data-elevation="raised" data-padding="lg">
                <h3 data-ui="heading" data-size="sm">Card B</h3>
                <p data-ui="text" data-size="sm">Container query magic</p>
              </div>
              <div className="card" data-clean-root="true" data-elevation="raised" data-padding="lg">
                <h3 data-ui="heading" data-size="sm">Card C</h3>
                <p data-ui="text" data-size="sm">No media queries needed</p>
              </div>
            </div>
          </div>
        </section>

        {/* NEW: Aspect Ratio Utility */}
        <section>
          <div className="stack" style={{ '--stack-gap': 'var(--space-24)' } as React.CSSProperties}>
            <h2 data-ui="heading" data-size="lg">Aspect Ratio Utility</h2>
            <p data-ui="text" data-muted="true">Maintains consistent aspect ratios for media containers with fallback support</p>

            <div className="grid" style={{ '--grid-cols': 'repeat(3, 1fr)', '--grid-gap': 'var(--space-20)' } as React.CSSProperties}>
              <div>
                <p data-ui="text" data-size="sm" style={{ marginBottom: 'var(--space-8)' }}>16:9 (widescreen)</p>
                <div className="ar ar-16x9" style={{ background: 'var(--mix-soft)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-muted)' }}>
                    16:9
                  </div>
                </div>
              </div>
              <div>
                <p data-ui="text" data-size="sm" style={{ marginBottom: 'var(--space-8)' }}>4:3 (standard)</p>
                <div className="ar ar-4x3" style={{ background: 'var(--mix-soft)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-muted)' }}>
                    4:3
                  </div>
                </div>
              </div>
              <div>
                <p data-ui="text" data-size="sm" style={{ marginBottom: 'var(--space-8)' }}>1:1 (square)</p>
                <div className="ar ar-1x1" style={{ background: 'var(--mix-soft)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-muted)' }}>
                    1:1
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* NEW: Prose Utility */}
        <section>
          <div className="stack" style={{ '--stack-gap': 'var(--space-24)' } as React.CSSProperties}>
            <h2 data-ui="heading" data-size="lg">Prose Utility</h2>
            <p data-ui="text" data-muted="true">Readable long-form text with optimal measure (~65ch) and vertical rhythm</p>

            <div className="card" data-clean-root="true" data-elevation="raised" data-padding="lg">
              <div className="prose">
                <h3>Your Perfect Wedding Venue</h3>
                <p>
                  Nestled in the heart of Minnesota, Rum River Barn offers a picturesque setting for your special day.
                  Our rustic barn venue combines timeless charm with modern amenities, creating an unforgettable experience
                  for you and your guests.
                </p>
                <blockquote>
                  "The most beautiful venue we've ever seen. Our wedding day was absolutely perfect!"
                  - Sarah & Michael
                </blockquote>
                <h4>What Makes Us Special</h4>
                <ul>
                  <li>Stunning natural surroundings with vineyard views</li>
                  <li>Flexible indoor and outdoor ceremony options</li>
                  <li>Full-service event coordination</li>
                  <li>Customizable packages to fit your vision</li>
                </ul>
                <p>
                  <a href="#contact">Schedule a tour today</a> to see why couples choose Rum River Barn for their celebration.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* NEW: Recipe System */}
        <section>
          <div className="stack" style={{ '--stack-gap': 'var(--space-24)' } as React.CSSProperties}>
            <h2 data-ui="heading" data-size="lg">Recipe System</h2>
            <p data-ui="text" data-muted="true">Pre-approved section theme/density combos via data-recipe attribute</p>

            <div className="grid" style={{ '--grid-cols': '1fr', '--grid-gap': 'var(--space-20)' } as React.CSSProperties}>
              <div data-recipe="surface-rose" data-density="compact" style={{ padding: 'var(--space-24)', borderRadius: 'var(--radius-md)' }}>
                <h3 data-ui="heading" data-size="sm" style={{ color: 'var(--rc-fg)' }}>Surface Rose (Compact)</h3>
                <p data-ui="text" data-size="sm" style={{ color: 'var(--rc-fg-muted)' }}>
                  Light background with rose accent. Compact density (--rc-gap: 24px, --rc-flow: 20px)
                </p>
              </div>

              <div data-recipe="tint-sage" data-density="loose" style={{ padding: 'var(--space-24)', borderRadius: 'var(--radius-md)' }}>
                <h3 data-ui="heading" data-size="sm" style={{ color: 'var(--rc-fg)' }}>Tint Sage (Loose)</h3>
                <p data-ui="text" data-size="sm" style={{ color: 'var(--rc-fg-muted)' }}>
                  Subtle sage tint background. Loose density (--rc-gap: 40px, --rc-flow: 32px)
                </p>
              </div>

              <div data-recipe="hero-dark" data-density="airy" style={{ padding: 'var(--space-32)', borderRadius: 'var(--radius-md)' }}>
                <h3 data-ui="heading" data-size="sm" style={{ color: 'var(--rc-fg)' }}>Hero Dark (Airy)</h3>
                <p data-ui="text" data-size="sm" style={{ color: 'var(--rc-fg-muted)' }}>
                  Dark gradient background with gold accent. Airy density (--rc-gap: 56px, --rc-flow: 40px)
                </p>
              </div>
            </div>
          </div>
        </section>

      </div>

      {/* DIALOG MARKUP */}
      <div className="scrim" data-scrim-for="contact" />
      <div
        className="dialog"
        id="contact"
        role="dialog"
        aria-modal="true"
        aria-labelledby="contact-title"
        aria-describedby="contact-desc"
      >
        <div className="dialog__panel" data-size="md" tabIndex={-1}>
          <header className="dialog__header">
            <h2 id="contact-title" className="dialog__title">
              Book a Tour
            </h2>
            <button
              className="dialog__close"
              aria-label="Close dialog"
              data-dialog-close="contact"
            >
              ×
            </button>
          </header>

          <div id="contact-desc" className="dialog__body">
            <div className="stack" style={{ '--stack-gap': 'var(--space-20)' } as React.CSSProperties}>
              <div className="field" data-clean-root="true" data-size="md" data-layout="stack">
                <label htmlFor="name" className="field__label">
                  Your name <span className="field__required" aria-hidden="true">*</span>
                </label>
                <div className="field__control">
                  <input
                    id="name"
                    name="name"
                    className="field__input"
                    required
                    aria-describedby="name-hint"
                  />
                </div>
                <p id="name-hint" className="field__hint">
                  We'll use this to address you in emails.
                </p>
              </div>

              <div className="field" data-clean-root="true" data-size="md" data-layout="inline">
                <label htmlFor="email" className="field__label">
                  Email
                </label>
                <div className="field__control">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    className="field__input"
                    required
                  />
                </div>
              </div>

              <div className="field" data-clean-root="true" data-size="md">
                <label htmlFor="msg" className="field__label">
                  Message
                </label>
                <div className="field__control">
                  <textarea id="msg" name="msg" className="field__textarea" rows={5} />
                </div>
              </div>
            </div>
          </div>

          <footer className="dialog__footer">
            <button
              data-ui="button"
              data-variant="ghost"
              data-size="md"
              data-corner="pill"
              data-dialog-close="contact"
            >
              Cancel
            </button>
            <button
              data-ui="button"
              data-variant="solid"
              data-size="md"
              data-corner="pill"
            >
              Send Message
            </button>
          </footer>
        </div>
      </div>
    </main>
  );
}
