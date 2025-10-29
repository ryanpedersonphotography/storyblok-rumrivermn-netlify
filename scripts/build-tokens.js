#!/usr/bin/env node

/**
 * Build CSS tokens from DTCG JSON using Style Dictionary v4
 *
 * Usage: node scripts/build-tokens.js
 */

const StyleDictionary = require('style-dictionary').default;
const fs = require('fs');
const path = require('path');

// Ensure output directory exists
const outputDir = path.join(__dirname, '../src/styles/tokens');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

console.log('🎨 Building design tokens...');
console.log('📁 Source: tokens/design-tokens.json');
console.log('📁 Output: src/styles/tokens/tokens.css');
console.log('');

// Style Dictionary v4 configuration
const sd = new StyleDictionary({
  source: ['tokens/design-tokens.json'],
  platforms: {
    css: {
      transformGroup: 'css',
      buildPath: 'src/styles/tokens/',
      files: [
        {
          destination: 'tokens.css',
          format: 'css/variables',
          options: {
            outputReferences: true,
            selector: ':root'
          }
        }
      ]
    }
  }
});

async function buildTokens() {
  try {
    await sd.buildAllPlatforms();
    console.log('✅ Tokens built successfully!');
    console.log('');
    console.log('Generated files:');
    console.log('  - src/styles/tokens/tokens.css');
  } catch (error) {
    console.error('❌ Token build failed:', error.message);
    console.error(error);
    process.exit(1);
  }
}

buildTokens();
