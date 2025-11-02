/* ==========================================================================
   CARD COMPONENT — React Wrapper for Card Primitive
   ==========================================================================
   Optional React component for type-safe card primitive usage.
   The primitive works with plain HTML + data attributes, but this provides
   better TypeScript autocomplete and prop validation.

   Usage:
   <Card elevation="raised" padding="spacious" hover="lift">
     <CardHeader>Title</CardHeader>
     <p>Content</p>
     <CardFooter>Actions</CardFooter>
   </Card>

   Glass composition:
   <Card elevation="elevated" glass glassElevation="lg">
     Content with glassmorphism
   </Card>
   ========================================================================== */

import React, { forwardRef } from 'react'

export type CardElevation = 'flat' | 'raised' | 'elevated' | 'floating'
export type CardPadding = 'none' | 'compact' | 'normal' | 'spacious'
export type CardHover = 'lift' | 'glow'
export type CardSurface = 'rose' | 'gold' | 'sage'

export interface CardProps {
  /** Child elements to render inside card */
  children: React.ReactNode

  /** Element type to render (default: div) */
  as?: keyof JSX.IntrinsicElements

  /** Shadow depth and visual elevation */
  elevation?: CardElevation

  /** Internal padding amount */
  padding?: CardPadding

  /** Hover interaction effect */
  hover?: CardHover

  /** Make card clickable with full keyboard accessibility */
  clickable?: boolean

  /** Tinted card background with accent color */
  surface?: CardSurface

  /** Combine with glass primitive for glassmorphism */
  glass?: boolean

  /** Glass elevation (when glass=true) */
  glassElevation?: 'sm' | 'md' | 'lg' | 'xl'

  /** Strong glass (when glass=true) */
  glassStrong?: boolean

  /** Glass surface tint (when glass=true) */
  glassSurface?: 'rose' | 'gold' | 'sage'

  /** Additional CSS class names */
  className?: string

  /** Additional inline styles */
  style?: React.CSSProperties

  /** Click handler */
  onClick?: (e: React.MouseEvent) => void

  /** Key down handler (for keyboard accessibility) */
  onKeyDown?: (e: React.KeyboardEvent) => void

  /** ARIA role */
  role?: string

  /** Tab index for keyboard navigation */
  tabIndex?: number

  /** Other HTML attributes */
  [key: string]: any
}

const Card = forwardRef<HTMLElement, CardProps>(
  (
    {
      children,
      as = 'div',
      elevation = 'flat',
      padding = 'normal',
      hover,
      clickable = false,
      surface,
      glass = false,
      glassElevation,
      glassStrong,
      glassSurface,
      className = '',
      style,
      onClick,
      onKeyDown,
      role,
      tabIndex,
      ...rest
    },
    ref
  ) => {
    const Component = as as any

    // Handle keyboard interactions for clickable cards
    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (clickable && onClick && (e.key === 'Enter' || e.key === ' ')) {
        e.preventDefault()
        onClick(e as any)
      }
      onKeyDown?.(e)
    }

    return (
      <Component
        ref={ref}
        data-card
        data-elevation={elevation}
        data-padding={padding}
        data-hover={hover}
        data-clickable={clickable || undefined}
        data-surface={surface}
        // Glass attributes (if glass prop is true)
        data-glass={glass || undefined}
        data-glass-elevation={glass ? glassElevation : undefined}
        data-strong={glass && glassStrong ? true : undefined}
        data-glass-surface={glass ? glassSurface : undefined}
        className={className}
        style={style}
        onClick={clickable ? onClick : undefined}
        onKeyDown={clickable ? handleKeyDown : undefined}
        role={clickable && !role ? 'button' : role}
        tabIndex={clickable && tabIndex === undefined ? 0 : tabIndex}
        {...rest}
      >
        {children}
      </Component>
    )
  }
)

Card.displayName = 'Card'

export default Card

/* ==========================================================================
   CARD SECTION COMPONENTS
   ========================================================================== */

export interface CardSectionProps {
  children: React.ReactNode
  className?: string
  style?: React.CSSProperties
  [key: string]: any
}

export const CardHeader = forwardRef<HTMLDivElement, CardSectionProps>(
  ({ children, className = '', ...rest }, ref) => (
    <div ref={ref} data-card-header className={className} {...rest}>
      {children}
    </div>
  )
)
CardHeader.displayName = 'CardHeader'

export const CardFooter = forwardRef<HTMLDivElement, CardSectionProps>(
  ({ children, className = '', ...rest }, ref) => (
    <div ref={ref} data-card-footer className={className} {...rest}>
      {children}
    </div>
  )
)
CardFooter.displayName = 'CardFooter'

export const CardMedia = forwardRef<HTMLDivElement, CardSectionProps>(
  ({ children, className = '', ...rest }, ref) => (
    <div ref={ref} data-card-media className={className} {...rest}>
      {children}
    </div>
  )
)
CardMedia.displayName = 'CardMedia'
