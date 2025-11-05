// FILE: src/components/clean/Gallery.tsx
'use client'

import Image from 'next/image'
import { useEffect, useMemo, useState, type HTMLAttributes } from 'react'
import { storyblokEditable } from '@storyblok/react/rsc'
import Section from '@/components/ui/SectionEnhanced'
import WeddingGalleryModal from '@/components/gallery/WeddingGalleryModal'

type GalleryItemBlok = Record<string, any>

const PLACEHOLDER_IMAGE = '/wedding-photos/placeholder.jpg'

const FALLBACK_GALLERIES: Array<{ couple: string; season: string; image: string; alt: string; href?: string }> = [
  {
    couple: 'Anthony & Linnea',
    season: 'Summer 2024',
    image: 'https://a.storyblok.com/f/288003424841711/177cb56979/anthony-linnea-wedding.jpg',
    alt: 'Anthony & Linnea at Rum River Barn',
    href: '/real-weddings/anthony-and-linnea'
  },
  {
    couple: 'Loria & Jason Rolstad',
    season: 'Summer 2024',
    image: 'https://a.storyblok.com/f/288003424841711/399bb3279c/loria-jason-wedding-final.jpg',
    alt: 'Loria & Jason Rolstad at Rum River Barn',
    href: '/real-weddings/loria-and-jason-rolstad'
  },
  {
    couple: 'Mattea Courtney',
    season: 'Summer 2024',
    image: 'https://a.storyblok.com/f/288003424841711/0d38f0a59c/mattea-courtney-wedding-final.jpg',
    alt: 'Mattea Courtney at Rum River Barn',
    href: '/real-weddings/mattea-courtney'
  },
  {
    couple: 'Kyle Carrie',
    season: 'Summer 2024',
    image: 'https://a.storyblok.com/f/288003424841711/da0775fb6b/kyle-carrie-wedding-final.jpg',
    alt: 'Kyle Carrie at Rum River Barn',
    href: '/real-weddings/kyle-carrie'
  },
  {
    couple: 'Emily & Barron Nixon',
    season: 'Summer 2024',
    image: 'https://a.storyblok.com/f/288003424841711/ef2dda951e/emily-barron-wedding-final.jpg',
    alt: 'Emily & Barron Nixon at Rum River Barn',
    href: '/real-weddings/emily-barron-nixon'
  },
  {
    couple: 'Joshua & Teri',
    season: 'Summer 2024',
    image: 'https://a.storyblok.com/f/288003424841711/ec400a08f8/joshua-teri-wedding-final.jpg',
    alt: 'Joshua & Teri at Rum River Barn',
    href: '/real-weddings/joshua-teri'
  }
]

function resolveImage(gallery: GalleryItemBlok, weddingStory: any): string {
  if (gallery.card_cover_image) {
    return typeof gallery.card_cover_image === 'string'
      ? gallery.card_cover_image
      : gallery.card_cover_image?.filename || PLACEHOLDER_IMAGE
  }

  if (gallery.image) {
    return typeof gallery.image === 'string'
      ? gallery.image
      : gallery.image?.filename || PLACEHOLDER_IMAGE
  }

  if (weddingStory?.content?.hero_image) {
    return typeof weddingStory.content.hero_image === 'string'
      ? weddingStory.content.hero_image
      : weddingStory.content.hero_image?.filename || PLACEHOLDER_IMAGE
  }

  if (weddingStory?.content?.gallery_photos?.[0]) {
    const firstPhoto = weddingStory.content.gallery_photos[0]
    return firstPhoto.filename || firstPhoto || PLACEHOLDER_IMAGE
  }

  return PLACEHOLDER_IMAGE
}

function buildModalData(gallery: GalleryItemBlok, weddingStory: any) {
  return {
    title: gallery.modal_title || weddingStory?.content?.title || gallery.couple_names || 'Wedding',
    wedding_date: gallery.modal_date || weddingStory?.content?.wedding_date || gallery.season || '',
    location: gallery.modal_location || weddingStory?.content?.location || gallery.venue || 'Rum River Barn',
    gallery_photos: weddingStory?.content?.gallery_photos || []
  }
}

