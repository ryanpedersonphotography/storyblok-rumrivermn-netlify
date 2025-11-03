# Alternating Blocks Images - To Be Uploaded to Storyblok

## Images Needed for CMS Wiring

The alternating blocks section has been seeded in Storyblok but needs images uploaded. Here are the image requirements:

### Block 01: "A Picturesque Location For Your Special Event"
- **Image Alt Text**: "Special event venue with beautiful ceiling beams"
- **Content Context**: Venue interior showcasing rustic charm and modern elegance
- **Suggested Image**: Interior shot of the barn showing ceiling beams, lighting, and event setup
- **Layout**: Image on RIGHT, content on LEFT (is_reverse: false)

### Block 02: "Rum River Barn & Vineyard" 
- **Image Alt Text**: "Rum River Barn and Vineyard with natural wildflowers"
- **Content Context**: 400 acres of country charm, vineyards, oak forests, brook
- **Suggested Image**: Exterior shot showing the barn, vineyard, and natural landscape
- **Layout**: Image on LEFT, content on RIGHT (is_reverse: true)

## Upload Instructions

1. Go to Storyblok admin: https://app.storyblok.com/
2. Navigate to the "Home" story
3. Find the "Alternating Blocks Section" component
4. Upload images to each block's "Image" field
5. Verify alt text matches the descriptions above

## Technical Notes

- Images are currently empty strings in the CMS
- Feature flag `FEATURE_CMS_IMAGES=0` keeps images disabled until uploaded
- Component mapping handles both asset objects and string URLs
- Full fallback to static content if CMS images unavailable

## Component UIDs in Storyblok

- Section UID: `alternating-blocks-1761221085055`
- Block 01 UID: `block-01-1761221085055` 
- Block 02 UID: `block-02-1761221085055`

## Current Status

✅ Component schema created in Storyblok
✅ Content seeded with proper text
✅ [object Object] rendering issue fixed
🔄 Images need to be uploaded manually in Storyblok admin
⏸️ Feature flag disabled until images ready: `FEATURE_CMS_IMAGES=0`