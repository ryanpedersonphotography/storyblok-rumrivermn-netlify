import * as React from 'react'
import { PropsSlot } from './PropsSlot'
import { SpinnerSVG } from './SpinnerSVG'

// Export types for consumer reuse
export type Variant = 'solid' | 'outline' | 'subtle' | 'ghost'
export type Size = 'xs' | 'sm' | 'md' | 'lg'
export type Corner = 'round' | 'pill' | 'square'
export type SpinnerPosition = 'start' | 'end' | 'overlay'

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
   * @default 'solid'
   */
  variant?: Variant

  /**
   * Size scale mapped to height, padding, and font-size tokens.
   * All sizes meet WCAG 2.5.5 minimum 44×44px hit target.
   * @default 'md'
   */
  size?: Size

  /**
   * Border radius style.
   * @default 'pill'
   */
  corner?: Corner

  /**
   * Icon-only square button (uses size as both dimensions).
   * Must provide aria-label for accessibility.
   * @default false
   */
  iconOnly?: boolean

  /**
   * Loading state - blocks interaction, shows spinner, sets aria-busy.
   * @default false
   */
  loading?: boolean

  /**
   * Text to show during loading state (replaces children).
   * Improves accessibility and UX.
   */
  loadingText?: React.ReactNode

  /**
   * Spinner position relative to content.
   * - 'start': Spinner before label
   * - 'end': Spinner after label
   * - 'overlay': Centered spinner, content hidden but width preserved
   * @default 'end'
   */
  spinnerPosition?: SpinnerPosition

  /**
   * Preserve button width during loading to prevent layout shift.
   * @default true
   */
  preserveWidth?: boolean
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
 * Production-ready button primitive with comprehensive accessibility.
 *
 * Features:
 * - Variants: solid, outline, subtle, ghost
 * - Sizes: xs, sm, md, lg (WCAG 44×44px minimum)
 * - Loading states with SVG spinner
 * - Icon-only support
 * - HCM (High Contrast Mode) support
 * - Motion preferences respect
 * - Universal styling (native + asChild)
 *
 * @example
 * // Primary CTA
 * <Button variant="solid" size="lg">Schedule Tour</Button>
 *
 * @example
 * // Secondary action
 * <Button variant="outline" size="md">View Pricing</Button>
 *
 * @example
 * // Link as button (maintains link semantics)
 * <Button asChild variant="subtle">
 *   <Link href="/gallery">Explore</Link>
 * </Button>
 *
 * @example
 * // Loading state
 * <Button loading loadingText="Saving…">Save Changes</Button>
 *
 * @example
 * // Icon-only (accessible)
 * <Button aria-label="Close" iconOnly variant="ghost">✕</Button>
 */
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      asChild,
      type = 'button',
      variant = 'solid',
      size = 'md',
      corner = 'pill',
      iconOnly = false,
      loading = false,
      loadingText,
      spinnerPosition = 'end',
      preserveWidth = true,
      disabled,
      children,
      ...rest
    },
    ref
  ) => {
    const computedDisabled = !!disabled || !!loading

    const dataAttrs = {
      'data-ui': 'button',
      'data-variant': variant,
      'data-size': size,
      'data-corner': corner,
      'data-icon-only': iconOnly ? 'true' : undefined,
      'data-loading': boolAttr(loading),
      'data-disabled': boolAttr(computedDisabled),
      'data-spinner-position': spinnerPosition,
      'data-preserve-width': boolAttr(preserveWidth),
    } as const

    // Spinner node (reused in row or overlay)
    const spinner = (
      <SpinnerSVG className="btn__spinner" style={{ width: '1em', height: '1em' }} />
    )

    // The visible label; keep in a span for styling & measurement symmetry
    const label = <span className="btn__label">{children}</span>

    // Width ghost (offscreen text) – prevents layout shift when loadingText differs
    const widthGhost =
      preserveWidth ? (
        <span className="btn__width-ghost" aria-hidden="true">
          {loading && loadingText ? loadingText : children}
        </span>
      ) : null

    // Overlay vs row content composition
    const content =
      spinnerPosition === 'overlay' ? (
        <span className="btn__content">
          {widthGhost}
          {loading && (
            <span className="btn__spinner-overlay">
              {spinner}
            </span>
          )}
          {/* Hide label visually when overlay spinner is active; CSS handles opacity */}
          {loading && loadingText ? (
            <span className="btn__row">{label}</span>
          ) : (
            <span className="btn__row">{label}</span>
          )}
        </span>
      ) : (
        <span className="btn__content">
          {widthGhost}
          <span className="btn__row">
            {loading && spinnerPosition === 'start' && (
              <span className="btn__spinner-start">{spinner}</span>
            )}
            {loading && loadingText ? (
              <span className="btn__label">{loadingText}</span>
            ) : (
              label
            )}
            {loading && spinnerPosition === 'end' && (
              <span className="btn__spinner-end">{spinner}</span>
            )}
          </span>
        </span>
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
            role: (rest as any).role, // don't force a role; keep semantic anchor if it's a link
            ...rest,
            ...dataAttrs,
            'aria-disabled': computedDisabled ? 'true' : undefined,
            'aria-busy': loading ? 'true' : undefined,
            tabIndex: computedDisabled ? -1 : (rest as any)?.tabIndex,
            onClick: compose(preventer, childOnClick),
            // Don't add disabled attr to non-buttons; rely on aria/tabIndex/pointer-events
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
        aria-busy={loading ? 'true' : undefined}
        {...rest}
        {...dataAttrs}
      >
        {content}
      </button>
    )
  }
)

Button.displayName = 'Button'
