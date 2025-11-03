/* ALTERNATING BLOCKS SECTION - Home Page (Lines 50-99)
 * Two-column alternating layout blocks with venue information
 * Dependencies: hotfix-site.css classes
 */

export function AlternatingBlocksSection() {
  return (
    <section className="hotfix-alternating-blocks">
      <div className="hotfix-content-wrapper">
        <div className="hotfix-section-header">
          <div className="hotfix-script-accent">Your Perfect Venue</div>
          <h2 className="hotfix-section-title">Why Choose Rum River Barn</h2>
          <p className="hotfix-lead">
            Discover what makes our venue the perfect setting for your unforgettable celebration
          </p>
        </div>

        <div className="hotfix-blocks-container">
          <div className="hotfix-block-item">
            <div className="hotfix-block-content">
              <div className="hotfix-number">01</div>
              <h3>A Picturesque Location For Your Special Event</h3>
              <p className="hotfix-block-lead">Near Milaca, Saint Paul, St Cloud, and Brainerd MN</p>
              <p>When it comes to special occasions such as weddings, birthday parties, or other events, it is important to have the perfect setting. You want to ensure that your event is at a location that people will remember.</p>
              <p>Here at Rum River Barn, we understand the importance of your special occasion. We are different from other special event venues because we allow you to pretty much run the show. When you choose us, you do not have to worry about us saying no.</p>
              <p>Our goal is to help you have your perfect day. We tend to book up fast, so don't wait—call us today at <strong>612-801-0546</strong>!</p>
            </div>
            <div className="hotfix-block-image">
              <img 
                src="https://rum-river-final.netlify.app/images/venue/barn-interior-ceiling-beams-lighting.jpg" 
                alt="Special event venue with beautiful ceiling beams"
                width="800" 
                height="500"
              />
            </div>
          </div>

          <div className="hotfix-block-item reverse">
            <div className="hotfix-block-content">
              <div className="hotfix-number">02</div>
              <h3>Rum River Barn & Vineyard</h3>
              <p className="hotfix-block-lead">Milaca, St. Cloud, Saint Paul, and Brainerd MN</p>
              <p>Nestled within 400 acres of pure country and rustic charm, this is the perfect barn wedding venue in Minnesota. On a peaceful hillside overlooking grape vineyards, mile-long manicured old oak forests, and white pines next to a whispering brook, we offer Minnesota's premier barn wedding venue and country special events venue for your custom special event.</p>
              <p>Enjoy the serenity, peacefulness, and amazing beauty which has been carved out of the forests and developed for the past 100 years.</p>
            </div>
            <div className="hotfix-block-image">
              <img 
                src="https://rum-river-final.netlify.app/images/venue/property-field-wildflowers-natural.jpg" 
                alt="Rum River Barn and Vineyard with natural wildflowers"
                width="800" 
                height="500"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}