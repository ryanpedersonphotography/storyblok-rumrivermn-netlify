// ===============================================================
// FILE: src/components/clean/CleanStoryblokProvider.tsx
// Purpose: Client-side bridge bootstrap (live preview ready)
// ===============================================================
'use client'

import { getStoryblokApi } from '@/lib/clean-storyblok'

export default function CleanStoryblokProvider({ children }: { children: React.ReactNode }) {
  // Re-initialize on the client; enables Visual Editor/bridge later
  getStoryblokApi()
  return children
}