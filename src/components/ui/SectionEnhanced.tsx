import * as React from 'react'
import { cx } from '@/lib/react-interop'
import { PropsSlot } from '@/components/primitives/PropsSlot'

export type Align = 'left' | 'center' | 'right'
export type Width = 'prose' | 'content' | 'wide' | 'full'
export type PaddingY = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'fluid'
export type Background = 'surface' | 'tint-rose' | 'tint-sage' | 'dark-gradient' | 'image'
export type Tone = 'light' | 'dark' | 'auto'
export type Divider = 'none' | 'hairline' | 'thread-gold'
export type Height = 'auto' | 'screen'
export type Container = 'rails' | 'wrapper'

/** Named, easy-to-remember layout presets. */
export type Variant =
  | 'legacy-full-centered'
  | 'centered'
  | 'header-center-content-left'
  | 'header-center-content-center'
  | 'alternating-blocks-luxe'
  | 'home-hero-2024'
  | 'right-rail'
  | 'left-rail'

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

export interface SectionProps<TTag extends React.ElementType = 'section'>
  extends Omit<React.ComponentPropsWithoutRef<TTag>, 'as' | 'color'> {
  as?: TTag

  // Layout rails
  align?: Align
  width?: Width
  headerWidth?: Width
  contentWidth?: Width
  paddingY?: PaddingY
  height?: Height
  bleed?: boolean
  container?: Container
  wrapperMax?: string
  wrapperGutter?: string

  // Visual
  background?: Background
  tone?: Tone
  divider?: Divider
  image?: SectionImageProps
  overlay?: 'none' | 'soft' | 'strong'

  // Content
  header?: SectionHeaderProps
  actions?: React.ReactNode
  children?: React.ReactNode

  // Named presets
  variant?: Variant | string | string[]
  wideRail?: boolean

  // === NEW: legacy content wrapper toggle (to match .content-wrapper layout) ===
  /** Adds inner wrapper with exact legacy math:
      max-width: 1200px; margin: 0 auto; padding: 0 clamp(50px, 5vw, 80px) */
  contentWrapper?: boolean

  // === Container Queries (opt-in feature flag) ===
  /** Enable container-based responsiveness (uses @container instead of @media).
      Components adapt to parent width instead of viewport width.
      @default false */
  containerQueries?: boolean

  // === OPTIONAL light-weight slots (advanced use only) ===
  headerSlotProps?: React.HTMLAttributes<HTMLElement>
  contentSlotProps?: React.HTMLAttributes<HTMLElement>
  actionsSlotProps?: React.HTMLAttributes<HTMLElement>
}

// Preset configurations (keeping existing ones)
const PRESETS: Record<Variant, Partial<SectionProps>> = {
  'legacy-full-centered': {
    align: 'center',
    headerWidth: 'content',
    contentWidth: 'content',
    paddingY: 'xl',
    background: 'surface',
    tone: 'auto',
    divider: 'none',
  },
  'centered': {
    align: 'center',
    headerWidth: 'prose',
    contentWidth: 'content',
    paddingY: 'lg',
    background: 'surface',
    tone: 'auto',
  },
  'header-center-content-left': {
    align: 'left',
    header: { align: 'center' },
    headerWidth: 'prose',
    contentWidth: 'content',
    paddingY: 'lg',
    background: 'surface',
    tone: 'auto',
  },
  'header-center-content-center': {
    align: 'center',
    header: { align: 'center' },
    headerWidth: 'prose',
    contentWidth: 'content',
    paddingY: 'lg',
    background: 'surface',
    tone: 'auto',
  },
  'alternating-blocks-luxe': {
    align: 'center',
    header: { align: 'center' },
    headerWidth: 'content',
    contentWidth: 'content',
    paddingY: 'fluid',
    background: 'tint-rose',
    tone: 'auto',
  },
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
  'right-rail': {
    align: 'right',
    header: { align: 'right' },
    headerWidth: 'prose',
    contentWidth: 'wide',
    paddingY: 'lg',
  },
  'left-rail': {
    align: 'left',
    header: { align: 'left' },
    headerWidth: 'prose',
    contentWidth: 'wide',
    paddingY: 'lg',
  },
}

function mergeHeader(a?: SectionHeaderProps, b?: SectionHeaderProps): SectionHeaderProps | undefined {
  if (!a && !b) return undefined
  return {
    scriptAccent: b?.scriptAccent ?? a?.scriptAccent,
    title: b?.title ?? a?.title,
    lead: b?.lead ?? a?.lead,
    align: b?.align ?? a?.align,
  }
}

