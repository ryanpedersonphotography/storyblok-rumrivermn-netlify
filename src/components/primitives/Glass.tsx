/* ==========================================================================
   GLASS COMPONENT — React Wrapper for Glass Primitive
   ==========================================================================
   Simplified glass component using role tokens and OKLCH color-mix.

   Usage:
   <Glass veil="rose">
     <p>Content with glass effect</p>
   </Glass>

   Composition with Card:
   <Glass veil="sage">
     <Card elevation="raised">
       <CardHeader>Title</CardHeader>
       <p>Glassmorphism card content</p>
     </Card>
   </Glass>
   ========================================================================== */

import React, { forwardRef } from 'react'

export type GlassVeil = 'rose' | 'gold' | 'sage'

// Polymorphic component types for proper TypeScript
type PolymorphicRef<E extends React.ElementType> = React.ComponentPropsWithRef<E>['ref']

type GlassOwnProps<E extends React.ElementType = React.ElementType> = {
  /** Element type to render (default: div) */
  as?: E

  /** Accent color veil overlay using OKLCH color-mix */
  veil?: GlassVeil
}

type GlassProps<E extends React.ElementType> = GlassOwnProps<E> &
  Omit<React.ComponentPropsWithoutRef<E>, keyof GlassOwnProps>

/**
 * Glass primitive with simplified glassmorphism effect.
 *
 * Features:
 * - Single blur/shadow (no elevation variants)
 * - OKLCH color-mix veils for perceptual blending
 * - Automatic theme adaptation
 * - Composition-friendly (wrap any content)
 *
 * @example
 * // Basic glass effect
 * <Glass>
 *   <p>Frosted glass content</p>
 * </Glass>
 *
 * @example
 * // With colored veil
 * <Glass veil="rose">
 *   <Card>Tinted glass card</Card>
 * </Glass>
 *
 * @example
 * // Render as section
 * <Glass as="section" veil="sage">
 *   <h2>Glass Section</h2>
 * </Glass>
 */
const Glass = forwardRef(
  <E extends React.ElementType = 'div'>(
    {
      children,
      as,
      veil,
      className = '',
      ...rest
    }: GlassProps<E>,
    ref?: PolymorphicRef<E>
  ) => {
    const Component = as || 'div'

    return (
      <Component
        ref={ref}
        className={`glass ${className}`.trim()}
        data-veil={veil}
        {...rest}
      >
        {children}
      </Component>
    )
  }
) as <E extends React.ElementType = 'div'>(
  props: GlassProps<E> & { ref?: PolymorphicRef<E> }
) => JSX.Element

Glass.displayName = 'Glass'

export default Glass
