/* ==========================================================================
   THEME PROVIDER — Unified React Context for Theme Management
   ==========================================================================
   Provides theme and brand state to all components via React context.
   Supports system theme detection with OS sync and cross-tab synchronization.

   Key Concepts:
   - choice: User selection ("light" | "dark" | "system")
   - effective: Computed theme ("light" | "dark") that tokens respond to
   - When choice === "system", effective is computed from OS preference
   ========================================================================== */

'use client'

import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
import {
  THEME_REGISTRY,
  BRAND_REGISTRY,
  STORAGE_KEYS,
  preferredSystemTheme,
  clampThemeChoice,
  clampBrand,
  type ThemeId,
  type ThemeChoice,
  type BrandId
} from '@/lib/theme/registry'

type ThemeContextValue = {
  choice: ThemeChoice           // user selection: "light" | "dark" | "system"
  effective: ThemeId            // computed: "light" | "dark"
  setChoice: (c: ThemeChoice) => void
  brand: BrandId
  setBrand: (b: BrandId) => void
  cycle: () => void             // convenience: light → dark → system → light
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

function applyTheme(choice: ThemeChoice) {
  if (typeof document === 'undefined') return
  const root = document.documentElement
  const effective: ThemeId = choice === 'system' ? preferredSystemTheme() : choice

  // Reflect attributes for CSS/tokens + UA
  THEME_REGISTRY[effective].apply(root)
  root.style.setProperty('color-scheme', effective === 'dark' ? 'dark' : 'light')
  root.setAttribute('data-theme-choice', choice) // optional diagnostic hook
}

function applyBrand(brand: BrandId) {
  if (typeof document === 'undefined') return
  BRAND_REGISTRY[brand].apply(document.documentElement)
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // Initialize from DOM attributes set by pre-paint script (or fallbacks)
  const initialChoice: ThemeChoice = typeof document !== 'undefined'
    ? clampThemeChoice(document.documentElement.getAttribute('data-theme-choice'))
    : 'system'
  const initialBrand: BrandId = typeof document !== 'undefined'
    ? clampBrand(document.documentElement.getAttribute('data-brand'))
    : 'romantic'

  const [choice, setChoiceState] = useState<ThemeChoice>(initialChoice)
  const [brand, setBrandState] = useState<BrandId>(initialBrand)

  const effective: ThemeId = useMemo(
    () => (choice === 'system' ? preferredSystemTheme() : choice),
    [choice]
  )

  // Write choice → DOM + storage
  const setChoice = (next: ThemeChoice) => {
    if (next === choice) return
    setChoiceState(next)
    if (typeof window !== 'undefined') {
      try { localStorage.setItem(STORAGE_KEYS.themeChoice, next) } catch {}
    }
    applyTheme(next)
  }

  // Write brand → DOM + storage
  const setBrand = (next: BrandId) => {
    if (next === brand) return
    setBrandState(next)
    if (typeof window !== 'undefined') {
      try { localStorage.setItem(STORAGE_KEYS.brand, next) } catch {}
    }
    applyBrand(next)
  }

  // Cross-tab sync + OS changes (only when choice === 'system')
  useEffect(() => {
    if (typeof window === 'undefined') return

    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEYS.themeChoice && e.newValue) {
        const nv = clampThemeChoice(e.newValue)
        if (nv !== choice) setChoice(nv)
      }
      if (e.key === STORAGE_KEYS.brand && e.newValue) {
        const nb = clampBrand(e.newValue)
        if (nb !== brand) setBrand(nb)
      }
    }

    const mql = window.matchMedia('(prefers-color-scheme: dark)')
    const onMqlChange = () => { if (choice === 'system') applyTheme('system') }

    window.addEventListener('storage', onStorage)
    mql.addEventListener?.('change', onMqlChange)
    // Safari legacy fallback
    // @ts-ignore
    mql.addListener?.(onMqlChange)

    return () => {
      window.removeEventListener('storage', onStorage)
      mql.removeEventListener?.('change', onMqlChange)
      // @ts-ignore
      mql.removeListener?.(onMqlChange)
    }
  }, [choice, brand])

  // Ensure DOM reflects current state after first paint (guards against weird SSR)
  useEffect(() => {
    applyTheme(choice)
    applyBrand(brand)
  }, []) // eslint-disable-line

  const cycle = () =>
    setChoice(choice === 'light' ? 'dark' : choice === 'dark' ? 'system' : 'light')

  const value = useMemo(
    () => ({ choice, effective, setChoice, brand, setBrand, cycle }),
    [choice, effective, brand]
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

/* useTheme Hook — Access theme context */
export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider')
  return ctx
}
