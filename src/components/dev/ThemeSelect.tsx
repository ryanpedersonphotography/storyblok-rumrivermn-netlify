/* ==========================================================================
   THEME SELECT — Dev/Admin Only Component
   ==========================================================================
   UI controls for switching theme (light/dark) and brand (romantic/modern).
   Only visible in development or to admin users.
   Public site is locked to romantic brand via pre-paint script.
   ========================================================================== */

'use client'

import React, { useState } from 'react'
import { useTheme } from '@/components/ui/ThemeProvider'
import { THEME_REGISTRY, BRAND_REGISTRY } from '@/lib/theme/registry'

export default function ThemeSelect() {
  const { theme, setTheme, brand, setBrand } = useTheme()
  const [isVisible, setIsVisible] = useState(true)

  if (!isVisible) {
    return (
      <button
        onClick={() => setIsVisible(true)}
        style={{
          position: 'fixed',
          bottom: '1rem',
          right: '1rem',
          zIndex: 9999,
          background: 'var(--surface-1)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '50%',
          padding: '0.75rem',
          boxShadow: 'var(--shadow-lg)',
          cursor: 'pointer',
          fontSize: '1rem'
        }}
        title="Show theme controls"
      >
        🎨
      </button>
    )
  }

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '1rem',
        right: '1rem',
        zIndex: 9999,
        background: 'var(--surface-1)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-md)',
        padding: '1rem',
        boxShadow: 'var(--shadow-lg)',
        fontFamily: 'var(--font-sans)',
        fontSize: '0.875rem'
      }}
    >
      <div style={{ marginBottom: '0.75rem', fontWeight: 600, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span>Theme Controls (Dev Only)</span>
        <button
          onClick={() => setIsVisible(false)}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontSize: '1.2rem',
            padding: '0.25rem',
            borderRadius: '4px',
            color: 'var(--text-secondary)'
          }}
          title="Hide theme controls"
        >
          ×
        </button>
      </div>

      {/* Theme Selector */}
      <div style={{ marginBottom: '0.75rem' }}>
        <label
          style={{
            display: 'block',
            marginBottom: '0.25rem',
            fontSize: '0.75rem',
            color: 'var(--text-secondary)'
          }}
        >
          Color Scheme
        </label>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {Object.values(THEME_REGISTRY).map(themeDef => (
            <button
              key={themeDef.id}
              onClick={() => setTheme(themeDef.id)}
              style={{
                padding: '0.375rem 0.75rem',
                border: '1px solid var(--border-medium)',
                borderRadius: 'var(--radius-sm)',
                background: theme === themeDef.id ? 'var(--accent-gold)' : 'var(--surface-0)',
                color: theme === themeDef.id ? 'var(--text-inverse)' : 'var(--text-primary)',
                cursor: 'pointer',
                fontSize: '0.75rem',
                fontWeight: theme === themeDef.id ? 600 : 400
              }}
            >
              {themeDef.label}
            </button>
          ))}
        </div>
      </div>

      {/* Brand Selector */}
      <div>
        <label
          style={{
            display: 'block',
            marginBottom: '0.25rem',
            fontSize: '0.75rem',
            color: 'var(--text-secondary)'
          }}
        >
          Brand Palette
        </label>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {Object.values(BRAND_REGISTRY).map(brandDef => (
            <button
              key={brandDef.id}
              onClick={() => setBrand(brandDef.id)}
              style={{
                padding: '0.375rem 0.75rem',
                border: '1px solid var(--border-medium)',
                borderRadius: 'var(--radius-sm)',
                background: brand === brandDef.id ? 'var(--accent-gold)' : 'var(--surface-0)',
                color: brand === brandDef.id ? 'var(--text-inverse)' : 'var(--text-primary)',
                cursor: 'pointer',
                fontSize: '0.75rem',
                fontWeight: brand === brandDef.id ? 600 : 400,
                display: 'flex',
                alignItems: 'center',
                gap: '0.375rem'
              }}
            >
              <span>{brandDef.label}</span>
              {/* Color swatches */}
              <span style={{ display: 'flex', gap: '2px' }}>
                {brandDef.swatches.map((swatch, i) => (
                  <span
                    key={i}
                    style={{
                      display: 'inline-block',
                      width: '10px',
                      height: '10px',
                      borderRadius: '2px',
                      background: swatch,
                      border: '1px solid rgba(0,0,0,0.1)'
                    }}
                  />
                ))}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Info Text */}
      <div
        style={{
          marginTop: '0.75rem',
          paddingTop: '0.75rem',
          borderTop: '1px solid var(--border-subtle)',
          fontSize: '0.625rem',
          color: 'var(--text-secondary)',
          lineHeight: 1.4
        }}
      >
        Changes sync to localStorage and persist across sessions.
        <br />
        Public site is locked to Romantic brand.
      </div>
    </div>
  )
}
