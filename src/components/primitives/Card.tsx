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

    // Check if this is a native interactive element
    const isNativeInteractive = as === 'a' || as === 'button' || as === 'input'
    const shouldAddA11y = !isNativeInteractive && (clickable || onClick)

    // Handle keyboard interactions for clickable cards (non-native elements only)
    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (shouldAddA11y && onClick) {
        // Enter key activates on keydown (like native buttons)
        if (e.key === 'Enter') {
          e.preventDefault()
          onClick(e as any)
        }
        // Space key prevents page scroll on keydown
        if (e.key === ' ' || e.key === 'Spacebar') {
          e.preventDefault()
        }
      }
      onKeyDown?.(e)
    }

    // Space key activates on keyup (like native buttons)
    const handleKeyUp = (e: React.KeyboardEvent) => {
      if (shouldAddA11y && onClick) {
        if (e.key === ' ' || e.key === 'Spacebar') {
          e.preventDefault()
          onClick(e as any)
        }
      }
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
        onClick={shouldAddA11y ? onClick : undefined}
        onKeyDown={shouldAddA11y ? handleKeyDown : onKeyDown}
        onKeyUp={shouldAddA11y ? handleKeyUp : undefined}
        role={shouldAddA11y && !role ? 'button' : role}
        tabIndex={shouldAddA11y && tabIndex === undefined ? 0 : tabIndex}
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
