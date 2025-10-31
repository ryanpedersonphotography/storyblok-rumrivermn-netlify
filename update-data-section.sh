#!/bin/bash
# Script to add data-section attributes to all clean and hotfix components

# Clean components mapping
declare -A CLEAN_FILES=(
  ["faq"]="src/components/clean/FAQ.tsx"
  ["alternating-blocks"]="src/components/clean/AlternatingBlocks.tsx"
  ["gallery"]="src/components/clean/Gallery.tsx"
  ["testimonials"]="src/components/clean/Testimonials.tsx"
  ["spaces"]="src/components/clean/Spaces.tsx"
  ["experience"]="src/components/clean/Experience.tsx"
  ["pricing"]="src/components/clean/Pricing.tsx"
  ["brand-proof"]="src/components/clean/BrandProof.tsx"
  ["schedule-form"]="src/components/clean/ScheduleForm.tsx"
  ["map"]="src/components/clean/Map.tsx"
  ["footer"]="src/components/clean/Footer.tsx"
  ["navbar"]="src/components/clean/Navbar.tsx"
)

# Hotfix components mapping
declare -A HOTFIX_FILES=(
  ["hero"]="src/components/storyblok/HeroEditor.tsx"
  ["faq"]="src/components/storyblok/FAQAccordionEditor.tsx"
  ["testimonials"]="src/components/storyblok/TestimonialsEditor.tsx"
  ["gallery"]="src/components/storyblok/LoveStoriesGalleryEditor.tsx"
  ["alternating-blocks"]="src/components/storyblok/AlternatingBlocksEditor.tsx"
  ["spaces"]="src/components/storyblok/SpacesEditor.tsx"
  ["experience"]="src/components/storyblok/RumRiverExperienceEditor.tsx"
  ["pricing"]="src/components/storyblok/PricingEditor.tsx"
  ["brand-proof"]="src/components/storyblok/BrandSocialProofEditor.tsx"
  ["schedule-form"]="src/components/storyblok/ScheduleFormEditor.tsx"
  ["map"]="src/components/storyblok/MapSectionEditor.tsx"
  ["footer"]="src/components/storyblok/FooterEditor.tsx"
)

echo "🔄 Updating clean components..."
for section in "${!CLEAN_FILES[@]}"; do
  file="${CLEAN_FILES[$section]}"
  echo "  Processing: $file"
done

echo ""
echo "🔄 Updating hotfix components..."
for section in "${!HOTFIX_FILES[@]}"; do
  file="${HOTFIX_FILES[$section]}"
  echo "  Processing: $file"
done

echo ""
echo "✅ Review complete - use Claude Code to add data-section=\"name\" to each <section> tag"
