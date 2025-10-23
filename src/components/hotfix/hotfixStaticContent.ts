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

export const hotfixAlternatingBlocks = {
  sectionHeader: {
    scriptAccent: "Your Perfect Venue",
    title: "Why Choose Rum River Barn",
    description: "Discover what makes our venue the perfect setting for your unforgettable celebration"
  },
  blocks: [
    {
      number: "01",
      title: "A Picturesque Location For Your Special Event",
      lead: "Near Milaca, Saint Paul, St Cloud, and Brainerd MN",
      content: [
        "When it comes to special occasions such as weddings, birthday parties, or other events, it is important to have the perfect setting. You want to ensure that your event is at a location that people will remember.",
        "Here at Rum River Barn, we understand the importance of your special occasion. We are different from other special event venues because we allow you to pretty much run the show. When you choose us, you do not have to worry about us saying no.",
        "Our goal is to help you have your perfect day. We tend to book up fast, so don't wait—call us today at <strong>612-801-0546</strong>!"
      ],
      image: "/hotfix-assets/barn-interior-ceiling-beams-lighting.jpg",
      imageAlt: "Special event venue with beautiful ceiling beams",
      isReverse: false
    },
    {
      number: "02", 
      title: "Rum River Barn & Vineyard",
      lead: "Milaca, St. Cloud, Saint Paul, and Brainerd MN",
      content: [
        "Nestled within 400 acres of pure country and rustic charm, this is the perfect barn wedding venue in Minnesota. On a peaceful hillside overlooking grape vineyards, mile-long manicured old oak forests, and white pines next to a whispering brook, we offer Minnesota's premier barn wedding venue and country special events venue for your custom special event.",
        "Enjoy the serenity, peacefulness, and amazing beauty which has been carved out of the forests and developed for the past 100 years."
      ],
      image: "/hotfix-assets/property-field-wildflowers-natural.jpg",
      imageAlt: "Rum River Barn and Vineyard with natural wildflowers",
      isReverse: true
    }
  ]
}