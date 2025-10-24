'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { StoryblokComponent, loadStoryblokBridge, storyblokInit } from '@storyblok/react'
import Page from '@/components/storyblok/Page'
import HeroEditor from '@/components/storyblok/HeroEditor'
import AlternatingBlocksEditor from '@/components/storyblok/AlternatingBlocksEditor'

// Initialize Storyblok for client-side rendering
storyblokInit({
  accessToken: process.env.NEXT_PUBLIC_STORYBLOK_ACCESS_TOKEN,
  components: {
    page: Page,
    home_hero_section: HeroEditor,
    alternating_blocks_section: AlternatingBlocksEditor,
  },
})

interface ClientBridgeProps {
  initialStory: any
}

export default function ClientBridge({ initialStory }: ClientBridgeProps) {
  const [story, setStory] = useState(initialStory)
  const router = useRouter()

  useEffect(() => {
    // Only load bridge when inside Visual Editor (when _storyblok param is present)
    const isInEditor = typeof window !== 'undefined' &&
                       window.location.search.includes('_storyblok')

    if (!isInEditor) return

    // Load the bridge script, then connect
    loadStoryblokBridge().then(() => {
      const connect = () => {
        // @ts-ignore
        if (!window.StoryblokBridge) {
          setTimeout(connect, 100)
          return
        }

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
