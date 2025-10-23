#!/usr/bin/env node
/**
 * Update a Storyblok story so its hero block uses an already-uploaded asset.
 *
 * Usage:
 *   node scripts/update-home-hero-bg.js "<ASSET_URL>" "<STORY_SLUG>"
 *
 * Required env:
 *   STORYBLOK_SPACE_ID=...
 *   STORYBLOK_MANAGEMENT_TOKEN=...     (raw token, NOT "Bearer ...")
 *
 * Example:
 *   node scripts/update-home-hero-bg.js \
 *     "https://a.storyblok.com/f/288003424841711/820f9a9bdb/barn-exterior-full-deck-view-evening.jpg" \
 *     "home-beta"
 */

const API_BASE = "https://mapi.storyblok.com/v1";
const SPACE_ID = process.env.STORYBLOK_SPACE_ID;
const MANAGEMENT_TOKEN = process.env.STORYBLOK_MANAGEMENT_TOKEN;

if (!SPACE_ID || !MANAGEMENT_TOKEN) {
  console.error("❌ Missing env: STORYBLOK_SPACE_ID and/or STORYBLOK_MANAGEMENT_TOKEN");
  process.exit(1);
}

const [, , RAW_ASSET_URL, STORY_SLUG] = process.argv;
if (!RAW_ASSET_URL || !STORY_SLUG) {
  console.error('❌ Usage: node scripts/update-home-hero-bg.js "<ASSET_URL>" "<STORY_SLUG>"');
  process.exit(1);
}

// Normalize CDN URL if user pasted the S3 host version
function normalizeAssetUrl(url) {
  // Many signed uploads return "https://s3.amazonaws.com/a.storyblok.com/f/.../file.jpg"
  // Canonical public CDN is "https://a.storyblok.com/f/.../file.jpg"
  return url.replace(/^https?:\/\/s3\.amazonaws\.com\/a\.storyblok\.com\//, "https://a.storyblok.com/");
}

const ASSET_URL = normalizeAssetUrl(RAW_ASSET_URL);

async function sbGET(path) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { Authorization: MANAGEMENT_TOKEN },
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`GET ${path} failed ${res.status}: ${text}`);
  return JSON.parse(text);
}

async function sbPUT(path, body) {
  const res = await fetch(`${API_BASE}${path}`, {
    method: "PUT",
    headers: {
      Authorization: MANAGEMENT_TOKEN,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`PUT ${path} failed ${res.status}: ${text}`);
  return JSON.parse(text);
}

(async () => {
  console.log("🚀 Updating hero image for story…");
  console.log(`📍 Space: ${SPACE_ID}`);
  console.log(`🖼️  Asset: ${ASSET_URL}`);
  console.log(`📘 Slug:  ${STORY_SLUG}`);

  // 1) Resolve story id by slug
  const list = await sbGET(`/spaces/${SPACE_ID}/stories?with_slug=${encodeURIComponent(STORY_SLUG)}`);
  if (!list.stories || !list.stories.length) {
    throw new Error(`Story with slug "${STORY_SLUG}" not found in space ${SPACE_ID}`);
  }
  const story = list.stories[0];
  const storyId = story.id;
  console.log(`✅ Found story id: ${storyId}`);

  // 2) Grab full content so we can update in-place (avoid wiping other fields)
  const full = await sbGET(`/spaces/${SPACE_ID}/stories/${storyId}`);
  const content = full.story?.content;
  if (!content) throw new Error("Story has no content payload to update.");

  // 3) Locate hero block (supports both hero_section_v2 and hero_section)
  function updateHeroBgImage(c) {
    if (!c) return 0;
    let touched = 0;

    // If this node is a hero component, update it
    if (c.component === "hero_section_v2" || c.component === "hero_section" || c.component === "home_hero_section") {
      c.bg_image = ASSET_URL; // Storyblok asset fields accept the CDN filename string
      touched++;
    }

    // Recurse known container fields
    if (Array.isArray(c.body)) {
      for (const child of c.body) touched += updateHeroBgImage(child);
    }
    if (Array.isArray(c.columns)) {
      for (const child of c.columns) touched += updateHeroBgImage(child);
    }
    if (Array.isArray(c.blocks)) {
      for (const child of c.blocks) touched += updateHeroBgImage(child);
    }
    return touched;
  }

  const hits = updateHeroBgImage(content);

  // If no hero found, optionally append one minimal hero block (commented out by default)
  if (hits === 0) {
    console.warn("⚠️ No existing hero_section found. (No changes made.)");
    // If you want to append a default hero instead, uncomment below:
    // if (!Array.isArray(content.body)) content.body = [];
    // content.body.push({
    //   component: "hero_section_v2",
    //   heading: "Rum River Wedding Barn",
    //   subheading: { type: "doc", content: [{ type: "paragraph", content: [{ type: "text", text: "" }]}]},
    //   bg_image: ASSET_URL,
    //   overlay_style: "soft",
    //   align: "center",
    //   height: "full",
    //   tone: "default"
    // });
  } else {
    console.log(`🛠️ Updated ${hits} hero block(s) with new bg_image.`);
  }

  // 4) PUT the updated story and publish it
  const result = await sbPUT(`/spaces/${SPACE_ID}/stories/${storyId}`, {
    story: { content },
    publish: 1,
  });

  const resultingFilename =
    (Array.isArray(result?.story?.content?.body)
      ? result.story.content.body.find(b => b.component?.startsWith("hero_section"))?.bg_image
      : result?.story?.content?.bg_image) || ASSET_URL;

  console.log("✅ Story updated (draft).");
  console.log("🔗 bg_image now points to:", resultingFilename);
  console.log("📎 Open in editor to verify preview thumbnail.");
})().catch((err) => {
  console.error("❌ Update failed:", err.message || err);
  process.exit(1);
});