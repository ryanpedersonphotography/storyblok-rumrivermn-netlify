// src/lib/clean-storyblok.ts
import { storyblokInit, apiPlugin, StoryblokComponent } from '@storyblok/react/rsc'
import {
  default as Page,
} from '@/components/storyblok/Page'
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

// Clean FAQ (client)
import FAQ from '@/components/clean/FAQ'

// guard to avoid double-init in dev HMR
let _initialized = false

export function initCleanStoryblok() {
  if (_initialized) return
  storyblokInit({
    accessToken: process.env.NEXT_PUBLIC_STORYBLOK_PREVIEW_TOKEN || '',
    use: [apiPlugin],
    components: {
      // MUST match the component names in Storyblok EXACTLY:
      page: Page,
      home_hero_section: HeroEditor,                 // ← your missing one
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

      // swap FAQ to clean version now
      faq_accordion: FAQ,
    },
  })
  _initialized = true
}