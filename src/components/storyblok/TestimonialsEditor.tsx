'use client';

import { storyblokEditable } from '@storyblok/react/rsc';

interface TestimonialItemProps {
  _uid: string;
  component: string;
  quote?: string;
  customer_name?: string;
  avatar_image?: any;
  gallery_link?: string;
  cta_text?: string;
  [key: string]: any;
}

interface TestimonialsSectionProps {
  blok: {
    _uid: string;
    component: string;
    script_accent?: string;
    section_title?: string;
    lead_text?: string;
    testimonials?: TestimonialItemProps[];
    [key: string]: any;
  };
}

// 5-star rating component
const StarRating = () => (
  <div className="hotfix-star-rating">
    {[...Array(5)].map((_, i) => (
      <svg key={i} xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="hotfix-star">
        <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z" clipRule="evenodd" />
      </svg>
    ))}
  </div>
);

// Testimonial Item Component (nested block)
export function TestimonialItem({ blok }: { blok: TestimonialItemProps }) {
  const avatarUrl = typeof blok.avatar_image === 'string'
    ? blok.avatar_image
    : blok.avatar_image?.filename || 'https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=300&h=300&fit=crop&crop=face&auto=format&q=80';

  return (
    <a
      href={blok.gallery_link || '/gallery'}
      className="hotfix-testimonial-card"
      {...storyblokEditable(blok)}
    >
      <div className="hotfix-card-underline"></div>
      <blockquote>
        &ldquo;{blok.quote || 'Testimonial quote goes here...'}&rdquo;
      </blockquote>

      <StarRating />

      <div style={{ paddingTop: '1rem', position: 'relative', zIndex: 1 }}>
        <div className="hotfix-couple-avatar">
          <img
            className="hotfix-avatar-image"
            src={avatarUrl}
            alt={blok.customer_name || 'Customer'}
          />
          <div className="hotfix-avatar-overlay"></div>
        </div>
        <div className="hotfix-couple-name">{blok.customer_name || 'Customer Name'}</div>
        <div className="hotfix-wedding-gallery-cta">{blok.cta_text || 'View Their Wedding Gallery'}</div>
      </div>
    </a>
  );
}

// Main Testimonials Section Component
export default function TestimonialsEditor({ blok }: TestimonialsSectionProps) {
  return (
    <section
      className="hotfix-social-proof"
      {...storyblokEditable(blok)}
      data-discover="true"
    >
      <div className="hotfix-social-proof-content">
        <div className="hotfix-social-proof-header">
          <div className="hotfix-script-accent">{blok.script_accent || 'Love Letters'}</div>
          <h2 className="hotfix-social-section-title">{blok.section_title || 'What Couples Say'}</h2>
          <p className="hotfix-social-lead">
            {blok.lead_text || 'Real stories from real couples who celebrated at Rum River Barn'}
          </p>
        </div>

        <div className="hotfix-testimonials-grid">
          {blok.testimonials?.map((testimonial) => (
            <TestimonialItem blok={testimonial} key={testimonial._uid} />
          ))}
        </div>
      </div>
    </section>
  );
}
