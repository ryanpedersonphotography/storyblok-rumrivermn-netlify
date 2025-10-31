/**
 * CSS Comparison Test Suite
 * Compares computed styles between hotfix and clean implementations
 * Uses comment markers to reliably identify sections
 */

import { test, expect } from '@playwright/test';
import { findSectionByComment, waitForSectionByComment } from './utils/find-section-by-comment';
import { extractStyles } from './utils/extract-styles';
import { compareStyles } from './utils/compare-styles';
import * as fs from 'fs';
import * as path from 'path';

// Section mapping - maps section names to their markers
const SECTIONS = {
  hero: 'hero',
  faq: 'faq',
  testimonials: 'testimonials',
  gallery: 'gallery',
  'alternating-blocks': 'alternating-blocks',
  spaces: 'spaces',
  experience: 'experience',
  pricing: 'pricing',
  'brand-proof': 'brand-proof',
  'schedule-form': 'schedule-form',
  map: 'map',
  footer: 'footer',
  navbar: 'navbar',
};

// URLs
const HOTFIX_URL = 'https://localhost:9999/';
const CLEAN_URL = 'https://localhost:9999/clean';

// Get section from environment variable or run all
const TARGET_SECTION = process.env.SECTION;

// Tolerance for numeric comparisons (percentage)
const TOLERANCE = parseFloat(process.env.TOLERANCE || '1');

test.describe('CSS Section Comparison', () => {
  test.use({ ignoreHTTPSErrors: true });

  // Generate tests for each section or just the target section
  const sectionsToTest = TARGET_SECTION
    ? { [TARGET_SECTION]: SECTIONS[TARGET_SECTION as keyof typeof SECTIONS] }
    : SECTIONS;

  for (const [sectionName, marker] of Object.entries(sectionsToTest)) {
    if (!marker) {
      console.warn(`Skipping ${sectionName}: no marker defined`);
      continue;
    }

    test(`Compare ${sectionName} section`, async ({ page }) => {
      console.log(`\n🔍 Comparing section: ${sectionName}`);

      // Navigate to hotfix version
      console.log(`📍 Loading hotfix: ${HOTFIX_URL}`);
      await page.goto(HOTFIX_URL, {
        waitUntil: 'networkidle',
        timeout: 30000,
      });

      // Find and extract hotfix styles
      console.log(`🔎 Finding hotfix section: ${marker}`);
      const hotfixSection = await waitForSectionByComment(page, marker, 15000);
      expect(hotfixSection).toBeTruthy();

      console.log('📊 Extracting hotfix styles...');
      const hotfixStyles = await extractStyles(page, hotfixSection);

      // Navigate to clean version
      console.log(`📍 Loading clean: ${CLEAN_URL}`);
      await page.goto(CLEAN_URL, {
        waitUntil: 'networkidle',
        timeout: 30000,
      });

      // Find and extract clean styles
      console.log(`🔎 Finding clean section: ${marker}`);
      const cleanSection = await waitForSectionByComment(page, marker, 15000);
      expect(cleanSection).toBeTruthy();

      console.log('📊 Extracting clean styles...');
      const cleanStyles = await extractStyles(page, cleanSection);

      // Compare styles
      console.log('⚖️  Comparing styles...');
      const comparison = compareStyles(
        sectionName,
        HOTFIX_URL,
        CLEAN_URL,
        hotfixStyles,
        cleanStyles,
        TOLERANCE
      );

      // Output results
      console.log('\n📋 Comparison Summary:');
      console.log(`   Total properties: ${comparison.summary.totalProperties}`);
      console.log(`   ✓ Matches: ${comparison.summary.matches}`);
      console.log(`   ⚠ Differences: ${comparison.summary.differences}`);
      console.log(`     - Minor (≤${TOLERANCE}%): ${comparison.summary.minorDiffs}`);
      console.log(`     - Warning: ${comparison.summary.warningDiffs}`);
      console.log(`     - Critical: ${comparison.summary.criticalDiffs}`);

      // Save results to JSON
      const resultsDir = path.join(process.cwd(), 'test-results');
      if (!fs.existsSync(resultsDir)) {
        fs.mkdirSync(resultsDir, { recursive: true });
      }

      const resultsFile = path.join(resultsDir, `css-comparison-${sectionName}.json`);
      fs.writeFileSync(resultsFile, JSON.stringify(comparison, null, 2));
      console.log(`\n💾 Results saved to: ${resultsFile}`);

      // Log critical differences
      if (comparison.summary.criticalDiffs > 0) {
        console.log('\n❌ Critical Differences:');
        comparison.differences
          .filter((d) => d.severity === 'critical')
          .forEach((d) => {
            console.log(`   ${d.property}:`);
            console.log(`     Hotfix: ${d.hotfixValue}`);
            console.log(`     Clean:  ${d.cleanValue}`);
          });
      }

      // Optionally fail test on critical differences
      if (process.env.FAIL_ON_CRITICAL === 'true') {
        expect(comparison.summary.criticalDiffs).toBe(0);
      }
    });
  }
});

test.describe('Section Existence Checks', () => {
  test.use({ ignoreHTTPSErrors: true });

  test('Verify all sections have comment markers', async ({ page }) => {

    // Check hotfix
    await page.goto(HOTFIX_URL, { waitUntil: 'networkidle' });
    for (const [name, marker] of Object.entries(SECTIONS)) {
      const section = await findSectionByComment(page, marker);
      expect(section, `Hotfix missing section: ${name}`).toBeTruthy();
    }

    // Check clean
    await page.goto(CLEAN_URL, { waitUntil: 'networkidle' });
    for (const [name, marker] of Object.entries(SECTIONS)) {
      const section = await findSectionByComment(page, marker);
      expect(section, `Clean missing section: ${name}`).toBeTruthy();
    }

    console.log('✅ All sections have comment markers on both versions');
  });
});
