/**
 * Navbar Component - Clean Semantic Implementation
 * No hotfix classes, token-based styling, zero !important
 * EXACT match of hotfix navbar structure
 */

'use client';

import { useState, useEffect } from 'react';
import ThemeToggle from '@/components/ThemeToggle'; // Reuse existing theme toggle

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Navigation items - EXACT match of hotfix
  const navItems = [
    { label: 'Venue', href: '#venue' },
    { label: 'Gallery', href: '#gallery' },
    { label: 'History', href: '#history' },
    { label: 'Packages', href: '#packages' },
    { label: 'Contact', href: '#contact' },
  ];

  return (
    <>
      <nav className={`navbar ${isScrolled ? 'navbar--scrolled' : ''}`} data-testid="navbar">
        <div className="navbar__container">
          {/* Logo */}
          <a href="/" className="navbar__logo">
            <div className="navbar__logo-icon">RR</div>
            <span className="navbar__logo-text">Rum River Barn</span>
          </a>

          {/* Desktop Navigation */}
          <div className="navbar__nav">
            {navItems.map((item) => (
              <a key={item.href} href={item.href} className="navbar__link">
                {item.label}
              </a>
            ))}

            {/* Theme Toggle */}
            <ThemeToggle />
          </div>

          {/* Mobile Menu Button */}
          <button
            className="navbar__mobile-toggle"
            onClick={() => setIsMenuOpen(true)}
            aria-label="Open mobile menu"
            data-testid="nav-mobile-toggle"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M3 12H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              <path d="M3 6H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              <path d="M3 18H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile Menu Drawer */}
      <div
        className={`navbar__mobile-drawer ${isMenuOpen ? 'navbar__mobile-drawer--open' : ''}`}
        data-testid="nav-mobile-drawer"
      >
        <button
          className="navbar__mobile-close"
          onClick={() => setIsMenuOpen(false)}
          aria-label="Close mobile menu"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            <path d="M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>

        {/* Mobile Navigation Links */}
        {navItems.map((item) => (
          <a
            key={item.href}
            href={item.href}
            className="navbar__link"
            onClick={() => setIsMenuOpen(false)}
          >
            {item.label}
          </a>
        ))}

        {/* Mobile Theme Toggle */}
        <div style={{ marginTop: '2rem' }}>
          <ThemeToggle />
        </div>
      </div>

      {/* Overlay backdrop for mobile menu */}
      {isMenuOpen && (
        <div className="navbar__backdrop" onClick={() => setIsMenuOpen(false)} />
      )}
    </>
  );
}
