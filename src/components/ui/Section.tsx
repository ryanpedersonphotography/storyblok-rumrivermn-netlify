import React from 'react'

/* ============================================================================
   UNIFIED SECTION COMPONENT
   - Token-driven layout system
   - Props-based API for all section variations
   - Named variant presets for common patterns
   - Data attributes for CSS targeting
   - Backward compatible with existing [data-clean-root] scoping
   ============================================================================ */

// Type definitions
export type Align = 'left' | 'center' | 'right'
export type Width = 'prose' | 'content' | 'wide' | 'full'
export type PaddingY = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'fluid'
export type Background = 'surface' | 'tint-rose' | 'tint-sage' | 'dark-gradient' | 'image'
export type Tone = 'light' | 'dark' | 'auto'
export type Divider = 'none' | 'hairline' | 'thread-gold'
export type Overlay = 'none' | 'soft' | 'strong'
export type Height = 'auto' | 'screen'
export type Container = 'rails' | 'wrapper'

/** Named, easy-to-remember layout presets. */
export type Variant =
  | 'legacy-full-centered'         // Legacy: everything centered, full feel
  | 'centered'                     // Header centered, content centered (content rail)
  | 'header-center-content-left'   // Header centered (prose), content left (content/wide)
  | 'header-center-content-center' // Header centered (prose), content centered (content)
  | 'alternating-blocks-luxe'      // Luxe alternating blocks with gold accents
  | 'home-hero-2024'               // Your original home hero baseline
  | 'right-rail'                   // Quick right-rail demo
  | 'left-rail'                    // Quick left-rail demo

export interface SectionHeaderProps {
  scriptAccent?: string
  title?: string
  lead?: string
  align?: Align
}

export interface SectionImageProps {
  src: string
  alt?: string
  attachment?: 'fixed' | 'scroll'
  position?: 'cover' | 'contain'
}

export interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  // Core HTML
  as?: keyof JSX.IntrinsicElements
  id?: string

  /** High-level preset name OR space-separated variant tokens. Accepts 'string' or ['a','b']. */
  variant?: string | string[]

  // Layout - Dual Rail System
  align?: Align
  width?: Width              // Deprecated: use headerWidth + contentWidth instead
  headerWidth?: Width        // Width of header rail (default: width value)
  contentWidth?: Width       // Width of content rail (default: width value)
  paddingY?: PaddingY
  height?: Height            // Preferred for hero: screen = 100vh with rail centering
  bleed?: boolean
  wideRail?: boolean         // Deprecated: use contentWidth='wide' instead

  // Container Mode (wrapper vs dual rails)
  container?: Container      // 'rails' (default) | 'wrapper'
  wrapperMax?: string       // Custom max-width for wrapper (default: var(--rail-content))
  wrapperGutter?: string    // Custom gutter for wrapper (default: var(--rail-gutter))

  // Visual
  background?: Background
  tone?: Tone
  divider?: Divider
  image?: SectionImageProps
  overlay?: Overlay

  // Content
  header?: SectionHeaderProps
  actions?: React.ReactNode
  children?: React.ReactNode
}

/* -----------------------------
   Variant defaults (opinionated)
   ----------------------------- */
