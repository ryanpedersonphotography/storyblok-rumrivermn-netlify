/**
 * TypeScript type definitions for CSS custom properties (variables)
 *
 * Extends React.CSSProperties to support CSS variable names as keys.
 * This eliminates the need for `as any` when using CSS variables in style objects.
 *
 * @example
 * ```tsx
 * import type { CSSVars } from '@/types/css-vars';
 *
 * <div style={{ "--card-min": "20rem" } as CSSVars}>
 *   Content
 * </div>
 * ```
 */

import type { CSSProperties } from 'react';

/**
 * CSSVars type - allows any CSS variable name (starts with --)
 * while preserving all standard CSS properties from React.CSSProperties
 */
export type CSSVars = CSSProperties & {
  [key: `--${string}`]: string | number;
};

/**
 * Common design system CSS variables with type-safe values
 * Use this for autocomplete and validation when setting custom properties
 */
export interface DesignSystemVars extends CSSProperties {
  // Layout primitives
  '--stack-gap'?: string;
  '--cluster-gap'?: string;
  '--grid-gap'?: string;
  '--grid-min'?: string;
  '--gap'?: string;
  '--col-gap'?: string;
  '--row-gap'?: string;
  '--align'?: string;

  // Switcher primitive
  '--switcher-threshold'?: string;

  // Card system
  '--card-min'?: string;
  '--card-padding'?: string;
  '--card-gap'?: string;
  '--card-surface'?: string;
  '--card-border'?: string;
  '--card-radius'?: string;
  '--card-shadow'?: string;
  '--card-focus-ring'?: string;

  // Recipe contract vars
  '--rc-bg'?: string;
  '--rc-card'?: string;
  '--rc-fg'?: string;
  '--rc-fg-muted'?: string;
  '--rc-accent'?: string;
  '--rc-border'?: string;
  '--rc-gap'?: string;
  '--rc-flow'?: string;

  // Glass primitive
  '--glass-blur'?: string;
  '--glass-saturate'?: string;
  '--glass-tint'?: string;
  '--glass-border'?: string;

  // Spacing tokens (from design system)
  '--space-4'?: string;
  '--space-8'?: string;
  '--space-12'?: string;
  '--space-16'?: string;
  '--space-20'?: string;
  '--space-24'?: string;
  '--space-32'?: string;
  '--space-40'?: string;
  '--space-48'?: string;
  '--space-56'?: string;
  '--space-64'?: string;
  '--space-80'?: string;
  '--space-96'?: string;
  '--space-128'?: string;
}

/**
 * Helper type for style objects that may contain CSS variables
 * Use this when you want both standard props AND arbitrary variables
 */
export type StyleWithVars = CSSProperties & Record<string, string | number | undefined>;
