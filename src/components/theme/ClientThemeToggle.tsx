'use client'

/**
 * ClientThemeToggle - Minimal client island for theme switching
 * Updates cookie and DOM, no full page re-render needed
 */

import { useState, useEffect } from 'react'

export default function ClientThemeToggle() {
  const [theme, setTheme] = useState<string>('system')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Read initial theme from cookie
    const cookieTheme = document.cookie
      .split('; ')
      .find(row => row.startsWith('theme='))
      ?.split('=')[1] || 'system'
    setTheme(cookieTheme)
  }, [])

  const toggleTheme = () => {
    const themes = ['light', 'dark', 'system']
    const currentIndex = themes.indexOf(theme)
    const nextTheme = themes[(currentIndex + 1) % themes.length]
    
    // Update cookie
    document.cookie = `theme=${nextTheme}; path=/; max-age=${60 * 60 * 24 * 365}`
    
    // Update DOM immediately
    if (nextTheme === 'system') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      document.documentElement.setAttribute('data-theme', prefersDark ? 'dark' : 'light')
    } else {
      document.documentElement.setAttribute('data-theme', nextTheme)
    }
    
    setTheme(nextTheme)
  }

  if (!mounted) return null

  return (
    <button
      onClick={toggleTheme}
      className="theme-toggle"
      aria-label={`Current theme: ${theme}. Click to change.`}
      style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        width: '48px',
        height: '48px',
        borderRadius: '50%',
        background: 'var(--theme-bg-secondary)',
        border: '2px solid var(--theme-border)',
        cursor: 'pointer',
        display: 'grid',
        placeItems: 'center',
        zIndex: 100,
      }}
    >
      {theme === 'light' && '☀️'}
      {theme === 'dark' && '🌙'}
      {theme === 'system' && '💻'}
    </button>
  )
}