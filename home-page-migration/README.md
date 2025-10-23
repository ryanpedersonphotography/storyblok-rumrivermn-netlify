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

## 🔄 Implementation Workflow

### **📋 Step 1: Read Primary Guide**
👉 **MIGRATION_ROADMAP.md** - Contains complete 10-phase workflow

### **📋 Step 2: Foundation Setup (Phase 1)**
👉 **shared-assets/docs/DESIGN-TOKENS.md** - Color system
👉 **shared-assets/docs/ANIMATIONS.md** - Interactive elements
```bash
# Copy foundation files first
cp shared-assets/styles/design-tokens.css project/src/styles/
cp shared-assets/styles/animations.css project/src/styles/
```

### **📋 Step 3: Sequential Phase Implementation**
For each phase (2-11), follow this pattern:
```bash
# 1. Create feature branch
git checkout -b feat/[section]-migration

# 2. Read section documentation
cat [XX-section-name]/docs/README.md

# 3. Copy component code
cp [XX-section-name]/code/*.tsx project/src/components/

# 4. Integrate styles
# Reference: [XX-section-name]/styles/[section]-styles.css

# 5. Test and validate
# Follow phase completion criteria

# 6. Merge checkpoint (mandatory stop)
# Follow MIGRATION_ROADMAP.md merge procedures
```

## Global Dependencies
- **Fonts**: Dancing Script, Playfair Display, Montserrat
- **Colors**: OKLCH romantic wedding palette
- **External Libraries**: Embla Carousel (for history section)
- **Form Integration**: Netlify Forms (needs Payload equivalent)

## Key Migration Notes
1. All `.hotfix-*` classes need conversion to design tokens
2. External images need to be downloaded and migrated to Payload media
3. Hardcoded content should become CMS-managed fields
4. Form handling needs Payload integration
5. Romantic button system needs integration with shadcn/ui

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