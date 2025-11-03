import * as React from 'react'
import { PropsSlot } from './PropsSlot'
import { SpinnerSVG } from './SpinnerSVG'

// Export types for consumer reuse
export type Variant = 'outline' | 'ghost' | 'gold' | 'sage'
export type Size = 'sm' | 'lg'

export interface ButtonProps extends React.ComponentPropsWithoutRef<'button'> {
  /**
   * Change the default rendered element for the one passed as a child.
   * Merges props and refs together using PropsSlot.
   *
   * Note: Maintains semantic honesty - links stay links, buttons stay buttons.
   * If you need true button semantics on a non-button element, add
   * role="button" and keyboard handlers explicitly.
   *
   * @example
   * // Render as Next.js Link (keeps link semantics)
   * <Button asChild variant="outline">
   *   <Link href="/page">Navigate</Link>
   * </Button>
   */
  asChild?: boolean

  /**
   * Visual style variant mapped to design tokens.
   * Default rose accent, or use outline/ghost/gold/sage variants.
   * @default undefined (uses default rose accent)
   */
  variant?: Variant

  /**
   * Size scale mapped to padding and font-size tokens.
   * Default is medium (no data-size attribute).
   * @default undefined (medium size)
   */
  size?: Size

  /**
   * Busy/loading state - blocks interaction, shows spinner, sets aria-busy.
   * @default false
   */
  busy?: boolean

  /**
   * @deprecated Use `busy` instead. Will be removed in future version.
   */
  loading?: boolean
}

/** Helper: normalize boolean to string attribute */
function boolAttr(val?: boolean) {
  return val ? 'true' : undefined
}

/** Helper: compose event handlers (child first, then ours) */
function compose<E extends React.SyntheticEvent>(
  a?: (e: E) => void,
  b?: (e: E) => void
) {
  return (e: E) => {
    a?.(e)
    b?.(e)
  }
}

/**
 * Simplified button primitive with role-token styling.
 *
 * Features:
 * - Variants: outline, ghost, gold, sage (default is rose accent)
 * - Sizes: sm, lg (default is medium, no data-size attribute)
 * - Busy states with SVG spinner and aria-busy
 * - Accessible (WCAG 44×44px minimum, HCM support)
 * - Motion preferences respect
 * - Universal styling (native + asChild)
 *
 * @example
 * // Default button (rose accent)
 * <Button>Schedule Tour</Button>
 *
 * @example
 * // Outline variant
 * <Button variant="outline">View Pricing</Button>
 *
 * @example
 * // Link as button (maintains link semantics)
 * <Button asChild variant="ghost">
 *   <Link href="/gallery">Explore</Link>
 * </Button>
 *
 * @example
 * // Busy state
 * <Button busy>Saving…</Button>
 */
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      asChild,
      type = 'button',
      variant,
      size,
      busy: busyProp,
      loading: loadingProp, // deprecated
      disabled,
      children,
      ...rest
    },
    ref
  ) => {
    // Support deprecated `loading` prop
    const busy = busyProp ?? loadingProp ?? false
    const computedDisabled = !!disabled || busy

    const dataAttrs = {
      'data-busy': boolAttr(busy),
    } as const

    // Simplified content: spinner before or after children via flex gap
    const content = (
      <>
        {busy && <SpinnerSVG className="button__spinner" aria-hidden="true" />}
        {children}
      </>
    )

    if (asChild) {
      // asChild path — keep semantic element (a, Link, etc.)
      const { onClick: childOnClick } = (children as any)?.props ?? {}
      const preventer =
        computedDisabled
          ? (e: React.MouseEvent) => {
              e.preventDefault()
              e.stopPropagation()
            }
          : undefined

      return (
        <PropsSlot
          ref={ref as any}
          inject={{
            ...rest,
            ...dataAttrs,
            'data-variant': variant,
            'data-size': size,
            'aria-disabled': computedDisabled ? 'true' : undefined,
            'aria-busy': busy ? 'true' : undefined,
            tabIndex: computedDisabled ? -1 : (rest as any)?.tabIndex,
            onClick: compose(preventer, childOnClick),
            className: `button ${rest.className || ''}`.trim(),
          }}
        >
          {content}
        </PropsSlot>
      )
    }

    // Native button path — use the real disabled attribute
    return (
      <button
        ref={ref}
        type={type}
        disabled={computedDisabled}
        aria-busy={busy ? 'true' : undefined}
        className={`button ${rest.className || ''}`.trim()}
        data-variant={variant}
        data-size={size}
        {...dataAttrs}
        {...rest}
      >
        {content}
      </button>
    )
  }
)

Button.displayName = 'Button'
