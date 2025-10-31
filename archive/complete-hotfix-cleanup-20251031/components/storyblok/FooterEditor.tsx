'use client';

import { storyblokEditable } from '@storyblok/react/rsc';
import { MapPin, Phone, Mail, Facebook, Instagram } from 'lucide-react';

interface FooterProps {
  blok: {
    _uid: string;
    component: string;
    brand_title?: string;
    brand_description?: string;
    address?: string;
    phone?: string;
    email?: string;
    facebook_url?: string;
    instagram_url?: string;
    [key: string]: any;
  };
}

export default function FooterEditor({ blok }: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
      <footer
        className="hotfix-footer"
        data-section="footer"
      {...storyblokEditable(blok)}
      data-discover="true"
    >
      <div className="hotfix-footer-container">
        <div className="hotfix-footer-content">
          {/* Column 1: Brand & Description */}
          <div className="hotfix-footer-section">
            <h3 className="hotfix-footer-title">
              {blok.brand_title || 'Rum River Wedding Barn'}
            </h3>
            <p className="hotfix-footer-description">
              {blok.brand_description || "Where dreams come to life along Minnesota's scenic Rum River. Historic charm meets modern elegance for your perfect celebration."}
            </p>
          </div>

          {/* Column 2: Contact Information */}
          <div className="hotfix-footer-section">
            <h4 className="hotfix-footer-section-title">Contact Information</h4>
            <div className="hotfix-footer-contact">
              <p className="hotfix-address">
                <MapPin className="hotfix-social-icon" size={18} />
                {blok.address || '42618 78th Street, Hillman, MN 56338'}
              </p>
              {blok.phone && (
                <a href={`tel:${blok.phone.replace(/[^0-9]/g, '')}`} className="hotfix-phone-link">
                  <Phone className="hotfix-social-icon" size={18} />
                  {blok.phone}
                </a>
              )}
              {blok.email && (
                <a href={`mailto:${blok.email}`} className="hotfix-phone-link">
                  <Mail className="hotfix-social-icon" size={18} />
                  {blok.email}
                </a>
              )}
            </div>
          </div>

          {/* Column 3: Social Links */}
          <div className="hotfix-footer-section">
            <h4 className="hotfix-footer-section-title">Connect With Us</h4>
            <div className="hotfix-social-links">
              {blok.facebook_url && (
                <a
                  href={blok.facebook_url}
                  className="hotfix-social-link"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Follow us on Facebook"
                >
                  <Facebook className="hotfix-social-icon" size={20} />
                </a>
              )}
              {blok.instagram_url && (
                <a
                  href={blok.instagram_url}
                  className="hotfix-social-link"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Follow us on Instagram"
                >
                  <Instagram className="hotfix-social-icon" size={20} />
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Footer Bottom with Centered Copyright */}
        <div className="hotfix-footer-bottom">
          <div className="hotfix-copyright">
            © {currentYear} {blok.brand_title || 'Rum River Wedding Barn'}. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}
