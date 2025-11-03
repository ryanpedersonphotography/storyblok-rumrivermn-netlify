// src/app/layout.tsx
// MINIMAL ROOT: no CSS imports; providers only.

import StoryblokProvider from '@/components/StoryblokProvider'
import { ThemeProvider } from '@/components/ui/ThemeProvider'
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
              {children}
            </div>
          </ThemeProvider>
        </body>
      </html>
    </StoryblokProvider>
  )
}