const PRESETS: Record<Variant, Partial<SectionProps>> = {
  // Legacy "full centered": centered header + centered content; ample padding
  'legacy-full-centered': {
    align: 'center',
    headerWidth: 'content',
    contentWidth: 'content',
    paddingY: 'xl',
    background: 'surface',
    tone: 'auto',
    divider: 'none',
  },

  // Centered everything, but more modern content measure (content rail)
  'centered': {
    align: 'center',
    headerWidth: 'prose',
    contentWidth: 'content',
    paddingY: 'lg',
    background: 'surface',
    tone: 'auto',
  },

  // Your requested "all centered header while content below aligns left"
  'header-center-content-left': {
    align: 'left',               // content/actions left
    header: { align: 'center' }, // header center
    headerWidth: 'prose',
    contentWidth: 'content',
    paddingY: 'lg',
    background: 'surface',
    tone: 'auto',
  },

  // Centered header (prose) with centered content (content rail)
  'header-center-content-center': {
    align: 'center',
    header: { align: 'center' },
    headerWidth: 'prose',
    contentWidth: 'content',
    paddingY: 'lg',
    background: 'surface',
    tone: 'auto',
  },

  // Luxe alternating blocks: tint bg, fluid vertical rhythm, center header
  'alternating-blocks-luxe': {
    align: 'center',
    header: { align: 'center' },
    headerWidth: 'content',
    contentWidth: 'content',
    paddingY: 'fluid',
    background: 'tint-rose',
    tone: 'auto',
  },

  // Original home hero: full-bleed, dark gradient, hero height, centered header
  'home-hero-2024': {
    align: 'center',
    header: { align: 'center' },
    headerWidth: 'content',
    contentWidth: 'content',
    paddingY: 'xl',
    height: 'screen',
    bleed: true,
    background: 'dark-gradient',
    tone: 'dark',
    divider: 'thread-gold',
  },

  // Quick showcasing rails: right edge locked to rail
  'right-rail': {
    align: 'right',
    header: { align: 'right' },
    headerWidth: 'prose',
    contentWidth: 'wide',
    paddingY: 'lg',
  },

  // Quick showcasing rails: left edge locked to rail
  'left-rail': {
    align: 'left',
    header: { align: 'left' },
    headerWidth: 'prose',
    contentWidth: 'wide',
    paddingY: 'lg',
  },
}

/* Deep-merge helper for the header object */
function mergeHeader(a?: SectionHeaderProps, b?: SectionHeaderProps): SectionHeaderProps | undefined {
  if (!a && !b) return undefined
  return {
    scriptAccent: b?.scriptAccent ?? a?.scriptAccent,
    title:        b?.title        ?? a?.title,
    lead:         b?.lead         ?? a?.lead,
    align:        b?.align        ?? a?.align,
  }
}

