# Implementation Guide - Critical Decisions & Clarifications

## 🎯 **FINAL IMPLEMENTATION DECISIONS** (Updated)

This document contains the authoritative implementation decisions made during the pre-Phase 1 planning session.

## **A. Image Migration Strategy** ✅

### **Decision: COMPREHENSIVE MIGRATION**
- **Approach**: Systematic migration of ALL essential images from `/migration-images/` folder
- **Scope**: Thousands of professional wedding photos, venue shots, historical images
- **Timing**: Copy images as needed for each phase (not all upfront)
- **Organization**: Maintain organized subdirectory structure in `/public/images/`

### **Directory Mapping**
```
/migration-images/venue/           → /public/images/venue/
/migration-images/blog-images/     → /public/images/weddings/
/migration-images/historical/      → /public/images/historical/
/migration-images/bridal-suite/    → /public/images/bridal-suite/
/migration-images/reception/       → /public/images/reception/
```

## **B. External Asset Replacement** ✅

### **Decision: REPLACE WITH MIGRATION PHOTOS**
- **Unsplash URLs**: Replace ALL external image URLs with appropriate photos from migration-images
- **Testimonial Avatars**: Use actual wedding couple photos instead of stock images
- **Gallery Content**: Use real wedding galleries from blog-images folder
- **Placeholder Content**: Zero external dependencies - everything self-hosted

### **Specific Replacements**
```typescript
// BEFORE (External)
avatarImage: "https://images.unsplash.com/photo-1606216794074-735e91aa2c92"

// AFTER (Local)
avatarImage: "/images/weddings/sarah-and-michael/portrait.jpg"
```

## **C. Design Fidelity Focus** ✅

### **Decision: PERFECT VISUAL REPLICATION**
- **Priority**: 100% design fidelity over performance optimization
- **Advanced Effects**: Include ALL complex CSS features
  - ✅ Glassmorphism with backdrop-filter
  - ✅ Multi-layer gradient systems
  - ✅ Shimmer animations (CSS-only)
  - ✅ SVG pattern overlays
  - ✅ Complex hover transforms
- **Performance**: Secondary concern during migration phases
- **Optimization**: Add after visual accuracy achieved

### **Visual Effects Checklist**
- [ ] Hero: 3-layer gradient overlay + parallax background
- [ ] Navigation: Transparent-to-white scroll effect with backdrop blur
- [ ] Gallery: Shimmer hover animations + glassmorphic overlays
- [ ] Social Proof: Complex bevel edges + star pattern backgrounds
- [ ] Testimonials: Multi-shadow card systems + gradient underlines
- [ ] Carousel: Hardware-accelerated transitions + autoplay controls
- [ ] Form: Rotating background animation + glass container
- [ ] Map: Floating action buttons with shimmer effects

## **D. Package Dependencies** ✅

### **Decision: INSTALL AS NEEDED**
- **Strategy**: Add packages when required for specific phase implementation
- **Timing**: Install during the phase that needs them, not upfront

### **Required Packages by Phase**
```bash
# Phase 6 (History Carousel)
pnpm add embla-carousel-react embla-carousel-autoplay

# Phase 7 (Schedule Form)  
pnpm add resend

# Optional Development Tools
pnpm add -D @types/node
```

### **Environment Variables**
```bash
# .env.local (already configured)
RESEND_API_KEY=re_P41xqx13_GvHvk7KnTwwjvkp1YDcJtzZK
```

## **E. Content Strategy** ✅

### **Decision: HARDCODE FOR FIDELITY**
- **Historical Timeline**: Hardcode carousel content for immediate design fidelity
- **Wedding Data**: Use real wedding information from migration-images metadata
- **CMS Integration**: Plan for future conversion but prioritize visual accuracy first

### **Content Implementation**
```typescript
// Hardcoded historical timeline
const historicalEvents = [
  {
    year: "1914",
    title: "Norwegian Settlers Arrive",
    description: "Sigvart and Helga Selmer, Norwegian immigrants...",
    image: "/images/historical/norwegian-settlers-1914.jpg"
  },
  // ... more events
];

// Real wedding data from migration-images
const featuredWeddings = [
  {
    coupleNames: "Anthony & Linnea",
    season: "Summer 2024", 
    photoCount: 114,
    image: "/images/weddings/anthony-and-linnea/001.jpg"
  },
  // ... more weddings
];
```

## **Implementation Priorities**

### **Phase 1 Foundation**
1. ✅ Design tokens installation
2. ✅ Animation system setup  
3. ✅ Font migration to next/font
4. ✅ Essential image copying
5. ✅ Home Global creation

### **Per-Phase Requirements**
- **Visual Fidelity**: Every pixel must match hotfix design
- **Asset Management**: Copy relevant images before implementation
- **External Replacement**: Replace Unsplash URLs immediately
- **Complex Effects**: Implement all advanced CSS features
- **Hardcoded Content**: Use real data but hardcode for speed

## **Success Criteria**

### **Mandatory Checkpoints**
- [ ] Side-by-side visual comparison with localhost:7777
- [ ] All hover/focus/animation effects working identically
- [ ] Mobile responsiveness matches exactly
- [ ] No external asset dependencies
- [ ] Perfect typography and spacing replication

### **Quality Gates**
Each phase must achieve:
- ✅ 100% Visual Fidelity (pixel-perfect match)
- ✅ All Interactive Elements Working
- ✅ Responsive Design Preserved
- ✅ Performance Maintained
- ✅ Cross-browser Compatibility

This implementation guide ensures consistent execution across all 10 migration phases while prioritizing perfect design fidelity above all other concerns.