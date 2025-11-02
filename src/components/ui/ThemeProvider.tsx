/* ==========================================================================
   THEME PROVIDER — React Context for Theme Management
   ==========================================================================
   Provides theme and brand state to all components via React context.
   Syncs with localStorage and responds to OS preference changes.
   ========================================================================== */

'use client'

import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
import {
  THEME_REGISTRY,
  BRAND_REGISTRY,
  STORAGE_KEYS,
  preferredSystemTheme,
  clampTheme,
  clampBrand,
  type ThemeId,
  type BrandId
} from '@/lib/theme/registry'

type ThemeContextValue = {
  theme: ThemeId
  setTheme: (theme: ThemeId) => void
  brand: BrandId
  setBrand: (brand: BrandId) => void
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // Initialize from DOM attributes (set by pre-paint script)
  const initialTheme: ThemeId = typeof document !== 'undefined'
    ? clampTheme(document.documentElement.getAttribute('data-theme'))
    : 'light'
  const initialBrand: BrandId = typeof document !== 'undefined'
    ? clampBrand(document.documentElement.getAttribute('data-brand'))
    : 'romantic'

  const [theme, setThemeState] = useState<ThemeId>(initialTheme)
  const [brand, setBrandState] = useState<BrandId>(initialBrand)

  /* Set theme: update state, DOM, and localStorage */
  const setTheme = (next: ThemeId) => {
    if (next === theme) return // no-op if unchanged
    setThemeState(next)
    if (typeof document !== 'undefined') {
      THEME_REGISTRY[next].apply(document.documentElement)
      localStorage.setItem(STORAGE_KEYS.theme, next)
    }
  }

  /* Set brand: update state, DOM, and localStorage */
  const setBrand = (next: BrandId) => {
    if (next === brand) return // no-op if unchanged
    setBrandState(next)
    if (typeof document !== 'undefined') {
      BRAND_REGISTRY[next].apply(document.documentElement)
      localStorage.setItem(STORAGE_KEYS.brand, next)
    }
  }

  /* Sync across tabs and respond to OS preference changes */
  useEffect(() => {
    if (typeof window === 'undefined') return

    // Cross-tab sync via storage events
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEYS.theme && e.newValue) {
        const nv = clampTheme(e.newValue)
        if (nv !== theme) setTheme(nv)
      }
      if (e.key === STORAGE_KEYS.brand && e.newValue) {
        const nv = clampBrand(e.newValue)
        if (nv !== brand) setBrand(nv)
      }
    }

    // OS preference change detection
    const mql = window.matchMedia('(prefers-color-scheme: dark)')
    const onMqlChange = () => {
      // Only auto-switch if user hasn't explicitly set a theme
      if (!localStorage.getItem(STORAGE_KEYS.theme)) {
        setTheme(preferredSystemTheme())
      }
    }

    window.addEventListener('storage', onStorage)
    mql.addEventListener('change', onMqlChange)

    return () => {
      window.removeEventListener('storage', onStorage)
      mql.removeEventListener('change', onMqlChange)
    }
  }, [theme, brand])

  const value = useMemo(
    () => ({ theme, setTheme, brand, setBrand }),
    [theme, brand]
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

/* useTheme Hook — Access theme context */
export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider')
  }
  return context
}
