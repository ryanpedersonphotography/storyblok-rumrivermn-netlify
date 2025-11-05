// netlify/edge-functions/theme.ts
import type { Context } from "https://edge.netlify.com";

const THEME_COOKIE = "theme";
const BRAND_COOKIE = "brand";

export default async (req: Request, ctx: Context) => {
  const url = new URL(req.url);
  
  // Skip for static assets
  if (url.pathname.match(/\.(js|css|png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|eot)$/)) {
    return ctx.next();
  }
  
  // Get cookies
  const cookies = req.headers.get("cookie") || "";
  const theme = cookies
    .split(";")
    .map(s => s.trim())
    .find(c => c.startsWith(`${THEME_COOKIE}=`))
    ?.split("=")[1] || "system";
    
  const brand = cookies
    .split(";")
    .map(s => s.trim())
    .find(c => c.startsWith(`${BRAND_COOKIE}=`))
    ?.split("=")[1] || "romantic";

  const res = await ctx.next(); // render page
  
  // Only process HTML responses
  const contentType = res.headers.get("content-type");
  if (!contentType || !contentType.includes("text/html")) {
    return res;
  }

  // Inject data-theme and data-brand on <html> to prevent FOUC
  const html = await res.text();
  
  // Determine actual theme if system
  let actualTheme = theme;
  if (theme === "system") {
    // Default to light for SSR, client will adjust based on media query
    actualTheme = "light";
  }
  
  const patched = html.replace(
    /<html([^>]*)>/i,
    `<html$1 data-theme="${actualTheme}" data-brand="${brand}" suppressHydrationWarning>`
  );

  return new Response(patched, {
    status: res.status,
    headers: res.headers
  });
};

export const config = {
  path: "/*"
};