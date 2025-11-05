'use client'

import { useEffect, useState } from 'react'
import { SunIcon, MoonIcon, ComputerDesktopIcon } from '@heroicons/react/24/outline'
import { cx } from '@/lib/react-interop'

type Mode = 'light' | 'dark' | 'system'

type ThemeToggleProps = {
  variant?: 'default' | 'toolbar'
  className?: string
}

export default function ThemeToggle({ variant = 'default', className }: ThemeToggleProps = {}) {
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
  const iconClass = cx('theme-toggle-icon', variant === 'toolbar' && 'theme-toggle-icon--toolbar')

  const getIcon = () => {
    if (mode === 'light') return <SunIcon className={iconClass} />
    if (mode === 'dark') return <MoonIcon className={iconClass} />
    return <ComputerDesktopIcon className={iconClass} />
  }

  // Get label for current mode
  const getLabel = () => {
    if (mode === 'light') return 'Switch to dark mode'
    if (mode === 'dark') return 'Switch to system mode'
    return 'Switch to light mode'
  }

  const buttonClassName = cx(
    'theme-toggle',
    variant === 'toolbar' ? 'theme-toggle--toolbar' : 'theme-toggle--default',
    className,
  )

  const placeholderClassName = cx(
    'theme-toggle-placeholder',
    variant === 'toolbar' && 'theme-toggle-placeholder--toolbar',
    className,
  )

  const styles = `
    .theme-toggle {
      border: none;
      cursor: pointer;
      display: grid;
      place-items: center;
      transition: opacity 150ms ease;
      background: transparent;
    }
    .theme-toggle--default {
      padding: 10px;
    }
    .theme-toggle--default:hover,
    .theme-toggle--default:focus-visible {
      opacity: 0.7;
      outline: none;
    }
    .theme-toggle--toolbar {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      border: 1px solid var(--glass-toolbar-chip-border, rgba(255, 255, 255, 0.2));
      background: var(--glass-toolbar-chip-bg, rgba(255, 255, 255, 0.08));
      color: var(--glass-toolbar-chip-foreground, currentColor);
      transition: border-color 220ms var(--glass-toolbar-ease, cubic-bezier(0.2, 0, 0, 1)),
        background 220ms var(--glass-toolbar-ease, cubic-bezier(0.2, 0, 0, 1));
    }
    .theme-toggle--toolbar:hover,
    .theme-toggle--toolbar:focus-visible {
      border-color: var(--glass-toolbar-chip-hover-border, rgba(255, 255, 255, 0.32));
      background: var(--glass-toolbar-chip-hover-bg, rgba(255, 255, 255, 0.12));
      outline: none;
    }
    :global(.theme-toggle-icon) {
      width: 24px;
      height: 24px;
      color: var(--navbar-link, var(--navbar-text, currentColor));
      transition: color 150ms ease, transform 200ms ease;
    }
    .theme-toggle--default:hover :global(.theme-toggle-icon),
    .theme-toggle--default:focus-visible :global(.theme-toggle-icon) {
      transform: scale(1.1);
    }
    .theme-toggle--toolbar :global(.theme-toggle-icon) {
      width: 18px;
      height: 18px;
      color: inherit;
      transition: color 200ms var(--glass-toolbar-ease, cubic-bezier(0.2, 0, 0, 1)),
        transform 220ms var(--glass-toolbar-ease, cubic-bezier(0.2, 0, 0, 1));
    }
    .theme-toggle--toolbar:hover :global(.theme-toggle-icon),
    .theme-toggle--toolbar:focus-visible :global(.theme-toggle-icon) {
      color: var(--glass-toolbar-icon-active, currentColor);
      transform: scale(1.05);
    }
    .theme-toggle-placeholder {
      width: 44px;
      height: 44px;
    }
    .theme-toggle-placeholder--toolbar {
      width: 36px;
      height: 36px;
    }
  `

  // Don't render until mounted to avoid hydration mismatch
  if (!mounted) {
    return (
      <>
        <div className={placeholderClassName} />
        <style jsx>{styles}</style>
      </>
    )
  }

  return (
    <>
      <button
        type="button"
        onClick={cycle}
        className={buttonClassName}
        data-testid="theme-toggle"
        aria-label={getLabel()}
        title={getLabel()}
      >
        {getIcon()}
      </button>
      <style jsx>{styles}</style>
    </>
  )
}
