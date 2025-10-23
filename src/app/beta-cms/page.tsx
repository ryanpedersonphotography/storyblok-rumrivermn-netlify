import NavbarHotfix from "@/components/hotfix/NavbarHotfix";
import HeroHotfix from "@/components/hotfix/HeroHotfix";
import { mapNavbarFromStory, mapHeroFromStory } from "@/components/hotfix/mapFromStoryblok";
import { fetchStory } from "@/lib/storyblok";

export default async function BetaCMSPage() {
  const version = process.env.NODE_ENV === "production" ? "published" : "draft";
  // Use the seeded story slug you created earlier:
  const { data } = await fetchStory("home", version);
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