export const Section = React.forwardRef<HTMLElement, SectionProps>((props, ref) => {
  const {
    as,
    id,
    className,
    style,
    variant,

    // rails
    align,
    width = 'content',
    headerWidth,
    contentWidth,
    paddingY,
    height = 'auto',
    bleed = false,
    container = 'rails',
    wrapperMax,
    wrapperGutter,
    wideRail = false,

    // visuals
    background,
    tone = 'auto',
    divider = 'none',
    image,
    overlay = 'none',

    // content
    header,
    actions,
    children,

    // compatibility/variants
    contentWrapper = false,
    containerQueries = false,
    headerSlotProps,
    contentSlotProps,
    actionsSlotProps,

    ...rest
  } = props

  const Tag = (as || 'section') as React.ElementType

  // Pull preset if provided
  const firstVariant = Array.isArray(variant) ? variant[0] : typeof variant === 'string' ? variant.split(/\s+/)[0] : undefined
  const preset = firstVariant && PRESETS[firstVariant as Variant] ? PRESETS[firstVariant as Variant] : undefined

  // Resolve props (explicit props override preset)
  const resolvedAlign = align ?? preset?.align ?? 'center'
  const resolvedHeaderWidth = headerWidth ?? preset?.headerWidth ?? width
  const resolvedContentWidth = contentWidth ?? preset?.contentWidth ?? (wideRail ? 'wide' : width)
  const resolvedPaddingY = paddingY ?? preset?.paddingY ?? 'md'
  const resolvedHeight = height ?? preset?.height ?? 'auto'
  const resolvedBleed = typeof bleed === 'boolean' ? bleed : (preset?.bleed ?? false)
  const resolvedBackground = background ?? preset?.background ?? 'surface'
  const resolvedTone = tone ?? preset?.tone ?? 'auto'
  const resolvedDivider = divider ?? preset?.divider ?? 'none'
  const resolvedHeader = mergeHeader(preset?.header, header)

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

  // IMPORTANT: keep .section + data-* stable for existing CSS.
  const rootClass = cx('section', className)
  const variantAttr = Array.isArray(variant) ? variant.filter(Boolean).join(' ') : (variant || undefined)
  
  const dataAttrs = {
    'data-section': 'unified',
    'data-variant': variantAttr,
    'data-align': resolvedAlign,
    'data-width': width,
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
    'data-cq': containerQueries ? 'on' : undefined,
  } as Record<string, string | undefined>

  const LegacyWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) =>
    contentWrapper ? (
      <div className="content-wrapper" data-legacy-wrapper="true">
        {children}
      </div>
    ) : (
      <>{children}</>
    )

  return (
    <Tag id={id} ref={ref as any} className={rootClass} style={sectionStyle} {...dataAttrs} {...rest}>
      {/* Overlay behind rails (if background image) */}
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
        <LegacyWrapper>
          {/* HEADER RAIL */}
          {resolvedHeader && (
            <div className="section__rail section__rail--header" data-width={resolvedHeaderWidth}>
              {headerSlotProps ? (
                <PropsSlot inject={headerSlotProps as any}>
                  <header className="section__header" data-align={resolvedHeader.align ?? resolvedAlign}>
                    {resolvedHeader.scriptAccent && <p className="section__script-accent">{resolvedHeader.scriptAccent}</p>}
                    {resolvedHeader.title && <h2 className="section__title">{resolvedHeader.title}</h2>}
                    {resolvedHeader.lead && <p className="section__lead">{resolvedHeader.lead}</p>}
                  </header>
                </PropsSlot>
              ) : (
                <header className="section__header" data-align={resolvedHeader.align ?? resolvedAlign}>
                  {resolvedHeader.scriptAccent && <p className="section__script-accent">{resolvedHeader.scriptAccent}</p>}
                  {resolvedHeader.title && <h2 className="section__title">{resolvedHeader.title}</h2>}
                  {resolvedHeader.lead && <p className="section__lead">{resolvedHeader.lead}</p>}
                </header>
              )}
            </div>
          )}

          {/* CONTENT RAIL */}
          {children && (
            <div className="section__rail section__rail--content" data-width={resolvedContentWidth}>
              {contentSlotProps ? (
                <PropsSlot inject={contentSlotProps as any}>
                  <div className="section__content">{children}</div>
                </PropsSlot>
              ) : (
                <div className="section__content">{children}</div>
              )}
            </div>
          )}

          {/* ACTIONS RAIL */}
          {actions && (
            <div className="section__rail section__rail--actions" data-width={resolvedHeaderWidth}>
              {actionsSlotProps ? (
                <PropsSlot inject={actionsSlotProps as any}>
                  <div className="section__actions" data-align={resolvedAlign}>
                    {actions}
                  </div>
                </PropsSlot>
              ) : (
                <div className="section__actions" data-align={resolvedAlign}>
                  {actions}
                </div>
              )}
            </div>
          )}
        </LegacyWrapper>
      )}

      {/* Divider */}
      {resolvedDivider !== 'none' && <div className="section__divider" data-divider={resolvedDivider} aria-hidden="true" />}
    </Tag>
  )
})
Section.displayName = 'Section'

export default Section