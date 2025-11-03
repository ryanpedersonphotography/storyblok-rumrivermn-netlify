import React from 'react';

import Section from '@/components/ui/SectionEnhanced';

export type HeroPrimitiveProps = {
  eyebrow?: string;
  title: string;
  accent?: string;
  lead?: string;
  height?: 'auto' | 'screen';
  overlay?: 'none' | 'soft' | 'strong';
  align?: 'start' | 'center' | 'end';
  density?: 'compact' | 'normal' | 'airy';
  paddingY?: 'sm' | 'md' | 'lg' | 'xl';
  tone?: 'prominent' | 'hero'; // hero is back-compat alias
  image?: {
    src: string;
    alt?: string;
    position?: 'cover' | 'contain';
    attachment?: 'fixed' | 'scroll';
    focalX?: string;
    focalY?: string;
  };
  primaryCta?: { label: string; href: string; rel?: string; target?: string };
  secondaryCta?: { label: string; href: string; rel?: string; target?: string };
  showScrollIndicator?: boolean;
  glass?: boolean; // turn on frosted glass behind text
};

export default function HeroPrimitive({
  eyebrow,
  title,
  accent,
  lead,
  height = 'screen',
  overlay = 'soft',
  align = 'center',
  density = 'normal',
  paddingY = 'lg',
  tone = 'prominent',
  image,
  primaryCta,
  secondaryCta,
  showScrollIndicator = true,
  glass = false,
}: HeroPrimitiveProps) {
  // Map align values: start/end → left/right for Section
  const sectionAlign = align === 'start' ? 'left' : align === 'end' ? 'right' : 'center';

  return (
    <Section
      height={height}
      align={sectionAlign}
      paddingY={paddingY}
      image={image ? {
        src: image.src,
        alt: image.alt || '',
        position: image.position ?? 'cover',
        attachment: image.attachment ?? 'fixed',
      } : undefined}
      overlay={overlay}
      {...{ 'data-recipe': 'hero-dark', 'data-density': density, 'data-gradient': 'auto', 'data-tone': tone }}
    >
      <div
        className="stack"
        data-container="lg"
        {...(glass ? { 'data-glass': 'true' } : {})}
        style={{
          ['--stack-gap' as any]: 'var(--space-32)',
          alignItems:
            align === 'center' ? 'center' :
            align === 'end'    ? 'flex-end' : 'flex-start',
          textAlign: align === 'center' ? 'center' : align === 'end' ? 'right' : 'left',
          maxWidth: 800,
          margin: align === 'center' ? '0 auto' : '0',
          boxShadow: glass ? 'var(--shadow-lg)' : undefined,
        }}
      >
        {/* Eyebrow */}
        {eyebrow && (
          <p className="text-script" data-ui="text" data-size="lg" style={{ color: 'var(--rc-accent)' }}>
            {eyebrow}
          </p>
        )}

        {/* Title + optional accent */}
        <h1 className="text-display" data-ui="heading" data-size="xl" style={{
          fontSize: 'clamp(3rem, 8vw, 5.5rem)',
          marginBlock: 'var(--space-16)',
        }}>
          {title}
          {accent ? (
            <>
              <br />
              <span data-accent="true" style={{ color: 'var(--rc-accent)' }}>
                {accent}
              </span>
            </>
          ) : null}
        </h1>

        {/* Lead */}
        {lead && (
          <p data-ui="text" data-size="lg" style={{
            maxWidth: '65ch',
            opacity: 0.95,
            lineHeight: 1.7,
            margin: align === 'center' ? '0 auto' : '0',
          }}>
            {lead}
          </p>
        )}

        {/* CTAs */}
        {(primaryCta || secondaryCta) && (
          <div className="cluster" style={{
            ['--cluster-gap' as any]: 'var(--space-20)',
            marginBlockStart: 'var(--space-24)',
            justifyContent:
              align === 'center' ? 'center' :
              align === 'end'    ? 'flex-end' : 'flex-start',
          }}>
            {primaryCta && (
              <a
                className="button"
                data-ui="button"
                data-variant="solid"
                data-size="lg"
                data-corner="pill"
                href={primaryCta.href}
                rel={primaryCta.rel}
                target={primaryCta.target}
                style={{
                  background: 'var(--rc-accent)',
                  color: 'var(--rc-accent-contrast)',
                  border: '1px solid var(--rc-accent)',
                }}
              >
                {primaryCta.label}
              </a>
            )}
            {secondaryCta && (
              <a
                className="button"
                data-ui="button"
                data-variant="ghost"
                data-size="lg"
                data-corner="pill"
                href={secondaryCta.href}
                rel={secondaryCta.rel}
                target={secondaryCta.target}
                style={{ color: 'var(--rc-fg-hero)', border: '1px solid currentColor' }}
              >
                {secondaryCta.label}
              </a>
            )}
          </div>
        )}

        {/* Scroll indicator */}
        {showScrollIndicator && (
          <a
            href="#next-section"
            className="button"
            data-ui="button"
            data-variant="ghost"
            aria-label="Scroll down"
            style={{
              marginBlockStart: 'var(--space-56)',
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--space-8)',
              alignItems: 'center',
              textDecoration: 'none',
              color: 'var(--rc-fg-hero)',
              opacity: 0.9,
            }}
          >
            <span data-ui="text" data-size="sm" style={{ textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              Discover Your Perfect Day
            </span>
            <span data-anim="hero-bounce" style={{ fontSize: '1.5rem' }}>↓</span>
          </a>
        )}
      </div>
    </Section>
  );
}
