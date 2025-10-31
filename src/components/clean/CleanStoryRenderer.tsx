// =============================================
// File: src/components/clean/CleanStoryRenderer.tsx
// Client component: initializes Storyblok (non-RSC) and renders the blok tree.
// We KEEP your existing *Editor components* so your stories render NOW,
// but we override specific ones (e.g., faq_accordion) with clean versions.
// =============================================
'use client'

import { storyblokInit, apiPlugin, StoryblokComponent } from '@storyblok/react'

// --- Existing Storyblok editor components (so everything keeps working)
import Page from '@/components/storyblok/Page'
import HeroEditor from '@/components/storyblok/HeroEditor'
import AlternatingBlocksEditor from '@/components/storyblok/AlternatingBlocksEditor'
import RumRiverExperienceEditor from '@/components/storyblok/RumRiverExperienceEditor'
import LoveStoriesGalleryEditor from '@/components/storyblok/LoveStoriesGalleryEditor'
import BrandSocialProofEditor from '@/components/storyblok/BrandSocialProofEditor'
import TestimonialsEditor, { TestimonialItem } from '@/components/storyblok/TestimonialsEditor'
import HistoryCarouselEditor from '@/components/storyblok/HistoryCarouselEditor'
import ScheduleFormEditor from '@/components/storyblok/ScheduleFormEditor'
import MapSectionEditor, { LocationItem } from '@/components/storyblok/MapSectionEditor'
import PricingEditor from '@/components/storyblok/PricingEditor'
import FooterEditor from '@/components/storyblok/FooterEditor'
import RealWeddingEditor from '@/components/storyblok/RealWeddingEditor'
import FeaturedWeddingsEditor from '@/components/storyblok/FeaturedWeddingsEditor'
import SpacesEditor from '@/components/storyblok/SpacesEditor'

// --- Clean overrides (start swapping here)
import FAQ from '@/components/clean/FAQ' // your clean FAQ TSX that uses semantic CSS
import Hero from '@/components/clean/Hero' // clean Hero component


let inited = false
function ensureInit() {
  if (inited) return
  storyblokInit({
    accessToken: process.env.NEXT_PUBLIC_STORYBLOK_PREVIEW_TOKEN || '',
    use: [apiPlugin],
    components: {
      // Keep legacy/editor mappings so the story renders
      page: Page,
      home_hero_section: Hero, // Override to clean Hero
      alternating_blocks_section: AlternatingBlocksEditor,
      rum_river_experience: RumRiverExperienceEditor,
      love_stories_gallery: LoveStoriesGalleryEditor,
      brand_social_proof: BrandSocialProofEditor,
      testimonials_section: TestimonialsEditor,
      testimonial_item: TestimonialItem,
      history_carousel: HistoryCarouselEditor,
      history_slide: HistoryCarouselEditor,
      schedule_form: ScheduleFormEditor,
      map_section: MapSectionEditor,
      location_item: LocationItem,
      pricing_section: PricingEditor,
      footer_section: FooterEditor,
      real_wedding: RealWeddingEditor,
      featured_weddings_section: FeaturedWeddingsEditor,
      spaces_section: SpacesEditor,

      // Clean override(s) — this replaces the existing FAQAccordionEditor for /clean
      faq_accordion: FAQ,
    },
  })
  inited = true
}

export default function CleanStoryRenderer({ story }: { story: any }) {
  ensureInit()
  return <StoryblokComponent blok={story.content} />
}