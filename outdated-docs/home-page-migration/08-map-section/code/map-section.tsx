/* MAP SECTION - Home Page (Lines 481-586)
 * Interactive location section with Google Maps and venue details
 * Dependencies: hotfix-site.css classes
 */

export function MapSection() {
  const locationDetails = [
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="hotfix-icon">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
        </svg>
      ),
      title: "Address",
      content: (
        <>
          42618 78th Street<br />Hillman, MN 56338
        </>
      )
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="hotfix-icon">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z" />
        </svg>
      ),
      title: "Easy Access From",
      content: (
        <>
          45 min from Minneapolis<br />30 min from St. Cloud<br />1 hour from Brainerd
        </>
      )
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="hotfix-icon">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 0 1-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 0 0 6.16-12.12A14.98 14.98 0 0 0 9.631 8.41m5.96 5.96a14.926 14.926 0 0 1-5.841 2.58m-.119-8.54a6 6 0 0 0-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 0 0-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 0 1-2.448-2.448 14.9 14.9 0 0 1 .06-.312m-2.24 2.39a4.493 4.493 0 0 0-1.757 4.306 4.493 4.493 0 0 0 4.306-1.758M16.5 9a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z" />
        </svg>
      ),
      title: "Nearest Airport",
      content: (
        <>
          Minneapolis-St. Paul International<br />55 miles (1 hour drive)
        </>
      )
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="hotfix-icon">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
        </svg>
      ),
      title: "Accommodations",
      content: (
        <>
          Partner hotels in Princeton & Milaca<br />Group rates available
        </>
      )
    }
  ];

  return (
    <section className="hotfix-map-section">
      <div className="hotfix-map-container">
        {/* Left Panel - Location Information */}
        <div className="hotfix-map-info">
          <div className="hotfix-map-header">
            <div className="hotfix-script-accent">Interactive Location</div>
            <h2 className="hotfix-map-title">Find Your Way to Forever</h2>
            <p className="hotfix-map-lead">
              Discover our beautiful venue nestled in the heart of Minnesota.
            </p>
          </div>
          
          <div className="hotfix-location-details">
            {locationDetails.map((item, index) => (
              <div key={index} className="hotfix-location-item">
                <div className="hotfix-location-icon">
                  {item.icon}
                </div>
                <div className="hotfix-location-text">
                  <h4>{item.title}</h4>
                  <p>{item.content}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Right Panel - Interactive Map */}
        <div className="hotfix-map-embed">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2817.8985775673544!2d-93.7851842!3d45.8936111!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x52b39b1c5c5c5c5c%3A0x5c5c5c5c5c5c5c5c!2s42618%2078th%20St%2C%20Hillman%2C%20MN%2056338!5e0!3m2!1sen!2sus!4v1704067200000!5m2!1sen!2sus"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Rum River Barn Location - 42618 78th Street, Hillman, MN 56338"
          />
          
          <div className="hotfix-map-overlay">
            <a 
              href="https://www.google.com/maps/dir//42618+78th+Street,+Hillman,+MN+56338"
              target="_blank"
              rel="noopener noreferrer"
              className="hotfix-map-action-btn"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="hotfix-icon-sm">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
              </svg>
              Get Directions
            </a>
            <a 
              href="https://www.google.com/maps/place/42618+78th+St,+Hillman,+MN+56338"
              target="_blank"
              rel="noopener noreferrer"
              className="hotfix-map-action-btn"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="hotfix-icon-sm">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
              </svg>
              Full Map
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}