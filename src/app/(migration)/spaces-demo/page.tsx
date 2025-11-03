import React from 'react';
import Spaces from '@/components/primitive/SpacesPrimitive';

export default function Page() {
  return (
    <main className="stack gap-12">
      <Spaces
        title="Our Spaces"
        lead="Flexible indoor & outdoor areas for every part of your day."
        items={[
          { title: 'The Barn', description: 'Rustic timber interior with string lights.', image: { src: '/images/barn.jpg', alt: 'Barn' }, features: ['Indoor', 'Power', 'Lighting'] },
          { title: 'The Lawn', description: 'Sunset ceremonies facing the river.', image: { src: '/images/lawn.jpg', alt: 'Lawn' }, features: ['Outdoor', 'Golden Hour'] },
          { title: 'The Deck', description: 'Cocktail hour with views.', image: { src: '/images/deck.jpg', alt: 'Deck' }, features: ['Covered', 'Bar-ready'] },
        ]}
        layout="grid"
        overlay="none"
        align="start"
        density="normal"
      />
    </main>
  );
}
