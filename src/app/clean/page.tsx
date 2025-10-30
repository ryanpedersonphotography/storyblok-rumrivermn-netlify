/**
 * Clean Version Route - Semantic CSS Implementation
 *
 * This route demonstrates the site with:
 * - Semantic class names (.navbar instead of .hotfix-navbar)
 * - Token-based styling (no hardcoded values)
 * - Zero !important declarations
 * - Proper CSS cascade management
 */

import Navbar from '@/components/clean/Navbar';
import Hero from '@/components/clean/Hero';

export const metadata = {
  title: 'Rum River Barn - Clean Version',
  description: 'Wedding venue in Minnesota - Clean CSS implementation',
};

export default function CleanPage() {
  return (
    <>
      <Navbar />
      <Hero />

      {/* Sections will be added incrementally:
        - Spaces
        - Alternating Blocks
        - Love Stories Gallery
        - Brand Social Proof
        - Testimonials
        - History Carousel
        - Rum River Experience
        - Pricing
        - Schedule Form
        - Map Section
        - Footer
      */}

      <div style={{ padding: '4rem 2rem', textAlign: 'center' }}>
        <h2>🚧 Clean Version In Progress</h2>
        <p style={{ marginTop: '1rem', color: '#666' }}>
          This is the clean CSS implementation. More sections coming soon!
        </p>
        <a
          href="/"
          style={{
            display: 'inline-block',
            marginTop: '1.5rem',
            padding: '0.75rem 1.5rem',
            background: '#6B4E3D',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '4px'
          }}
        >
          ← Back to Original Version
        </a>
      </div>
    </>
  );
}
