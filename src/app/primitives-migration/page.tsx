"use client";

import ThemeSwitch from "@/components/ui/ThemeSwitch";
import Section from "@/components/ui/SectionEnhanced";

export default function PrimitivesMigration() {
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
          ["--stack-gap" as any]: "var(--space-32)",
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
              color: "var(--accent-gold, #E4C896)",
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
              color: "var(--accent-gold, #E4C896)"
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
            ["--cluster-gap" as any]: "var(--space-20)",
            marginTop: "var(--space-24)"
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
              marginTop: "var(--space-56)",
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
      <div className="stack" style={{ ["--stack-gap" as any]: "var(--space-40)", padding: "var(--space-32)" }} data-scroll-target>
      <header className="cluster" style={{ justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "var(--space-24)" }}>
        <h1 data-ui="heading" data-size="xl">Primitives + Recipes Migration</h1>
        <ThemeSwitch />
      </header>

      {/* Surface Rose - Compact */}
      <Section recipe="surface-rose" density="compact">
        <div className="stack" style={{ ["--stack-gap" as any]: "var(--rc-flow)" }}>
          <h2 data-ui="heading" data-size="lg" style={{ color: "var(--rc-fg)" }}>Surface • Rose (compact)</h2>
          <p data-ui="text" data-muted="true" style={{ color: "var(--rc-fg-muted)" }}>
            Light surface with rose accent. Compact density (--rc-gap: 24px, --rc-flow: 20px)
          </p>
          <div className="grid" style={{ ["--grid-min" as any]: "18rem", ["--grid-gap" as any]: "var(--rc-gap)" }}>
            <article data-card data-elevation="raised" data-padding="spacious" className="stack">
              <h3 data-ui="heading" data-size="sm">Card A</h3>
              <p data-ui="text" className="muted">Uses rc vars for bg/fg/border</p>
              <div className="inline">
                <span className="badge">Rustic</span>
                <span className="badge">Romantic</span>
                <span className="badge">Outdoor</span>
              </div>
            </article>
            <article data-card data-elevation="raised" data-padding="spacious" className="stack">
              <h3 data-ui="heading" data-size="sm">Card B</h3>
              <p data-ui="text" className="muted">Test switcher in narrow containers</p>
              <div className="switcher" style={{ ["--switcher-threshold" as any]: "320px" }}>
                <div data-card data-elevation="flat" data-padding="compact">Item 1</div>
                <div data-card data-elevation="flat" data-padding="compact">Item 2</div>
                <div data-card data-elevation="flat" data-padding="compact">Item 3</div>
              </div>
            </article>
            <article data-card data-elevation="raised" data-padding="spacious" className="stack">
              <h3 data-ui="heading" data-size="sm">Card C</h3>
              <p data-ui="text" className="muted">Aspect ratio utilities</p>
              <div className="ar ar-16x9" style={{ background: "var(--mix-soft)", borderRadius: "var(--radius-md)", overflow: "hidden" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", color: "var(--text-muted)" }}>
                  16:9
                </div>
              </div>
            </article>
          </div>
        </div>
      </Section>

      {/* Surface Sage - Loose */}
      <Section recipe="surface-sage" density="loose">
        <div className="stack" style={{ ["--stack-gap" as any]: "var(--rc-flow)" }}>
          <h2 data-ui="heading" data-size="lg" style={{ color: "var(--rc-fg)" }}>Surface • Sage (loose)</h2>
          <p data-ui="text" data-muted="true" style={{ color: "var(--rc-fg-muted)" }}>
            Light surface with sage accent. Loose density (--rc-gap: 40px, --rc-flow: 32px)
          </p>
          <div className="grid" style={{ ["--grid-min" as any]: "16rem", ["--grid-gap" as any]: "var(--rc-gap)" }}>
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
        <div className="stack" style={{ ["--stack-gap" as any]: "var(--rc-flow)" }}>
          <h2 data-ui="heading" data-size="lg" style={{ color: "var(--rc-fg)" }}>Tint • Rose (compact)</h2>
          <p data-ui="text" data-muted="true" style={{ color: "var(--rc-fg-muted)" }}>
            Subtle rose tint background with color-mix fallback. Compact density.
          </p>
          <div className="grid" style={{ ["--grid-min" as any]: "20rem", ["--grid-gap" as any]: "var(--rc-gap)" }}>
            <div data-card data-elevation="raised" data-padding="spacious">
              <h3 data-ui="heading" data-size="sm">Inline Primitive</h3>
              <p data-ui="text" className="muted" style={{ marginBottom: "var(--space-16)" }}>Wraps tags with consistent gap</p>
              <div className="inline" style={{ ["--gap" as any]: "var(--space-12)" }}>
                <span className="badge">Tag A</span>
                <span className="badge">Tag B</span>
                <span className="badge">Tag C</span>
                <span className="badge">Tag D</span>
                <span className="badge">Tag E</span>
              </div>
            </div>
            <div data-card data-elevation="raised" data-padding="spacious">
              <h3 data-ui="heading" data-size="sm">Stack Layout</h3>
              <div className="stack" style={{ ["--stack-gap" as any]: "var(--space-16)" }}>
                <div style={{ padding: "var(--space-12)", background: "var(--mix-soft)", borderRadius: "var(--radius-sm)" }}>Item 1</div>
                <div style={{ padding: "var(--space-12)", background: "var(--mix-soft)", borderRadius: "var(--radius-sm)" }}>Item 2</div>
                <div style={{ padding: "var(--space-12)", background: "var(--mix-soft)", borderRadius: "var(--radius-sm)" }}>Item 3</div>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* Tint Sage - Tight */}
      <Section recipe="tint-sage" density="tight">
        <div className="stack" style={{ ["--stack-gap" as any]: "var(--rc-flow)" }}>
          <h2 data-ui="heading" data-size="lg" style={{ color: "var(--rc-fg)" }}>Tint • Sage (tight)</h2>
          <p data-ui="text" data-muted="true" style={{ color: "var(--rc-fg-muted)" }}>
            Subtle sage tint background. Tight density (--rc-gap: 16px, --rc-flow: 16px)
          </p>
          <div className="cluster" style={{ ["--cluster-gap" as any]: "var(--rc-gap)", flexWrap: "wrap" }}>
            <div data-card data-elevation="flat" data-padding="normal" style={{ minWidth: "200px" }}>
              <h4 data-ui="heading" data-size="xs">Feature A</h4>
              <p data-ui="text" data-size="sm" className="muted">Tight spacing demo</p>
            </div>
            <div data-card data-elevation="flat" data-padding="normal" style={{ minWidth: "200px" }}>
              <h4 data-ui="heading" data-size="xs">Feature B</h4>
              <p data-ui="text" data-size="sm" className="muted">Compact layout</p>
            </div>
            <div data-card data-elevation="flat" data-padding="normal" style={{ minWidth: "200px" }}>
              <h4 data-ui="heading" data-size="xs">Feature C</h4>
              <p data-ui="text" data-size="sm" className="muted">Dense information</p>
            </div>
          </div>
        </div>
      </Section>

      {/* Hero Dark - Airy */}
      <Section recipe="hero-dark" density="airy" style={{ paddingBlock: "var(--space-56)" }}>
        <div className="stack" style={{ ["--stack-gap" as any]: "var(--rc-flow)", alignItems: "flex-start" }}>
          <h2 data-ui="heading" data-size="xl" style={{ color: "var(--rc-fg)" }}>Hero • Dark (airy)</h2>
          <p data-ui="text" data-size="lg" style={{ maxWidth: "60ch", color: "var(--rc-fg-muted)" }}>
            This section demonstrates tone-aware tokens with inverse text. Dark gradient background with gold accent.
            Airy density (--rc-gap: 56px, --rc-flow: 40px).
          </p>
          <div className="cluster" style={{ ["--cluster-gap" as any]: "var(--space-20)" }}>
            <a className="button" data-variant="primary" href="/contact">Book a Tour</a>
            <a className="button" data-variant="ghost" href="/pricing">See Pricing</a>
          </div>
          <div className="grid" style={{ ["--grid-min" as any]: "16rem", ["--grid-gap" as any]: "var(--rc-gap)", marginTop: "var(--space-32)" }}>
            <div data-card data-elevation="raised" data-padding="spacious">
              <h3 data-ui="heading" data-size="sm" style={{ color: "var(--rc-fg)" }}>Dark Card A</h3>
              <p data-ui="text" className="muted">Recipe system ensures consistent colors</p>
            </div>
            <div data-card data-elevation="raised" data-padding="spacious">
              <h3 data-ui="heading" data-size="sm" style={{ color: "var(--rc-fg)" }}>Dark Card B</h3>
              <p data-ui="text" className="muted">Works in both light and dark themes</p>
            </div>
          </div>
        </div>
      </Section>

      {/* Switcher Showcase */}
      <Section recipe="surface-rose" density="compact">
        <div className="stack" style={{ ["--stack-gap" as any]: "var(--rc-flow)" }}>
          <h2 data-ui="heading" data-size="lg">Switcher Primitive Showcase</h2>
          <p data-ui="text" data-muted="true">
            Auto-switches from horizontal to vertical based on container width (container queries, no media queries)
          </p>

          <div style={{ border: "2px dashed var(--border-subtle)", padding: "var(--space-20)", borderRadius: "var(--radius-md)" }}>
            <p data-ui="text" data-size="sm" className="muted" style={{ marginBottom: "var(--space-16)" }}>
              Container width controlled (resize to see switch at 320px threshold)
            </p>
            <div className="switcher" style={{ ["--switcher-threshold" as any]: "320px", ["--gap" as any]: "var(--space-24)" }}>
              <div data-card data-elevation="raised" data-padding="spacious">
                <h3 data-ui="heading" data-size="sm">Column A</h3>
                <p data-ui="text" data-size="sm">Switches based on container</p>
              </div>
              <div data-card data-elevation="raised" data-padding="spacious">
                <h3 data-ui="heading" data-size="sm">Column B</h3>
                <p data-ui="text" data-size="sm">Not viewport width</p>
              </div>
              <div data-card data-elevation="raised" data-padding="spacious">
                <h3 data-ui="heading" data-size="sm">Column C</h3>
                <p data-ui="text" data-size="sm">Pure component responsiveness</p>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* Typography Showcase */}
      <Section recipe="tint-sage" density="loose">
        <div className="stack" style={{ ["--stack-gap" as any]: "var(--rc-flow)" }}>
          <h2 data-ui="heading" data-size="lg">Typography System</h2>
          <div className="grid" style={{ ["--grid-min" as any]: "20rem", ["--grid-gap" as any]: "var(--rc-gap)" }}>
            <div className="stack">
              <h3 data-ui="heading" data-size="md">Heading Sizes</h3>
              <div className="stack" style={{ ["--stack-gap" as any]: "var(--space-12)" }}>
                <p data-ui="heading" data-size="xl">XL Heading</p>
                <p data-ui="heading" data-size="lg">LG Heading</p>
                <p data-ui="heading" data-size="md">MD Heading</p>
                <p data-ui="heading" data-size="sm">SM Heading</p>
                <p data-ui="heading" data-size="xs">XS Heading</p>
              </div>
            </div>
            <div className="stack">
              <h3 data-ui="heading" data-size="md">Text Sizes</h3>
              <div className="stack" style={{ ["--stack-gap" as any]: "var(--space-12)" }}>
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
