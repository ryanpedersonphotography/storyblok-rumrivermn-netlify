#!/usr/bin/env node

/**
 * CLI wrapper for CSS comparison tests
 * Makes it easy to run section comparisons from the command line
 *
 * Usage:
 *   node compare-section.mjs hero
 *   node compare-section.mjs faq
 *   node compare-section.mjs all
 */

import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const VALID_SECTIONS = [
  'hero',
  'faq',
  'testimonials',
  'gallery',
  'alternating-blocks',
  'spaces',
  'experience',
  'pricing',
  'brand-proof',
  'schedule-form',
  'map',
  'footer',
  'navbar',
];

// Parse command line arguments
const args = process.argv.slice(2);

if (args.length === 0) {
  console.log('Usage: node compare-section.mjs <section-name> [options]');
  console.log('');
  console.log('Section names:');
  VALID_SECTIONS.forEach((s) => console.log(`  - ${s}`));
  console.log('  - all (run all sections)');
  console.log('');
  console.log('Options:');
  console.log('  --tolerance=<percentage>  Set tolerance level (default: 1)');
  console.log('  --fail-on-critical        Fail test if critical differences found');
  console.log('');
  console.log('Examples:');
  console.log('  node compare-section.mjs hero');
  console.log('  node compare-section.mjs faq --tolerance=2');
  console.log('  node compare-section.mjs all --fail-on-critical');
  process.exit(0);
}

const sectionArg = args[0].toLowerCase();
const options = args.slice(1);

// Parse options
let tolerance = '1';
let failOnCritical = false;

for (const opt of options) {
  if (opt.startsWith('--tolerance=')) {
    tolerance = opt.split('=')[1];
  } else if (opt === '--fail-on-critical') {
    failOnCritical = true;
  }
}

// Validate section
if (sectionArg !== 'all' && !VALID_SECTIONS.includes(sectionArg)) {
  console.error(`❌ Invalid section: ${sectionArg}`);
  console.error('Valid sections:', VALID_SECTIONS.join(', '));
  process.exit(1);
}

// Build environment variables
const env = {
  ...process.env,
  TOLERANCE: tolerance,
};

if (failOnCritical) {
  env.FAIL_ON_CRITICAL = 'true';
}

// Build command
const playwrightArgs = ['test', 'tests/compare-css.spec.ts'];

if (sectionArg !== 'all') {
  env.SECTION = sectionArg;
  playwrightArgs.push('--grep', `Compare ${sectionArg} section`);
}

console.log('');
console.log('🎭 Running CSS Comparison');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log(`Section: ${sectionArg === 'all' ? 'ALL' : sectionArg}`);
console.log(`Tolerance: ${tolerance}%`);
console.log(`Fail on critical: ${failOnCritical ? 'Yes' : 'No'}`);
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('');

// Run Playwright test
const playwright = spawn('npx', ['playwright', ...playwrightArgs], {
  env,
  stdio: 'inherit',
  shell: true,
});

playwright.on('close', (code) => {
  if (code === 0) {
    console.log('');
    console.log('✅ Comparison completed successfully');
    console.log('');
    console.log('📁 Results saved to:');
    if (sectionArg === 'all') {
      VALID_SECTIONS.forEach((s) => {
        console.log(`   test-results/css-comparison-${s}.json`);
      });
    } else {
      console.log(`   test-results/css-comparison-${sectionArg}.json`);
    }
    console.log('');
  } else {
    console.error('');
    console.error(`❌ Comparison failed with code ${code}`);
    console.error('');
  }
  process.exit(code);
});

playwright.on('error', (err) => {
  console.error('❌ Failed to start Playwright:', err);
  process.exit(1);
});
