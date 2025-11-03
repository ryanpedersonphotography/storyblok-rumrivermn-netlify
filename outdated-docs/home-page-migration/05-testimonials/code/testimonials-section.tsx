/* TESTIMONIALS SECTION - Home Page (Lines 225-345)
 * Social proof testimonials with star ratings and customer photos
 * Dependencies: hotfix-site.css classes
 */

export function TestimonialsSection() {
  const testimonials = [
    {
      quote: "From our first tour to our last dance, the team at Rum River made our dreams come true. The barn was absolutely magical, and our guests are still talking about how perfect everything was.",
      customerName: "Sarah & Michael Johnson",
      avatarImage: "https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=300&h=300&fit=crop&crop=face&auto=format&q=80",
      galleryLink: "/gallery",
      ctaText: "View Their Wedding Gallery"
    },
    {
      quote: "We wanted rustic elegance, and Rum River delivered beyond our wildest expectations. The historic charm combined with modern amenities was exactly what we were looking for.",
      customerName: "Emma & James Wilson", 
      avatarImage: "https://images.unsplash.com/photo-1519741497674-611481863552?w=300&h=300&fit=crop&crop=face&auto=format&q=80",
      galleryLink: "/gallery",
      ctaText: "View Their Wedding Gallery"
    },
    {
      quote: "The team went above and beyond to make our winter wedding absolutely magical. Even in February, the barn felt warm and romantic. We couldn't have asked for more.",
      customerName: "Amanda & Chris Thompson",
      avatarImage: "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=300&h=300&fit=crop&crop=face&auto=format&q=80", 
      galleryLink: "/gallery",
      ctaText: "View Their Wedding Gallery"
    }
  ];

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

  return (
    <section className="hotfix-social-proof">
      <div className="hotfix-social-proof-content">
        <div className="hotfix-social-proof-header">
          <div className="hotfix-script-accent">Love Letters</div>
          <h2 className="hotfix-social-section-title">What Couples Say</h2>
          <p className="hotfix-social-lead">
            Real stories from real couples who celebrated at Rum River Barn
          </p>
        </div>

        <div className="hotfix-testimonials-grid">
          {testimonials.map((testimonial, index) => (
            <a key={index} href={testimonial.galleryLink} className="hotfix-testimonial-card">
              <div className="hotfix-card-underline"></div>
              <blockquote>
                "{testimonial.quote}"
              </blockquote>
              
              <StarRating />
              
              <div style={{ paddingTop: '1rem', position: 'relative', zIndex: 1 }}>
                <div className="hotfix-couple-avatar">
                  <img 
                    className="hotfix-avatar-image" 
                    src={testimonial.avatarImage}
                    alt={testimonial.customerName}
                  />
                  <div className="hotfix-avatar-overlay"></div>
                </div>
                <div className="hotfix-couple-name">{testimonial.customerName}</div>
                <div className="hotfix-wedding-gallery-cta">{testimonial.ctaText}</div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}