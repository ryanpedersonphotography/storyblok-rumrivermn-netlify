import React from 'react';
import HeroPrimitive from '@/components/primitive/HeroPrimitive';

export const metadata = { title: 'Hero QA — Migration Clean Room' };

export default function Page() {
  return (
    <main>
      <HeroPrimitive
        tone="prominent"
        eyebrow="A Romantic Setting"
        title="Rum River Barn"
        accent="Minnesota Wedding Venue"
        lead="Warm wood, river sunsets, and room for everyone you love. Tour the property and picture your day."
        height="screen"
        overlay="soft"
        align="center"
        density="normal"
        paddingY="lg"
        image={{
          src: '/images/barn-exterior-full-deck-view-evening.jpg',
          alt: 'Rum River Barn at sunset',
          position: 'cover',
          attachment: 'fixed',
          focalX: '50%',
          focalY: '50%',
        }}
        primaryCta={{ label: 'Schedule a Tour', href: '/contact' }}
        secondaryCta={{ label: 'See Packages', href: '/packages' }}
        showScrollIndicator
      />
      <section id="next-section" style={{ minHeight: '120vh' }} />
    </main>
  );
}
