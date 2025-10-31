export default function Pricing() {
  const packages = [
    {
      name: 'Classic',
      price: '$5,000',
      features: [
        'Venue rental for 8 hours',
        'Tables & chairs for 150 guests',
        'Bridal suite access',
        'Setup & cleanup included',
        'Parking for all guests'
      ]
    },
    {
      name: 'Premium',
      price: '$7,500',
      features: [
        'Venue rental for 12 hours',
        'Tables & chairs for 200 guests',
        'Bridal suite & groom\'s quarters',
        'Setup, cleanup & coordination',
        'Ceremony & reception space',
        'Preferred vendor access'
      ]
    },
    {
      name: 'Luxury',
      price: '$10,000',
      features: [
        'Full weekend access',
        'Tables & chairs for 250 guests',
        'All premium amenities',
        'Full event coordination',
        'Rehearsal dinner space',
        'Custom décor consultation',
        'Complimentary suite upgrade'
      ]
    }
  ];

  return (
    <section className="pricing" data-section="pricing">
        <div className="pricing__container">
        <div className="pricing__header">
          <span className="pricing__script">Investment</span>
          <h2 className="pricing__title">Wedding Packages</h2>
        </div>

        <div className="pricing__grid">
          {packages.map((pkg, index) => (
            <div key={index} className="pricing__card">
              <h3 className="pricing__name">{pkg.name}</h3>
              <div className="pricing__price">{pkg.price}</div>
              <ul className="pricing__features">
                {pkg.features.map((feature, i) => (
                  <li key={i} className="pricing__feature">{feature}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
