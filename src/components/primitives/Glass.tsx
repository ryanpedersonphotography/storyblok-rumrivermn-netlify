/* ==========================================================================
   GLASS COMPONENT — React Wrapper for Glass Primitive
   ==========================================================================
   Optional React component for type-safe glass primitive usage.
   The primitive works with plain HTML + data attributes, but this provides
   better TypeScript autocomplete and prop validation.

   Usage:
   <Glass elevation="lg" strong surface="rose">
     <p>Content with glass effect</p>
   </Glass>
   ========================================================================== */

import React from 'react'

export type GlassElevation = 'sm' | 'md' | 'lg' | 'xl'
export type GlassSurface = 'rose' | 'gold' | 'sage'
export type GlassHover = 'lift'

export interface GlassProps {
  /** Child elements to render with glass effect */
  children: React.ReactNode

  /** Element type to render (default: div) */
  as?: keyof JSX.IntrinsicElements

  /** Blur intensity and background opacity */
  elevation?: GlassElevation

  /** Increase opacity for better legibility */
  strong?: boolean

  /** Tinted glass with accent colors */
  surface?: GlassSurface

  /** Hover interaction effect */
  hover?: GlassHover

  /** Additional CSS class names */
  className?: string

  /** Additional inline styles */
  style?: React.CSSProperties

  /** Click handler */
  onClick?: (e: React.MouseEvent) => void

  /** Other HTML attributes */
  [key: string]: any
}

export default function Glass({
  children,
  as = 'div',
  elevation = 'md',
  strong = false,
  surface,
  hover,
  className = '',
  style,
  ...rest
}: GlassProps) {
  const Component = as as any

  return (
    <Component
      data-glass
      data-elevation={elevation}
      data-strong={strong || undefined}
      data-surface={surface}
      data-hover={hover}
      className={className}
      style={style}
      {...rest}
    >
      {children}
    </Component>
  )
}
