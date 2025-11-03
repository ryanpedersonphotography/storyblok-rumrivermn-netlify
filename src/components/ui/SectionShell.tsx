/* ========================================================================
   FILE: src/components/ui/SectionShell.tsx
   PURPOSE: Visual frame + theming contract for sections (no layout logic)
   - Emits `.section` + recipe data-attrs consumed by recipes/section.css
   - Maps friendly background props → data-variant + recipe contract vars
   - Zero legacy/global token references
   ======================================================================== */
import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'

export type Align = 'left' | 'center' | 'right'
export type Container = 'prose' | 'content' | 'wide' | 'full'
export type PaddingY = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'fluid'
export type Tone = 'auto' | 'light' | 'dark'
export type Divider = 'none' | 'hairline' | 'thread-gold'
export type Height = 'auto' | 'screen'
export type Radius = 'none' | 'sm' | 'md' | 'lg' | 'xl'
export type Shadow = 'none' | 'sm' | 'md' | 'lg'
export type Overlay = 'none' | 'soft' | 'strong'

export type Background =
  | 'surface'                    // plain section surface
  | 'tint-rose'                  // soft tinted veil using --accent-rose
  | 'tint-sage'                  // soft tinted veil using --accent-sage
  | { kind: 'gradient'; token?: 'prominent' | string } // add .gradient--<token>
  | { kind: 'image'; src: string; attachment?: 'fixed' | 'scroll'; fit?: 'cover' | 'contain'; position?: string; overlay?: Overlay }

export interface SectionShellProps extends React.HTMLAttributes<HTMLElement> {
  asChild?: boolean
  as?: keyof JSX.IntrinsicElements

  id?: string
  role?: 'region' | 'complementary' | 'navigation' | 'main' | 'contentinfo' | 'none'
  'aria-labelledby'?: string
  'aria-label'?: string

  align?: Align
  container?: Container
  paddingY?: PaddingY
  paddingX?: 'gutter' | 'none' | 'wide'
  height?: Height
  bleed?: boolean
  tone?: Tone
  background?: Background
  divider?: Divider
  radius?: Radius
  shadow?: Shadow

  /** Enable container queries for the inner rail; name is optional */
  containerQueries?: boolean
  containerName?: string

  /** Sticky helper for hero bars, etc. */
  stickiness?: { top?: string }
}

export const SectionShell = React.forwardRef<HTMLElement, SectionShellProps>(
  (
    {
      asChild,
      as: Tag = 'section',
      align = 'center',
      container = 'content',
      paddingY = 'md',
      paddingX = 'gutter',
      height = 'auto',
      bleed = false,
      tone = 'auto',
      background = 'surface',
      divider = 'none',
      radius = 'none',
      shadow = 'none',
      containerQueries = false,
      containerName,
      stickiness,
      style,
      children,
      className = '',
      ...rest
    },
    ref
  ) => {
    const Comp: any = asChild ? Slot : Tag

    // ---- Map background prop → data-variant + recipe-local contract vars
    let dataVariant: string | undefined
    const rcVars: React.CSSProperties = {}

    if (typeof background === 'string') {
      if (background === 'surface') {
        dataVariant = undefined // base
      } else if (background === 'tint-rose' || background === 'tint-sage') {
        dataVariant = 'soft'
        // recipe contract variable: tint color to mix into surface
        rcVars['--rc-tint' as any] =
          background === 'tint-rose' ? 'var(--accent-rose)' : 'var(--accent-sage)'
      }
    } else if (background.kind === 'gradient') {
      dataVariant = 'soft'
      // rely on primitives/gradient.css; allow custom token hook
      rcVars['--rc-gradient-token' as any] = background.token ?? 'prominent'
    } else if (background.kind === 'image') {
      dataVariant = 'image'
    }

    // ---- Root inline style: stickiness + recipe vars + (optional) bg-image
    const sectionStyle: React.CSSProperties = {
      ...style,
      ...(stickiness && { position: 'sticky', top: stickiness.top }),
      ...rcVars,
      ...(typeof background === 'object' &&
        background.kind === 'image' && {
          backgroundImage: `url(${background.src})`,
          backgroundAttachment: background.attachment ?? 'scroll',
          backgroundSize: background.fit ?? 'cover',
          backgroundPosition: background.position ?? 'center',
          backgroundRepeat: 'no-repeat',
        }),
    }

    return (
      <Comp
        ref={ref}
        className={`section ${className}`.trim()}
        style={sectionStyle}
        data-section="unified"
        data-variant={dataVariant}
        data-align={align}
        data-container={container}
        data-padding-y={paddingY}
        data-padding-x={paddingX}
        data-height={height}
        data-bleed={bleed ? 'true' : undefined}
        data-tone={tone}
        data-divider={divider}
        data-radius={radius}
        data-shadow={shadow}
        data-cq={containerQueries ? 'on' : undefined}
        data-container-name={containerName}
        {...rest}
      >
        {/* Overlay layer for image backgrounds */}
        {typeof background === 'object' &&
          background.kind === 'image' &&
          background.overlay &&
          background.overlay !== 'none' && (
            <div className="section__overlay" data-overlay={background.overlay} aria-hidden="true" />
          )}

        {/* Container rail. recipes/section.css should set:
           [data-cq="on"] .section__rail[data-rail="container"] {
             container-type: inline-size;
             container-name: var(--container-name, section);
           } */}
        <div className="section__rail" data-rail="container">
          {children}
        </div>

        {divider !== 'none' && (
          <div className="section__divider" data-divider={divider} aria-hidden="true" />
        )}
      </Comp>
    )
  }
)

SectionShell.displayName = 'SectionShell'
export default SectionShell
