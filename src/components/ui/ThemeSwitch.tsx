/* ==========================================================================
   THEME SWITCH — Unified UI Component
   ==========================================================================
   Uses ThemeProvider context to display and control theme/brand state.
   Supports cycle button and individual choice buttons.
   ========================================================================== */

"use client"

import React from 'react'
import { useTheme } from '@/components/ui/ThemeProvider'

export default function ThemeSwitch() {
  const { choice, effective, cycle, setChoice, brand, setBrand } = useTheme()

  return (
    <div className="cluster" style={{ gap: 'var(--space-12)', alignItems: 'center' }}>
      {/* Cycle button: light → dark → system → light */}
      <button
        type="button"
        className="button"
        data-variant="ghost"
        aria-label="Toggle theme"
        title="Toggle theme (Light → Dark → System)"
        onClick={cycle}
      >
        {choice === 'light' && '☀️ Light'}
        {choice === 'dark' && '🌒 Dark'}
        {choice === 'system' && `🖥️ System (${effective})`}
      </button>

      {/* Individual choice buttons */}
      <div className="inline" style={{ ['--gap' as any]: 'var(--space-8)' }}>
        <button
          type="button"
          className="button"
          data-size="sm"
          onClick={() => setChoice('light')}
          aria-pressed={choice === 'light'}
        >
          Light
        </button>
        <button
          type="button"
          className="button"
          data-size="sm"
          onClick={() => setChoice('dark')}
          aria-pressed={choice === 'dark'}
        >
          Dark
        </button>
        <button
          type="button"
          className="button"
          data-size="sm"
          onClick={() => setChoice('system')}
          aria-pressed={choice === 'system'}
        >
          System
        </button>
      </div>

      {/* Brand switcher (optional section) */}
      <div className="inline" style={{ ['--gap' as any]: 'var(--space-8)' }}>
        <button
          type="button"
          className="button"
          data-size="sm"
          onClick={() => setBrand('romantic')}
          aria-pressed={brand === 'romantic'}
          title="Romantic brand palette"
        >
          🌹 Romantic
        </button>
        <button
          type="button"
          className="button"
          data-size="sm"
          onClick={() => setBrand('modern')}
          aria-pressed={brand === 'modern'}
          title="Modern brand palette"
        >
          ✨ Modern
        </button>
      </div>
    </div>
  )
}
