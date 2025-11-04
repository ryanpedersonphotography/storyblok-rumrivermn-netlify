'use client'
import React from 'react'
import { storyblokEditable } from '@storyblok/react'
import { MapPin, Phone, Mail, Facebook, Instagram } from 'lucide-react'

interface FooterBlok {
  _uid?: string
  component?: string
  brand_title?: string
  brand_description?: string
  address?: string
  phone?: string
  email?: string
  facebook_url?: string
  instagram_url?: string
  [key: string]: any
}

export default function Footer({ blok }: { blok?: FooterBlok }) {
  const currentYear = new Date().getFullYear()

  // Default values matching hotfix
  const brandTitle = blok?.brand_title || 'Rum River Wedding Barn'
  const brandDescription = blok?.brand_description || "Where dreams come to life along Minnesota's scenic Rum River. Historic charm meets modern elegance for your perfect celebration."
  const address = blok?.address || '42618 78th Street, Hillman, MN 56338'
  const phone = blok?.phone
  const email = blok?.email
  const facebookUrl = blok?.facebook_url
  const instagramUrl = blok?.instagram_url

  return (
    <footer
      className="footer"
      data-section="footer"
      {...(blok ? storyblokEditable(blok) : {})}
    >
      <div className="footer-container">
        <div className="footer-content">
          {/* Column 1: Brand & Description */}
          <div className="footer-section">
            <h3 className="footer-title">{brandTitle}</h3>
            <p className="footer-description">{brandDescription}</p>
          </div>

          {/* Column 2: Contact Information */}
          <div className="footer-section">
            <h4 className="footer-section-title">Contact Information</h4>
            <div className="footer-contact">
              <p className="footer-address">
                <MapPin className="footer-social-icon" size={18} />
                {address}
              </p>
              {phone && (
                <a href={`tel:${phone.replace(/[^0-9]/g, '')}`} className="footer-phone-link">
                  <Phone className="footer-social-icon" size={18} />
                  {phone}
                </a>
              )}
              {email && (
                <a href={`mailto:${email}`} className="footer-phone-link">
                  <Mail className="footer-social-icon" size={18} />
                  {email}
                </a>
              )}
            </div>
          </div>

          {/* Column 3: Social Links */}
          <div className="footer-section">
            <h4 className="footer-section-title">Connect With Us</h4>
            <div className="footer-social-links">
              {facebookUrl && (
                <a
                  href={facebookUrl}
                  className="footer-social-link"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Follow us on Facebook"
                >
                  <Facebook className="footer-social-icon" size={20} />
                </a>
              )}
              {instagramUrl && (
                <a
                  href={instagramUrl}
                  className="footer-social-link"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Follow us on Instagram"
                >
                  <Instagram className="footer-social-icon" size={20} />
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Footer Bottom with Centered Copyright */}
        <div className="footer-bottom">
          <div className="footer-copyright">
            &copy; {currentYear} {brandTitle}. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  )
}
