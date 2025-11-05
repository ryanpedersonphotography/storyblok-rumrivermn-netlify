// Server-side init for the /clean route
import { storyblokInit, apiPlugin } from '@storyblok/react/rsc'
import dynamic from 'next/dynamic'
import type { ReactNode } from 'react'
import { StoryblokComponent } from '@storyblok/react/rsc'

// ✅ Client component (accordion) must be loaded dynamically in RSC:
const FAQ = dynamic(() => import('@/components/clean/FAQ'), { ssr: false })

// ✅ Minimal server component that renders nested body:
function CleanPage({ blok }: { blok: any }) {
  const body = Array.isArray(blok?.body) ? blok.body : []
  return (
    <main>
      {body.map((nested: any) => {
        return <StoryblokComponent blok={nested} key={nested._uid} />
      })}
    </main>
  )
}

// ✅ Safe no-op for not-yet-migrated blocks:
function Null({ children }: { children?: ReactNode }) {
  return null
}

// Keep a single init
let _inited = false
export function initCleanStoryblokRsc() {
  if (_inited) return

  storyblokInit({
    accessToken: process.env.NEXT_PUBLIC_STORYBLOK_PREVIEW_TOKEN ?? '',
    use: [apiPlugin],
    components: {
      // 🔹 REQUIRED TOP-LEVEL
      page: CleanPage,

      // 🔹 CLEAN components you’ve migrated
      faq_accordion: FAQ,

      // 🔹 TEMP placeholders for everything else used on "home"
      home_hero_section: Null,
      alternating_blocks_section: Null,
      rum_river_experience: Null,
      love_stories_gallery: Null,
      brand_social_proof: Null,
      testimonials_section: Null,
      testimonial_item: Null,
      history_carousel: Null,
      history_slide: Null,
      schedule_form: Null,
      map_section: Null,
      location_item: Null,
      pricing_section: Null,
      footer_section: Null,
      real_wedding: Null,
      featured_weddings_section: Null,
      spaces_section: Null,
    },
  })

  _inited = true
}
