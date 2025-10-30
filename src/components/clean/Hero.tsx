/**
 * Hero Component - Clean Semantic Implementation
 * Full-viewport hero section with parallax background and romantic styling
 */

import Link from 'next/link';

export default function Hero() {
  return (
    <section className="hero">
      <div className="hero__content">
        {/* Script accent kicker */}
        <div className="hero__kicker">Where Dreams Begin</div>

        {/* Main hero title with accent */}
        <h1 className="hero__title">
          Rum River
          <br />
          <span className="hero__title--accent">Wedding Barn</span>
        </h1>

        {/* Hero description */}
        <p className="hero__description">
          Nestled along Minnesota's scenic Rum River, our historic barn offers the perfect blend of
          rustic charm and modern elegance for your once-in-a-lifetime celebration.
        </p>

        {/* Hero action buttons */}
        <div className="hero__buttons">
          <Link href="/clean#schedule" className="hero__cta">
            Schedule Your Visit
          </Link>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="hero__scroll-indicator">
        <div className="hero__scroll-text">Discover Your Perfect Day</div>
        <div className="hero__scroll-arrow">↓</div>
      </div>
    </section>
  );
}
