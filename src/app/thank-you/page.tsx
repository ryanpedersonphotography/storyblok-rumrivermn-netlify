import Link from 'next/link';

export const metadata = {
  title: 'Thank You - Rum River Wedding Barn',
  description: 'Thank you for your inquiry. We&apos;ll be in touch soon!',
};

export default function ThankYouPage() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #FFFCF8 0%, #F5EFE7 100%)',
      padding: '2rem',
    }}>
      <div style={{
        maxWidth: '600px',
        textAlign: 'center',
        background: 'white',
        padding: '3rem 2rem',
        borderRadius: '16px',
        boxShadow: '0 8px 32px rgba(107, 78, 61, 0.1)',
      }}>
        {/* Success Icon */}
        <div style={{
          width: '80px',
          height: '80px',
          margin: '0 auto 2rem',
          background: 'linear-gradient(135deg, #9D6B7B 0%, #7A8B7F 100%)',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '3rem',
        }}>
          ✓
        </div>

        {/* Script Accent */}
        <p style={{
          fontFamily: "'Dancing Script', cursive",
          fontSize: '1.5rem',
          color: '#9D6B7B',
          marginBottom: '1rem',
        }}>
          Thank You!
        </p>

        {/* Main Title */}
        <h1 style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: '2.5rem',
          color: '#6B4E3D',
          marginBottom: '1.5rem',
          lineHeight: '1.2',
        }}>
          We Received Your Tour Request
        </h1>

        {/* Description */}
        <p style={{
          fontFamily: "'Montserrat', sans-serif",
          fontSize: '1.125rem',
          color: '#6B4E3D',
          opacity: 0.8,
          lineHeight: '1.7',
          marginBottom: '2rem',
        }}>
          We&apos;re excited to show you our beautiful venue! One of our team members will reach out within 24 hours to confirm your tour date and time.
        </p>

        {/* Next Steps */}
        <div style={{
          background: '#FFFCF8',
          padding: '1.5rem',
          borderRadius: '12px',
          marginBottom: '2rem',
          textAlign: 'left',
        }}>
          <h2 style={{
            fontFamily: "'Montserrat', sans-serif",
            fontSize: '1rem',
            color: '#6B4E3D',
            fontWeight: 600,
            marginBottom: '1rem',
            textTransform: 'uppercase',
            letterSpacing: '1px',
          }}>
            What&apos;s Next?
          </h2>
          <ul style={{
            listStyle: 'none',
            padding: 0,
            margin: 0,
            fontFamily: "'Montserrat', sans-serif",
            color: '#6B4E3D',
            opacity: 0.8,
          }}>
            <li style={{ marginBottom: '0.5rem' }}>✓ We&apos;ll call or email you within 24 hours</li>
            <li style={{ marginBottom: '0.5rem' }}>✓ Confirm your preferred tour date and time</li>
            <li style={{ marginBottom: '0.5rem' }}>✓ Answer any questions you may have</li>
            <li>✓ Show you why Rum River is perfect for your day</li>
          </ul>
        </div>

        {/* Call to Actions */}
        <div style={{
          display: 'flex',
          gap: '1rem',
          justifyContent: 'center',
          flexWrap: 'wrap',
        }}>
          <Link
            href="/home-live"
            style={{
              display: 'inline-block',
              padding: '0.875rem 1.75rem',
              background: 'linear-gradient(135deg, #9D6B7B 0%, #7A8B7F 100%)',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '50px',
              fontFamily: "'Montserrat', sans-serif",
              fontWeight: 600,
              fontSize: '0.875rem',
              letterSpacing: '1px',
              textTransform: 'uppercase',
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 12px rgba(107, 78, 61, 0.2)',
            }}
          >
            Back to Home
          </Link>

          <Link
            href="/home-live#love-stories"
            style={{
              display: 'inline-block',
              padding: '0.875rem 1.75rem',
              background: 'transparent',
              color: '#6B4E3D',
              textDecoration: 'none',
              borderRadius: '50px',
              fontFamily: "'Montserrat', sans-serif",
              fontWeight: 600,
              fontSize: '0.875rem',
              letterSpacing: '1px',
              textTransform: 'uppercase',
              transition: 'all 0.3s ease',
              border: '2px solid #6B4E3D',
            }}
          >
            View Love Stories
          </Link>
        </div>
      </div>
    </div>
  );
}
