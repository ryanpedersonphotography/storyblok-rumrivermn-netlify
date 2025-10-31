/* BRAND SOCIAL PROOF - Clean Version
 * Brand logos with testimonial quote
 * Dependencies: brand-proof CSS classes
 */

export default function BrandProof() {
  const brands = ['THE KNOT', 'WEDDINGWIRE', 'MARTHA STEWART', 'MINNESOTA BRIDE'];

  return (
    <section className="brand-proof" data-section="brand-proof">
        <div className="brand-proof__content">
        <div className="brand-proof__logos">
          {brands.map((brand, index) => (
            <span key={index} className="brand-proof__logo">
              {brand}
            </span>
          ))}
        </div>

        <p className="brand-proof__quote">
          "Rum River Barn isn't just a venue—it's{' '}
          <span className="brand-proof__highlight">where dreams come to life</span>.
          Their commitment to saying 'yes' to every couple's vision sets them apart as{' '}
          <span className="brand-proof__highlight">Minnesota's most accommodating wedding destination</span>."
        </p>
      </div>
    </section>
  );
}
