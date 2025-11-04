// =============================================
// File: src/components/clean/CleanStoryRenderer.tsx
// Client component: initializes Storyblok (non-RSC) and renders the blok tree.
// We KEEP your existing *Editor components* so your stories render NOW,
// but we override specific ones (e.g., faq_accordion) with clean versions.
// =============================================
'use client'

import { storyblokInit, apiPlugin, StoryblokComponent } from '@storyblok/react'

// --- Existing Storyblok editor components (only those still needed)
import Page from '@/components/storyblok/Page'
import HistoryCarouselEditor from '@/components/storyblok/HistoryCarouselEditor'
import { LocationItem } from '@/components/storyblok/MapSectionEditor'
import RealWeddingEditor from '@/components/storyblok/RealWeddingEditor'
import FeaturedWeddingsEditor from '@/components/storyblok/FeaturedWeddingsEditor'

// --- Clean overrides (start swapping here)
import FAQ from '@/components/clean/FAQ'
import Hero from '@/components/clean/Hero'
import Footer from '@/components/clean/Footer'
import AlternatingBlocks from '@/components/clean/AlternatingBlocks'
import Experience from '@/components/clean/Experience'
import BrandProof from '@/components/clean/BrandProof'
import Pricing from '@/components/clean/Pricing'
import Gallery from '@/components/clean/Gallery'
import Spaces from '@/components/clean/Spaces'
import ScheduleForm from '@/components/clean/ScheduleForm'
import Map from '@/components/clean/Map'
import CleanStoryblokBridge from '@/components/clean/CleanStoryblokBridge'


let inited = false
function ensureInit() {
  if (inited) return
  storyblokInit({
    accessToken: process.env.NEXT_PUBLIC_STORYBLOK_PREVIEW_TOKEN || '',
    use: [apiPlugin],
    components: {
      // Keep legacy/editor mappings so the story renders
      page: Page,
      home_hero_section: Hero, // ✅ Clean with migrated CSS
      alternating_blocks_section: AlternatingBlocks, // ✅ Clean with migrated CSS
      rum_river_experience: Experience, // ✅ Clean with migrated CSS
      brand_social_proof: BrandProof, // ✅ Clean with migrated CSS
      pricing_section: Pricing, // ✅ Clean with migrated CSS
      testimonials_section: () => null, // Hidden - not rendering testimonials

      // ✅ Now using clean components with migrated CSS
      love_stories_gallery: Gallery, // ✅ Clean with migrated CSS
      schedule_form: ScheduleForm, // ✅ Clean with migrated CSS
      map_section: Map, // ✅ Clean with migrated CSS
      spaces_section: Spaces, // ✅ Clean with migrated CSS
      location_item: LocationItem, // Keep for nested items

      // Keep these as-is
      history_carousel: HistoryCarouselEditor,
      history_slide: HistoryCarouselEditor,
      footer_section: Footer, // ✅ Clean with migrated CSS
      real_wedding: RealWeddingEditor,
      featured_weddings_section: FeaturedWeddingsEditor,
      faq_accordion: FAQ, // ✅ Clean with migrated CSS
    },
  })
  inited = true
}

export default function CleanStoryRenderer({ story }: { story: any }) {
  ensureInit()

  // Dev mode guardrail: warn if root component isn't mapped
  if (process.env.NODE_ENV !== 'production') {
    const root = story?.content?.component
    const known = new Set(['page', 'home', 'landing_page'])
    if (root && !known.has(root)) {
      console.warn(
        `[Storyblok] ⚠️  Unmapped root component: "${root}". Add it to storyblokInit.components in CleanStoryRenderer.tsx`,
        story.content
      )
    }
  }

  return (
    <>
      <StoryblokComponent blok={story.content} />
      <CleanStoryblokBridge />
    </>
  )
}