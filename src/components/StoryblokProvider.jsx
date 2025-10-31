/* ========================================================================
   UPDATE: src/components/StoryblokProvider.jsx (LEGACY)
   Purpose: Prevent legacy client init from firing on /clean (local fix)
   NOTES:
   - Your current file calls storyblokInit(...) at module scope.
   - Move that init INSIDE the component and SKIP when path starts with /clean.
   ======================================================================== */
// BEFORE (yours): storyblokInit({...}) at top-level
// AFTER (guarded init):
'use client'

import { storyblokInit } from '@storyblok/react'
import { useRef } from 'react'
import { usePathname } from 'next/navigation'

// --- your existing imports preserved ---
import { getStoryblokApi } from '@/lib/storyblok'
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
import FAQAccordionEditor from '@/components/storyblok/FAQAccordionEditor'
import PricingEditor from '@/components/storyblok/PricingEditor'
import FooterEditor from '@/components/storyblok/FooterEditor'
import RealWeddingEditor from '@/components/storyblok/RealWeddingEditor'
import FeaturedWeddingsEditor from '@/components/storyblok/FeaturedWeddingsEditor'
import SpacesEditor from '@/components/storyblok/SpacesEditor'

export default function StoryblokProvider({ children }) {
  const pathname = usePathname()
  const initialized = useRef(false)

  // Skip initializing on /clean — the clean route uses server-side init
  const shouldInitLegacy = !pathname?.startsWith('/clean')

  if (shouldInitLegacy && !initialized.current) {
    storyblokInit({
      accessToken: process.env.NEXT_PUBLIC_STORYBLOK_PREVIEW_TOKEN || '',
      components: {
        page: Page,
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
        faq_accordion: FAQAccordionEditor,
        pricing_section: PricingEditor,
        footer_section: FooterEditor,
        real_wedding: RealWeddingEditor,
        featured_weddings_section: FeaturedWeddingsEditor,
        spaces_section: SpacesEditor,
      },
    })
    initialized.current = true
  }

  // Keep your existing API touch if you need it
  try { getStoryblokApi() } catch {}

  return children
}
// 'use client';

// import { storyblokInit } from '@storyblok/react';
// import { getStoryblokApi } from '@/lib/storyblok';
// import Page from '@/components/storyblok/Page';
// import HeroEditor from '@/components/storyblok/HeroEditor';
// import AlternatingBlocksEditor from '@/components/storyblok/AlternatingBlocksEditor';
// import RumRiverExperienceEditor from '@/components/storyblok/RumRiverExperienceEditor';
// import LoveStoriesGalleryEditor from '@/components/storyblok/LoveStoriesGalleryEditor';
// import BrandSocialProofEditor from '@/components/storyblok/BrandSocialProofEditor';
// import TestimonialsEditor, { TestimonialItem } from '@/components/storyblok/TestimonialsEditor';
// import HistoryCarouselEditor from '@/components/storyblok/HistoryCarouselEditor';
// import ScheduleFormEditor from '@/components/storyblok/ScheduleFormEditor';
// import MapSectionEditor, { LocationItem } from '@/components/storyblok/MapSectionEditor';
// import FAQAccordionEditor from '@/components/storyblok/FAQAccordionEditor';
// import PricingEditor from '@/components/storyblok/PricingEditor';
// import FooterEditor from '@/components/storyblok/FooterEditor';
// import RealWeddingEditor from '@/components/storyblok/RealWeddingEditor';
// import FeaturedWeddingsEditor from '@/components/storyblok/FeaturedWeddingsEditor';
// import SpacesEditor from '@/components/storyblok/SpacesEditor';

// // Initialize Storyblok CLIENT-SIDE components globally
// storyblokInit({
// 	accessToken: process.env.NEXT_PUBLIC_STORYBLOK_PREVIEW_TOKEN || '',
// 	components: {
// 		page: Page,
// 		home_hero_section: HeroEditor,
// 		alternating_blocks_section: AlternatingBlocksEditor,
// 		rum_river_experience: RumRiverExperienceEditor,
// 		love_stories_gallery: LoveStoriesGalleryEditor,
// 		brand_social_proof: BrandSocialProofEditor,
// 		testimonials_section: TestimonialsEditor,
// 		testimonial_item: TestimonialItem,
// 		history_carousel: HistoryCarouselEditor,
// 		history_slide: HistoryCarouselEditor,
// 		schedule_form: ScheduleFormEditor,
// 		map_section: MapSectionEditor,
// 		location_item: LocationItem,
// 		faq_accordion: FAQAccordionEditor,
// 		pricing_section: PricingEditor,
// 		footer_section: FooterEditor,
// 		real_wedding: RealWeddingEditor,
// 		featured_weddings_section: FeaturedWeddingsEditor,
// 		spaces_section: SpacesEditor,
// 	},
// });

// export default function StoryblokProvider({ children }) {
// 	// Initialize the API (required for component registration)
// 	getStoryblokApi();

// 	// Note: Bridge is now loaded on /home-live route only (see ClientBridge.tsx)
// 	// Global bridge loading has been removed to prevent conflicts

// 	return children;
// }
