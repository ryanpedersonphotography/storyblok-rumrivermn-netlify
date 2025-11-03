/* ========================================================================
   FILE: src/components/clean/CleanStoryblokBridge.tsx
   Purpose: Proper Storyblok Visual Editor bridge
   ======================================================================== */
'use client'
import { useEffect } from 'react'

export default function CleanStoryblokBridge() {
  useEffect(() => {
    // Only load the bridge if we're in development and have the _storyblok parameter
    if (typeof window === 'undefined') return
    
    const urlParams = new URLSearchParams(window.location.search)
    const isStoryblokMode = urlParams.has('_storyblok')
    
    if (!isStoryblokMode) return

    console.log('[Bridge] Loading Storyblok Bridge...')

    // Load the Storyblok Bridge script dynamically
    const script = document.createElement('script')
    script.src = 'https://app.storyblok.com/f/storyblok-v2-latest.js'
    script.onload = () => {
      console.log('[Bridge] Storyblok script loaded')
      
      // Wait for window.StoryblokBridge to be available
      const checkBridge = () => {
        // @ts-ignore
        if (window.StoryblokBridge) {
          console.log('[Bridge] Initializing StoryblokBridge')
          // @ts-ignore
          const bridge = new window.StoryblokBridge()
          
          bridge.on(['input', 'published', 'change'], (payload: any) => {
            console.log('[Bridge] Event received:', payload?.action)
            // Simple reload for now - this will refresh the page with new content
            window.location.reload()
          })
          
          console.log('[Bridge] Bridge initialized successfully')
        } else {
          setTimeout(checkBridge, 100)
        }
      }
      
      checkBridge()
    }
    
    script.onerror = () => {
      console.error('[Bridge] Failed to load Storyblok script')
    }
    
    document.head.appendChild(script)

    // Cleanup
    return () => {
      const existingScript = document.querySelector('script[src="https://app.storyblok.com/f/storyblok-v2-latest.js"]')
      if (existingScript) {
        existingScript.remove()
      }
    }
  }, [])

  return null
}