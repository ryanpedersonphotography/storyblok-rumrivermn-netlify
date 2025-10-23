/* THANK YOU PAGE - Success page after form submission
 * Dependencies: hotfix-site.css classes for consistent styling
 */

export default function ThankYouPage() {
  return (
    <section className="hotfix-schedule-tour">
      <div className="hotfix-form-container">
        <div className="hotfix-form-header">
          <p className="hotfix-form-script">Thank You!</p>
          <h2 className="hotfix-form-title">Your Tour Request Has Been Sent</h2>
          <p className="hotfix-form-description">
            We've received your tour request and will get back to you within 24 hours to confirm your visit.
          </p>
        </div>

        <div className="hotfix-tour-form" style={{ textAlign: 'center' }}>
          <div style={{ padding: '2rem 0' }}>
            <div style={{ 
              fontSize: '4rem', 
              color: '#E4C896', 
              marginBottom: '1rem' 
            }}>
              ✓
            </div>
            
            <h3 style={{ 
              color: '#6B4E3D', 
              fontSize: '1.5rem', 
              marginBottom: '1rem',
              fontFamily: "'Playfair Display', serif"
            }}>
              We're Excited to Meet You!
            </h3>
            
            <p style={{ 
              color: '#6B4E3D', 
              lineHeight: '1.6',
              marginBottom: '2rem'
            }}>
              In the meantime, feel free to explore our venue galleries or learn more about our wedding packages.
            </p>

            <div style={{ 
              display: 'flex', 
              gap: '1rem', 
              justifyContent: 'center',
              flexWrap: 'wrap'
            }}>
              <a 
                href="/gallery" 
                className="hotfix-form-submit"
                style={{ 
                  textDecoration: 'none',
                  display: 'inline-flex',
                  margin: '0'
                }}
              >
                VIEW GALLERY
              </a>
              
              <a 
                href="/" 
                className="hotfix-form-submit"
                style={{ 
                  textDecoration: 'none',
                  display: 'inline-flex',
                  margin: '0',
                  background: 'transparent',
                  color: '#9D6B7B',
                  borderColor: '#9D6B7B'
                }}
              >
                BACK TO HOME
              </a>
            </div>
          </div>

          <div style={{ 
            marginTop: '2rem',
            padding: '1.5rem',
            background: 'rgba(228, 200, 150, 0.1)',
            borderRadius: '12px',
            border: '1px solid rgba(228, 200, 150, 0.3)'
          }}>
            <h4 style={{ 
              color: '#6B4E3D',
              fontSize: '1.125rem',
              marginBottom: '0.5rem',
              fontFamily: "'Montserrat', sans-serif",
              fontWeight: '500'
            }}>
              Questions? Call us directly:
            </h4>
            <a 
              href="tel:612-801-0546"
              style={{
                color: '#9D6B7B',
                fontSize: '1.25rem',
                fontWeight: '600',
                textDecoration: 'none'
              }}
            >
              (612) 801-0546
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}