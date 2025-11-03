// src/app/(migration)/layout.tsx
// Clean room: tokens + primitives + base only. NO legacy imports.

import '@/styles/tokens/theme.css'
import '@/styles/primitives/index.css'
import '@/styles/globals.css'           // ensure this is base-only (no hidden legacy)

export default function MigrationLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}