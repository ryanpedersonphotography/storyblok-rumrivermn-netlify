import NavbarHotfix from "@/components/hotfix/NavbarHotfix";
import HeroHotfix from "@/components/hotfix/HeroHotfix";
import { mapNavbarFromStory, mapHeroFromStory } from "@/components/hotfix/mapFromStoryblok";

async function getStoryblokStory() {
  // Use public token with delivery API  
  const token = process.env.STORYBLOK_ACCESS_TOKEN;
  const url = `https://api.storyblok.com/v2/cdn/stories/home?token=${token}&version=published`;
  
  try {
    const response = await fetch(url, { 
      cache: 'no-store'
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Storyblok API Error: ${response.status} ${errorText}`);
      throw new Error(`Storyblok API Error: ${response.status} ${errorText}`);
    }
    
    const data = await response.json();
    console.log('Storyblok API Success:', JSON.stringify(data.story?.content?.body, null, 2));
    return { story: data.story };
  } catch (error) {
    console.error('Storyblok fetch error:', error);
    return { story: { content: { body: [] } } };
  }
}

export default async function BetaCMSPage() {
  const data = await getStoryblokStory();
  const page = data?.story?.content;

  console.log('Page body:', JSON.stringify(page?.body, null, 2));

  const navbar = page?.body?.find((b: any) => String(b.component).startsWith("navbar")) || null;
  // Fix: Look for the actual component name created by scripts
  const hero = page?.body?.find((b: any) => b.component === "home_hero_section") || null;

  console.log('Found hero component:', hero);

  return (
    <>
      <NavbarHotfix data={mapNavbarFromStory(navbar)} />
      <HeroHotfix   data={mapHeroFromStory(hero)} />
    </>
  );
}