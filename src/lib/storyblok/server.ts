/**
 * Server-side Storyblok data layer with caching and revalidation
 * This runs on the server only - no client bundle impact
 */

import { cache } from 'react'

const STORYBLOK_API_URL = 'https://api.storyblok.com/v2/cdn/stories'
const STORYBLOK_TOKEN = process.env.STORYBLOK_ACCESS_TOKEN || ''
const PREVIEW_TOKEN = process.env.STORYBLOK_PREVIEW_TOKEN || ''

interface StoryblokStory {
  story: {
    id: number
    uuid: string
    name: string
    slug: string
    full_slug: string
    content: any
    position: number
    published_at: string | null
    created_at: string
    updated_at: string
    alternates: any[]
    tag_list: string[]
    meta_data: any
  }
  cv: number
  rels: any[]
  links: any[]
}

/**
 * Build Storyblok API URL with proper params
 */
function buildStoryblokUrl(slug: string | string[], isDraft: boolean): string {
  const pathSlug = Array.isArray(slug) ? slug.join('/') : slug
  const token = isDraft ? PREVIEW_TOKEN : STORYBLOK_TOKEN
  const version = isDraft ? 'draft' : 'published'
  
  const params = new URLSearchParams({
    token,
    version,
    cv: Date.now().toString(), // Cache buster for draft mode
  })

  // Handle home page
  const storyPath = pathSlug === '' || pathSlug === '/' ? 'home' : pathSlug
  
  return `${STORYBLOK_API_URL}/${storyPath}?${params.toString()}`
}

/**
 * Fetch a story from Storyblok with caching
 * Uses React cache() for request deduplication within a render
 * Uses fetch next.tags for revalidation
 */
export const getStory = cache(async (
  slug: string | string[], 
  options: { 
    draft?: boolean
  } = {}
): Promise<StoryblokStory | null> => {
  const { draft = false } = options
  const pathSlug = Array.isArray(slug) ? slug.join('/') : slug

  try {
    const url = buildStoryblokUrl(slug, draft)
    
    // Netlify: Use static caching, no ISR
    const res = await fetch(url, {
      cache: draft ? 'no-store' : 'force-cache',
    })

    if (!res.ok) {
      if (res.status === 404) {
        return null
      }
      throw new Error(`Storyblok API error: ${res.status}`)
    }

    return await res.json()
  } catch (error) {
    console.error('Error fetching Storyblok story:', error)
    return null
  }
})

/**
 * Get multiple stories (for lists, navigation, etc)
 */
export const getStories = cache(async (
  options: {
    starts_with?: string
    per_page?: number
    page?: number
    draft?: boolean
  } = {}
): Promise<{ stories: StoryblokStory['story'][] } | null> => {
  const { 
    starts_with = '', 
    per_page = 100, 
    page = 1,
    draft = false
  } = options

  const token = draft ? PREVIEW_TOKEN : STORYBLOK_TOKEN
  const version = draft ? 'draft' : 'published'
  
  const params = new URLSearchParams({
    token,
    version,
    starts_with,
    per_page: per_page.toString(),
    page: page.toString(),
    cv: draft ? Date.now().toString() : '',
  })

  try {
    const res = await fetch(
      `${STORYBLOK_API_URL}?${params.toString()}`,
      {
        cache: draft ? 'no-store' : 'force-cache',
      }
    )

    if (!res.ok) {
      throw new Error(`Storyblok API error: ${res.status}`)
    }

    return await res.json()
  } catch (error) {
    console.error('Error fetching Storyblok stories:', error)
    return null
  }
})

/**
 * Helper to check if we're in Storyblok preview mode
 * This can be called from server components
 */
export function isStoryblokPreview(): boolean {
  // Check for Storyblok preview cookie or query param
  // Implementation depends on your preview setup
  return process.env.NODE_ENV === 'development'
}

/**
 * Generate static params for all stories (for SSG)
 */
export async function generateStoryblokStaticParams() {
  const data = await getStories({
    per_page: 100,
    draft: false,
  })

  if (!data) return []

  return data.stories
    .filter(story => story.slug !== 'home')
    .map(story => ({
      slug: story.full_slug.split('/'),
    }))
}