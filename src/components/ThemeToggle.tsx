'use client'

import { useEffect, useState } from 'react'
import { SunIcon, MoonIcon, ComputerDesktopIcon } from '@heroicons/react/24/outline'

type Mode = 'light' | 'dark' | 'system'

export default function ThemeToggle() {
  const [mode, setMode] = useState<Mode>('system')
  const [mounted, setMounted] = useState(false)

  // Hydration-safe mounting
  useEffect(() => {
    setMounted(true)
    try {
      const stored = localStorage.getItem('theme-mode') as Mode | null
      setMode(stored || 'system')
    } catch {}
  }, [])

  // Apply theme to document
  useEffect(() => {
    if (!mounted) return

    const apply = (m: Mode) => {
      const root = document.documentElement
      if (m === 'system') {
        const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches
        root.setAttribute('data-theme', isDark ? 'dark' : 'light')
      } else {
        root.setAttribute('data-theme', m)
      }
      // Dispatch event for listeners
      root.dispatchEvent(new CustomEvent('themechange', { detail: { mode: m } }))
    }

    apply(mode)

    // Listen for system theme changes when in system mode
    if (mode === 'system') {
      const mq = window.matchMedia('(prefers-color-scheme: dark)')
      const handler = () => apply('system')
      mq.addEventListener('change', handler)
      return () => mq.removeEventListener('change', handler)
    }
  }, [mode, mounted])

  // Cycle through modes: light → dark → system → light
  const cycle = () => {
    setMode(prev => {
      const next = prev === 'light' ? 'dark' : prev === 'dark' ? 'system' : 'light'
      try {
        localStorage.setItem('theme-mode', next)
      } catch {}
      return next
    })
  }

  // Get icon for current mode
  const getIcon = () => {
    if (mode === 'light') return <SunIcon className="theme-toggle-icon" />
    if (mode === 'dark') return <MoonIcon className="theme-toggle-icon" />
    return <ComputerDesktopIcon className="theme-toggle-icon" />
  }

  // Get label for current mode
  const getLabel = () => {
    if (mode === 'light') return 'Switch to dark mode'
    if (mode === 'dark') return 'Switch to system mode'
    return 'Switch to light mode'
  }

  // Don't render until mounted to avoid hydration mismatch
  if (!mounted) {
    return (
      <div className="theme-toggle-placeholder" style={{ width: '44px', height: '44px' }} />
    )
  }

  return (
    <button
      type="button"
      onClick={cycle}
      className="theme-toggle"
      data-testid="theme-toggle"
      aria-label={getLabel()}
      title={getLabel()}
      style={{
        background: 'transparent',
        border: 'none',
        cursor: 'pointer',
        padding: '10px',
        display: 'grid',
        placeItems: 'center',
        transition: 'opacity 150ms ease',
      }}
      onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.7')}
      onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
    >
      {getIcon()}
      <style jsx>{`
        :global(.theme-toggle-icon) {
          width: 24px;
          height: 24px;
          color: var(--text-primary);
          transition: color 150ms ease, transform 200ms ease;
        }
        button:hover :global(.theme-toggle-icon) {
          transform: scale(1.1);
        }
      `}</style>
    </button>
  )
}
