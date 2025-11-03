/* NAVBAR COMPONENT - Home Page Navigation
 * Transparent overlay navbar with scroll effects and mobile menu
 * Dependencies: navbar-styles.css
 */

'use client'

import { useState, useEffect } from 'react'

export function Navbar() {
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

  // Navigation items
  const navItems = [
    { label: 'Home', href: '/' },
    { label: 'About', href: '/about' },
    { label: 'Venue', href: '/venue' },
    { label: 'Gallery', href: '/gallery' },
    { label: 'Packages', href: '/packages' },
    { label: 'Contact', href: '/contact' }
  ]

  return (
    <>
      <nav className={`hotfix-navbar ${isScrolled ? 'scrolled' : ''}`}>
        <div className="hotfix-navbar-container">
          {/* Logo */}
          <a href="/" className="hotfix-navbar-logo">
            <div className="hotfix-navbar-logo-icon">
              RR
            </div>
            <span className="hotfix-navbar-logo-text">Rum River Barn</span>
          </a>

          {/* Desktop Navigation */}
          <div className="hotfix-navbar-nav">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="hotfix-navbar-link"
              >
                {item.label}
              </a>
            ))}
            
            {/* CTA Button */}
            <a href="/schedule-tour" className="hotfix-navbar-cta">
              Schedule Tour
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="hotfix-navbar-mobile-btn"
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
      <div className={`hotfix-navbar-mobile-menu ${isMenuOpen ? 'open' : ''}`}>
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
        {navItems.map((item) => (
          <a
            key={item.href}
            href={item.href}
            className="hotfix-navbar-link"
            onClick={() => setIsMenuOpen(false)}
          >
            {item.label}
          </a>
        ))}
        
        {/* Mobile CTA */}
        <a
          href="/schedule-tour"
          className="hotfix-navbar-cta"
          onClick={() => setIsMenuOpen(false)}
        >
          Schedule Tour
        </a>
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

// Alternative static version for SSR/no-JS environments
export function NavbarStatic() {
  const navItems = [
    { label: 'Home', href: '/' },
    { label: 'About', href: '/about' },
    { label: 'Venue', href: '/venue' },
    { label: 'Gallery', href: '/gallery' },
    { label: 'Packages', href: '/packages' },
    { label: 'Contact', href: '/contact' }
  ]

  return (
    <nav className="hotfix-navbar">
      <div className="hotfix-navbar-container">
        {/* Logo */}
        <a href="/" className="hotfix-navbar-logo">
          <div className="hotfix-navbar-logo-icon">
            RR
          </div>
          <span className="hotfix-navbar-logo-text">Rum River Barn</span>
        </a>

        {/* Desktop Navigation */}
        <div className="hotfix-navbar-nav">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="hotfix-navbar-link"
            >
              {item.label}
            </a>
          ))}
          
          {/* CTA Button */}
          <a href="/schedule-tour" className="hotfix-navbar-cta">
            Schedule Tour
          </a>
        </div>

        {/* Mobile Menu Button - functionality requires JavaScript */}
        <div className="hotfix-navbar-mobile-btn">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 12H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            <path d="M3 6H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            <path d="M3 18H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </div>
      </div>
    </nav>
  )
}