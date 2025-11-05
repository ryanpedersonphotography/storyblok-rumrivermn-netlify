'use client'

/**
 * StoryblokBridgeLoader - Client Component
 * Only loads Storyblok bridge in preview/development
 * Keeps the visual editor working without impacting production bundle
 */

import { useEffect } from 'react'
import { storyblokInit, apiPlugin } from '@storyblok/react'

export default function StoryblokBridgeLoader() {
  useEffect(() => {
    // Only initialize in development or when in Storyblok editor
    if (typeof window !== 'undefined' && window.location.search.includes('_storyblok')) {
      storyblokInit({
        accessToken: process.env.NEXT_PUBLIC_STORYBLOK_ACCESS_TOKEN,
        use: [apiPlugin],
        components: {
          // Register components for bridge here if needed
          // These would be client components for editing
        },
      })

      // Load the bridge script
      const script = document.createElement('script')
      script.src = '//app.storyblok.com/f/storyblok-v2-latest.js'
      script.async = true
      document.body.appendChild(script)

      return () => {
        document.body.removeChild(script)
      }
    }
  }, [])

  return null
}