/* HERO SECTION - Home Page (Lines 16-47)
 * This is the main hero section with romantic styling
 * Dependencies: hotfix-site.css classes
 */

export function HeroSection() {
  return (
    <section className="hotfix-hero-romantic">
      <div className="hotfix-hero-content">
        {/* HOTFIX: Script accent kicker */}
        <div className="hotfix-hero-kicker">
          Where Dreams Begin
        </div>
        
        {/* HOTFIX: Main hero title with accent */}
        <h1 className="hotfix-hero-title">
          Rum River<br />
          <span className="hotfix-hero-title-accent">Wedding Barn</span>
        </h1>
        
        {/* HOTFIX: Hero description */}
        <p className="hotfix-hero-description">
          Nestled along Minnesota's scenic Rum River, our historic barn offers the perfect blend of rustic charm and modern elegance for your once-in-a-lifetime celebration.
        </p>
        
        {/* HOTFIX: Hero action buttons */}
        <div className="hotfix-hero-buttons">
          <a href="/contact" className="hotfix-btn-romantic-secondary">
            Schedule Your Visit
          </a>
        </div>
      </div>
      
      {/* HOTFIX: Scroll indicator */}
      <div className="hotfix-hero-scroll">
        <div className="hotfix-hero-scroll-text">Discover Your Perfect Day</div>
        <div className="hotfix-hero-scroll-arrow">↓</div>
      </div>
    </section>
  );
}