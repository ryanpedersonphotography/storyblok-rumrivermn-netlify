/* ========================================================================
   FILE: src/components/clean/CleanStoryblokBridge.tsx  (optional)
   Purpose: Simple live reload while editing in Storyblok Visual Editor
   ======================================================================== */
'use client'
import { useEffect } from 'react'
import { loadStoryblokBridge } from '@storyblok/react'

export default function CleanStoryblokBridge() {
  useEffect(() => {
    loadStoryblokBridge(() => {
      // @ts-ignore
      const sb = new window.StoryblokBridge()
      sb.on(['input', 'published', 'change'], () => location.reload())
    })
  }, [])
  return null
}