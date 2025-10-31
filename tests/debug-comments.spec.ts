/**
 * Debug script to investigate comment nodes in the DOM
 * This will help us understand why section markers aren't being found
 */

import { test } from '@playwright/test';

test.describe('Comment Node Debugging', () => {
  test.use({ ignoreHTTPSErrors: true });

  test('List all comment nodes on hotfix page', async ({ page }) => {
    console.log('\n🔍 Debugging hotfix page comments...\n');

    await page.goto('https://localhost:9999/', {
      waitUntil: 'networkidle',
      timeout: 30000,
    });

    // Get all comment nodes
    const comments = await page.evaluate(() => {
      const iterator = document.createNodeIterator(
        document.body,
        NodeFilter.SHOW_COMMENT,
        null
      );

      const foundComments: Array<{
        text: string;
        parentTag: string;
        nextElementTag: string | null;
        nextElementClass: string | null;
      }> = [];

      let comment: Comment | null;
      while ((comment = iterator.nextNode() as Comment | null)) {
        const text = comment.textContent?.trim() || '';
        const parentTag = comment.parentElement?.tagName.toLowerCase() || 'no-parent';
        const nextElement = comment.nextElementSibling;

        foundComments.push({
          text,
          parentTag,
          nextElementTag: nextElement?.tagName.toLowerCase() || null,
          nextElementClass: nextElement?.className || null,
        });
      }

      return foundComments;
    });

    console.log(`Found ${comments.length} comment nodes:\n`);

    comments.forEach((comment, index) => {
      console.log(`Comment ${index + 1}:`);
      console.log(`  Text: "${comment.text}"`);
      console.log(`  Parent: <${comment.parentTag}>`);
      console.log(`  Next element: ${comment.nextElementTag ? `<${comment.nextElementTag}>` : 'none'}`);
      if (comment.nextElementClass) {
        console.log(`  Next element class: "${comment.nextElementClass}"`);
      }
      console.log('');
    });

    // Look specifically for section markers
    const sectionComments = comments.filter(c => c.text.includes('section:'));
    console.log(`\n✨ Found ${sectionComments.length} section marker comments\n`);

    sectionComments.forEach(comment => {
      console.log(`  ✓ ${comment.text}`);
    });
  });

  test('List all comment nodes on clean page', async ({ page }) => {
    console.log('\n🔍 Debugging clean page comments...\n');

    await page.goto('https://localhost:9999/clean', {
      waitUntil: 'networkidle',
      timeout: 30000,
    });

    const comments = await page.evaluate(() => {
      const iterator = document.createNodeIterator(
        document.body,
        NodeFilter.SHOW_COMMENT,
        null
      );

      const foundComments: Array<{
        text: string;
        parentTag: string;
        nextElementTag: string | null;
        nextElementClass: string | null;
      }> = [];

      let comment: Comment | null;
      while ((comment = iterator.nextNode() as Comment | null)) {
        const text = comment.textContent?.trim() || '';
        const parentTag = comment.parentElement?.tagName.toLowerCase() || 'no-parent';
        const nextElement = comment.nextElementSibling;

        foundComments.push({
          text,
          parentTag,
          nextElementTag: nextElement?.tagName.toLowerCase() || null,
          nextElementClass: nextElement?.className || null,
        });
      }

      return foundComments;
    });

    console.log(`Found ${comments.length} comment nodes:\n`);

    comments.forEach((comment, index) => {
      console.log(`Comment ${index + 1}:`);
      console.log(`  Text: "${comment.text}"`);
      console.log(`  Parent: <${comment.parentTag}>`);
      console.log(`  Next element: ${comment.nextElementTag ? `<${comment.nextElementTag}>` : 'none'}`);
      if (comment.nextElementClass) {
        console.log(`  Next element class: "${comment.nextElementClass}"`);
      }
      console.log('');
    });

    const sectionComments = comments.filter(c => c.text.includes('section:'));
    console.log(`\n✨ Found ${sectionComments.length} section marker comments\n`);

    sectionComments.forEach(comment => {
      console.log(`  ✓ ${comment.text}`);
    });
  });

  test('Check Hero component HTML structure', async ({ page }) => {
    console.log('\n🔍 Checking Hero component HTML...\n');

    await page.goto('https://localhost:9999/', {
      waitUntil: 'networkidle',
      timeout: 30000,
    });

    // Get the outer HTML of the first section on the page
    const heroHTML = await page.evaluate(() => {
      const firstSection = document.querySelector('section');
      return firstSection?.outerHTML.substring(0, 500) || 'No section found';
    });

    console.log('First 500 characters of first <section> element:');
    console.log(heroHTML);
  });
});
