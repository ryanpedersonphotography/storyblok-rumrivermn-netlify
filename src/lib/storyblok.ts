import { storyblokInit, apiPlugin, getStoryblokApi as getSbApi } from '@storyblok/react/rsc'
import Page from '@/components/storyblok/Page'
import HeroEditor from '@/components/storyblok/HeroEditor'
import AlternatingBlocksEditor from '@/components/storyblok/AlternatingBlocksEditor'

// Initialize Storyblok with component registration
storyblokInit({
  accessToken: process.env.STORYBLOK_PUBLIC_TOKEN || process.env.STORYBLOK_ACCESS_TOKEN,
  use: [apiPlugin],
  apiOptions: { region: process.env.STORYBLOK_REGION || 'eu' },
  components: {
    page: Page,
    home_hero_section: HeroEditor,
    alternating_blocks_section: AlternatingBlocksEditor,
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