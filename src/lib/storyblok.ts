const REGION = (process.env.STORYBLOK_REGION || "eu") as "us" | "eu";
const TOKEN =
  process.env.NEXT_PUBLIC_STORYBLOK_TOKEN ||
  process.env.STORYBLOK_ACCESS_TOKEN ||
  process.env.STORYBLOK_PUBLIC_TOKEN ||
  process.env.STORYBLOK_PREVIEW_TOKEN;

export async function fetchStory(slug: string, version: "draft" | "published" = "published") {
  const baseUrl = REGION === "eu" ? "https://api.eu.storyblok.com" : "https://api-us.storyblok.com";
  const url = `${baseUrl}/v2/cdn/stories/${slug}?token=${TOKEN}&version=${version}&cv=${Date.now()}`;
  
  const response = await fetch(url, { cache: 'no-store' });
  
  if (!response.ok) {
    throw new Error(`Storyblok API Error: ${response.status} ${await response.text()}`);
  }
  
  return response.json();
}