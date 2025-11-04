'use client'

import { storyblokInit } from '@storyblok/react'
import { useRef } from 'react'
import { usePathname } from 'next/navigation'
import { getStoryblokApi } from '@/lib/storyblok'

// Import CLEAN components for main route
import Hero from '@/components/clean/Hero'
import AlternatingBlocks from '@/components/clean/AlternatingBlocks'
import Experience from '@/components/clean/Experience'
import Gallery from '@/components/clean/Gallery'
import BrandProof from '@/components/clean/BrandProof'
import FAQ from '@/components/clean/FAQ'
import Pricing from '@/components/clean/Pricing'
import Footer from '@/components/clean/Footer'
import Spaces from '@/components/clean/Spaces'
import ScheduleForm from '@/components/clean/ScheduleForm'
import Map from '@/components/clean/Map'

// Import legacy/editor components for other routes
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

  // CRITICAL: Use clean components on main route (/) to prevent conflicts
  const isMainRoute = pathname === '/'
  
  if (!initialized.current) {
    if (isMainRoute) {
      // Main route: Use CLEAN components to match CleanStoryRenderer
      storyblokInit({
        accessToken: process.env.NEXT_PUBLIC_STORYBLOK_PREVIEW_TOKEN || '',
        components: {
          page: Page,
          home_hero_section: Hero, // Clean
          alternating_blocks_section: AlternatingBlocks, // Clean
          rum_river_experience: Experience, // Clean
          love_stories_gallery: Gallery, // Clean
          brand_social_proof: BrandProof, // Clean
          testimonials_section: () => null, // Hidden
          history_carousel: HistoryCarouselEditor, // Keep editor for now
          schedule_form: ScheduleForm, // Clean
          map_section: Map, // Clean
          spaces_section: Spaces, // Clean
          faq_accordion: FAQ, // Clean
          pricing_section: Pricing, // Clean
          footer_section: Footer, // Clean
          
          // Nested items
          location_item: LocationItem,
          testimonial_item: TestimonialItem,
          history_slide: HistoryCarouselEditor,
          real_wedding: RealWeddingEditor,
          featured_weddings_section: FeaturedWeddingsEditor,
        },
      })
    } else {
      // Other routes: Use editor components
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
    }
    initialized.current = true
  }

  // Keep your existing API touch if you need it
  try { getStoryblokApi() } catch {}

  return children
}