/**
 * Root Layout - Server Component
 * Handles theme via cookies, no client hydration needed for theme
 */

import { cookies } from 'next/headers'
import { playfairDisplay, montserrat, dancingScript } from './fonts'
import ClientThemeToggle from '@/components/theme/ClientThemeToggle'
import StoryblokBridgeLoader from '@/components/storyblok/StoryblokBridgeLoader'

// Import all CSS (stays the same)
import '@/styles/tokens/theme.css'
import '@/styles/tokens/spacing.css'
import '@/styles/primitives/index.css'
import '@/styles/system/section-presets.css'
import '@/styles/system/layout.css'
import '@/styles/globals.css'
import '@/styles/components/buttons.css'
import '@/styles/components/section.css'
import '@/styles/components/section.variants.css'
import '@/styles/components/section.wrapper.css'
import '@/styles/components/navbar.css'
import '@/styles/components/hero.css'
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
import '@/styles/components/glass-toolbar.css'

export const metadata = {
  title: 'Rum River Barn | Wedding Venue',
  description: 'Experience your dream wedding at Rum River Barn, a romantic venue in Minnesota',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Get theme from cookie or system preference
  const cookieStore = cookies()
  const themeCookie = cookieStore.get('theme')
  const brandCookie = cookieStore.get('brand')
  
  // Server-side theme detection
  const theme = themeCookie?.value || 'system'
  const brand = brandCookie?.value || 'romantic'
  
  return (
    <html
      lang="en"
      className={`${playfairDisplay.variable} ${montserrat.variable} ${dancingScript.variable}`}
      data-theme={theme === 'system' ? undefined : theme}
      data-brand={brand}
      suppressHydrationWarning
    >
      <head>
        {/* Inline script to prevent flash - reads cookie immediately */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                function getCookie(name) {
                  const value = '; ' + document.cookie;
                  const parts = value.split('; ' + name + '=');
                  if (parts.length === 2) return parts.pop().split(';').shift();
                }
                
                const theme = getCookie('theme') || 'system';
                const brand = getCookie('brand') || 'romantic';
                
                if (theme === 'system') {
                  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                  document.documentElement.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
                } else {
                  document.documentElement.setAttribute('data-theme', theme);
                }
                
                document.documentElement.setAttribute('data-brand', brand);
              })();
            `,
          }}
        />
      </head>
      <body>
        <div data-clean-root="true">
          {children}
          
          {/* Client island for theme toggle only */}
          <ClientThemeToggle />
          
          {/* Load Storyblok bridge only in development/preview */}
          {process.env.NODE_ENV === 'development' && <StoryblokBridgeLoader />}
        </div>
      </body>
    </html>
  )
}