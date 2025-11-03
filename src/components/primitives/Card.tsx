/* ==========================================================================
   CARD COMPONENT — React Wrapper for Card Primitive
   ==========================================================================
   Simplified card component using role tokens and container queries.

   Usage:
   <Card elevation="raised" hover="lift">
     <CardMedia>
       <img src="..." alt="..." />
     </CardMedia>
     <CardHeader>Title</CardHeader>
     <p>Content</p>
     <CardFooter>Actions</CardFooter>
   </Card>

   Glass composition (wrap Card with Glass, don't use props):
   <Glass veil="rose">
     <Card elevation="raised">Content with glassmorphism</Card>
   </Glass>
   ========================================================================== */

import React, { forwardRef } from 'react'

export type CardElevation = 'flat' | 'raised' | 'elevated'
export type CardPadding = 'none' | 'compact' | 'normal' | 'spacious'
export type CardHover = 'lift' | 'glow'
export type CardTint = 'rose' | 'gold' | 'sage'

// Polymorphic component types for proper TypeScript
type PolymorphicRef<E extends React.ElementType> = React.ComponentPropsWithRef<E>['ref']

type CardOwnProps<E extends React.ElementType = React.ElementType> = {
  /** Element type to render (default: div) */
  as?: E

  /** Shadow depth and visual elevation */
  elevation?: CardElevation

  /** Internal padding amount (auto-adjusts via container queries) */
  padding?: CardPadding

  /** Hover interaction effect */
  hover?: CardHover

  /** Make card clickable with full keyboard accessibility */
  clickable?: boolean

  /** Tinted card background with accent color (uses color-mix in OKLCH) */
  tint?: CardTint
}

type CardProps<E extends React.ElementType> = CardOwnProps<E> &
  Omit<React.ComponentPropsWithoutRef<E>, keyof CardOwnProps>

/**
 * Card primitive with container-query responsive density.
 *
 * @example
 * // Basic card
 * <Card elevation="raised">
 *   <h3>Title</h3>
 *   <p>Content</p>
 * </Card>
 *
 * @example
 * // Clickable card with tint
 * <Card clickable tint="rose" onClick={() => navigate('/details')}>
 *   <CardMedia><img src="..." /></CardMedia>
 *   <h3>Product Name</h3>
 * </Card>
 *
 * @example
 * // Render as article
 * <Card as="article" elevation="raised">
 *   <CardHeader>Blog Post Title</CardHeader>
 *   <p>Content...</p>
 * </Card>
 */
const Card = forwardRef(
  <E extends React.ElementType = 'div'>(
    {
      children,
      as,
      elevation,
      padding,
      hover,
      clickable = false,
      tint,
      className = '',
      style,
      onClick,
      onKeyDown,
      role,
      tabIndex,
      ...rest
    }: CardProps<E>,
    ref?: PolymorphicRef<E>
  ) => {
    const Component = as || 'div'

    // Check if this is a native interactive element
    const isNativeInteractive = as === 'a' || as === 'button' || as === 'input'
    const shouldAddA11y = !isNativeInteractive && (clickable || onClick)

    // Handle keyboard interactions for clickable cards (non-native elements only)
    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (shouldAddA11y && onClick) {
        // Enter key activates on keydown (like native buttons)
        if (e.key === 'Enter') {
          e.preventDefault()
          ;(onClick as any)(e)
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
          ;(onClick as any)(e)
        }
      }
    }

    return (
      <Component
        ref={ref}
        className={`card ${className}`.trim()}
        data-elevation={elevation}
        data-padding={padding}
        data-hover={hover}
        data-clickable={clickable || undefined}
        data-tint={tint}
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
) as <E extends React.ElementType = 'div'>(
  props: CardProps<E> & { ref?: PolymorphicRef<E> }
) => JSX.Element

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
