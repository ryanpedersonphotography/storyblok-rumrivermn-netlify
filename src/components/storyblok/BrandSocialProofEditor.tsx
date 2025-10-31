'use client';

import { storyblokEditable } from '@storyblok/react/rsc';

interface BrandSocialProofProps {
  blok: {
    _uid: string;
    component: string;
    brands?: string;
    quote_text?: string;
    highlight_1?: string;
    highlight_2?: string;
  };
}

export default function BrandSocialProofEditor({ blok }: BrandSocialProofProps) {
  // Parse brands from textarea (one per line)
  const brandsList = (blok.brands || 'THE KNOT\nWEDDINGWIRE\nMARTHA STEWART\nMINNESOTA BRIDE')
    .split('\n')
    .filter(brand => brand.trim());

  // Parse quote text and replace placeholders with highlighted spans
  const quoteText = blok.quote_text ||
    'Rum River Barn isn\'t just a venue—it\'s {highlight_1}. Their commitment to saying \'yes\' to every couple\'s vision sets them apart as {highlight_2}.';

  const highlight1 = blok.highlight_1 || 'where dreams come to life';
  const highlight2 = blok.highlight_2 || 'Minnesota\'s most accommodating wedding destination';

  // Replace placeholders with span elements
  const renderQuoteText = () => {
    const parts = quoteText.split(/(\{highlight_1\}|\{highlight_2\})/g);

    return parts.map((part, index) => {
      if (part === '{highlight_1}') {
        return (
          <span key={index} className="hotfix-highlight">
            {highlight1}
          </span>
        );
      }
      if (part === '{highlight_2}') {
        return (
          <span key={index} className="hotfix-highlight">
            {highlight2}
          </span>
        );
      }
      return part;
    });
  };

  return (
      <section
        className="hotfix-brand-quote-section"
        data-section="brand-proof"
      {...storyblokEditable(blok)}
      data-discover="true"
    >
      <div className="hotfix-brand-quote-content">
        {/* Brand Logos Section */}
        <div className="hotfix-brand-logos">
          {brandsList.map((brand, index) => (
            <span key={index} className="hotfix-brand-logo">
              {brand.trim()}
            </span>
          ))}
        </div>

        {/* Testimonial Quote with Highlighted Text */}
        <p className="hotfix-brand-quote-text">
          &ldquo;{renderQuoteText()}&rdquo;
        </p>
      </div>
    </section>
  );
}
