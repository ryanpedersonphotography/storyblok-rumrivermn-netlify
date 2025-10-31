// ==============================
// File: src/app/clean/layout.tsx
// IMPORTANT: Do NOT render <html> or <body> here (they live in app/layout.*)
// Also import your clean CSS here.
// ==============================
import '@/styles/tokens/theme.css'
import '@/styles/globals.css'
import '@/styles/components/faq.css' // your clean FAQ CSS (adjust path if needed)

export default function CleanLayout({ children }: { children: React.ReactNode }) {
  return <div data-clean-root>{children}</div>
}