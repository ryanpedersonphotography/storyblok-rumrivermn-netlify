export type HotfixNavItem = { label: string; href: string; isCta?: boolean; children?: HotfixNavItem[] }

export const hotfixNavbar = {
  logoText: "Rum River Barn",     // text logo - no image
  style_variant: "transparent",   // "solid" | "transparent" | "sticky"
  tone: "default" as const,
  show_cta: true,
  cta: { url: "/schedule-tour", label: "Schedule Tour" },
  items: [
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
    { label: "Venue", href: "/venue" },
    { label: "Gallery", href: "/gallery" },
    { label: "Packages", href: "/packages" },
    { label: "Contact", href: "/contact" },
  ] as HotfixNavItem[],
}

export const hotfixHero = {
  kicker: "Where Dreams Begin",
  title: "Rum River",
  titleAccent: "Wedding Barn",
  description: "Nestled along Minnesota's scenic Rum River, our historic barn offers the perfect blend of rustic charm and modern elegance for your once-in-a-lifetime celebration.",
  primaryCta: { url: "/contact", label: "Schedule Your Visit" },
  bgImage: "/hotfix-assets/barn-exterior-full-deck-view-evening.jpg",
  overlay_style: "soft" as const,      // "none" | "soft" | "strong"
  align: "center" as const,            // "left" | "center" | "right"
  height: "full" as const,             // "sm" | "md" | "lg" | "full"
  tone: "default" as const
}