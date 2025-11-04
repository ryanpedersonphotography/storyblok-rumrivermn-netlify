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
    
    const urlParams = new URLSearchParams(window.location.search)
    const isStoryblokMode = urlParams.has('_storyblok')
    
    if (!isStoryblokMode) return

    console.log('[Bridge] Initializing Storyblok Preview Bridge...')

    // Dynamically import the bridge to avoid SSR issues
    import('@storyblok/preview-bridge')
      .then((module) => {
        const StoryblokBridge = module.default
        
        try {
          const storyblokBridge = new StoryblokBridge()
          
          storyblokBridge.on(['input', 'published', 'change'], (payload: any) => {
            console.log('[Bridge] Event received:', payload?.action, payload)
            
            // For specific background_variant changes, update immediately
            if (payload?.action === 'input' && payload?.story?.content) {
              updateBackgroundVariants(payload.story.content)
            } else {
              // For other changes, still reload the page
              window.location.reload()
            }
          })
          
          console.log('[Bridge] Preview Bridge initialized successfully')
        } catch (error) {
          console.error('[Bridge] Failed to initialize preview bridge:', error)
        }
      })
      .catch((error) => {
        console.error('[Bridge] Failed to load preview bridge module:', error)
        // Fallback to the old bridge if preview-bridge fails
        loadLegacyBridge()
      })
  }, [])

  // Fallback to legacy bridge if preview-bridge fails
  const loadLegacyBridge = () => {
    console.log('[Bridge] Loading legacy Storyblok Bridge...')

    const script = document.createElement('script')
    script.src = 'https://app.storyblok.com/f/storyblok-v2-latest.js'
    script.onload = () => {
      console.log('[Bridge] Legacy Storyblok script loaded')
      
      const checkBridge = () => {
        // @ts-ignore
        if (window.StoryblokBridge) {
          console.log('[Bridge] Initializing legacy StoryblokBridge')
          // @ts-ignore
          const bridge = new window.StoryblokBridge()
          
          bridge.on(['input', 'published', 'change'], (payload: any) => {
            console.log('[Bridge] Legacy event received:', payload?.action)
            // Legacy bridge always reloads the page
            window.location.reload()
          })
          
          console.log('[Bridge] Legacy bridge initialized successfully')
        } else {
          setTimeout(checkBridge, 100)
        }
      }
      
      checkBridge()
    }
    
    script.onerror = () => {
      console.error('[Bridge] Failed to load legacy Storyblok script')
    }
    
    document.head.appendChild(script)
  }

  // Function to update background variants in real-time
  const updateBackgroundVariants = (storyContent: any) => {
    try {
      // Find all elements with background variants and update them
      const updateComponent = (component: any, element?: HTMLElement) => {
        if (!component) return
        
        // Look for background_variant field
        if (component.background_variant) {
          const selector = element || document.querySelector(`[data-blok-uid*="${component._uid}"]`)
          if (selector instanceof HTMLElement) {
            // Look for the closest .section element that has data-bg attribute
            const sectionElement = selector.closest('.section[data-bg]') || 
                                 selector.querySelector('.section[data-bg]') ||
                                 (selector.matches('.section[data-bg]') ? selector : null)
            
            if (sectionElement) {
              // Update the data-bg attribute directly
              sectionElement.setAttribute('data-bg', component.background_variant)
              console.log(`[Bridge] Updated data-bg to: ${component.background_variant}`)
            }
          }
        }
        
        // Recursively check nested components
        if (Array.isArray(component.body)) {
          component.body.forEach((child: any) => updateComponent(child))
        }
        if (Array.isArray(component.blocks)) {
          component.blocks.forEach((child: any) => updateComponent(child))
        }
      }
      
      updateComponent(storyContent)
    } catch (error) {
      console.warn('[Bridge] Error updating background variants:', error)
      // Fallback to reload if real-time update fails
      window.location.reload()
    }
  }

  return null
}