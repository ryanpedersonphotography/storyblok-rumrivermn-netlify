import React from 'react';

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
 * Uses your primitives layer classes: .section, .section__inner, .stack, .btn, etc.
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
  // Section attributes used by your primitives/recipes
  const sectionData: Record<string, string> = {
    'data-density': density,
    'data-align': align,
  };

  const style: React.CSSProperties = {
    minHeight: height === 'screen' ? '100svh' : undefined,
    backgroundImage: image?.src ? `url(${image.src})` : undefined,
    backgroundSize: image?.position === 'contain' ? 'contain' : 'cover',
    backgroundAttachment: image?.attachment === 'fixed' ? 'fixed' : undefined,
    backgroundPosition: `${image?.focalX ?? '50%'} ${image?.focalY ?? '50%'}`,
  };

  // Overlay strength maps to a data attribute primitives already style
  const overlayAttr =
    overlay === 'none' ? undefined :
    overlay === 'strong' ? { 'data-overlay': 'strong' } :
    { 'data-overlay': 'soft' };

  return (
    <section
      data-hero data-impl="primitive"
      className={`section section--surface section--pad section--py-${paddingY}`}
      style={style}
      {...sectionData}
      {...overlayAttr}
    >
      <div className="section__inner stack gap-6" data-container="lg">
        {eyebrow && <div className="text-script text-script--eyebrow">{eyebrow}</div>}

        <h1 className="text-display">
          {accent
            ? (<>{title.replace(accent, '')}<span data-accent="true">{accent}</span></>)
            : title}
        </h1>

        {lead && <p className="text-lead">{lead}</p>}

        {(primaryCta || secondaryCta) && (
          <div className="inline cluster gap-4">
            {primaryCta && (
              <a className="btn btn--primary" href={primaryCta.href} rel={primaryCta.rel} target={primaryCta.target}>
                {primaryCta.label}
              </a>
            )}
            {secondaryCta && (
              <a className="btn btn--secondary" href={secondaryCta.href} rel={secondaryCta.rel} target={secondaryCta.target}>
                {secondaryCta.label}
              </a>
            )}
          </div>
        )}

        {showScrollIndicator && (
          <div className="stack gap-2" aria-hidden="true">
            <div className="text-small">Scroll</div>
            <svg width="24" height="24" viewBox="0 0 24 24" role="img" aria-label="scroll down">
              <path d="M12 16l-6-6h12l-6 6z" />
            </svg>
          </div>
        )}
      </div>
    </section>
  );
}
