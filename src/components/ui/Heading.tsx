import * as React from 'react'
import type { Align } from './types'

/* ==========================================================================
   HEADING PRIMITIVE - Token-Driven, Semantic Headings

   Features:
   - Semantic HTML (h1-h6) via `as` prop
   - Fluid typography sizes (xs, sm, md, lg, xl)
   - Text balancing by default (prevents orphans)
   - Zero margins by default (composition over inheritance)
   - Full TypeScript support with proper element typing
   ========================================================================== */

export type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6
export type HeadingSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

export interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  /**
   * Semantic heading level (renders as h1, h2, etc.)
   * @default 2
   */
  as?: HeadingLevel

  /**
   * Visual size (independent of semantic level)
   * @default 'md'
   */
  size?: HeadingSize

  /**
   * Text alignment
   * @default 'start'
   */
  align?: Align

  /**
   * Enable text-wrap: balance for nicer multi-line headings
   * @default true
   */
  balance?: boolean

  /**
   * Muted color variant (70% opacity)
   * @default false
   */
  muted?: boolean

  /**
   * Add block margin (opt-in)
   * @default false
   */
  blockMargin?: boolean

  children?: React.ReactNode
}

/**
 * Heading primitive component with fluid typography and semantic HTML.
 *
 * @example
 * // Hero title
 * <Heading as={1} size="xl" align="center">
 *   Welcome to Rum River Barn
 * </Heading>
 *
 * @example
 * // Section title
 * <Heading as={2} size="lg" balance>
 *   Discover Our Spaces
 * </Heading>
 *
 * @example
 * // Small subsection title
 * <Heading as={3} size="sm" muted>
 *   Gallery
 * </Heading>
 */
export const Heading = React.forwardRef<HTMLHeadingElement, HeadingProps>(
  (
    {
      as = 2,
      size = 'md',
      align = 'start',
      balance = true,
      muted = false,
      blockMargin = false,
      className = '',
      ...rest
    },
    ref
  ) => {
    const Tag = `h${as}` as const

    const classes = [blockMargin && 't-block-margin', className]
      .filter(Boolean)
      .join(' ')
      .trim()

    return (
      <Tag
        ref={ref}
        data-ui="heading"
        data-size={size}
        data-align={align}
        data-muted={muted ? 'true' : undefined}
        data-balance={balance ? undefined : 'false'}
        className={classes || undefined}
        {...rest}
      />
    )
  }
)

Heading.displayName = 'Heading'
