# Storyblok Content Setup Instructions

## Current Status
✅ **Authentication Fixed** - Region corrected from 'us' to 'eu'  
✅ **Components Ready** - All required components exist in space  
❌ **Content Missing** - No stories exist yet (space is empty)

## Space Information
- **Space:** rum-river-mn  
- **Space ID:** 287999131965922
- **Region:** EU (api.storyblok.com)
- **Admin URL:** https://app.storyblok.com/#!/me/spaces/287999131965922

## Required Manual Steps

### 1. Create Home Story
Go to Storyblok admin and create a new story:

1. Navigate to: https://app.storyblok.com/#!/me/spaces/287999131965922
2. Click "Create new" → "Story"
3. Configure the story:
   - **Name:** Home
   - **Slug:** home  
   - **Content type:** page
4. In the story editor, add content blocks:

#### Story Structure:
```
📄 Home (page component)
└── 📝 body (blocks field)
    ├── 📢 Teaser
    │   └── headline: "Welcome to Rum River MN"
    └── 📊 Grid  
        └── columns:
            ├── ⭐ Feature (name: "Beautiful Nature")
            └── ⭐ Feature (name: "Community Events")
```

### 2. Publish the Story
After creating the content structure:
1. Click "Publish" to make the content live
2. Verify the story slug is exactly "home"

### 3. Configure Visual Editor
In Space Settings → Visual Editor:
- **Preview URL:** `https://storyblok-rumrivermn-netlify.netlify.app/`
- **Real path:** `https://storyblok-rumrivermn-netlify.netlify.app/`

## Component Mapping
The following components are available and correctly mapped:

| Storyblok Component | React Component | Fields |
|-------------------|-----------------|--------|
| `page` | Page.jsx | `body` (blocks) |
| `teaser` | Teaser.jsx | `headline` (text) |
| `feature` | Feature.jsx | `name` (text) |
| `grid` | Grid.jsx | `columns` (blocks) |

## Testing Checklist
After creating content:
- [ ] Home page loads without errors
- [ ] Content displays correctly  
- [ ] Visual Editor preview works
- [ ] Live preview updates in real-time
- [ ] All component mappings function properly

## URLs
- **Live Site:** https://storyblok-rumrivermn-netlify.netlify.app
- **Admin:** https://app.storyblok.com/#!/me/spaces/287999131965922
- **API Test:** https://api.storyblok.com/v2/cdn/stories/home?token=dI9HJYQcCfjLzXCUWpQF8wtt