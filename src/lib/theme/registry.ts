/* ==========================================================================
   THEME REGISTRY — Single Source of Truth
   ==========================================================================
   Defines all available themes and brand variants.
   Registry only sets attributes (data-theme, data-brand), never token values.
   Token values live in theme.css and respond to these attributes.
   ========================================================================== */

export type ThemeId = 'light' | 'dark'
export type BrandId = 'romantic' | 'modern'

export type ThemeDef = {
  id: ThemeId
  label: string
  apply: (root: HTMLElement) => void
}

export type BrandDef = {
  id: BrandId
  label: string
  swatches: string[]  // CSS color values for preview
  apply: (root: HTMLElement) => void
}

/* Theme Registry */
export const THEME_REGISTRY: Record<ThemeId, ThemeDef> = {
  light: {
    id: 'light',
    label: 'Light',
    apply(root) {
      root.setAttribute('data-theme', 'light')
    }
  },
  dark: {
    id: 'dark',
    label: 'Dark',
    apply(root) {
      root.setAttribute('data-theme', 'dark')
    }
  }
}

/* Brand Registry */
export const BRAND_REGISTRY: Record<BrandId, BrandDef> = {
  romantic: {
    id: 'romantic',
    label: 'Romantic',
    swatches: ['var(--accent-rose)', 'var(--accent-gold)', 'var(--accent-sage)'],
    apply(root) {
      root.setAttribute('data-brand', 'romantic')
    }
  },
  modern: {
    id: 'modern',
    label: 'Modern',
    swatches: ['oklch(0.72 0.10 10)', 'oklch(0.86 0.07 95)', 'oklch(0.80 0.07 190)'],
    apply(root) {
      root.setAttribute('data-brand', 'modern')
    }
  }
}

/* Storage Keys for localStorage */
export const STORAGE_KEYS = {
  theme: 'rr.theme',
  brand: 'rr.brand'
} as const

/* Helper: Detect system color scheme preference */
export function preferredSystemTheme(): ThemeId {
  if (typeof window === 'undefined') return 'light'
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}
