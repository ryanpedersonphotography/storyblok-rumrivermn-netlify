import NavbarHotfix from "@/components/hotfix/NavbarHotfix"
import HeroHotfix from "@/components/hotfix/HeroHotfix"
import AlternatingBlocks from "@/components/sections/AlternatingBlocks"
import { hotfixAlternatingBlocks } from "@/components/hotfix/hotfixStaticContent"

export default function BetaPage() {
  // No wrappers that affect spacing/width
  return (
    <>
      <NavbarHotfix />
      <HeroHotfix />
      <AlternatingBlocks data={hotfixAlternatingBlocks} />
    </>
  )
}