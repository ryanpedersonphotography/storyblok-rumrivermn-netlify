/**
 * Netlify Edge Function for theme handling
 * Runs at the edge to inject theme before page loads
 */

import type { Context } from "@netlify/edge-functions"

export default async (request: Request, context: Context) => {
  // Get the response from the origin
  const response = await context.next()
  
  // Get theme from cookie
  const cookie = request.headers.get('cookie') || ''
  const themeCookie = cookie.split('; ').find(row => row.startsWith('theme='))
  const theme = themeCookie ? themeCookie.split('=')[1] : 'system'
  
  const brandCookie = cookie.split('; ').find(row => row.startsWith('brand='))
  const brand = brandCookie ? brandCookie.split('=')[1] : 'romantic'

  // Clone response to modify it
  const modifiedResponse = new Response(response.body, response)
  
  // Transform the HTML to inject theme
  const html = await response.text()
  
  // Inject theme attributes into the HTML tag
  const modifiedHtml = html.replace(
    '<html',
    `<html data-theme="${theme === 'system' ? '' : theme}" data-brand="${brand}"`
  )
  
  // Also ensure the inline script is present for immediate theme application
  const scriptInjection = `
    <script>
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
    </script>
  `
  
  // Inject script right after opening head tag if not already present
  const finalHtml = modifiedHtml.includes('getCookie') 
    ? modifiedHtml 
    : modifiedHtml.replace('<head>', `<head>${scriptInjection}`)

  return new Response(finalHtml, {
    status: response.status,
    headers: response.headers,
  })
}

export const config = {
  path: "/*",
  excludedPath: ["/.netlify/*", "/api/*", "/_next/*", "/favicon.ico"],
}