export default function Gallery({ blok }: { blok?: any } = {}) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedWedding, setSelectedWedding] = useState<any>(null)
  const [weddingStories, setWeddingStories] = useState<Map<string, any>>(new Map())
  const [fetchError, setFetchError] = useState(false)

  const galleries: GalleryItemBlok[] | null = Array.isArray(blok?.galleries) && blok.galleries.length > 0
    ? blok.galleries
    : null

  const linkedUUIDKey = useMemo(() => {
    if (!galleries) return ''
    const unique = new Set<string>()
    galleries.forEach((gallery) => {
      if (typeof gallery?.wedding_story === 'string' && gallery.wedding_story.trim().length > 0) {
        unique.add(gallery.wedding_story.trim())
      }
    })
    return Array.from(unique).join('|')
  }, [galleries])

  useEffect(() => {
    if (!linkedUUIDKey) {
      setWeddingStories(new Map())
      setFetchError(false)
      return
    }

    const controller = new AbortController()
    const uuids = linkedUUIDKey.split('|').filter(Boolean)
    const version = blok?._editable || process.env.NODE_ENV !== 'production' ? 'draft' : 'published'

    async function fetchStories() {
      try {
        const results = await Promise.all(
          uuids.map(async (uuid) => {
            try {
              const response = await fetch(`/api/storyblok-story?uuid=${uuid}&version=${version}`, {
                signal: controller.signal
              })

              if (!response.ok) {
                console.warn(`[Gallery] Failed to fetch wedding ${uuid}: ${response.status}`)
                return null
              }

              const story = await response.json()
              return { uuid, story }
            } catch (error) {
              if ((error as Error).name !== 'AbortError') {
                console.error(`[Gallery] Error fetching wedding ${uuid}:`, error)
              }
              return null
            }
          })
        )

        if (!controller.signal.aborted) {
          const map = new Map<string, any>()
          results.forEach((result) => {
            if (result?.story) {
              map.set(result.uuid, result.story)
            }
          })
          setWeddingStories(map)
          setFetchError(results.every((result) => !result))
        }
      } catch (error) {
        if ((error as Error).name !== 'AbortError') {
          console.error('[Gallery] Unexpected error fetching weddings:', error)
          setFetchError(true)
        }
      }
    }

    fetchStories()

    return () => {
      controller.abort()
    }
  }, [linkedUUIDKey, blok?._editable])

  const handleOpenModal = (gallery: GalleryItemBlok, weddingStory: any) => {
    setSelectedWedding(buildModalData(gallery, weddingStory))
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedWedding(null)
  }

  const sectionTitle = blok?.title || 'Weddings at the Barn'
  const sectionSubtitle = blok?.script_accent || 'Real Love Stories'
  const sectionDescription = blok?.description || 'Every celebration tells a unique story of love, laughter, and happily ever after.'

  const hasStoryblokGalleries = Boolean(galleries)

  const headerSlotProps: HTMLAttributes<HTMLElement> = useMemo(
    () => ({ style: { scrollMarginTop: '80px' } }),
    []
  )

  const contentSlotProps: HTMLAttributes<HTMLElement> = useMemo(
    () => ({ 'aria-label': 'Wedding gallery showcase' }),
    []
  )

  return (
    <>
      <Section
        id="gallery"
        as="section"
        align="center"
        contentWrapper={true}
        paddingY="lg"
        background={blok?.background_variant || 'surface'}
        tone={blok?.theme_override || 'auto'}
        header={{
          scriptAccent: sectionSubtitle,
          title: sectionTitle,
          lead: sectionDescription,
          align: 'center'
        }}
        headerSlotProps={headerSlotProps}
        contentSlotProps={contentSlotProps}
        className="love-stories-gallery"
        data-section="gallery"
        variant={blok?.section_variant || 'gallery-rose-grid'}
        {...(blok ? storyblokEditable(blok) : {})}
      >
        <div className="wedding-gallery" data-anim="stagger" data-fetch-error={fetchError ? 'true' : undefined}>
          {hasStoryblokGalleries
            ? galleries!.map((gallery, index) => {
                const uuid = typeof gallery.wedding_story === 'string' ? gallery.wedding_story : ''
                const weddingStory = uuid ? weddingStories.get(uuid) : null
                const imageUrl = resolveImage(gallery, weddingStory)
                const cardTitle = gallery.card_title || weddingStory?.content?.title || gallery.couple_names || 'Wedding'
                const cardSubtitle = gallery.card_subtitle || weddingStory?.content?.wedding_date || gallery.season || ''
                const cardLocation = gallery.card_location || weddingStory?.content?.location || gallery.venue || ''
                const photos = weddingStory?.content?.gallery_photos?.length || gallery.photo_count || 0
                const detailHref = (typeof gallery.href === 'string' && gallery.href.trim().length > 0)
                  ? gallery.href
                  : weddingStory?.full_slug
                    ? `/${weddingStory.full_slug}`
                    : '#'
                const canOpenModal = Boolean(uuid)
                const isLoadingStory = Boolean(uuid && !weddingStory)

                return (
                  <a
                    key={gallery._uid || index}
                    className="gallery-item"
                    href={detailHref}
                    aria-label={`${cardTitle}${cardSubtitle ? ` — ${cardSubtitle}` : ''}`}
                    data-testid="gallery-item"
                    onClick={(event) => {
                      if (canOpenModal) {
                        event.preventDefault()
                        handleOpenModal(gallery, weddingStory)
                      }
                    }}
                    onKeyDown={(event) => {
                      if (!canOpenModal) return
                      if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault()
                        handleOpenModal(gallery, weddingStory)
                      }
                    }}
                    data-state={isLoadingStory ? 'loading' : undefined}
                    style={{ cursor: canOpenModal ? 'pointer' : 'default', opacity: isLoadingStory ? 0.85 : 1 }}
                    {...(gallery._uid ? storyblokEditable(gallery) : {})}
                  >
                    <Image
                      src={imageUrl}
                      alt={`${cardTitle}${cardLocation ? ` at ${cardLocation}` : ''}`.trim()}
                      width={800}
                      height={800}
                      loading="lazy"
                      decoding="async"
                      sizes="(min-width:1024px) 25vw, (min-width:768px) 33vw, 100vw"
                    />
                    <div className="gallery-overlay" aria-hidden="true">
                      <div className="gallery-couple-names">{cardTitle}</div>
                      <div className="gallery-season">{cardSubtitle}</div>
                      <div className="gallery-details">
                        {canOpenModal
                          ? photos > 0
                            ? `${photos} Photos • View Gallery →`
                            : 'View Gallery →'
                          : cardLocation}
                      </div>
                    </div>
                  </a>
                )
              })
            : FALLBACK_GALLERIES.map((wedding, index) => (
                <a
                  key={`${wedding.couple}-${index}`}
                  className="gallery-item"
                  href={wedding.href || '#'}
                  aria-label={`${wedding.couple}${wedding.season ? ` — ${wedding.season}` : ''}`}
                  data-testid="gallery-item"
                >
                  <Image
                    src={wedding.image}
                    alt={wedding.alt}
                    width={800}
                    height={800}
                    loading="lazy"
                    decoding="async"
                    sizes="(min-width:1024px) 25vw, (min-width:768px) 33vw, 100vw"
                  />
                  <div className="gallery-overlay" aria-hidden="true">
                    <div className="gallery-couple-names">{wedding.couple}</div>
                    <div className="gallery-season">{wedding.season}</div>
                    <div className="gallery-details">View Gallery →</div>
                  </div>
                </a>
              ))}
        </div>
      </Section>

      <WeddingGalleryModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        wedding={selectedWedding}
        variant="standard"
      />
    </>
  )
}