export function Section({
  as: Tag = 'section',
  id,
  variant,

  align,
  width = 'content',
  headerWidth,
  contentWidth,
  paddingY,
  height = 'auto',
  bleed,
  wideRail = false,

  container = 'rails',
  wrapperMax,
  wrapperGutter,

  background,
  tone = 'auto',
  divider = 'none',
  image,
  overlay = 'none',

  header,
  actions,
  children,
  className = '',
  style,
  ...rest
}: SectionProps) {
  // 1) Pull preset if provided (check first token for preset match)
  const firstVariant = Array.isArray(variant) ? variant[0] : typeof variant === 'string' ? variant.split(/\s+/)[0] : undefined
  const preset = firstVariant && PRESETS[firstVariant as Variant] ? PRESETS[firstVariant as Variant] : undefined

  // 2) Resolve props (explicit props override preset)
  const resolvedAlign        = align        ?? preset?.align        ?? 'center'
  const resolvedHeaderWidth  = headerWidth  ?? preset?.headerWidth  ?? width
  const resolvedContentWidth = contentWidth ?? preset?.contentWidth ?? (wideRail ? 'wide' : width)
  const resolvedPaddingY     = paddingY     ?? preset?.paddingY     ?? 'md'
  const resolvedHeight       = height       ?? preset?.height       ?? 'auto'
  const resolvedBleed        = typeof bleed === 'boolean' ? bleed : (preset?.bleed ?? false)
  const resolvedBackground   = background   ?? preset?.background   ?? 'surface'
  const resolvedTone         = tone         ?? preset?.tone         ?? 'auto'
  const resolvedDivider      = divider      ?? preset?.divider      ?? 'none'
  const resolvedHeader       = mergeHeader(preset?.header, header)

  // 3) Build data attributes for CSS targeting
  // Allow multiple tokens: data-variant="token-a token-b"
  const variantAttr =
    Array.isArray(variant) ? variant.filter(Boolean).join(' ') : (variant || undefined)

  const dataAttrs = {
    'data-section': 'unified',
    'data-variant': variantAttr,
    'data-align': resolvedAlign,
    'data-width': width,                      // Keep for backward compat
    'data-hwidth': resolvedHeaderWidth,
    'data-cwidth': resolvedContentWidth,
    'data-padding-y': resolvedPaddingY,
    'data-height': resolvedHeight,
    'data-bg': resolvedBackground,
    'data-tone': resolvedTone,
    'data-divider': resolvedDivider,
    'data-overlay': image ? overlay : undefined,
    'data-bleed': resolvedBleed ? 'true' : undefined,
    'data-container': container,
  } as Record<string, string | undefined>

  // Build inline styles for background image + wrapper custom properties
  const sectionStyle: React.CSSProperties = {
    ...style,
    ...(wrapperMax && { ['--wrapper-max' as any]: wrapperMax }),
    ...(wrapperGutter && { ['--wrapper-gutter' as any]: wrapperGutter }),
    ...(image && {
      backgroundImage: `url(${image.src})`,
      backgroundAttachment: image.attachment || 'scroll',
      backgroundSize: image.position || 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
    }),
  }

  return (
    <Tag
      id={id}
      className={`section ${className}`.trim()}
      style={sectionStyle}
      {...dataAttrs}
      {...rest}
    >
      {/* Overlay layer (if using background image) - positioned behind content */}
      {image && overlay !== 'none' && (
        <div className="section__overlay" data-overlay={overlay} aria-hidden="true" />
      )}

      {container === 'wrapper' ? (
        /* === WRAPPER MODE: Simple centered container === */
        <div className="section__wrapper">
          {resolvedHeader && (
            <header className="section__header" data-align={resolvedHeader.align ?? resolvedAlign}>
              {resolvedHeader.scriptAccent && (
                <p className="section__script-accent">{resolvedHeader.scriptAccent}</p>
              )}
              {resolvedHeader.title && (
                <h2 className="section__title">{resolvedHeader.title}</h2>
              )}
              {resolvedHeader.lead && (
                <p className="section__lead">{resolvedHeader.lead}</p>
              )}
            </header>
          )}

          {children && (
            <div className="section__content" data-align={resolvedAlign}>
              {children}
            </div>
          )}

          {actions && (
            <div className="section__actions" data-align={resolvedAlign}>
              {actions}
            </div>
          )}
        </div>
      ) : (
        /* === RAILS MODE: Dual rail system === */
        <>
          {/* Header rail (independent width from content) */}
          {resolvedHeader && (
            <div className="section__rail section__rail--header" data-width={resolvedHeaderWidth}>
              <header className="section__header" data-align={resolvedHeader.align ?? resolvedAlign}>
                {resolvedHeader.scriptAccent && (
                  <p className="section__script-accent">{resolvedHeader.scriptAccent}</p>
                )}
                {resolvedHeader.title && (
                  <h2 className="section__title">{resolvedHeader.title}</h2>
                )}
                {resolvedHeader.lead && (
                  <p className="section__lead">{resolvedHeader.lead}</p>
                )}
              </header>
            </div>
          )}

          {/* Content rail (independent width from header) */}
          {children && (
            <div className="section__rail section__rail--content" data-width={resolvedContentWidth}>
              <div className="section__content">
                {children}
              </div>
            </div>
          )}

          {/* Actions rail (shares width with header for alignment) */}
          {actions && (
            <div className="section__rail section__rail--actions" data-width={resolvedHeaderWidth}>
              <div className="section__actions" data-align={resolvedAlign}>
                {actions}
              </div>
            </div>
          )}
        </>
      )}

      {/* Divider line (if specified) */}
      {resolvedDivider !== 'none' && (
        <div className="section__divider" data-divider={resolvedDivider} aria-hidden="true" />
      )}
    </Tag>
  )
}

export default Section
