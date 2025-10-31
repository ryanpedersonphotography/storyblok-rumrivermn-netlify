import { StarIcon } from '@heroicons/react/24/solid'

export default function Testimonials() {
  const testimonials = [
    {
      text: "Testimonial quote goes here...",
      coupleName: 'Customer Name',
      avatar: 'https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=80&h=80&fit=crop&crop=face&auto=format&q=80',
      rating: 5
    },
    {
      text: "Testimonial quote goes here...",
      coupleName: 'Customer Name',
      avatar: 'https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=80&h=80&fit=crop&crop=face&auto=format&q=80',
      rating: 5
    },
    {
      text: "Testimonial quote goes here...",
      coupleName: 'Customer Name',
      avatar: 'https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=80&h=80&fit=crop&crop=face&auto=format&q=80',
      rating: 5
    }
  ];

  return (
    <section className="testimonials" data-section="testimonials">
        <div className="testimonials__content">
        <div className="testimonials__header">
          <span className="testimonials__script">Love Letters</span>
          <h2 className="testimonials__title">What Couples Say</h2>
          <p className="testimonials__lead">
            Real stories from real couples who celebrated at Rum River Barn
          </p>
        </div>

        <div className="testimonials__grid">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="testimonials__card">
              <div className="testimonials__underline"></div>

              <blockquote>
                {testimonial.text}
              </blockquote>

              <div className="testimonials__stars">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <StarIcon key={i} className="testimonials__star" />
                ))}
              </div>

              <div style={{ paddingTop: '1rem', position: 'relative', zIndex: 1 }}>
                <div className="testimonials__avatar">
                  <img
                    className="testimonials__avatar-image"
                    src={testimonial.avatar}
                    alt={testimonial.coupleName}
                    width="80"
                    height="80"
                  />
                  <div className="testimonials__avatar-overlay"></div>
                </div>
                <div className="testimonials__name">{testimonial.coupleName}</div>
                <div className="testimonials__cta">View Their Wedding Gallery</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
