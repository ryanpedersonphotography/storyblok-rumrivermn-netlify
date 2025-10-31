'use client'

import { useState, useEffect } from 'react'
import { hotfixNavbar, type HotfixNavItem } from './hotfixStaticContent'
import ThemeToggle from '../ThemeToggle'

type Props = { data?: typeof hotfixNavbar }

export default function NavbarHotfix({ data = hotfixNavbar }: Props) {
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

  // Handle smooth scrolling for anchor links with custom animation
  const handleAnchorClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault()
    
    if (href.startsWith('#')) {
      const targetId = href.substring(1)
      const targetElement = document.getElementById(targetId)
      
      if (targetElement) {
        // Use the same custom scroll animation as the hero scroll indicator
        // Temporarily disable smooth scroll behavior to prevent conflicts
        const htmlElement = document.documentElement
        const originalScrollBehavior = htmlElement.style.scrollBehavior
        htmlElement.style.scrollBehavior = 'auto'

        // Calculate scroll target position
        const targetPosition = targetElement.offsetTop
        const start = window.pageYOffset
        const distance = targetPosition - start
        const startTime = performance.now()
        const duration = 850 // 0.85 seconds - same as hero scroll

        // Smooth ease-out-quad for buttery smooth motion
        const easeOutQuad = (t: number) => {
          return t * (2 - t)
        }

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
            // Restore original scroll behavior
            htmlElement.style.scrollBehavior = originalScrollBehavior
          }
        }

        requestAnimationFrame(animateScroll)
      }
    }
    
    // Close mobile menu if open
    setIsMenuOpen(false)
  }

  return (
    <>
      <nav className={`hotfix-navbar ${isScrolled ? 'scrolled' : ''}`} data-section="navbar">
        <div className="hotfix-navbar-container">
          {/* Logo */}
          <a href="/" className="hotfix-navbar-logo">
            <div className="hotfix-navbar-logo-icon">
              RR
            </div>
            <span className="hotfix-navbar-logo-text">{data.logoText}</span>
          </a>

          {/* Desktop Navigation */}
          <div className="hotfix-navbar-nav">
            {data.items.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="hotfix-navbar-link"
                onClick={(e) => handleAnchorClick(e, item.href)}
              >
                {item.label}
              </a>
            ))}
            <ThemeToggle />
            {data.show_cta && (
              <a
                href={data.cta.url}
                className="hotfix-navbar-cta"
                onClick={(e) => handleAnchorClick(e, data.cta.url)}
              >
                {data.cta.label}
              </a>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="hotfix-navbar-mobile-btn"
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
      <div className={`hotfix-navbar-mobile-menu ${isMenuOpen ? 'open' : ''}`} data-testid="nav-mobile-drawer">
        <button
          className="hotfix-navbar-mobile-close"
          onClick={() => setIsMenuOpen(false)}
          aria-label="Close mobile menu"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            <path d="M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </button>

        {/* Mobile Navigation Links */}
        {data.items.map((item) => (
          <a
            key={item.href}
            href={item.href}
            className="hotfix-navbar-link"
            onClick={(e) => handleAnchorClick(e, item.href)}
          >
            {item.label}
          </a>
        ))}
        <div style={{ display: 'flex', justifyContent: 'center', padding: '1rem 0' }}>
          <ThemeToggle />
        </div>
        {data.show_cta && (
          <a
            href={data.cta.url}
            className="hotfix-navbar-cta-mobile"
            onClick={(e) => handleAnchorClick(e, data.cta.url)}
          >
            {data.cta.label}
          </a>
        )}
      </div>

      {/* Overlay backdrop for mobile menu */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-[1000]"
          onClick={() => setIsMenuOpen(false)}
        />
      )}
    </>
  )
}