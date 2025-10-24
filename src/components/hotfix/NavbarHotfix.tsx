'use client'

import { useState, useEffect } from 'react'
import { hotfixNavbar, type HotfixNavItem } from './hotfixStaticContent'

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

  return (
    <>
      <nav className={`hotfix-navbar ${isScrolled ? 'scrolled' : ''}`}>
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
              >
                {item.label}
              </a>
            ))}
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
        {data.items.map((item) => (
          <a
            key={item.href}
            href={item.href}
            className="hotfix-navbar-link"
            onClick={() => setIsMenuOpen(false)}
          >
            {item.label}
          </a>
        ))}
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