// ==============================
// File: src/app/clean/layout.tsx
// IMPORTANT: Do NOT render <html> or <body> here (they live in app/layout.*)
// Also import your clean CSS here.
// ==============================
import '@/styles/tokens/theme.css'
import '@/styles/globals.css'
import '@/styles/components/faq.css' // your clean FAQ CSS (adjust path if needed)
import '@/styles/components/hero.css' // clean Hero CSS
import '@/styles/components/footer.css' // clean Footer CSS
import '@/styles/components/alternating-blocks.css' // clean Alternating Blocks CSS
import '@/styles/components/navbar.css' // clean Navbar CSS
import '@/styles/components/experience.css' // clean Experience CSS
import '@/styles/components/spaces.css' // clean Spaces CSS
import '@/styles/components/gallery.css' // clean Gallery CSS
import '@/styles/components/brand-proof.css' // clean Brand Proof CSS
import '@/styles/components/pricing.css' // clean Pricing CSS
import '@/styles/components/schedule-form.css' // clean Schedule Form CSS
import '@/styles/components/map.css' // clean Map CSS
import Navbar from '@/components/clean/Navbar'

export default function CleanLayout({ children }: { children: React.ReactNode }) {
  return (
    <div data-clean-root>
      <Navbar />
      {children}
    </div>
  )
}