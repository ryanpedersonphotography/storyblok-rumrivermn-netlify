'use client'

/**
 * ClientHeroMotion - Client Component
 * Handles interactive elements: scroll button, animations
 * Minimal client bundle impact
 */

import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'

interface ClientHeroMotionProps {
  scrollText?: string
}

export default function ClientHeroMotion({ 
  scrollText = 'Discover Your Perfect Day' 
}: ClientHeroMotionProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const onScrollClick = () => {
    const html = document.documentElement
    const prev = html.style.scrollBehavior
    html.style.scrollBehavior = 'auto'
    const start = window.pageYOffset
    const amount = window.innerHeight * 0.9
    const duration = 850
    const t0 = performance.now()
    const ease = (t: number) => t * (2 - t)
    
    const step = (t1: number) => {
      const p = Math.min((t1 - t0) / duration, 1)
      window.scrollTo({ top: start + amount * ease(p), behavior: 'auto' })
      if (p < 1) requestAnimationFrame(step)
      else html.style.scrollBehavior = prev
    }
    requestAnimationFrame(step)
  }

  // Portal the scroll button into the hero
  if (!mounted) return null
  
  const mountPoint = document.getElementById('hero-scroll-mount')
  if (!mountPoint) return null

  return createPortal(
    <button 
      onClick={onScrollClick} 
      className="hero-scroll-indicator"
      aria-label="Scroll to content"
    >
      <span className="hero-scroll-text">{scrollText}</span>
      <svg 
        className="hero-scroll-arrow" 
        width="24" 
        height="24" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor"
      >
        <path d="M12 5v14M19 12l-7 7-7-7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>,
    mountPoint
  )
}