import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'

/* ============================================================================
   SECTION SHELL COMPONENT
   - Token-driven layout system
   - Visual "frame" for sections (semantics, theming, spacing, bleed, overlays)
   - Separates visual concerns from content orchestration
   - Uses Radix Slot for flexible element rendering
   ============================================================================ */

export type Align = 'left' | 'center' | 'right'
export type Container = 'prose' | 'content' | 'wide' | 'full'
export type PaddingY = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'fluid'
export type Tone = 'auto' | 'light' | 'dark'
export type Background =
  | 'surface'
  | 'tint-rose'
  | 'tint-sage'
  | { kind: 'gradient'; token?: string }
  | { kind: 'image'; src: string; attachment?: 'fixed' | 'scroll'; fit?: 'cover' | 'contain'; position?: string; overlay?: 'none' | 'soft' | 'strong' }

export type Divider = 'none' | 'hairline' | 'thread-gold'
export type Height = 'auto' | 'screen'

export interface SectionShellProps extends React.HTMLAttributes<HTMLElement> {
  /** Render as custom element via Slot (Radix) */
  asChild?: boolean
  as?: keyof JSX.IntrinsicElements

  /** Semantics & a11y */
  id?: string
  role?: 'region' | 'complementary' | 'navigation' | 'main' | 'contentinfo' | 'none'
  'aria-labelledby'?: string
  'aria-label'?: string

  /** Layout frame (no content orchestration here) */
  align?: Align
  container?: Container
  paddingY?: PaddingY
  paddingX?: 'gutter' | 'none' | 'wide'
  height?: Height
  bleed?: boolean
  tone?: Tone
  background?: Background
  divider?: Divider
  radius?: 'none' | 'sm' | 'md' | 'lg' | 'xl'
  shadow?: 'none' | 'sm' | 'md' | 'lg'

  /** Advanced layout hooks */
  containerName?: string
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

    // Normalize background
    const bgKind = typeof background === 'string' ? background : background.kind

    // Inline style for bg image and stickiness
    const sectionStyle: React.CSSProperties = {
      ...style,
      ...(stickiness && { position: 'sticky', top: stickiness.top }),
      ...(containerName && { ['--container-name' as any]: containerName }),
      ...(typeof background === 'object' &&
        background.kind === 'image' && {
          backgroundImage: `url(${background.src})`,
          backgroundAttachment: background.attachment ?? 'scroll',
          backgroundSize: background.fit ?? 'cover',
          backgroundPosition: background.position ?? 'center',
          backgroundRepeat: 'no-repeat',
        }),
    }

    const baseClass = 'section section-shell'
    const composedClassName = className ? `${baseClass} ${className}` : baseClass

    return (
      <Comp
        ref={ref}
        data-clean-root="true"
        data-section="shell"
        data-align={align}
        data-container={container}
        data-padding-y={paddingY}
        data-padding-x={paddingX}
        data-height={height}
        data-bleed={bleed ? 'true' : undefined}
        data-tone={tone}
        data-bg={typeof background === 'string' ? background : undefined}
        data-bg-kind={bgKind}
        data-divider={divider}
        data-radius={radius}
        data-shadow={shadow}
        data-container-name={containerName}
  className={composedClassName}
        style={sectionStyle}
        {...rest}
      >
        {/* Optional overlay for bg images/gradients */}
        {typeof background === 'object' &&
          background.kind === 'image' &&
          background.overlay &&
          background.overlay !== 'none' && (
            <div
              className="section-shell__overlay"
              data-overlay={background.overlay}
              aria-hidden="true"
            />
          )}

        <div className="section-shell__rail" data-rail="container">
          {children}
        </div>

        {divider !== 'none' && (
          <div
            className="section-shell__divider"
            data-divider={divider}
            aria-hidden="true"
          />
        )}
      </Comp>
    )
  }
)

SectionShell.displayName = 'SectionShell'

export default SectionShell