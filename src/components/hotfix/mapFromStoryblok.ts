import { hotfixNavbar, hotfixHero } from "./hotfixStaticContent";

export function mapNavbarFromStory(content: any) {
  if (!content) return hotfixNavbar;
  return {
    ...hotfixNavbar,
    // if you later add a logo asset field, map it here
    items: Array.isArray(content.items)
      ? content.items.map((it: any) => ({
          label: it?.label ?? "",
          href: it?.href?.cached_url ? `/${it.href.cached_url.replace(/^\/+/, "")}` : "#",
          isCta: !!it?.is_cta,
          children: Array.isArray(it?.children)
            ? it.children.map((c: any) => ({
                label: c?.label ?? "",
                href: c?.href?.cached_url ? `/${c.href.cached_url.replace(/^\/+/, "")}` : "#",
                isCta: !!c?.is_cta,
              }))
            : [],
        }))
      : hotfixNavbar.items,
  };
}

export function mapHeroFromStory(content: any) {
  if (!content) {
    console.log('No hero content from Storyblok, using static fallback');
    return hotfixHero;
  }
  
  console.log('Mapping hero from Storyblok:', JSON.stringify(content, null, 2));
  
  // Handle Storyblok asset objects properly
  let bgImageUrl = hotfixHero.bgImage; // fallback
  
  if (content?.bg_image) {
    if (typeof content.bg_image === 'string') {
      bgImageUrl = content.bg_image;
    } else if (content.bg_image?.filename) {
      bgImageUrl = content.bg_image.filename;
    }
  }
  
  const mapped = {
    ...hotfixHero,
    kicker: content?.kicker ?? hotfixHero.kicker,
    title: content?.title ?? hotfixHero.title,
    titleAccent: content?.title_accent ?? hotfixHero.titleAccent,
    description: content?.description ?? hotfixHero.description,
    bgImage: bgImageUrl,
    primaryCta: {
      url: "/contact",
      label: content?.primary_cta_text ?? hotfixHero.primaryCta.label
    },
  };
  
  console.log('Mapped hero data:', JSON.stringify(mapped, null, 2));
  return mapped;
}
