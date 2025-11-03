// src/app/(site)/layout.tsx
// Legacy site shell: tokens + primitives + globals + ALL legacy components

// 1) Tokens define @layer order
import '@/styles/tokens/theme.css'

// 2) Primitives for migrated pieces used on the site
import '@/styles/primitives/index.css'

// 3) Base globals (your true base reset/typography)
import '@/styles/globals.css'

// 4) Legacy component CSS (must be layered; see Phase 5)
import '@/styles/components/navbar.css'
import '@/styles/components/experience.css'
import '@/styles/components/spaces.css'
import '@/styles/components/gallery.css'
import '@/styles/components/alternating-blocks.css'
import '@/styles/components/brand-proof.css'
import '@/styles/components/pricing.css'
import '@/styles/components/schedule-form.css'
import '@/styles/components/map.css'
import '@/styles/components/footer.css'
import '@/styles/components/faq.css'
import '@/styles/components/section.css'
import '@/styles/components/section.wrapper.css'
import '@/styles/components/section.legacy-wrapper.css'
import '@/styles/components/section.variants.css'
import '@/styles/components/buttons.css'

import Navbar from '@/components/clean/Navbar'

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      {children}
    </>
  )
}