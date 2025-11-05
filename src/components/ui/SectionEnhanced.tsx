import * as React from 'react'
import Surface from '@/components/primitives/Surface'
import SectionLayout from '@/components/primitives/SectionLayout'
import type {
  Align,
  Width,
  PaddingY,
  Background,
  Tone,
  Divider,
  Height,
  Container,
  Variant,
  SectionHeaderProps,
  SectionImageProps,
  SectionSlots,
} from './section-types'

export type SectionProps<TTag extends React.ElementType = 'section'> = Omit<
  React.ComponentPropsWithoutRef<TTag>,
  'as' | 'color'
> & SectionSlots & {
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
}

// Preset configurations (keeping existing ones)
const PRESETS: Record<Variant, Partial<SectionProps>> = {
  // 'legacy-full-centered': {
  //   align: 'center',
  //   headerWidth: 'content',
  //   contentWidth: 'content',
  //   paddingY: 'xl',
  //   background: 'surface',
  //   tone: 'auto',
  //   divider: 'none',
  // },
  // 'centered': {
  //   align: 'center',
  //   headerWidth: 'prose',
  //   contentWidth: 'content',
  //   paddingY: 'lg',
  //   background: 'surface',
  //   tone: 'auto',
  // },
  // 'header-center-content-left': {
  //   align: 'left',
  //   header: { align: 'center' },
  //   headerWidth: 'prose',
  //   contentWidth: 'content',
  //   paddingY: 'lg',
  //   background: 'surface',
  //   tone: 'auto',
  // },
  // 'header-center-content-center': {
  //   align: 'center',
  //   header: { align: 'center' },
  //   headerWidth: 'prose',
  //   contentWidth: 'content',
  //   paddingY: 'lg',
  //   background: 'surface',
  //   tone: 'auto',
  // },
  // 'alternating-blocks-luxe': {
  //   align: 'center',
  //   header: { align: 'center' },
  //   headerWidth: 'content',
  //   contentWidth: 'content',
  //   paddingY: 'fluid',
  //   background: 'tint-rose',
  //   tone: 'auto',
  // },
  // 'home-hero-2024': {
  //   align: 'center',
  //   header: { align: 'center' },
  //   headerWidth: 'content',
  //   contentWidth: 'content',
  //   paddingY: 'xl',
  //   height: 'screen',
  //   bleed: true,
  //   background: 'dark-gradient',
  //   tone: 'dark',
  //   divider: 'thread-gold',
  // },
  // 'right-rail': {
  //   align: 'right',
  //   header: { align: 'right' },
  //   headerWidth: 'prose',
  //   contentWidth: 'wide',
  //   paddingY: 'lg',
  // },
  // 'left-rail': {
  //   align: 'left',
  //   header: { align: 'left' },
  //   headerWidth: 'prose',
  //   contentWidth: 'wide',
  //   paddingY: 'lg',
  // },
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
  }

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

  return (
    <Surface
      as={as}
      id={id}
      ref={ref}
      className={className}
      style={sectionStyle}
      image={image}
      overlay={overlay}
      dataAttributes={dataAttrs}
      {...rest}
    >
      <SectionLayout
        container={container}
        align={resolvedAlign}
        headerWidth={resolvedHeaderWidth}
        contentWidth={resolvedContentWidth}
        header={resolvedHeader}
        actions={actions}
        contentWrapper={contentWrapper}
        headerSlotProps={headerSlotProps}
        contentSlotProps={contentSlotProps}
        actionsSlotProps={actionsSlotProps}
      >
        {children}
      </SectionLayout>

      {resolvedDivider !== 'none' ? (
        <div className="section__divider" data-divider={resolvedDivider} aria-hidden="true" />
      ) : null}
    </Surface>
  )
})
Section.displayName = 'Section'

export default Section

export type {
  Align,
  Width,
  PaddingY,
  Background,
  Tone,
  Divider,
  Height,
  Container,
  Variant,
  SectionHeaderProps,
  SectionImageProps,
  SectionSlots,
} from './section-types'