import * as React from 'react'
import type { Align } from './types'

/* ==========================================================================
   TEXT PRIMITIVE - Token-Driven Body Text

   Features:
   - Semantic HTML (p, span, div) via `as` prop
   - Fluid typography sizes (xs, sm, md, lg)
   - Zero margins by default (composition over inheritance)
   - Muted color variant for secondary text
   - True polymorphic typing (element-specific props & refs)
   ========================================================================== */

type Element = keyof Pick<JSX.IntrinsicElements, 'p' | 'span' | 'div'>

export type TextSize = 'xs' | 'sm' | 'md' | 'lg'

type Props<E extends Element> = {
  /**
   * HTML element to render
   * @default 'p'
   */
  as?: E

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
} & Omit<React.ComponentPropsWithoutRef<E>, 'as'>

type Ref<E extends Element> = E extends 'span'
  ? HTMLSpanElement
  : E extends 'div'
  ? HTMLDivElement
  : HTMLParagraphElement

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
 * // Inline span with proper typing
 * <Text as="span" size="lg" onClick={(e) => console.log(e.currentTarget)}>
 *   Important highlight
 * </Text>
 */
export const Text = React.forwardRef(
  <E extends Element = 'p'>(
    {
      as,
      size = 'md',
      align = 'start',
      muted = false,
      blockMargin = false,
      className = '',
      ...rest
    }: Props<E>,
    ref: React.ForwardedRef<Ref<E>>
  ) => {
    const Tag = (as ?? 'p') as Element

    const classes = [blockMargin && 't-block-margin', className]
      .filter(Boolean)
      .join(' ')
      .trim()

    return (
      <Tag
        ref={ref as any}
        data-ui="text"
        data-size={size}
        data-align={align}
        data-muted={muted ? 'true' : undefined}
        className={classes || undefined}
        {...(rest as any)}
      />
    )
  }
) as <E extends Element = 'p'>(
  p: Props<E> & { ref?: React.Ref<Ref<E>> }
) => JSX.Element

Text.displayName = 'Text'
