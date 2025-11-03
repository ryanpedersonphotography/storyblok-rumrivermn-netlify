import React from 'react';

export type SpacesPrimitiveProps = {
  title?: string;
  lead?: string;
  items: Array<{
    title: string;
    description?: string;
    image?: { src: string; alt?: string; focalX?: string; focalY?: string };
    features?: string[];
  }>;
  layout?: 'masonry' | 'grid' | 'carousel';
  overlay?: 'none' | 'soft' | 'strong';
  align?: 'start' | 'center' | 'end';
  density?: 'compact' | 'normal' | 'airy';
};

export default function SpacesPrimitive({
  title,
  lead,
  items,
  layout = 'grid',
  overlay = 'none',
  align = 'start',
  density = 'normal',
}: SpacesPrimitiveProps) {
  return (
    <section data-section="spaces" data-density={density} data-overlay={overlay}>
      <div className="section__inner stack gap-6" data-container="lg" style={{ textAlign: align === 'center' ? 'center' : align === 'end' ? 'right' : 'left' }}>
        {title && <h2 data-ui="heading" data-size="lg">{title}</h2>}
        {lead && <p data-ui="text" data-size="md">{lead}</p>}
        <div data-layout={layout} className="grid" style={{ gap: 'var(--space-20)' }}>
          {items.map((it, i) => (
            <article key={i} className="card stack" data-card data-hover>
              {it.image?.src && (
                <div className="media" style={{
                  aspectRatio: '16 / 9',
                  background: `url(${it.image.src}) center / cover no-repeat`
                }} aria-label={it.image.alt || it.title} />
              )}
              <div className="stack gap-2" style={{ padding: 'var(--space-16)' }}>
                <h3 data-ui="heading" data-size="md">{it.title}</h3>
                {it.description && <p data-ui="text" data-size="sm">{it.description}</p>}
                {it.features?.length ? (
                  <ul className="inline" style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-8)', padding: 0, margin: 0, listStyle: 'none' }}>
                    {it.features.map((f, idx) => (
                      <li key={idx} className="badge" data-ui="badge">{f}</li>
                    ))}
                  </ul>
                ) : null}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
