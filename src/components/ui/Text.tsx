import * as React from 'react'

/* ==========================================================================
   TEXT PRIMITIVE - Token-Driven Body Text

   Features:
   - Semantic HTML (p, span, div) via `as` prop
   - Fluid typography sizes (xs, sm, md, lg)
   - Zero margins by default (composition over inheritance)
   - Muted color variant for secondary text
   - Full TypeScript support with polymorphic typing
   ========================================================================== */

export type TextElement = 'p' | 'span' | 'div'
export type TextSize = 'xs' | 'sm' | 'md' | 'lg'
export type Align = 'start' | 'center' | 'end'

export interface TextProps<TElement extends TextElement = 'p'>
  extends React.HTMLAttributes<HTMLElement> {
  /**
   * HTML element to render
   * @default 'p'
   */
  as?: TElement

  /**
   * Text size variant
   * @default 'md'
   */
  size?: TextSize

  /**
   * Text alignment
   * @default 'start'
   */
  align?: Align

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
 * Text primitive component with fluid typography and semantic HTML.
 *
 * @example
 * // Body paragraph
 * <Text size="md">
 *   Discover what makes our venue the perfect setting.
 * </Text>
 *
 * @example
 * // Muted secondary text
 * <Text size="sm" muted>
 *   Last updated: January 2025
 * </Text>
 *
 * @example
 * // Inline span
 * <Text as="span" size="lg">
 *   Important highlight
 * </Text>
 */
export const Text = React.forwardRef<HTMLElement, TextProps>(
  (
    {
      as = 'p',
      size = 'md',
      align = 'start',
      muted = false,
      blockMargin = false,
      className = '',
      ...rest
    },
    ref
  ) => {
    const Tag = as as React.ElementType

    const classes = [blockMargin && 't-block-margin', className]
      .filter(Boolean)
      .join(' ')
      .trim()

    return (
      <Tag
        ref={ref}
        data-ui="text"
        data-size={size}
        data-align={align}
        data-muted={muted ? 'true' : undefined}
        className={classes || undefined}
        {...rest}
      />
    )
  }
)

Text.displayName = 'Text'
