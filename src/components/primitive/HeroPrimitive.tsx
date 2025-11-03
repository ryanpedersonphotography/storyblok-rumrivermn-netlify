import Section from '@/components/ui/SectionEnhanced';
import type { CSSVars } from '@/types/css-vars';

export type HeroPrimitiveProps = {
  eyebrow?: string;
  title: string;
  accent?: string;           // portion of title to accent (optional)
  lead?: string;
  height?: 'auto' | 'screen';
  overlay?: 'none' | 'soft' | 'strong';
  image?: {
    src: string;
    alt?: string;
    position?: 'cover' | 'contain';
    attachment?: 'fixed' | 'scroll';
    focalX?: string; // e.g., '50%'
    focalY?: string; // e.g., '40%'
  };
  primaryCta?: { label: string; href: string; rel?: string; target?: string };
  secondaryCta?: { label: string; href: string; rel?: string; target?: string };
  showScrollIndicator?: boolean;
  align?: 'start' | 'center' | 'end';
  density?: 'compact' | 'normal' | 'airy';     // ties into your primitives density rules
  paddingY?: 'sm' | 'md' | 'lg' | 'xl';
};

/**
 * Pure-primitives Hero. No legacy CSS.
 * Uses only primitives from the migration layer.
 */
export default function HeroPrimitive({
  eyebrow,
  title,
  accent,
  lead,
  height = 'screen',
  overlay = 'soft',
  image,
  primaryCta,
  secondaryCta,
  showScrollIndicator = false,
  align = 'center',
  density = 'normal',
  paddingY = 'lg',
}: HeroPrimitiveProps) {

  return (
    <Section
      recipe="hero-dark"
      density={density}
      height={height}
      align={align}
      paddingY={paddingY}
      image={image ? {
        src: image.src,
        alt: image.alt || '',
        position: image.position,
        attachment: image.attachment
      } : undefined}
      overlay={overlay}
    >
      <div className="stack" style={{
        ["--stack-gap" as CSSVars]: "var(--space-32)",
        alignItems: align === 'center' ? 'center' : align === 'end' ? 'flex-end' : 'flex-start',
        textAlign: align === 'center' ? 'center' : align === 'end' ? 'right' : 'left',
        maxWidth: "800px",
        margin: align === 'center' ? "0 auto" : "0",
        position: "relative",
        zIndex: 10
      }}>
        {/* Eyebrow - using text primitive */}
        {eyebrow && (
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
            {eyebrow}
          </p>
        )}

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
          {title}
          {accent && (
            <>
              <br />
              <span style={{
                fontFamily: "var(--font-script, 'Dancing Script', cursive)",
                fontWeight: 400,
                fontSize: "0.85em",
                color: "var(--rc-accent)"
              }}>
                {accent}
              </span>
            </>
          )}
        </h1>

        {/* Lead text - using text primitive */}
        {lead && (
          <p
            data-ui="text"
            data-size="lg"
            style={{
              maxWidth: "65ch",
              opacity: 0.95,
              lineHeight: 1.7,
              margin: align === 'center' ? "0 auto" : "0"
            }}
          >
            {lead}
          </p>
        )}

        {/* CTAs - using button primitive */}
        {(primaryCta || secondaryCta) && (
          <div className="cluster" style={{
            ["--cluster-gap" as CSSVars]: "var(--space-20)",
            marginBlockStart: "var(--space-24)",
            justifyContent: align === 'center' ? 'center' : align === 'end' ? 'flex-end' : 'flex-start'
          }}>
            {primaryCta && (
              <a 
                href={primaryCta.href}
                rel={primaryCta.rel}
                target={primaryCta.target}
                className="button" 
                data-ui="button"
                data-variant="solid" 
                data-size="lg"
                data-corner="pill"
                style={{
                  background: "var(--rc-accent)",
                  color: "var(--rc-accent-contrast)",
                  border: "1px solid var(--rc-accent)"
                }}
              >
                {primaryCta.label}
              </a>
            )}
            {secondaryCta && (
              <a 
                href={secondaryCta.href}
                rel={secondaryCta.rel}
                target={secondaryCta.target}
                className="button" 
                data-ui="button"
                data-variant="ghost" 
                data-size="lg"
                data-corner="pill"
                style={{
                  color: "var(--rc-fg)",
                  border: "1px solid currentColor"
                }}
              >
                {secondaryCta.label}
              </a>
            )}
          </div>
        )}

        {/* Scroll indicator (server-safe) */}
        {showScrollIndicator && (
          <a
            href="#next-section"
            className="button"
            data-ui="button"
            data-variant="ghost"
            aria-label="Scroll down"
            style={{
              marginBlockStart: "var(--space-56)",
              display: "flex",
              flexDirection: "column",
              gap: "var(--space-8)",
              alignItems: "center",
              textDecoration: "none",
              color: "var(--rc-fg)",
              opacity: 0.9
            }}
          >
            <span data-ui="text" data-size="sm" style={{ 
              textTransform: "uppercase", 
              letterSpacing: "0.1em" 
            }}>
              {showScrollIndicator === true ? 'Discover Your Perfect Day' : 'Scroll'}
            </span>
            <span style={{ 
              fontSize: "1.5rem", 
              animation: "heroScrollBounce 2s infinite" 
            }}>
              ↓
            </span>
          </a>
        )}
      </div>

      <style jsx>{`
        @keyframes heroScrollBounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(10px); }
        }
      `}</style>
    </Section>
  );
}
