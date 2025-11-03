// src/app/(site)/layout.tsx
// Site shell: tokens + primitives + globals + recipes (primitives-only, zero legacy CSS)

// 1) Tokens define @layer order
import '@/styles/tokens/theme.css'

// 2) Primitives for migrated pieces used on the site
import '@/styles/primitives/index.css'

// 3) Base globals (your true base reset/typography)
import '@/styles/globals.css'

// 4) Recipes for semantic color/spacing combos
import '@/styles/recipes.css'

import Navbar from '@/components/clean/Navbar'

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      {children}
    </>
  )
}