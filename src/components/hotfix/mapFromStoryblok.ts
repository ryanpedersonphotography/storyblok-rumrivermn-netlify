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
  if (!content) return hotfixHero;
  return {
    ...hotfixHero,
    kicker: content?.kicker ?? hotfixHero.kicker,
    title: content?.title ?? hotfixHero.title,
    titleAccent: content?.title_accent ?? hotfixHero.titleAccent,
    description: content?.description ?? hotfixHero.description,
    bgImage: content?.bg_image || hotfixHero.bgImage,
    primaryCta: {
      url: "/contact",
      label: content?.primary_cta_text ?? hotfixHero.primaryCta.label
    },
  };
}
