'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { StoryblokComponent, loadStoryblokBridge, storyblokInit } from '@storyblok/react'
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

// Initialize Storyblok for client-side rendering
// Use PREVIEW token for draft content in Visual Editor
storyblokInit({
  accessToken: process.env.NEXT_PUBLIC_STORYBLOK_PREVIEW_TOKEN || '',
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
  },
})

interface ClientBridgeProps {
  initialStory: any
}

export default function ClientBridge({ initialStory }: ClientBridgeProps) {
  const [story, setStory] = useState(initialStory)
  const router = useRouter()

  useEffect(() => {
    // Always load the bridge script; it's a no-op outside Visual Editor
    loadStoryblokBridge().then(() => {
      const connect = () => {
        // @ts-ignore
        const SB = (typeof window !== 'undefined') && window.StoryblokBridge
        if (!SB) return setTimeout(connect, 100)

        // @ts-ignore
        const bridge = new window.StoryblokBridge()

        bridge.on(['input', 'change', 'published'], (ev: any) => {
          if (ev?.story) {
            setStory(ev.story)  // instant client update
          }
          router.refresh()      // keep RSC data in sync
        })
      }
      connect()
    })
  }, [router])

  return (
    <div className="home-live-container">
      {story?.content && <StoryblokComponent blok={story.content} />}
    </div>
  )
}
