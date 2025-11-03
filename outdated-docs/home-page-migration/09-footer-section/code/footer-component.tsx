import { 
  PhoneIcon, 
  EnvelopeIcon, 
  MapPinIcon,
  UserGroupIcon,
  CameraIcon 
} from '@heroicons/react/24/outline';

export function Footer() {
  const socialLinks = [
    {
      name: 'Facebook',
      href: 'https://facebook.com/rumriverbarn',
      icon: UserGroupIcon,
      label: 'Follow us on Facebook'
    },
    {
      name: 'Instagram', 
      href: 'https://instagram.com/rumriverbarn',
      icon: CameraIcon,
      label: 'Follow us on Instagram'
    },
    {
      name: 'Email',
      href: 'mailto:info@rumriverbarn.com',
      icon: EnvelopeIcon,
      label: 'Send us an email'
    },
    {
      name: 'Phone',
      href: 'tel:612-801-0546',
      icon: PhoneIcon,
      label: 'Call us at 612-801-0546'
    }
  ];

  return (
    <footer className="hotfix-footer">
      <div className="hotfix-footer-container">
        <div className="hotfix-footer-content">
          {/* Column 1: Brand & Description */}
          <div className="hotfix-footer-section">
            <h3 className="hotfix-footer-title">Rum River Wedding Barn</h3>
            <p className="hotfix-footer-description">
              Where dreams come to life along Minnesota's scenic Rum River. 
              Historic charm meets modern elegance for your perfect celebration.
            </p>
          </div>

          {/* Column 2: Contact Information */}
          <div className="hotfix-footer-section">
            <h4 className="hotfix-footer-title">Contact Information</h4>
            <div className="hotfix-footer-contact">
              <p className="hotfix-address">
                <MapPinIcon className="hotfix-social-icon" />
                42618 78th Street, Hillman, MN 56338
              </p>
              <a href="tel:612-801-0546" className="hotfix-phone-link">
                <PhoneIcon className="hotfix-social-icon" />
                612-801-0546
              </a>
              <a href="mailto:info@rumriverbarn.com" className="hotfix-phone-link">
                <EnvelopeIcon className="hotfix-social-icon" />
                info@rumriverbarn.com
              </a>
            </div>
          </div>

          {/* Column 3: Social Links */}
          <div className="hotfix-footer-section">
            <h4 className="hotfix-footer-title">Connect With Us</h4>
            <div className="hotfix-social-links">
              {socialLinks.slice(0, 2).map((link) => {
                const IconComponent = link.icon;
                return (
                  <a
                    key={link.name}
                    href={link.href}
                    className="hotfix-social-link"
                    target={link.href.startsWith('http') ? '_blank' : undefined}
                    rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                    aria-label={link.label}
                  >
                    <IconComponent className="hotfix-social-icon" />
                    {link.name}
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer Bottom with Centered Decorative Divider */}
        <div className="hotfix-footer-bottom">
          <div className="hotfix-copyright">
            © {new Date().getFullYear()} Rum River Wedding Barn. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}