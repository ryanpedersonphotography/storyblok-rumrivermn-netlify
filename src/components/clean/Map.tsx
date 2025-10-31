import { MapPinIcon, ClockIcon, PhoneIcon, EnvelopeIcon, HomeIcon, CakeIcon } from '@heroicons/react/24/outline'

export default function Map() {
  const locations = [
    {
      icon: MapPinIcon,
      title: 'Our Location',
      description: '12345 Rum River Road, Princeton, MN 55371'
    },
    {
      icon: ClockIcon,
      title: 'Tour Hours',
      description: 'Mon-Sat: 10am - 5pm, Sun: By Appointment'
    },
    {
      icon: PhoneIcon,
      title: 'Call Us',
      description: '(763) 555-0123'
    },
    {
      icon: EnvelopeIcon,
      title: 'Email',
      description: 'info@rumriverbarn.com'
    },
    {
      icon: HomeIcon,
      title: 'Indoor & Outdoor',
      description: 'Beautiful spaces for any weather'
    },
    {
      icon: CakeIcon,
      title: 'Full Catering',
      description: 'Professional kitchen and dining facilities'
    }
  ];

  return (
    <section className="map" data-section="map">
        <div className="map__container">
        <div className="map__header">
          <span className="map__script">Find Us</span>
          <h2 className="map__title">Visit Rum River Barn</h2>
          <p className="map__lead">
            Located in the heart of Minnesota, easily accessible from the Twin Cities
          </p>
        </div>

        <div className="map__grid">
          <div className="map__embed">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2810.5!2d-93.5!3d45.5!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDXCsDMwJzAwLjAiTiA5M8KwMzAnMDAuMCJX!5e0!3m2!1sen!2sus!4v1234567890"
              width="650"
              height="650"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Rum River Barn Location"
            />
          </div>

          <div className="map__locations">
            {locations.map((location, index) => {
              const IconComponent = location.icon;
              return (
                <div key={index} className="map__location">
                  <div className="map__icon">
                    <IconComponent />
                  </div>
                  <div className="map__text">
                    <h4>{location.title}</h4>
                    <p>{location.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
