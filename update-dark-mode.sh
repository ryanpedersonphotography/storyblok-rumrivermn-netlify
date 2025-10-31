#!/bin/bash

# Comprehensive dark mode tokenization script
# Replaces all hard-coded colors with tokens across all CSS files

# Colors to replace:
# white !important → var(--theme-text-on-dark, #FFF8E7) !important
# #FFFFFF → var(--theme-text-on-dark, #FFF8E7)
# #fff → var(--theme-text-on-dark, #FFF8E7)
# #E4C896 → var(--theme-accent-gold, #E4C896)
# #9D6B7B → var(--theme-accent-rose, #9D6B7B)
# #6B4E3D → var(--color-warm-walnut, #6B4E3D)

# Function to replace in file
replace_colors() {
  local file=$1

  # Backup
  cp "$file" "$file.bak"

  # Replace white variants (but skip data-theme rules that already use tokens)
  sed -i '' -E '
    # Skip lines that already have var(--theme
    /var\(--theme/! {
      s/color: white !important;/color: var(--theme-text-on-dark, #FFF8E7) !important;/g
      s/color: #FFFFFF/color: var(--theme-text-on-dark, #FFF8E7)/g
      s/color: #fff([^a-f0-9])/color: var(--theme-text-on-dark, #FFF8E7)\1/g
    }
  ' "$file"

  # Replace gold
  sed -i '' 's/#E4C896/var(--theme-accent-gold, #E4C896)/g' "$file"

  # Replace rose
  sed -i '' 's/#9D6B7B/var(--theme-accent-rose, #9D6B7B)/g' "$file"

  # Replace walnut in text contexts
  sed -i '' 's/color: #6B4E3D/color: var(--color-warm-walnut, #6B4E3D)/g' "$file"

  echo "✅ Updated: $file"
}

# Process key files
replace_colors "src/styles/hotfix/alternating-blocks-styles.css"
replace_colors "src/styles/hotfix/footer-styles.css"
replace_colors "src/styles/hotfix/schedule-form-styles.css"
replace_colors "src/styles/hotfix/history-carousel-styles.css"
replace_colors "src/styles/hotfix/testimonials-styles.css"

echo "🎉 All files updated with tokens!"
