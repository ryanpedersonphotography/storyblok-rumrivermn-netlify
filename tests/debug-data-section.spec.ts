/**
 * Debug script to verify data-section attributes are rendering
 */

import { test } from '@playwright/test';

test.describe('Data Section Debugging', () => {
  test.use({ ignoreHTTPSErrors: true });

  test('List all data-section attributes on hotfix page', async ({ page }) => {
    console.log('\n🔍 Debugging hotfix page data-section attributes...\n');

    await page.goto('https://localhost:9999/', {
      waitUntil: 'networkidle',
      timeout: 30000,
    });

    // Get all elements with data-section
    const sections = await page.evaluate(() => {
      const elements = document.querySelectorAll('[data-section]');
      return Array.from(elements).map(el => ({
        tag: el.tagName.toLowerCase(),
        section: el.getAttribute('data-section'),
        classes: el.className,
        id: el.id,
      }));
    });

    console.log(`Found ${sections.length} elements with data-section:\n`);

    sections.forEach((section, index) => {
      console.log(`Element ${index + 1}:`);
      console.log(`  Tag: <${section.tag}>`);
      console.log(`  data-section: "${section.section}"`);
      console.log(`  classes: "${section.classes}"`);
      if (section.id) console.log(`  id: "${section.id}"`);
      console.log('');
    });
  });

  test('List all data-section attributes on clean page', async ({ page }) => {
    console.log('\n🔍 Debugging clean page data-section attributes...\n');

    await page.goto('https://localhost:9999/clean', {
      waitUntil: 'networkidle',
      timeout: 30000,
    });

    const sections = await page.evaluate(() => {
      const elements = document.querySelectorAll('[data-section]');
      return Array.from(elements).map(el => ({
        tag: el.tagName.toLowerCase(),
        section: el.getAttribute('data-section'),
        classes: el.className,
        id: el.id,
      }));
    });

    console.log(`Found ${sections.length} elements with data-section:\n`);

    sections.forEach((section, index) => {
      console.log(`Element ${index + 1}:`);
      console.log(`  Tag: <${section.tag}>`);
      console.log(`  data-section: "${section.section}"`);
      console.log(`  classes: "${section.classes}"`);
      if (section.id) console.log(`  id: "${section.id}"`);
      console.log('');
    });
  });

  test('Test direct selector for hero section', async ({ page }) => {
    console.log('\n🔍 Testing direct selector for hero section...\n');

    await page.goto('https://localhost:9999/', {
      waitUntil: 'networkidle',
      timeout: 30000,
    });

    // Try to find hero with data-section selector
    const heroSelector = '[data-section="hero"]';
    const hero = page.locator(heroSelector).first();
    const count = await hero.count();

    console.log(`Selector: ${heroSelector}`);
    console.log(`Count: ${count}`);

    if (count > 0) {
      const tagName = await hero.evaluate(el => el.tagName.toLowerCase());
      const classes = await hero.evaluate(el => el.className);
      console.log(`Found: <${tagName} class="${classes}">`);
    } else {
      console.log('❌ Hero section not found with data-section attribute');
    }
  });
});
