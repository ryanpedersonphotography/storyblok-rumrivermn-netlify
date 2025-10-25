/**
 * Font Configuration using next/font
 *
 * Benefits:
 * - Self-hosted fonts (no external requests)
 * - Automatic font optimization
 * - Zero Cumulative Layout Shift (CLS)
 * - Automatic subsetting based on usage
 * - FOUT (Flash of Unstyled Text) prevention
 *
 * Fonts:
 * - Playfair Display: Elegant serif for headings
 * - Montserrat: Clean sans-serif for body text
 * - Dancing Script: Handwritten script for accents
 */

import { Playfair_Display, Montserrat, Dancing_Script } from 'next/font/google';

/**
 * Playfair Display - Serif for headings
 * Weights: 400 (regular), 500 (medium), 600 (semibold), 700 (bold)
 */
export const playfairDisplay = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-playfair',
  display: 'swap', // Use 'swap' for best performance
  preload: true,
  fallback: ['Georgia', 'Times New Roman', 'serif'],
  adjustFontFallback: true, // Minimize CLS with size-adjusted fallback
});

/**
 * Montserrat - Sans-serif for body text
 * Weights: 300 (light), 400 (regular), 500 (medium), 600 (semibold), 700 (bold)
 */
export const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-montserrat',
  display: 'swap',
  preload: true,
  fallback: ['system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
  adjustFontFallback: true,
});

/**
 * Dancing Script - Script for decorative accents only
 * Weight: 400 (regular), 700 (bold)
 *
 * ACCESSIBILITY NOTE: Use sparingly and only for decorative purposes.
 * Never use for body text or critical information due to readability concerns.
 */
export const dancingScript = Dancing_Script({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-dancing',
  display: 'swap',
  preload: false, // Lower priority since it's decorative
  fallback: ['cursive'],
  adjustFontFallback: true,
});

/**
 * CSS Variables for Font Families
 *
 * Usage in CSS:
 * ```css
 * h1 { font-family: var(--font-playfair), serif; }
 * body { font-family: var(--font-montserrat), sans-serif; }
 * .accent { font-family: var(--font-dancing), cursive; }
 * ```
 */
export const fontVariables = `${playfairDisplay.variable} ${montserrat.variable} ${dancingScript.variable}`;
