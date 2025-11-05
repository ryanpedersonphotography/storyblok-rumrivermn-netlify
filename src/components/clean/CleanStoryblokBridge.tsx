/* ========================================================================
   FILE: src/components/clean/CleanStoryblokBridge.tsx
   Purpose: Storyblok Visual Editor bridge with real-time preview
   ======================================================================== */
'use client'
import { useEffect } from 'react'

export default function CleanStoryblokBridge() {
  useEffect(() => {
    // Only load the bridge if we're in Storyblok preview mode
    if (typeof window === 'undefined') return
    
    const isStoryblokMode = window.location.search.includes('_storyblok')
    if (!isStoryblokMode) return

    console.log('[Bridge] Initializing Storyblok Preview...')

    // Dynamically import the bridge to avoid SSR issues
    import('@storyblok/preview-bridge')
      .then(({ default: StoryblokBridge }) => {
        const bridge = new StoryblokBridge()
        bridge.on(['input', 'published'], ({ action, story }) => {
          if (action === 'input' && story?.content) {
            updateBackgroundVariants(story.content)
          } else {
            window.location.reload()
          }
        })
      })
      .catch(() => loadLegacyBridge())
  }, [])

  // Fallback to legacy bridge if preview-bridge fails
  const loadLegacyBridge = () => {
    const script = document.createElement('script')
    script.src = 'https://app.storyblok.com/f/storyblok-v2-latest.js'
    script.onload = () => {
      const init = () => {
        if (window.StoryblokBridge) {
          const bridge = new window.StoryblokBridge()
          bridge.on(['input', 'published'], () => window.location.reload())
        } else setTimeout(init, 100)
      }
      init()
    }
    document.head.appendChild(script)
  }

  // Function to update background variants in real-time
  const updateBackgroundVariants = (content: any) => {
    try {
      const update = (component: any) => {
        if (component.background_variant) {
          const el = document.querySelector(`[data-blok-uid="${component._uid}"]`)
          const section = el?.closest('.section[data-bg]')
          if (section) section.setAttribute('data-bg', component.background_variant)
        }
        
        ;['body', 'blocks'].forEach(key => {
          if (Array.isArray(component[key])) {
            component[key].forEach(update)
          }
        })
      }
      update(content)
    } catch {
      window.location.reload()
    }
  }

  return null
}