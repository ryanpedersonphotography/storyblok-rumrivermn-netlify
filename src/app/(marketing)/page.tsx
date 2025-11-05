/**
 * Home Page - Server Component
 * Fetches data on the server, renders with RSC
 * Only interactive islands use client components
 */

import { draftMode } from 'next/headers'
import { getStory } from '@/lib/storyblok/server'
import HeroShell from '@/components/hero/HeroShell'
import ClientHeroMotion from '@/components/hero/ClientHeroMotion'

// Force static generation for Netlify
export const dynamic = 'force-static'
export const dynamicParams = true

// Generate metadata on the server
export async function generateMetadata() {
  const { isEnabled } = draftMode()
  const data = await getStory('home', { draft: isEnabled })
  
  const story = data?.story
  const seo = story?.content?.seo || {}

  return {
    title: seo.title || 'Rum River Wedding Barn | Minnesota Wedding Venue',
    description: seo.description || 'Experience your dream wedding at Rum River Barn, a romantic venue in Minnesota',
    openGraph: {
      title: seo.og_title || seo.title,
      description: seo.og_description || seo.description,
      images: seo.og_image ? [{ url: seo.og_image }] : [],
    },
  }
}

export default async function HomePage() {
  const { isEnabled } = draftMode()
  const data = await getStory('home', { draft: isEnabled })

  if (!data) {
    return <div>Story not found</div>
  }

  const { story } = data
  const content = story.content

  // Extract component data from Storyblok content
  const heroData = content.body?.find((blok: any) => blok.component === 'Hero') || content

  return (
    <>
      {/* Server-rendered hero shell */}
      <HeroShell data={heroData} />
      
      {/* Client-side scroll button (tiny bundle) */}
      <ClientHeroMotion scrollText={heroData.scroll_text} />

      {/* Add other sections here as RSC with client islands as needed */}
    </>
  )
}