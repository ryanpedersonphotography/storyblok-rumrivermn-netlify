/* ==========================================================================
   THEME PROVIDER — React Context for Theme Management
   ==========================================================================
   Provides theme and brand state to all components via React context.
   Syncs with localStorage and responds to OS preference changes.
   ========================================================================== */

'use client'

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import {
  THEME_REGISTRY,
  BRAND_REGISTRY,
  STORAGE_KEYS,
  preferredSystemTheme,
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
  const [theme, setThemeState] = useState<ThemeId>(() => {
    if (typeof document !== 'undefined') {
      const attr = document.documentElement.getAttribute('data-theme')
      return (attr as ThemeId) || 'light'
    }
    return 'light'
  })

  const [brand, setBrandState] = useState<BrandId>(() => {
    if (typeof document !== 'undefined') {
      const attr = document.documentElement.getAttribute('data-brand')
      return (attr as BrandId) || 'romantic'
    }
    return 'romantic'
  })

  /* Set theme: update state, DOM, and localStorage */
  const applyThemeToDom = useCallback((nextTheme: ThemeId) => {
    if (typeof document === 'undefined') return
    THEME_REGISTRY[nextTheme].apply(document.documentElement)
  }, [])

  const applyBrandToDom = useCallback((nextBrand: BrandId) => {
    if (typeof document === 'undefined') return
    BRAND_REGISTRY[nextBrand].apply(document.documentElement)
  }, [])

  const setTheme = useCallback((newTheme: ThemeId) => {
    setThemeState(newTheme)
    applyThemeToDom(newTheme)
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.theme, newTheme)
    }
  }, [applyThemeToDom])

  /* Set brand: update state, DOM, and localStorage */
  const setBrand = useCallback((newBrand: BrandId) => {
    setBrandState(newBrand)
    applyBrandToDom(newBrand)
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.brand, newBrand)
    }
  }, [applyBrandToDom])

  /* Sync across tabs and respond to OS preference changes */
  useEffect(() => {
    if (typeof window === 'undefined') return

    // Cross-tab sync via storage events
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEYS.theme && e.newValue) {
        const nextTheme = e.newValue as ThemeId
        setThemeState(nextTheme)
        applyThemeToDom(nextTheme)
      }
      if (e.key === STORAGE_KEYS.brand && e.newValue) {
        const nextBrand = e.newValue as BrandId
        setBrandState(nextBrand)
        applyBrandToDom(nextBrand)
      }
    }

    // OS preference change detection
    const mql = window.matchMedia('(prefers-color-scheme: dark)')
    const onMqlChange = () => {
      // Only auto-switch if user hasn't explicitly set a theme
      if (!localStorage.getItem(STORAGE_KEYS.theme)) {
        const systemTheme = preferredSystemTheme()
        setThemeState(systemTheme)
        applyThemeToDom(systemTheme)
      }
    }

    window.addEventListener('storage', onStorage)
    mql.addEventListener('change', onMqlChange)

    return () => {
      window.removeEventListener('storage', onStorage)
      mql.removeEventListener('change', onMqlChange)
    }
  }, [applyBrandToDom, applyThemeToDom])

  const value = useMemo(
    () => ({ theme, setTheme, brand, setBrand }),
    [theme, setTheme, brand, setBrand]
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
