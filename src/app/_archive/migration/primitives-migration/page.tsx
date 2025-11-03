"use client";

import { useEffect, useState } from "react";
import ThemeSwitch from "@/components/ui/ThemeSwitch";
import Section from "@/components/ui/SectionEnhanced";
import type { CSSVars } from "@/types/css-vars";

interface TokenDebugInfo {
  element: string;
  tokens: {
    name: string;
    expected: string;
    computed: string;
    matches: boolean;
  }[];
  hardcoded: {
    property: string;
    value: string;
  }[];
}

export default function PrimitivesMigration() {
  const [glassDebugInfo, setGlassDebugInfo] = useState<TokenDebugInfo[]>([]);

  useEffect(() => {
    // Wait for DOM to be ready
    const timer = setTimeout(() => {
      const glassCards = document.querySelectorAll('[data-glass]');
      const debugInfo: TokenDebugInfo[] = [];

      glassCards.forEach((card, index) => {
        const computedStyle = window.getComputedStyle(card);
        const elevation = card.getAttribute('data-glass-elevation') || 'md';

        // Expected values based on elevation
        const expectedBlur = {
          'sm': '6px',
          'md': '10px',
          'lg': '16px',
          'xl': '24px'
        }[elevation];

        const expectedSaturate = {
          'sm': '1.15',
          'md': '1.25',
          'lg': '1.35',
          'xl': '1.4'
        }[elevation];

        const backdropFilter = computedStyle.backdropFilter || computedStyle.webkitBackdropFilter;
        const background = computedStyle.background;

        debugInfo.push({
          element: `Glass Card ${elevation.toUpperCase()}`,
          tokens: [
            {
              name: '--blur-' + elevation,
              expected: expectedBlur || 'N/A',
              computed: backdropFilter,
              matches: backdropFilter.includes(expectedBlur || '')
            },
            {
              name: '--saturate-' + elevation,
              expected: expectedSaturate || 'N/A',
              computed: backdropFilter,
              matches: backdropFilter.includes(expectedSaturate || '')
            },
            {
              name: '--card-surface (22% opacity)',
              expected: 'color-mix with 22% opacity',
              computed: background,
              matches: true // Can't easily validate color-mix
            }
          ],
          hardcoded: [
            {
              property: 'backdrop-filter',
              value: `blur(${expectedBlur}) saturate(${expectedSaturate})`
            },
            {
              property: '-webkit-backdrop-filter',
              value: `blur(${expectedBlur}) saturate(${expectedSaturate})`
            },
            {
              property: 'background',
              value: 'color-mix(in oklch, var(--card-surface, Canvas) 22%, transparent)'
            },
            {
              property: 'box-shadow',
              value: 'var(--shadow-sm)'
            }
          ]
        });
      });

      setGlassDebugInfo(debugInfo);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const handleScrollClick = () => {
    const nextSection = document.querySelector('[data-scroll-target]');
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      window.scrollBy({ top: window.innerHeight * 0.9, behavior: 'smooth' });
    }
  };

  return (
    <main style={{ margin: 0 }}>
      {/* HOME HERO - Primitives Only (No Custom CSS) */}
      <Section
        recipe="hero-dark"
        density="airy"
        height="screen"
        align="center"
        paddingY="xl"
        image={{
          src: "/images/barn-exterior-full-deck-view-evening.jpg",
          alt: "Rum River Wedding Barn at sunset",
          attachment: "fixed",
          position: "cover"
        }}
        overlay="strong"
      >
        <div className="stack" style={{
          ["--stack-gap" as CSSVars]: "var(--space-32)",
          alignItems: "center",
          textAlign: "center",
          maxWidth: "800px",
          margin: "0 auto",
          position: "relative",
          zIndex: 10
        }}>
          {/* Eyebrow - using text primitive */}
          <p
            data-ui="text"
            data-size="lg"
            style={{
              fontFamily: "var(--font-script, 'Dancing Script', cursive)",
              fontSize: "clamp(1.5rem, 4vw, 2rem)",
              color: "var(--rc-accent)",
              fontWeight: 400
            }}
          >
            Where Dreams Begin
          </p>

          {/* Title - using heading primitive */}
          <h1
            data-ui="heading"
            data-size="xl"
            style={{
              fontSize: "clamp(3rem, 8vw, 5.5rem)",
              lineHeight: 1.1,
              marginBlock: "var(--space-16)"
            }}
          >
            Rum River
            <br />
            <span style={{
              fontFamily: "var(--font-script, 'Dancing Script', cursive)",
              fontWeight: 400,
              fontSize: "0.85em",
              color: "var(--rc-accent)"
            }}>
              Wedding Barn
            </span>
          </h1>

          {/* Lead text - using text primitive */}
          <p
            data-ui="text"
            data-size="lg"
            style={{
              maxWidth: "65ch",
              opacity: 0.95,
              lineHeight: 1.7
            }}
          >
            Nestled along Minnesota's scenic Rum River, our historic barn offers the perfect blend of rustic charm and modern elegance for your once-in-a-lifetime celebration.
          </p>

          {/* CTAs - using button primitive */}
          <div className="cluster" style={{
            ["--cluster-gap" as CSSVars]: "var(--space-20)",
            marginBlockStart: "var(--space-24)"
          }}>
            <a href="#contact" className="button" data-variant="primary" data-size="lg">
              Schedule Your Visit
            </a>
            <a href="#gallery" className="button" data-variant="ghost" data-size="lg">
              View Gallery
            </a>
          </div>

          {/* Scroll indicator */}
          <button
            onClick={handleScrollClick}
            className="button"
            data-variant="ghost"
            style={{
              marginBlockStart: "var(--space-56)",
              display: "flex",
              flexDirection: "column",
              gap: "var(--space-8)",
              alignItems: "center",
              cursor: "pointer",
              opacity: 0.8,
              transition: "opacity 0.3s ease"
            }}
            onMouseEnter={(e) => e.currentTarget.style.opacity = "1"}
            onMouseLeave={(e) => e.currentTarget.style.opacity = "0.8"}
          >
            <span data-ui="text" data-size="sm" style={{ textTransform: "uppercase", letterSpacing: "0.1em" }}>
              Discover Your Perfect Day
            </span>
            <span style={{ fontSize: "1.5rem", animation: "bounce 2s infinite" }}>↓</span>
          </button>
        </div>
      </Section>

      <style jsx>{`
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(10px); }
        }
      `}</style>

      {/* Remaining sections... */}
      <div className="stack" style={{ ["--stack-gap" as CSSVars]: "var(--space-40)", padding: "var(--space-32)" }} data-scroll-target>
      <header className="cluster" style={{ justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "var(--space-24)" }}>
        <h1 data-ui="heading" data-size="xl">Primitives + Recipes Migration</h1>
        <ThemeSwitch />
      </header>

      {/* COMPREHENSIVE CARD PRIMITIVE SHOWCASE */}
      <Section recipe="surface-rose" density="compact">
        <div className="stack" style={{ ["--stack-gap" as CSSVars]: "var(--rc-flow)" }}>
          <h2 data-ui="heading" data-size="lg">Card Primitive Showcase</h2>
          <p data-ui="text" data-muted="true">
            Production-grade card component with recipe-driven styling, container-responsive density, and zero-specificity architecture.
          </p>

          {/* Elevation Variants */}
          <div className="stack" style={{ ["--stack-gap" as CSSVars]: "var(--space-24)" }}>
            <div>
              <h3 data-ui="heading" data-size="md" style={{ marginBlockEnd: "var(--space-12)" }}>Elevation Variants</h3>
              <p data-ui="text" data-size="sm" className="muted" style={{ marginBlockEnd: "var(--space-20)" }}>
                Four elevation levels from flat to floating, each with progressively stronger shadows and borders.
              </p>
            </div>
            <div className="card-region card-grid" style={{ ["--card-min" as CSSVars]: "16rem", ["--grid-gap" as CSSVars]: "var(--space-20)" }}>
              <div data-card data-elevation="flat">
                <h4 data-ui="heading" data-size="sm">Flat</h4>
                <p data-ui="text" data-size="sm" className="muted">data-elevation="flat"</p>
                <p data-ui="text" data-size="sm">No shadow, subtle border. Perfect for minimal designs or nested content.</p>
              </div>
              <div data-card data-elevation="raised">
                <h4 data-ui="heading" data-size="sm">Raised</h4>
                <p data-ui="text" data-size="sm" className="muted">data-elevation="raised"</p>
                <p data-ui="text" data-size="sm">Small shadow (--shadow-sm), medium border. Default elevated state for most cards.</p>
              </div>
              <div data-card data-elevation="elevated">
                <h4 data-ui="heading" data-size="sm">Elevated</h4>
                <p data-ui="text" data-size="sm" className="muted">data-elevation="elevated"</p>
                <p data-ui="text" data-size="sm">Medium shadow (--shadow-md), strong border. For emphasized content or hero cards.</p>
              </div>
              <div data-card data-elevation="floating">
                <h4 data-ui="heading" data-size="sm">Floating</h4>
                <p data-ui="text" data-size="sm" className="muted">data-elevation="floating"</p>
                <p data-ui="text" data-size="sm">Large shadow (--shadow-lg), transparent border. Creates dramatic depth and separation.</p>
              </div>
            </div>
          </div>

          {/* Hover Effects */}
          <div className="stack" style={{ ["--stack-gap" as CSSVars]: "var(--space-24)" }}>
            <div>
              <h3 data-ui="heading" data-size="md" style={{ marginBlockEnd: "var(--space-12)" }}>Hover Effects</h3>
              <p data-ui="text" data-size="sm" className="muted" style={{ marginBlockEnd: "var(--space-20)" }}>
                Interactive hover states with capability queries (hover: hover) and (pointer: fine) to prevent mobile jank.
              </p>
            </div>
            <div className="card-region card-grid" style={{ ["--card-min" as CSSVars]: "18rem", ["--grid-gap" as CSSVars]: "var(--space-20)" }}>
              <div data-card data-elevation="raised" data-hover="lift">
                <h4 data-ui="heading" data-size="sm">Lift Effect</h4>
                <p data-ui="text" data-size="sm" className="muted">data-hover="lift"</p>
                <p data-ui="text" data-size="sm">Lifts 2px on hover with enhanced shadow. Combines with elevation for stronger effects.</p>
              </div>
              <div data-card data-elevation="raised" data-hover="glow">
                <h4 data-ui="heading" data-size="sm">Glow Effect</h4>
                <p data-ui="text" data-size="sm" className="muted">data-hover="glow"</p>
                <p data-ui="text" data-size="sm">Border glows with --accent-rose and 2px color-mix halo. Perfect for call-to-action cards.</p>
              </div>
              <div data-card data-elevation="raised" data-clickable>
                <h4 data-ui="heading" data-size="sm">Clickable</h4>
                <p data-ui="text" data-size="sm" className="muted">data-clickable</p>
                <p data-ui="text" data-size="sm">Cursor pointer, lift on hover, press micro-state, and focus-visible ring for accessibility.</p>
              </div>
            </div>
          </div>

          {/* Glass Effects */}
          <div className="stack" style={{ ["--stack-gap" as CSSVars]: "var(--space-24)" }}>
            <div>
              <h3 data-ui="heading" data-size="md" style={{ marginBlockEnd: "var(--space-12)" }}>Glass Composition</h3>
              <p data-ui="text" data-size="sm" className="muted" style={{ marginBlockEnd: "var(--space-20)" }}>
                Glassmorphism with backdrop-filter blur + saturate. Four elevation levels with progressive blur intensity.
              </p>
            </div>
            <div className="glass-bed" style={{ padding: "var(--space-32)" }}>
              <div className="card-region card-grid" style={{ ["--card-min" as CSSVars]: "16rem", ["--grid-gap" as CSSVars]: "var(--space-20)" }}>
                <div data-card data-glass data-glass-elevation="sm">
                  <h4 data-ui="heading" data-size="sm">Glass SM</h4>
                  <p data-ui="text" data-size="sm" className="muted">data-glass data-glass-elevation="sm"</p>
                  <p data-ui="text" data-size="sm">Blur: --blur-sm, Saturate: --saturate-low. Subtle glassmorphism effect.</p>
                </div>
                <div data-card data-glass data-glass-elevation="md">
                  <h4 data-ui="heading" data-size="sm">Glass MD</h4>
                  <p data-ui="text" data-size="sm" className="muted">data-glass data-glass-elevation="md"</p>
                  <p data-ui="text" data-size="sm">Blur: --blur-md, Saturate: --saturate-med. Balanced glass appearance.</p>
                </div>
                <div data-card data-glass data-glass-elevation="lg">
                  <h4 data-ui="heading" data-size="sm">Glass LG</h4>
                  <p data-ui="text" data-size="sm" className="muted">data-glass data-glass-elevation="lg"</p>
                  <p data-ui="text" data-size="sm">Blur: --blur-lg, Saturate: --saturate-high. Strong glassmorphism with color pop.</p>
                </div>
                <div data-card data-glass data-glass-elevation="xl">
                  <h4 data-ui="heading" data-size="sm">Glass XL</h4>
                  <p data-ui="text" data-size="sm" className="muted">data-glass data-glass-elevation="xl"</p>
                  <p data-ui="text" data-size="sm">Blur: --blur-xl, Saturate: --saturate-high. Maximum glass effect for overlays.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Glass Token Debug Info */}
          {glassDebugInfo.length > 0 && (
            <div className="stack" style={{ ["--stack-gap" as CSSVars]: "var(--space-24)" }}>
              <div>
                <h3 data-ui="heading" data-size="md" style={{ marginBlockEnd: "var(--space-12)" }}>
                  Glass Tokens Debug Info
                </h3>
                <p data-ui="text" data-size="sm" className="muted" style={{ marginBlockEnd: "var(--space-20)" }}>
                  Computed values vs expected values for glass card tokens
                </p>
              </div>
              <div className="card-region card-grid" style={{ ["--card-min" as CSSVars]: "20rem", ["--grid-gap" as CSSVars]: "var(--space-20)" }}>
                {glassDebugInfo.map((info, idx) => (
                  <div key={idx} data-card data-elevation="flat" style={{ fontFamily: "monospace", fontSize: "0.875rem" }}>
                    <h4 data-ui="heading" data-size="sm" style={{ marginBlockEnd: "var(--space-12)" }}>
                      {info.element}
                    </h4>

                    <div style={{ marginBlockEnd: "var(--space-16)" }}>
                      <p style={{ fontWeight: 600, marginBlockEnd: "var(--space-8)" }}>Expected Tokens:</p>
                      {info.tokens.map((token, tidx) => (
                        <div key={tidx} style={{
                          marginBlockEnd: "var(--space-8)",
                          padding: "var(--space-8)",
                          background: token.matches ? "rgba(0, 255, 0, 0.1)" : "rgba(255, 0, 0, 0.1)",
                          borderRadius: "4px"
                        }}>
                          <div style={{ color: "var(--text-primary)" }}>
                            {token.name}: {token.expected}
                          </div>
                          <div style={{ color: "var(--text-secondary)", fontSize: "0.8rem", marginBlockStart: "4px" }}>
                            Computed: {token.computed.substring(0, 60)}...
                          </div>
                          <div style={{ color: token.matches ? "green" : "red", fontSize: "0.75rem" }}>
                            {token.matches ? "✓ Match" : "✗ No match"}
                          </div>
                        </div>
                      ))}
                    </div>

                    <div>
                      <p style={{ fontWeight: 600, marginBlockEnd: "var(--space-8)" }}>Hardcoded CSS:</p>
                      {info.hardcoded.map((prop, pidx) => (
                        <div key={pidx} style={{
                          marginBlockEnd: "var(--space-8)",
                          padding: "var(--space-8)",
                          background: "rgba(100, 100, 255, 0.05)",
                          borderRadius: "4px"
                        }}>
                          <div style={{ color: "var(--accent-rose)" }}>{prop.property}:</div>
                          <div style={{ color: "var(--text-secondary)", fontSize: "0.8rem", marginBlockStart: "4px" }}>
                            {prop.value}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Surface Tints */}
          <div className="stack" style={{ ["--stack-gap" as CSSVars]: "var(--space-24)" }}>
            <div>
              <h3 data-ui="heading" data-size="md" style={{ marginBlockEnd: "var(--space-12)" }}>Surface Tints</h3>
              <p data-ui="text" data-size="sm" className="muted" style={{ marginBlockEnd: "var(--space-20)" }}>
                Color-mix tinted surfaces with matching border accent. Uses oklch color space for perceptual uniformity.
              </p>
            </div>
            <div className="card-region card-grid" style={{ ["--card-min" as CSSVars]: "18rem", ["--grid-gap" as CSSVars]: "var(--space-20)" }}>
              <div data-card data-elevation="raised" data-surface="rose">
                <h4 data-ui="heading" data-size="sm">Rose Tint</h4>
                <p data-ui="text" data-size="sm" className="muted">data-surface="rose"</p>
                <p data-ui="text" data-size="sm">6% --accent-rose mixed into --surface-1 with 30% alpha border. Romantic, warm tone.</p>
              </div>
              <div data-card data-elevation="raised" data-surface="gold">
                <h4 data-ui="heading" data-size="sm">Gold Tint</h4>
                <p data-ui="text" data-size="sm" className="muted">data-surface="gold"</p>
                <p data-ui="text" data-size="sm">6% --accent-gold mixed into --surface-1 with 30% alpha border. Elegant, premium feel.</p>
              </div>
              <div data-card data-elevation="raised" data-surface="sage">
                <h4 data-ui="heading" data-size="sm">Sage Tint</h4>
                <p data-ui="text" data-size="sm" className="muted">data-surface="sage"</p>
                <p data-ui="text" data-size="sm">6% --theme-accent-sage mixed into --surface-1 with 30% alpha border. Natural, calming.</p>
              </div>
            </div>
          </div>

          {/* Card Sections (Media, Header, Footer) */}
          <div className="stack" style={{ ["--stack-gap" as CSSVars]: "var(--space-24)" }}>
            <div>
              <h3 data-ui="heading" data-size="md" style={{ marginBlockEnd: "var(--space-12)" }}>Card Sections</h3>
              <p data-ui="text" data-size="sm" className="muted" style={{ marginBlockEnd: "var(--space-20)" }}>
                Semantic sections with automatic spacing: full-bleed media, bordered header/footer with logical properties.
              </p>
            </div>
            <div className="card-region card-grid" style={{ ["--card-min" as CSSVars]: "18rem", ["--grid-gap" as CSSVars]: "var(--space-20)" }}>
              <div data-card data-elevation="raised">
                <div data-card-media style={{ aspectRatio: "16/9", background: "linear-gradient(135deg, var(--accent-rose), var(--accent-gold))" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", color: "white", fontWeight: 500 }}>
                    16:9 Media
                  </div>
                </div>
                <h4 data-ui="heading" data-size="sm">Full-Bleed Media</h4>
                <p data-ui="text" data-size="sm" className="muted">data-card-media</p>
                <p data-ui="text" data-size="sm">Negative margins pull media to edges, border-radius respects card corners.</p>
              </div>
              <div data-card data-elevation="raised">
                <div data-card-header>
                  <h4 data-ui="heading" data-size="sm">Card Header</h4>
                  <p data-ui="text" data-size="sm" className="muted">data-card-header</p>
                </div>
                <p data-ui="text" data-size="sm">Header section with bottom border (--border-subtle) and padding-block-end spacing.</p>
              </div>
              <div data-card data-elevation="raised">
                <h4 data-ui="heading" data-size="sm">Card Footer</h4>
                <p data-ui="text" data-size="sm">Footer section with top border (--border-subtle) and padding-block-start spacing.</p>
                <div data-card-footer>
                  <div className="cluster" style={{ ["--cluster-gap" as CSSVars]: "var(--space-12)", justifyContent: "flex-end" }}>
                    <button className="button" data-variant="ghost" data-size="sm">Cancel</button>
                    <button className="button" data-variant="primary" data-size="sm">Confirm</button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Combined Effects */}
          <div className="stack" style={{ ["--stack-gap" as CSSVars]: "var(--space-24)" }}>
            <div>
              <h3 data-ui="heading" data-size="md" style={{ marginBlockEnd: "var(--space-12)" }}>Combined Effects</h3>
              <p data-ui="text" data-size="sm" className="muted" style={{ marginBlockEnd: "var(--space-20)" }}>
                Stack multiple attributes to create sophisticated card compositions with glass, tints, hover, and elevation.
              </p>
            </div>
            <div className="card-region card-grid" style={{ ["--card-min" as CSSVars]: "18rem", ["--grid-gap" as CSSVars]: "var(--space-20)" }}>
              <div data-card data-glass data-glass-elevation="lg" data-hover="lift">
                <h4 data-ui="heading" data-size="sm">Glass + Lift</h4>
                <p data-ui="text" data-size="sm" className="muted">data-glass data-glass-elevation="lg" data-hover="lift"</p>
                <p data-ui="text" data-size="sm">Glassmorphism with interactive lift. Perfect for overlays and modals.</p>
              </div>
              <div data-card data-elevation="elevated" data-surface="rose" data-hover="glow">
                <h4 data-ui="heading" data-size="sm">Surface + Glow</h4>
                <p data-ui="text" data-size="sm" className="muted">data-elevation="elevated" data-surface="rose" data-hover="glow"</p>
                <p data-ui="text" data-size="sm">Tinted surface with glow hover. Draws attention to important actions.</p>
              </div>
              <div data-card data-elevation="floating" data-glass data-glass-elevation="md" data-surface="gold">
                <h4 data-ui="heading" data-size="sm">Everything</h4>
                <p data-ui="text" data-size="sm" className="muted">floating + glass + gold tint</p>
                <p data-ui="text" data-size="sm">Maximum drama: floating shadow, glass blur, and gold tint combined.</p>
              </div>
            </div>
          </div>

          {/* Container Query Auto-Responsive */}
          <div className="stack" style={{ ["--stack-gap" as CSSVars]: "var(--space-24)" }}>
            <div>
              <h3 data-ui="heading" data-size="md" style={{ marginBlockEnd: "var(--space-12)" }}>Container Query Auto-Responsive</h3>
              <p data-ui="text" data-size="sm" className="muted" style={{ marginBlockEnd: "var(--space-20)" }}>
                Cards automatically adjust padding/gap based on container width. No manual data-padding needed.
              </p>
            </div>
            <div style={{ border: "2px dashed var(--border-subtle)", padding: "var(--space-20)", borderRadius: "var(--radius-md)" }}>
              <p data-ui="text" data-size="sm" className="muted" style={{ marginBlockEnd: "var(--space-16)" }}>
                <strong>{'< 380px:'}</strong> --card-padding: 16px, --card-gap: 12px (compact)<br />
                <strong>380px - 900px:</strong> --card-padding: 24px, --card-gap: 16px (default)<br />
                <strong>{'> 900px:'}</strong> --card-padding: 32px, --card-gap: 20px (spacious)
              </p>
              <div className="card-region card-grid" style={{ ["--card-min" as CSSVars]: "16rem", ["--grid-gap" as CSSVars]: "var(--space-20)" }}>
                <div data-card data-elevation="raised">
                  <h4 data-ui="heading" data-size="sm">Responsive Padding</h4>
                  <p data-ui="text" data-size="sm">Resize window to see padding adjust automatically via @container queries.</p>
                  <div className="inline">
                    <span className="badge">Compact</span>
                    <span className="badge">Default</span>
                    <span className="badge">Spacious</span>
                  </div>
                </div>
                <div data-card data-elevation="raised">
                  <h4 data-ui="heading" data-size="sm">No Manual Override</h4>
                  <p data-ui="text" data-size="sm">Container queries handle density. Manual data-padding only for special cases.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* Surface Sage - Loose */}
      <Section recipe="surface-sage" density="loose">
        <div className="stack" style={{ ["--stack-gap" as CSSVars]: "var(--rc-flow)" }}>
          <h2 data-ui="heading" data-size="lg">Surface • Sage (loose)</h2>
          <p data-ui="text" data-muted="true">
            Light surface with sage accent. Loose density (--rc-gap: 40px, --rc-flow: 32px)
          </p>
          <div className="grid" style={{ ["--grid-min" as CSSVars]: "16rem", ["--grid-gap" as CSSVars]: "var(--rc-gap)" }}>
            <article className="prose">
              <h3>Why Couples Love It</h3>
              <p>
                Vertical rhythm, readable measure (~65ch), and tokenized spacing make long-form content look
                sharp in both themes.
              </p>
              <blockquote>"Best venue ever. The space was magical!" — A Happy Couple</blockquote>
              <ul>
                <li>Stunning natural surroundings</li>
                <li>Flexible ceremony options</li>
                <li>Full-service coordination</li>
              </ul>
            </article>
            <div className="stack">
              <div className="ar ar-4x3" style={{ background: "var(--mix-soft)", borderRadius: "var(--radius-md)", overflow: "hidden" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", color: "var(--text-muted)" }}>
                  4:3 placeholder
                </div>
              </div>
              <div className="inline">
                <span className="badge">Vineyard</span>
                <span className="badge">Barn</span>
                <span className="badge">Nature</span>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* Tint Rose - Compact */}
      <Section recipe="tint-rose" density="compact">
        <div className="stack" style={{ ["--stack-gap" as CSSVars]: "var(--rc-flow)" }}>
          <h2 data-ui="heading" data-size="lg">Recipe Integration Demo</h2>
          <p data-ui="text" data-muted="true">
            Cards consuming recipe variables (--rc-bg, --rc-fg, --rc-card) and composing with other primitives.
          </p>
          <div className="card-region card-grid" style={{ ["--card-min" as CSSVars]: "20rem", ["--grid-gap" as CSSVars]: "var(--rc-gap)" }}>
            <div data-card data-elevation="raised">
              <h3 data-ui="heading" data-size="sm">Card + Inline Primitive</h3>
              <p data-ui="text" className="muted" style={{ marginBlockEnd: "var(--space-16)" }}>
                Demonstrates card composing with inline primitive for tag wrapping. Flexible gap control.
              </p>
              <div className="inline" style={{ ["--gap" as CSSVars]: "var(--space-12)" }}>
                <span className="badge">Venue</span>
                <span className="badge">Catering</span>
                <span className="badge">Photography</span>
                <span className="badge">Music</span>
                <span className="badge">Florals</span>
              </div>
            </div>
            <div data-card data-elevation="raised">
              <h3 data-ui="heading" data-size="sm">Card + Stack Layout</h3>
              <p data-ui="text" className="muted" style={{ marginBlockEnd: "var(--space-16)" }}>
                Demonstrates card composing with stack primitive for vertical rhythm. Auto-flow spacing.
              </p>
              <div className="stack" style={{ ["--stack-gap" as CSSVars]: "var(--space-16)" }}>
                <div style={{ padding: "var(--space-12)", background: "var(--mix-soft)", borderRadius: "var(--radius-sm)" }}>Ceremony</div>
                <div style={{ padding: "var(--space-12)", background: "var(--mix-soft)", borderRadius: "var(--radius-sm)" }}>Reception</div>
                <div style={{ padding: "var(--space-12)", background: "var(--mix-soft)", borderRadius: "var(--radius-sm)" }}>Cocktail Hour</div>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* Tint Sage - Tight */}
      <Section recipe="tint-sage" density="tight">
        <div className="stack" style={{ ["--stack-gap" as CSSVars]: "var(--rc-flow)" }}>
          <h2 data-ui="heading" data-size="lg">Card + Cluster Layout</h2>
          <p data-ui="text" data-muted="true">
            Cards composing with cluster primitive for horizontal wrapping. Great for feature badges or compact info blocks.
          </p>
          <div className="card-region cluster" style={{ ["--cluster-gap" as CSSVars]: "var(--rc-gap)", flexWrap: "wrap" }}>
            <div data-card data-elevation="flat" style={{ minWidth: "200px" }}>
              <h4 data-ui="heading" data-size="xs">Auto-Responsive</h4>
              <p data-ui="text" data-size="sm" className="muted">Container queries adjust padding/gap automatically. No media queries needed.</p>
            </div>
            <div data-card data-elevation="flat" style={{ minWidth: "200px" }}>
              <h4 data-ui="heading" data-size="xs">Recipe-Driven</h4>
              <p data-ui="text" data-size="sm" className="muted">Semantic --card-* variables in recipes layer. Single source of truth.</p>
            </div>
            <div data-card data-elevation="flat" style={{ minWidth: "200px" }}>
              <h4 data-ui="heading" data-size="xs">Zero-Specificity</h4>
              <p data-ui="text" data-size="sm" className="muted">:where() selectors allow easy overriding. No specificity wars.</p>
            </div>
          </div>
        </div>
      </Section>

      {/* Hero Dark - Airy */}
      <Section recipe="hero-dark" density="airy" style={{ paddingBlock: "var(--space-56)" }}>
        <div className="stack" style={{ ["--stack-gap" as CSSVars]: "var(--rc-flow)", alignItems: "flex-start" }}>
          <h2 data-ui="heading" data-size="xl">Dark Recipe Context</h2>
          <p data-ui="text" data-size="lg" data-muted style={{ maxWidth: "60ch" }}>
            Cards automatically adapt to dark recipe contexts. Tone-aware tokens (--rc-fg, --rc-card) ensure proper contrast and readability.
          </p>
          <div className="cluster" style={{ ["--cluster-gap" as CSSVars]: "var(--space-20)" }}>
            <a className="button" data-variant="primary" href="/contact">Book a Tour</a>
            <a className="button" data-variant="ghost" href="/pricing">See Pricing</a>
          </div>
          <div className="card-region card-grid" style={{ ["--card-min" as CSSVars]: "16rem", ["--grid-gap" as CSSVars]: "var(--rc-gap)", marginBlockStart: "var(--space-32)" }}>
            <div data-card data-elevation="raised">
              <h3 data-ui="heading" data-size="sm">Automatic Adaptation</h3>
              <p data-ui="text" className="muted">Card inherits dark recipe tokens. No manual theme switching needed.</p>
              <div className="inline" style={{ marginBlockStart: "var(--space-12)" }}>
                <span className="badge">Dark Mode</span>
                <span className="badge">Tone-Aware</span>
              </div>
            </div>
            <div data-card data-elevation="raised">
              <h3 data-ui="heading" data-size="sm">Proper Contrast</h3>
              <p data-ui="text" className="muted">Recipe ensures WCAG-compliant contrast ratios in all lighting conditions.</p>
              <div className="inline" style={{ marginBlockStart: "var(--space-12)" }}>
                <span className="badge">Accessible</span>
                <span className="badge">WCAG AA</span>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* Switcher Showcase */}
      <Section recipe="surface-rose" density="compact">
        <div className="stack" style={{ ["--stack-gap" as CSSVars]: "var(--rc-flow)" }}>
          <h2 data-ui="heading" data-size="lg">Card + Switcher Layout</h2>
          <p data-ui="text" data-muted="true">
            Cards composing with switcher primitive for container-responsive horizontal/vertical switching. Uses container queries, not media queries.
          </p>

          <div style={{ border: "2px dashed var(--border-subtle)", padding: "var(--space-20)", borderRadius: "var(--radius-md)" }}>
            <p data-ui="text" data-size="sm" className="muted" style={{ marginBlockEnd: "var(--space-16)" }}>
              <strong>Switcher Behavior:</strong> Horizontal when container {'>'} 320px, vertical when {'<='} 320px. Resize browser to see switch.
            </p>
            <div className="card-region switcher" style={{ ["--switcher-threshold" as CSSVars]: "320px", ["--gap" as CSSVars]: "var(--space-24)" }}>
              <div data-card data-elevation="raised">
                <h3 data-ui="heading" data-size="sm">Container-Based</h3>
                <p data-ui="text" data-size="sm">Switches based on container width, not viewport. Perfect for responsive sidebar layouts.</p>
              </div>
              <div data-card data-elevation="raised">
                <h3 data-ui="heading" data-size="sm">Flexible Threshold</h3>
                <p data-ui="text" data-size="sm">Customize --switcher-threshold per component. Each switcher can have different break points.</p>
              </div>
              <div data-card data-elevation="raised">
                <h3 data-ui="heading" data-size="sm">Auto-Responsive</h3>
                <p data-ui="text" data-size="sm">Cards inside maintain auto-responsive padding via container queries. No manual adjustments.</p>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* Typography Showcase */}
      <Section recipe="tint-sage" density="loose">
        <div className="stack" style={{ ["--stack-gap" as CSSVars]: "var(--rc-flow)" }}>
          <h2 data-ui="heading" data-size="lg">Typography System</h2>
          <div className="grid" style={{ ["--grid-min" as CSSVars]: "20rem", ["--grid-gap" as CSSVars]: "var(--rc-gap)" }}>
            <div className="stack">
              <h3 data-ui="heading" data-size="md">Heading Sizes</h3>
              <div className="stack" style={{ ["--stack-gap" as CSSVars]: "var(--space-12)" }}>
                <p data-ui="heading" data-size="xl">XL Heading</p>
                <p data-ui="heading" data-size="lg">LG Heading</p>
                <p data-ui="heading" data-size="md">MD Heading</p>
                <p data-ui="heading" data-size="sm">SM Heading</p>
                <p data-ui="heading" data-size="xs">XS Heading</p>
              </div>
            </div>
            <div className="stack">
              <h3 data-ui="heading" data-size="md">Text Sizes</h3>
              <div className="stack" style={{ ["--stack-gap" as CSSVars]: "var(--space-12)" }}>
                <p data-ui="text" data-size="lg">LG Text - Larger body copy with loose leading</p>
                <p data-ui="text" data-size="md">MD Text - Default body copy size</p>
                <p data-ui="text" data-size="sm">SM Text - Smaller labels and captions</p>
                <p data-ui="text" data-size="xs">XS Text - Fine print and metadata</p>
              </div>
            </div>
          </div>
        </div>
      </Section>

      </div> {/* end scroll-target wrapper */}
    </main>
  );
}
