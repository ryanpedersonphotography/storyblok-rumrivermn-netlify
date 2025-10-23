/* BRAND SOCIAL PROOF SECTION - Home Page (Lines 204-222)
 * Brand logos and highlighted testimonial quote
 * Dependencies: hotfix-site.css classes
 */

export function BrandSocialProofSection() {
  const brandLogos = [
    "THE KNOT",
    "WEDDINGWIRE", 
    "MARTHA STEWART",
    "MINNESOTA BRIDE"
  ];

  return (
    <section className="hotfix-brand-quote-section">
      <div className="hotfix-brand-quote-content">
        {/* Brand Logos Section */}
        <div className="hotfix-brand-logos">
          {brandLogos.map((brand, index) => (
            <span key={index} className="hotfix-brand-logo">{brand}</span>
          ))}
        </div>
        
        {/* Testimonial Quote with Highlighted Text */}
        <p className="hotfix-brand-quote-text">
          "Rum River Barn isn't just a venue—it's{' '}
          <span className="hotfix-highlight">where dreams come to life</span>.
          Their commitment to saying 'yes' to every couple's vision sets them apart as{' '}
          <span className="hotfix-highlight">Minnesota's most accommodating wedding destination</span>."
        </p>
      </div>
    </section>
  );
}