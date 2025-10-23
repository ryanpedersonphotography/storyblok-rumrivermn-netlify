import { storyblokInit, apiPlugin, StoryblokClient } from "@storyblok/react/rsc";

const REGION = (process.env.STORYBLOK_REGION || "us") as "us" | "eu";
const TOKEN =
  process.env.NEXT_PUBLIC_STORYBLOK_TOKEN ||
  process.env.STORYBLOK_ACCESS_TOKEN ||
  process.env.STORYBLOK_PUBLIC_TOKEN ||
  process.env.STORYBLOK_PREVIEW_TOKEN;

export function getSbClient(): StoryblokClient {
  const { storyblokApi } = storyblokInit({
    accessToken: TOKEN,
    apiOptions: { region: REGION }, // switches host to api-us.storyblok.com
    use: [apiPlugin],
  });
  return storyblokApi;
}

export async function fetchStory(slug: string, version: "draft" | "published" = "draft") {
  const api = getSbClient();
  return api.get(`cdn/stories/${slug}`, { version });
}
