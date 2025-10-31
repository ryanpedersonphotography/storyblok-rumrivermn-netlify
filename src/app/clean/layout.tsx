// ==============================
// File: src/app/clean/layout.tsx
// IMPORTANT: Do NOT render <html> or <body> here (they live in app/layout.*)
// CSS Import Order (CRITICAL for dark mode):
//   1. Tokens (theme.css)
//   2. Utilities (section-presets.css, layout.css)
//   3. Globals (globals.css)
//   4. Components (all component CSS)
// ==============================

// 1. TOKENS - Design tokens (OKLCH colors, surfaces, gradients, accent veils)
import '@/styles/tokens/theme.css'

// 2. UTILITIES - Section presets and layout utilities (@layer utilities)
import '@/styles/system/section-presets.css'
import '@/styles/system/layout.css'

// 3. GLOBALS - Base styles
import '@/styles/globals.css'

// 4. COMPONENTS - Component-specific styles (@layer components)
import '@/styles/components/buttons.css'
import '@/styles/components/section.css'
import '@/styles/components/section.variants.css'
import '@/styles/components/section.wrapper.css'
import '@/styles/components/navbar.css'
import '@/styles/components/hero.css'
import '@/styles/components/experience.css'
import '@/styles/components/spaces.css'
import '@/styles/components/spaces-new.css'
import '@/styles/components/gallery.css'
import '@/styles/components/alternating-blocks.css'
import '@/styles/components/brand-proof.css'
import '@/styles/components/pricing.css'
import '@/styles/components/schedule-form.css'
import '@/styles/components/map.css'
import '@/styles/components/footer.css'
import '@/styles/components/faq.css'

import Navbar from '@/components/clean/Navbar'

export default function CleanLayout({ children }: { children: React.ReactNode }) {
  return (
    <div data-clean-root>
      <Navbar />
      {children}
    </div>
  )
}