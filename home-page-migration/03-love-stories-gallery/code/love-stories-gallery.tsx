/* LOVE STORIES GALLERY SECTION - Home Page (Lines 104-201)
 * Gallery of real wedding photos with overlays and metadata
 * Dependencies: hotfix-site.css classes, local wedding photos
 */

export function LoveStoriesGallerySection() {
  const weddingGalleries = [
    {
      href: "/real-weddings/anthony-and-linnea",
      imageSrc: "/wedding-photos/anthony-and-linnea/015.jpg",
      coupleNames: "Anthony & Linnea",
      season: "Summer 2024",
      photoCount: "114 Photos",
      venue: "Rum River Barn"
    },
    {
      href: "/real-weddings/loria-and-jason-rolstad-agape",
      imageSrc: "/wedding-photos/loria-and-jason-rolstad-agape/025.jpg",
      coupleNames: "Loria & Jason Rolstad",
      season: "Summer 2024", 
      photoCount: "96 Photos",
      venue: "Rum River Barn"
    },
    {
      href: "/real-weddings/mattea-courtney-photo-gallery",
      imageSrc: "/wedding-photos/mattea-courtney-photo-gallery/012.jpg",
      coupleNames: "Mattea Courtney",
      season: "Summer 2024",
      photoCount: "89 Photos", 
      venue: "Rum River Barn"
    },
    {
      href: "/real-weddings/kyle-carrie",
      imageSrc: "/wedding-photos/kyle-carrie/018.jpg",
      coupleNames: "Kyle Carrie",
      season: "Summer 2024",
      photoCount: "57 Photos",
      venue: "Rum River Barn"
    },
    {
      href: "/real-weddings/emily-and-barron-nixon",
      imageSrc: "/real-wedding-blogs/emily-and-barron-nixon/emily-barron-wedding-reception.jpg",
      coupleNames: "Emily & Barron Nixon",
      season: "Summer 2024",
      photoCount: "36 Photos",
      venue: "Rum River Barn"
    },
    {
      href: "/real-weddings/joshua-and-teri",
      imageSrc: "/wedding-photos/joshua-and-teri/010.jpg",
      coupleNames: "Joshua & Teri",
      season: "Summer 2024",
      photoCount: "36 Photos",
      venue: "Rum River Barn"
    }
  ];

  return (
    <section className="hotfix-love-stories-gallery">
      <div className="hotfix-love-stories-content">
        <div className="hotfix-love-stories-header">
          <div className="hotfix-script-accent">Real Love Stories</div>
          <h2 className="hotfix-love-section-title">Weddings at the Barn</h2>
          <p className="hotfix-love-lead">
            Every celebration tells a unique story of love, laughter, and happily ever after.
          </p>
        </div>

        <div className="hotfix-wedding-gallery">
          {weddingGalleries.map((wedding, index) => (
            <a 
              key={index}
              href={wedding.href} 
              className="hotfix-gallery-item" 
              data-discover="true"
            >
              <img 
                src={wedding.imageSrc}
                alt={`${wedding.coupleNames} Wedding`}
                width="800" 
                height="800"
              />
              <div className="hotfix-gallery-overlay">
                <div className="hotfix-gallery-couple-names">{wedding.coupleNames}</div>
                <div className="hotfix-gallery-season">{wedding.season}</div>
                <div className="hotfix-gallery-details">{wedding.photoCount} • {wedding.venue}</div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}