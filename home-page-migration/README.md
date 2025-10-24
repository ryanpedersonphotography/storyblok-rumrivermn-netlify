# Home Page Migration Package

## 🎯 **START HERE: Complete Implementation Guide**

### **📋 MIGRATION_ROADMAP.md** 
**👆 READ THIS FIRST** - Your primary implementation guide with:
- 10-phase migration strategy with Git workflows
- Mandatory merge checkpoints for each section
- Design fidelity validation requirements
- Complete branch strategy and merge procedures

## 🗂️ Documentation System Overview
This migration package contains everything needed to migrate the romantic wedding barn home page with 100% design fidelity. All files work together as a comprehensive system.

## 📁 Package Structure & File References
```
home-page-migration/
├── 📖 MIGRATION_ROADMAP.md     # 👈 PRIMARY GUIDE - Start here
├── 📖 README.md                # 👈 This file - Overview & cross-references
├── 00-navbar/                  # Phase 2: Fixed transparent navbar
├── 01-hero-section/            # Phase 3: Full-viewport romantic hero
├── 02-alternating-blocks/      # Phase 4: Two-column venue features
├── 03-love-stories-gallery/    # Phase 5: Dynamic wedding photo grid
├── 04-brand-social-proof/      # Phase 6: Complex visual effects section
├── 05-testimonials/            # Phase 7: Customer testimonials grid
├── 06-history-carousel/        # Phase 8: Interactive timeline carousel
├── 07-schedule-form/           # Phase 9: Server Actions contact form
├── 08-map-section/             # Phase 10: Split-screen map layout
├── 09-footer-section/          # Phase 11: 3-column footer with heroicons
└── shared-assets/              # Phase 1: Foundation (design tokens)
```

## 📂 Section Structure (Each [XX-section-name]/)
```
├── code/
│   └── [component].tsx         # 📝 Copy → Adapt to project structure
├── styles/
│   └── [section]-styles.css    # 🎨 Extract → Integrate with design tokens
├── docs/
│   └── README.md               # 📚 Read → Implementation guide
└── images/                     # 🖼️ Copy → Move to project assets
```

## 🏗️ Foundation Files (shared-assets/)
```
shared-assets/
├── styles/
│   ├── design-tokens.css       # 🎨 Phase 1: Copy FIRST (required by all)
│   └── animations.css          # ✨ Phase 1: Copy FIRST (keyframes)
└── docs/
    ├── DESIGN-TOKENS.md        # 📚 Reference during implementation
    └── ANIMATIONS.md           # 📚 Reference for interactive elements
```

## 🔄 Implementation Workflow (UPDATED: Visual Editor-First)

> **Important Change**: This project now uses a **Visual Editor-first approach**. See [VISUAL_EDITOR_WORKFLOW.md](VISUAL_EDITOR_WORKFLOW.md) for complete details.

### **📋 Step 1: Read Primary Guides**
👉 **MIGRATION_ROADMAP.md** - Complete 11-phase workflow with Visual Editor integration
👉 **VISUAL_EDITOR_WORKFLOW.md** - NEW: Visual Editor-first implementation guide

### **📋 Step 2: Foundation Setup (Phase 1) ✅ COMPLETE**
👉 **shared-assets/docs/DESIGN-TOKENS.md** - Color system
👉 **shared-assets/docs/ANIMATIONS.md** - Interactive elements
- [x] Storyblok Visual Editor route: `/home-live`
- [x] Component mapping configured in `src/lib/storyblok.ts`
- [x] Design tokens and animations integrated

### **📋 Step 3: Sequential Phase Implementation** (Visual Editor-First)
For each phase (2-11), follow this **NEW** pattern:

```bash
# 1. Create feature branch
git checkout -b feat/[section]-migration

# 2. Read section documentation
cat [XX-section-name]/docs/README.md

# 3. CREATE STORYBLOK SCHEMA FIRST (in Storyblok UI)
# - Navigate to Block Library → New Block
# - Add all required fields
# - Save schema

# 4. Create [Component]Editor.tsx with Visual Editor support
# - Add 'use client' directive
# - Import storyblokEditable from @storyblok/react
# - Wrap component with {...storyblokEditable(blok)}
# - Access content via blok.field_name
# - Provide fallbacks with || operator

# 5. Register component in src/lib/storyblok.ts
# - Import Editor component
# - Add to storyblokComponents mapping

# 6. TEST IN VISUAL EDITOR (http://localhost:9999/home-live)
# - Add block to Home story in Storyblok
# - Verify blue outline appears on click
# - Test field editing updates immediately
# - Check nested blocks editable (if applicable)

# 7. Validate design fidelity and Visual Editor functionality
# Follow phase completion criteria

# 8. Merge checkpoint (mandatory stop)
# Follow MIGRATION_ROADMAP.md merge procedures
```

## Global Dependencies
- **Fonts**: Dancing Script, Playfair Display, Montserrat
- **Colors**: OKLCH romantic wedding palette
- **External Libraries**: Embla Carousel (for history section)
- **Form Integration**: Netlify Forms (needs Payload equivalent)

## Key Migration Notes (UPDATED)
1. All `.hotfix-*` classes preserved (used in Editor components)
2. Images managed via Storyblok asset fields
3. All content is Storyblok-managed from the start (not hardcoded)
4. Components use `storyblokEditable()` for Visual Editor support
5. Form handling uses Next.js Server Actions (not Netlify Forms)
6. Components are created as `[Name]Editor.tsx` in `/src/components/storyblok/`

## Completed Sections ✅
- **Phase 3: Hero Section** - [HeroEditor.tsx](../src/components/storyblok/HeroEditor.tsx)
- **Phase 4: Alternating Blocks** - [AlternatingBlocksEditor.tsx](../src/components/storyblok/AlternatingBlocksEditor.tsx)

## Next Section 👉
- **Phase 5: Love Stories Gallery** - See [03-love-stories-gallery/docs/README.md](03-love-stories-gallery/docs/README.md)

## Assets to Download
- External images from `rum-river-final.netlify.app`
- Local wedding photos from `/wedding-photos/` directories
- Placeholder images from Unsplash (testimonials)

## Colors Used Throughout
- **Champagne Gold**: #E4C896
- **Warm Walnut**: #6B4E3D
- **Dusty Rose**: #9D6B7B
- **Cream Pearl**: #FFFCF8
- **Sage Green**: #7A8B7F
- **Blush Pink**: #F4E4E1

This package preserves the complete romantic wedding barn theme while organizing it for systematic migration to the official Payload CMS template.