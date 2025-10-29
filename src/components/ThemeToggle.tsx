'use client'

import { useState, useEffect } from 'react'
import { SunIcon, MoonIcon } from '@heroicons/react/24/outline'

type ThemeMode = 'auto' | 'light' | 'dark'
type EffectiveTheme = 'light' | 'dark'

export default function ThemeToggle() {
  const [mode, setMode] = useState<ThemeMode>('auto')
  const [effectiveTheme, setEffectiveTheme] = useState<EffectiveTheme>('light')
  const [mounted, setMounted] = useState(false)

  // Get effective theme based on mode and system preference
  const getEffectiveTheme = (themeMode: ThemeMode): EffectiveTheme => {
    if (themeMode === 'auto') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    }
    return themeMode
  }

  // Apply theme to document
  const applyTheme = (themeMode: ThemeMode) => {
    const root = document.documentElement

    if (themeMode === 'auto') {
      // Remove forced theme, let CSS media query handle it
      root.removeAttribute('data-theme')
      const systemTheme = getEffectiveTheme('auto')
      root.style.colorScheme = systemTheme
      setEffectiveTheme(systemTheme)
    } else {
      // Force specific theme
      root.setAttribute('data-theme', themeMode)
      root.style.colorScheme = themeMode
      setEffectiveTheme(themeMode)
    }
  }

  // Handle hydration and initial setup
  useEffect(() => {
    setMounted(true)

    // Get saved mode or default to auto
    const savedMode = (localStorage.getItem('theme-mode') as ThemeMode) || 'auto'
    setMode(savedMode)
    applyTheme(savedMode)

    // Listen for system theme changes when in auto mode
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = () => {
      const currentMode = localStorage.getItem('theme-mode') as ThemeMode || 'auto'
      if (currentMode === 'auto') {
        applyTheme('auto')
      }
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  // Smart toggle logic
  const handleToggle = () => {
    let nextMode: ThemeMode

    if (mode === 'auto') {
      // In auto mode: force the opposite of system
      const currentEffective = getEffectiveTheme('auto')
      nextMode = currentEffective === 'dark' ? 'light' : 'dark'
    } else {
      // In forced mode: return to auto
      nextMode = 'auto'
    }

    setMode(nextMode)
    localStorage.setItem('theme-mode', nextMode)
    applyTheme(nextMode)
  }

  // Get button label based on current state
  const getButtonLabel = (): string => {
    if (mode === 'auto') {
      // Offer opposite of system
      const offer = effectiveTheme === 'dark' ? 'Light' : 'Dark'
      return `Switch to ${offer}`
    } else {
      // Offer to follow system
      return 'Follow System'
    }
  }

  // Don't render until mounted to avoid hydration mismatch
  if (!mounted) {
    return (
      <div className="theme-toggle-placeholder" style={{ width: '44px', height: '44px' }} />
    )
  }

  return (
    <button
      onClick={handleToggle}
      className="theme-toggle"
      data-testid="theme-toggle"
      aria-label={getButtonLabel()}
      title={getButtonLabel()}
    >
      {effectiveTheme === 'light' ? (
        <SunIcon className="theme-toggle-icon" />
      ) : (
        <MoonIcon className="theme-toggle-icon" />
      )}
      {mode !== 'auto' && (
        <span className="theme-toggle-auto-badge">!</span>
      )}
    </button>
  )
}
