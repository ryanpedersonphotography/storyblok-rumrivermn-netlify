import React from 'react';

import HeroPrimitive from '@/components/primitive/HeroPrimitive';

export const metadata = { title: 'Tone QA — Prominent' };

export default function Page() {
  return (
    <main>
      <HeroPrimitive
        tone="prominent"
        overlay="none"
        eyebrow="Tone-driven gradient"
        title="Rum River Barn"
        accent="Prominent tone"
        lead="This section uses the brand's prominent tone. Switch html[data-brand] and data-theme to verify."
        primaryCta={{ label: 'Schedule a Tour', href: '/contact' }}
        secondaryCta={{ label: 'See Packages', href: '/packages' }}
        showScrollIndicator
      />
      <section id="next-section" style={{ minHeight: '120vh' }} />
    </main>
  );
}
