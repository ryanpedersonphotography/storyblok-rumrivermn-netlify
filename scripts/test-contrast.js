#!/usr/bin/env node

/**
 * Color Contrast Testing Script
 *
 * Tests all color combinations in the design system against WCAG 2.2 requirements:
 * - Text (normal): 4.5:1 minimum (AA), 7:1 enhanced (AAA)
 * - Text (large ≥18pt / ≥14pt bold): 3:1 minimum (AA), 4.5:1 enhanced (AAA)
 * - UI Components: 3:1 minimum (AA)
 *
 * Usage: node scripts/test-contrast.js
 */

/**
 * Convert hex color to RGB
 * @param {string} hex - Hex color (e.g., '#6B4E3D')
 * @returns {[number, number, number]} RGB values [r, g, b]
 */
function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? [
        parseInt(result[1], 16),
        parseInt(result[2], 16),
        parseInt(result[3], 16),
      ]
    : null;
}

/**
 * Calculate relative luminance (WCAG formula)
 * @param {[number, number, number]} rgb - RGB values
 * @returns {number} Relative luminance (0-1)
 */
function luminance([r, g, b]) {
  const [rs, gs, bs] = [r, g, b].map((val) => {
    val = val / 255;
    return val <= 0.03928 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

/**
 * Calculate contrast ratio between two colors
 * @param {string} color1 - First hex color
 * @param {string} color2 - Second hex color
 * @returns {number} Contrast ratio (1-21)
 */
function contrastRatio(color1, color2) {
  const lum1 = luminance(hexToRgb(color1));
  const lum2 = luminance(hexToRgb(color2));
  const lighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);
  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Get WCAG level for text contrast
 * @param {number} ratio - Contrast ratio
 * @param {boolean} largeText - Is text large (≥18pt or ≥14pt bold)?
 * @returns {string} WCAG level ('AAA', 'AA', 'Fail')
 */
function getTextLevel(ratio, largeText = false) {
  if (largeText) {
    if (ratio >= 4.5) return 'AAA';
    if (ratio >= 3.0) return 'AA';
    return 'Fail';
  } else {
    if (ratio >= 7.0) return 'AAA';
    if (ratio >= 4.5) return 'AA';
    return 'Fail';
  }
}

/**
 * Get WCAG level for UI component contrast
 * @param {number} ratio - Contrast ratio
 * @returns {string} WCAG level ('AAA', 'AA', 'Fail')
 */
function getUILevel(ratio) {
  if (ratio >= 4.5) return 'AAA';
  if (ratio >= 3.0) return 'AA';
  return 'Fail';
}

/**
 * Format result with color indicator
 * @param {string} level - WCAG level
 * @returns {string} Formatted level with emoji
 */
function formatLevel(level) {
  switch (level) {
    case 'AAA':
      return '✅ AAA';
    case 'AA':
      return '✅ AA';
    case 'Fail':
      return '❌ Fail';
    default:
      return level;
  }
}

// ============================================================================
// Color Definitions (from design tokens)
// ============================================================================

const colors = {
  brand: {
    walnut: '#6B4E3D',
    walnutDeep: '#4A3426',
    rose: '#9D6B7B',
    roseDark: '#8A5F6D',
    gold: '#E4C896',
    goldAlt: '#D9BD88',
    sage: '#7A8B7F',
  },
  neutral: {
    creamPearl: '#FFFCF8',
    warmCream: '#FBF8F4',
    blushPink: '#F4E4E1',
    white: '#FFFFFF',
    textDark: '#2C2416',
    textChocolate: '#1A1410',
  },
};

// ============================================================================
// Test Definitions
// ============================================================================

const tests = [
  // Text on Light Backgrounds
  {
    category: 'Text on Light Backgrounds',
    pairs: [
      {
        name: 'Text Dark on Cream Pearl',
        fg: colors.neutral.textDark,
        bg: colors.neutral.creamPearl,
        type: 'text',
      },
      {
        name: 'Warm Walnut on Cream Pearl',
        fg: colors.brand.walnut,
        bg: colors.neutral.creamPearl,
        type: 'text',
      },
      {
        name: 'Warm Walnut on White',
        fg: colors.brand.walnut,
        bg: colors.neutral.white,
        type: 'text',
      },
      {
        name: 'Warm Walnut on Blush Pink',
        fg: colors.brand.walnut,
        bg: colors.neutral.blushPink,
        type: 'text',
      },
      {
        name: 'Warm Walnut on Warm Cream',
        fg: colors.brand.walnut,
        bg: colors.neutral.warmCream,
        type: 'text',
      },
      {
        name: 'Dusty Rose on Cream Pearl (large text only)',
        fg: colors.brand.rose,
        bg: colors.neutral.creamPearl,
        type: 'text-large',
      },
    ],
  },

  // Text on Dark Backgrounds
  {
    category: 'Text on Dark Backgrounds',
    pairs: [
      {
        name: 'White on Deep Brown',
        fg: colors.neutral.white,
        bg: colors.brand.walnutDeep,
        type: 'text',
      },
      {
        name: 'White on Warm Walnut',
        fg: colors.neutral.white,
        bg: colors.brand.walnut,
        type: 'text',
      },
    ],
  },

  // UI Components (Focus Rings, Borders)
  {
    category: 'UI Components',
    pairs: [
      {
        name: 'Focus Ring (Walnut) on Cream Pearl',
        fg: colors.brand.walnut,
        bg: colors.neutral.creamPearl,
        type: 'ui',
      },
      {
        name: 'Focus Ring (Walnut) on White',
        fg: colors.brand.walnut,
        bg: colors.neutral.white,
        type: 'ui',
      },
      {
        name: 'Focus Ring (Walnut) on Blush Pink',
        fg: colors.brand.walnut,
        bg: colors.neutral.blushPink,
        type: 'ui',
      },
      {
        name: 'Focus Ring (Walnut) on Warm Cream',
        fg: colors.brand.walnut,
        bg: colors.neutral.warmCream,
        type: 'ui',
      },
    ],
  },

  // Unsafe Combinations (Should NOT be used)
  {
    category: 'Unsafe Combinations (Documentation Only)',
    pairs: [
      {
        name: '❌ Champagne Gold on Cream Pearl',
        fg: colors.brand.gold,
        bg: colors.neutral.creamPearl,
        type: 'text',
      },
      {
        name: '❌ Sage Green on Cream Pearl',
        fg: colors.brand.sage,
        bg: colors.neutral.creamPearl,
        type: 'text',
      },
    ],
  },
];

// ============================================================================
// Run Tests
// ============================================================================

console.log('🎨 Color Contrast Testing - WCAG 2.2 Compliance\n');
console.log('='.repeat(80));
console.log('');

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

tests.forEach((testGroup) => {
  console.log(`\n${testGroup.category}`);
  console.log('-'.repeat(80));

  testGroup.pairs.forEach((pair) => {
    totalTests++;
    const ratio = contrastRatio(pair.fg, pair.bg);

    let level;
    let requirement;
    if (pair.type === 'text') {
      level = getTextLevel(ratio, false);
      requirement = 'Text: 4.5:1 (AA), 7:1 (AAA)';
    } else if (pair.type === 'text-large') {
      level = getTextLevel(ratio, true);
      requirement = 'Large Text: 3:1 (AA), 4.5:1 (AAA)';
    } else if (pair.type === 'ui') {
      level = getUILevel(ratio);
      requirement = 'UI: 3:1 (AA), 4.5:1 (AAA)';
    }

    const passed = level !== 'Fail';
    if (passed) passedTests++;
    else failedTests++;

    console.log(`\n  ${pair.name}`);
    console.log(`    Ratio: ${ratio.toFixed(2)}:1`);
    console.log(`    Level: ${formatLevel(level)}`);
    console.log(`    Requirement: ${requirement}`);
    console.log(`    Foreground: ${pair.fg}`);
    console.log(`    Background: ${pair.bg}`);
  });
});

// ============================================================================
// Summary
// ============================================================================

console.log('\n' + '='.repeat(80));
console.log('\n📊 Test Summary\n');
console.log(`  Total Tests: ${totalTests}`);
console.log(`  Passed: ${passedTests} ✅`);
console.log(`  Failed: ${failedTests} ❌`);
console.log(`  Pass Rate: ${((passedTests / totalTests) * 100).toFixed(1)}%`);
console.log('');

if (failedTests > 0) {
  console.log('⚠️  Some color combinations do not meet WCAG requirements!');
  console.log('   Review the unsafe combinations and avoid using them for text.');
  console.log('');
  process.exit(1);
} else {
  console.log('✅ All tested color combinations meet WCAG 2.2 Level AA requirements!');
  console.log('');
  process.exit(0);
}
