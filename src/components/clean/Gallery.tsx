/* LOVE STORIES GALLERY - Clean Version
 * Wedding photo gallery with hover effects
 * Dependencies: gallery CSS classes
 */

'use client'

export default function Gallery() {
  const weddings = [
    {
      couple: 'Anthony & Linnea',
      season: 'Summer 2024',
      image: 'https://a.storyblok.com/f/288003424841711/177cb56979/anthony-linnea-wedding.jpg',
      alt: 'Anthony & Linnea at Rum River Barn'
    },
    {
      couple: 'Loria & Jason Rolstad',
      season: 'Summer 2024',
      image: 'https://a.storyblok.com/f/288003424841711/399bb3279c/loria-jason-wedding-final.jpg',
      alt: 'Loria & Jason Rolstad at Rum River Barn'
    },
    {
      couple: 'Mattea Courtney',
      season: 'Summer 2024',
      image: 'https://a.storyblok.com/f/288003424841711/0d38f0a59c/mattea-courtney-wedding-final.jpg',
      alt: 'Mattea Courtney at Rum River Barn'
    },
    {
      couple: 'Kyle Carrie',
      season: 'Summer 2024',
      image: 'https://a.storyblok.com/f/288003424841711/da0775fb6b/kyle-carrie-wedding-final.jpg',
      alt: 'Kyle Carrie at Rum River Barn'
    },
    {
      couple: 'Emily & Barron Nixon',
      season: 'Summer 2024',
      image: 'https://a.storyblok.com/f/288003424841711/ef2dda951e/emily-barron-wedding-final.jpg',
      alt: 'Emily & Barron Nixon at Rum River Barn'
    },
    {
      couple: 'Joshua & Teri',
      season: 'Summer 2024',
      image: 'https://a.storyblok.com/f/288003424841711/ec400a08f8/joshua-teri-wedding-final.jpg',
      alt: 'Joshua & Teri at Rum River Barn'
    }
  ];

  return (
    <section id="gallery" className="gallery">
      <div className="gallery__content">
        <div className="gallery__header">
          <div className="gallery__script">Real Love Stories</div>
          <h2 className="gallery__title">Weddings at the Barn</h2>
          <p className="gallery__lead">
            Every celebration tells a unique story of love, laughter, and happily ever after.
          </p>
        </div>

        <div className="gallery__grid">
          {weddings.map((wedding, index) => (
            <div key={index} className="gallery__item" role="button" tabIndex={0}>
              <img
                src={wedding.image}
                alt={wedding.alt}
                width="800"
                height="800"
              />
              <div className="gallery__overlay">
                <div className="gallery__couple-names">{wedding.couple}</div>
                <div className="gallery__season">{wedding.season}</div>
                <div className="gallery__details"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
