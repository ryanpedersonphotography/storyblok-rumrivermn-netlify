import { storyblokInit, apiPlugin, getStoryblokApi as getSbApi } from '@storyblok/react/rsc'
import Page from '@/components/storyblok/Page'
import HeroEditor from '@/components/storyblok/HeroEditor'
import AlternatingBlocksEditor from '@/components/storyblok/AlternatingBlocksEditor'
import LoveStoriesGalleryEditor from '@/components/storyblok/LoveStoriesGalleryEditor'
import BrandSocialProofEditor from '@/components/storyblok/BrandSocialProofEditor'
import TestimonialsEditor, { TestimonialItem } from '@/components/storyblok/TestimonialsEditor'
import HistoryCarouselEditor from '@/components/storyblok/HistoryCarouselEditor'
import ScheduleFormEditor from '@/components/storyblok/ScheduleFormEditor'
import MapSectionEditor, { LocationItem } from '@/components/storyblok/MapSectionEditor'
import FooterEditor from '@/components/storyblok/FooterEditor'
import RealWeddingEditor from '@/components/storyblok/RealWeddingEditor'
import FeaturedWeddingsEditor from '@/components/storyblok/FeaturedWeddingsEditor'
import SpacesEditor from '@/components/storyblok/SpacesEditor'

// Initialize Storyblok with component registration
// Use PREVIEW token for draft content access
storyblokInit({
  accessToken: process.env.STORYBLOK_PREVIEW_TOKEN || process.env.STORYBLOK_ACCESS_TOKEN,
  use: [apiPlugin],
  apiOptions: { region: process.env.STORYBLOK_REGION || 'eu' },
  components: {
    page: Page,
    home_hero_section: HeroEditor,
    alternating_blocks_section: AlternatingBlocksEditor,
    love_stories_gallery: LoveStoriesGalleryEditor,
    brand_social_proof: BrandSocialProofEditor,
    testimonials_section: TestimonialsEditor,
    testimonial_item: TestimonialItem,
    history_carousel: HistoryCarouselEditor,
    history_slide: HistoryCarouselEditor,
    schedule_form: ScheduleFormEditor,
    map_section: MapSectionEditor,
    location_item: LocationItem,
    footer_section: FooterEditor,
    real_wedding: RealWeddingEditor,
    featured_weddings_section: FeaturedWeddingsEditor,
    spaces_section: SpacesEditor,
  },
})

// Export API helper
export function getStoryblokApi() {
  return getSbApi()
}

// Fetch story using the SDK with aggressive cache control
export async function fetchStory(slug: string, version: 'draft' | 'published') {
  const { data } = await getStoryblokApi().get(`cdn/stories/${slug}`, {
    version,
    // Disable caching for draft content (Visual Editor)
    cv: version === 'draft' ? Date.now() : undefined,
  })
  return data.story
}

// Fetch multiple stories with filtering and sorting
export async function fetchStories(params: any) {
  const { data } = await getStoryblokApi().get('cdn/stories', {
    version: params.version || 'published',
    ...params,
  })
  return data.stories
}
