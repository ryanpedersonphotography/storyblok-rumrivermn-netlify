// FILE: src/components/clean/Gallery.tsx
'use client'

import Section from '@/components/ui/Section'

type WeddingItem = {
  couple: string
  season: string
  image: string
  alt: string
  href?: string
}

export default function Gallery({ blok }: { blok?: any } = {}) {
  const weddings: WeddingItem[] = [
    {
      couple: 'Anthony & Linnea',
      season: 'Summer 2024',
      image: 'https://a.storyblok.com/f/288003424841711/177cb56979/anthony-linnea-wedding.jpg',
      alt: 'Anthony & Linnea at Rum River Barn',
      href: '#'
    },
    {
      couple: 'Loria & Jason Rolstad',
      season: 'Summer 2024',
      image: 'https://a.storyblok.com/f/288003424841711/399bb3279c/loria-jason-wedding-final.jpg',
      alt: 'Loria & Jason Rolstad at Rum River Barn',
      href: '#'
    },
    {
      couple: 'Mattea Courtney',
      season: 'Summer 2024',
      image: 'https://a.storyblok.com/f/288003424841711/0d38f0a59c/mattea-courtney-wedding-final.jpg',
      alt: 'Mattea Courtney at Rum River Barn',
      href: '#'
    },
    {
      couple: 'Kyle Carrie',
      season: 'Summer 2024',
      image: 'https://a.storyblok.com/f/288003424841711/da0775fb6b/kyle-carrie-wedding-final.jpg',
      alt: 'Kyle Carrie at Rum River Barn',
      href: '#'
    },
    {
      couple: 'Emily & Barron Nixon',
      season: 'Summer 2024',
      image: 'https://a.storyblok.com/f/288003424841711/ef2dda951e/emily-barron-wedding-final.jpg',
      alt: 'Emily & Barron Nixon at Rum River Barn',
      href: '#'
    },
    {
      couple: 'Joshua & Teri',
      season: 'Summer 2024',
      image: 'https://a.storyblok.com/f/288003424841711/ec400a08f8/joshua-teri-wedding-final.jpg',
      alt: 'Joshua & Teri at Rum River Barn',
      href: '#'
    }
  ]

  const title = 'Weddings at the Barn'
  const subtitle = 'Real Love Stories'
  const description = 'Every celebration tells a unique story of love, laughter, and happily ever after.'

  return (
    <Section
      id="gallery"
      as="section"
      align="center"
      headerWidth="prose"
      contentWidth="wide"
      paddingY="lg"
      background="surface"
      header={{
        scriptAccent: subtitle,
        title: title,
        lead: description,
        align: 'center'
      }}
      className="love-stories-gallery"
      data-section="gallery"
    >
      <div className="wedding-gallery">
        {weddings.map((w, i) => (
          <a
            key={`${w.couple}-${i}`}
            className="gallery-item"
            href={w.href || '#'}
            aria-label={`${w.couple}${w.season ? ` — ${w.season}` : ''}`}
            data-testid="gallery-item"
          >
            <img
              src={w.image}
              alt={w.alt}
              width={800}
              height={800}
              loading="lazy"
              decoding="async"
              // basic sizes for the 4→1 column responsive grid
              sizes="(min-width:1024px) 25vw, (min-width:768px) 33vw, 100vw"
            />
            <div className="gallery-overlay" aria-hidden="true">
              <div className="gallery-couple-names">{w.couple}</div>
              <div className="gallery-season">{w.season}</div>
              <div className="gallery-details"></div>
            </div>
          </a>
        ))}
      </div>
    </Section>
  )
}
