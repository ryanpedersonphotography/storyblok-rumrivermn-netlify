import NavbarHotfix from "@/components/hotfix/NavbarHotfix";
import HeroHotfix from "@/components/hotfix/HeroHotfix";
import { mapNavbarFromStory, mapHeroFromStory } from "@/components/hotfix/mapFromStoryblok";

async function getStoryblokStory() {
  const token = process.env.NEXT_PUBLIC_STORYBLOK_TOKEN || process.env.STORYBLOK_ACCESS_TOKEN;
  const url = `https://api.eu.storyblok.com/v2/cdn/stories/home?token=${token}&version=published&cv=${Date.now()}`;
  
  try {
    const response = await fetch(url, { cache: 'no-store' });
    if (!response.ok) {
      throw new Error(`Storyblok API Error: ${response.status} ${await response.text()}`);
    }
    return response.json();
  } catch (error) {
    console.error('Storyblok fetch error:', error);
    return { story: { content: { body: [] } } };
  }
}

export default async function BetaCMSPage() {
  const data = await getStoryblokStory();
  const page = data?.story?.content;

  const navbar = page?.body?.find((b: any) => String(b.component).startsWith("navbar")) || null;
  const hero   = page?.body?.find((b: any) => b.component === "home_hero_section") || null;

  return (
    <>
      <NavbarHotfix data={mapNavbarFromStory(navbar)} />
      <HeroHotfix   data={mapHeroFromStory(hero)} />
    </>
  );
}