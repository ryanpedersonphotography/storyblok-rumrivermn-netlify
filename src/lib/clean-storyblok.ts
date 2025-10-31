// // src/lib/clean-storyblok.ts
// import { storyblokInit, apiPlugin } from '@storyblok/react/rsc'

// // === Your existing storyblok components (same paths you already use) ===
// import Page from '@/components/storyblok/Page'
// import HeroEditor from '@/components/storyblok/HeroEditor'
// import AlternatingBlocksEditor from '@/components/storyblok/AlternatingBlocksEditor'
// import RumRiverExperienceEditor from '@/components/storyblok/RumRiverExperienceEditor'
// import LoveStoriesGalleryEditor from '@/components/storyblok/LoveStoriesGalleryEditor'
// import BrandSocialProofEditor from '@/components/storyblok/BrandSocialProofEditor'
// import TestimonialsEditor, { TestimonialItem } from '@/components/storyblok/TestimonialsEditor'
// import HistoryCarouselEditor from '@/components/storyblok/HistoryCarouselEditor'
// import ScheduleFormEditor from '@/components/storyblok/ScheduleFormEditor'
// import MapSectionEditor, { LocationItem } from '@/components/storyblok/MapSectionEditor'
// import PricingEditor from '@/components/storyblok/PricingEditor'
// import FooterEditor from '@/components/storyblok/FooterEditor'
// import RealWeddingEditor from '@/components/storyblok/RealWeddingEditor'
// import FeaturedWeddingsEditor from '@/components/storyblok/FeaturedWeddingsEditor'
// import SpacesEditor from '@/components/storyblok/SpacesEditor'

// // Swap ONLY the FAQ to the clean component for now
// import FAQ from '@/components/clean/FAQ'

// let _initialized = false

// export function initCleanStoryblok(): void {
//   if (_initialized) return
//   storyblokInit({
//     accessToken: process.env.NEXT_PUBLIC_STORYBLOK_PREVIEW_TOKEN || '',
//     use: [apiPlugin],
//     components: {
//       page: Page,
//       home_hero_section: HeroEditor,
//       alternating_blocks_section: AlternatingBlocksEditor,
//       rum_river_experience: RumRiverExperienceEditor,
//       love_stories_gallery: LoveStoriesGalleryEditor,
//       brand_social_proof: BrandSocialProofEditor,
//       testimonials_section: TestimonialsEditor,
//       testimonial_item: TestimonialItem,
//       history_carousel: HistoryCarouselEditor,
//       history_slide: HistoryCarouselEditor,
//       schedule_form: ScheduleFormEditor,
//       map_section: MapSectionEditor,
//       location_item: LocationItem,
//       pricing_section: PricingEditor,
//       footer_section: FooterEditor,
//       real_wedding: RealWeddingEditor,
//       featured_weddings_section: FeaturedWeddingsEditor,
//       spaces_section: SpacesEditor,

//       // Clean migration target:
//       faq_accordion: FAQ,
//     },
//   })
//   _initialized = true
// }

// // Export as default too, so either import style works.
// export default initCleanStoryblok


// src/lib/clean-storyblok.ts
import { storyblokInit, apiPlugin } from '@storyblok/react/rsc'

// ---- Existing Editor components (keep them for now)
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

// ---- Clean components (override one by one)
import FAQ from '@/components/clean/FAQ' // your clean FAQ (client component is fine)

let _inited = false

export function initCleanStoryblok() {
  if (_inited) return

  storyblokInit({
    accessToken: process.env.NEXT_PUBLIC_STORYBLOK_PREVIEW_TOKEN || '',
    use: [apiPlugin],
    components: {
      // base
      page: Page,

      // sections used by "home" story
      home_hero_section: HeroEditor,
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

      // override FAQ to your clean component
      faq_accordion: FAQ,

      pricing_section: PricingEditor,
      footer_section: FooterEditor,
      real_wedding: RealWeddingEditor,
      featured_weddings_section: FeaturedWeddingsEditor,
      spaces_section: SpacesEditor,
    },
  })

  _inited = true
}