import React from 'react';
import SpacesPrimitive, { type SpacesPrimitiveProps } from '@/components/primitive/SpacesPrimitive';

type SBImage = { filename?: string; alt?: string; focal_x?: string | number; focal_y?: string | number; };
type SBItem = { title?: string; description?: string; image?: SBImage; features?: { name?: string }[] };

type SpacesBlok = {
  title?: string;
  lead?: string;
  layout?: 'masonry' | 'grid' | 'carousel';
  overlay?: 'none' | 'soft' | 'strong';
  align?: 'start' | 'center' | 'end';
  density?: 'compact' | 'normal' | 'airy';
  items?: SBItem[];
};

export default function Spaces({ blok }: { blok?: SpacesBlok }) {
  const items: SpacesPrimitiveProps['items'] = (blok?.items || []).map(it => ({
    title: it.title || 'Untitled Space',
    description: it.description,
    image: it.image?.filename ? {
      src: it.image.filename,
      alt: it.image.alt || '',
      focalX: String(it.image.focal_x ?? '50%'),
      focalY: String(it.image.focal_y ?? '50%'),
    } : undefined,
    features: (it.features || []).map(f => f?.name || '').filter(Boolean),
  }));

  return (
    <SpacesPrimitive
      title={blok?.title}
      lead={blok?.lead}
      items={items}
      layout={(blok?.layout as SpacesPrimitiveProps['layout']) || 'grid'}
      overlay={(blok?.overlay as SpacesPrimitiveProps['overlay']) || 'none'}
      align={(blok?.align as SpacesPrimitiveProps['align']) || 'start'}
      density={(blok?.density as SpacesPrimitiveProps['density']) || 'normal'}
    />
  );
}
