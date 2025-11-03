/* ========================================================================
   Enhanced Storyblok Editable - Forces inline editing attributes
   ======================================================================== */

import { storyblokEditable } from '@storyblok/react/rsc'

export function storyblokEditableEnhanced(blok: any) {
  // Get the standard editable attributes
  const editableProps = storyblokEditable(blok)
  
  // Check if we're in Storyblok preview mode
  const isPreviewMode = typeof window !== 'undefined' && 
    (window.location.search.includes('_storyblok=') || 
     window.location.search.includes('_storyblok_tk='))
  
  // If we have blok data and we're in preview mode, ensure editing attributes are present
  if (blok && (isPreviewMode || process.env.NODE_ENV === 'development')) {
    return {
      ...editableProps,
      'data-blok-c': JSON.stringify({
        name: blok.component || 'unknown',
        space: blok.space || '288003424841711',
        uid: blok._uid || '',
        id: blok.id || ''
      }),
      'data-blok-uid': `${blok.id || ''}-${blok._uid || ''}`
    }
  }
  
  return editableProps
}