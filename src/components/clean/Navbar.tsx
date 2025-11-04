/**
 * Navbar Component - Clean Semantic Implementation with Storyblok
 * Token-based styling, zero !important, full accessibility
 */

'use client'

import { useState, useEffect } from 'react'
import { storyblokEditable } from '@storyblok/react'
import ThemeToggle from '@/components/ThemeToggle'

interface NavItem {
  _uid?: string
  label?: string
  href?: string
}

interface NavbarBlok {
  _uid?: string
  component?: string
  logo_text?: string
  nav_items?: NavItem[]
  show_cta?: boolean
  cta_label?: string
  cta_url?: string
  [key: string]: any
}

export default function Navbar({ blok }: { blok?: NavbarBlok }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Handle smooth scrolling for anchor links
  const handleAnchorClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault()

    if (href.startsWith('#')) {
      const targetId = href.substring(1)
      // Try to find by id first, then by data-section attribute
      let targetElement = document.getElementById(targetId)
      if (!targetElement) {
        targetElement = document.querySelector(`[data-section="${targetId}"]`)
      }

      if (targetElement) {
        const htmlElement = document.documentElement
        const originalScrollBehavior = htmlElement.style.scrollBehavior
        htmlElement.style.scrollBehavior = 'auto'

        const targetPosition = targetElement.offsetTop
        const start = window.pageYOffset
        const distance = targetPosition - start
        const startTime = performance.now()
        const duration = 850

        const easeOutQuad = (t: number) => t * (2 - t)

        const animateScroll = (currentTime: number) => {
          const elapsed = currentTime - startTime
          const progress = Math.min(elapsed / duration, 1)
          const easeProgress = easeOutQuad(progress)

          window.scrollTo({
            top: start + distance * easeProgress,
            behavior: 'auto'
          })

          if (progress < 1) {
            requestAnimationFrame(animateScroll)
          } else {
            htmlElement.style.scrollBehavior = originalScrollBehavior
          }
        }

        requestAnimationFrame(animateScroll)
      }
    }

    setIsMenuOpen(false)
  }

  // Default content
  const logoText = blok?.logo_text || 'Rum River Barn'
  const navItems = blok?.nav_items || [
    { label: 'Spaces', href: '#spaces' },
    { label: 'Why Choose Us', href: '#alternating-blocks' },
    { label: 'Experience', href: '#experience' },
    { label: 'Real Weddings', href: '#gallery' },
    { label: 'History', href: '#history' },
  ]
  const showCta = blok?.show_cta !== false
  const ctaLabel = blok?.cta_label || 'Book Now'
  const ctaUrl = blok?.cta_url || '#schedule-form'

  return (
    <>
      <nav
        className={`navbar ${isScrolled ? 'scrolled' : ''}`}
        data-section="navbar"
        {...(blok ? storyblokEditable(blok) : {})}
      >
        <div className="navbar__container">
          {/* Logo */}
          <a href="/" className="navbar__logo">
            <div className="navbar__logo-icon">RR</div>
            <span className="navbar__logo-text">{logoText}</span>
          </a>

          {/* Desktop Navigation */}
          <div className="navbar__nav">
            {navItems.map((item: NavItem) => (
              <a
                key={item._uid || item.href}
                href={item.href || '#'}
                className="navbar__link"
                onClick={(e) => handleAnchorClick(e, item.href || '#')}
              >
                {item.label}
              </a>
            ))}
            <ThemeToggle />
            {showCta && (
              <a
                href={ctaUrl}
                className="navbar__cta"
                onClick={(e) => handleAnchorClick(e, ctaUrl)}
              >
                {ctaLabel}
              </a>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="navbar__mobile-btn"
            data-testid="nav-mobile-toggle"
            onClick={() => setIsMenuOpen(true)}
            aria-label="Open mobile menu"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 12H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <path d="M3 6H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <path d="M3 18H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div className={`navbar__mobile-menu ${isMenuOpen ? 'open' : ''}`} data-testid="nav-mobile-drawer">
        <button
          className="navbar__mobile-close"
          onClick={() => setIsMenuOpen(false)}
          aria-label="Close mobile menu"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            <path d="M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </button>

        {/* Mobile Navigation Links */}
        {navItems.map((item: NavItem) => (
          <a
            key={item._uid || item.href}
            href={item.href || '#'}
            className="navbar__link"
            onClick={(e) => handleAnchorClick(e, item.href || '#')}
          >
            {item.label}
          </a>
        ))}
        <div style={{ display: 'flex', justifyContent: 'center', padding: '1rem 0' }}>
          <ThemeToggle />
        </div>
        {showCta && (
          <a
            href={ctaUrl}
            className="navbar__cta-mobile"
            onClick={(e) => handleAnchorClick(e, ctaUrl)}
          >
            {ctaLabel}
          </a>
        )}
      </div>

      {/* Overlay backdrop for mobile menu */}
      {isMenuOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.2)',
            zIndex: 1000
          }}
          onClick={() => setIsMenuOpen(false)}
        />
      )}
    </>
  )
}
