// src/app/layout.tsx
// Root layout: tokens + primitives + globals + recipes + providers

// 1) Tokens define @layer order
import '@/styles/tokens/theme.tokens.v3.css'

// 2) Primitives for components
import '@/styles/primitives/index.css'

// 3) Base globals (reset/typography)
import '@/styles/globals.css'

// 4) Recipes for semantic color/spacing combos
import '@/styles/recipes.css'

import StoryblokProvider from '@/components/StoryblokProvider'
import { ThemeProvider } from '@/components/ui/ThemeProvider'
import Navbar from '@/components/clean/Navbar'
import { playfairDisplay, montserrat, dancingScript } from './fonts'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <StoryblokProvider>
      <html
        lang="en"
        className={`${playfairDisplay.variable} ${montserrat.variable} ${dancingScript.variable}`}
        suppressHydrationWarning
      >
        <head>
          <script
            dangerouslySetInnerHTML={{
              __html: `(function(){try{
                var choice=localStorage.getItem('theme')||'system';
                var m=window.matchMedia('(prefers-color-scheme: dark)');
                var effective=choice==='system'?(m.matches?'dark':'light'):choice;
                var root=document.documentElement;
                root.setAttribute('data-theme',effective);
                root.style.setProperty('color-scheme',effective==='dark'?'dark':'light');
                root.setAttribute('data-theme-choice',choice);
                var b=localStorage.getItem('rr.brand')||'romantic';
                root.setAttribute('data-brand',(b==='modern'?'modern':'romantic'));
              }catch(e){}})();`,
            }}
          />
        </head>
        <body>
          <ThemeProvider>
            <div data-clean-root="true">
              <Navbar />
              {children}
            </div>
          </ThemeProvider>
        </body>
      </html>
    </StoryblokProvider>
  )
}