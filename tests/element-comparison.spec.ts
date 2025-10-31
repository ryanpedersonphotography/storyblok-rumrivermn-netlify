import { test } from '@playwright/test';

const ORIGIN = process.env.E2E_ORIGIN ?? 'https://localhost:9999';

test('compare ALL elements between hotfix and clean', async ({ page }) => {
  // Analyze hotfix version
  await page.goto(`${ORIGIN}/`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  const hotfixElements = await page.evaluate(() => {
    const navbar = document.querySelector('.hotfix-navbar');
    const hero = document.querySelector('.hotfix-hero-romantic');

    return {
      navbar: {
        exists: !!navbar,
        classes: navbar?.className || '',
        children: Array.from(navbar?.querySelectorAll('*') || []).map((el) => ({
          tag: el.tagName.toLowerCase(),
          class: el.className,
          text: el.textContent?.trim().substring(0, 50),
        })),
        childCount: navbar?.querySelectorAll('*').length || 0,
      },
      hero: {
        exists: !!hero,
        classes: hero?.className || '',
        children: Array.from(hero?.querySelectorAll('*') || []).map((el) => ({
          tag: el.tagName.toLowerCase(),
          class: el.className,
          text: el.textContent?.trim().substring(0, 50),
        })),
        childCount: hero?.querySelectorAll('*').length || 0,
      },
    };
  });

  // Analyze clean version
  await page.goto(`${ORIGIN}/clean`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  const cleanElements = await page.evaluate(() => {
    const navbar = document.querySelector('.navbar');
    const hero = document.querySelector('.hero');

    return {
      navbar: {
        exists: !!navbar,
        classes: navbar?.className || '',
        children: Array.from(navbar?.querySelectorAll('*') || []).map((el) => ({
          tag: el.tagName.toLowerCase(),
          class: el.className,
          text: el.textContent?.trim().substring(0, 50),
        })),
        childCount: navbar?.querySelectorAll('*').length || 0,
      },
      hero: {
        exists: !!hero,
        classes: hero?.className || '',
        children: Array.from(hero?.querySelectorAll('*') || []).map((el) => ({
          tag: el.tagName.toLowerCase(),
          class: el.className,
          text: el.textContent?.trim().substring(0, 50),
        })),
        childCount: hero?.querySelectorAll('*').length || 0,
      },
    };
  });

  console.log('\n=== NAVBAR COMPARISON ===');
  console.log(`Hotfix child count: ${hotfixElements.navbar.childCount}`);
  console.log(`Clean child count: ${cleanElements.navbar.childCount}`);
  console.log('\nHotfix navbar children (first 20):');
  hotfixElements.navbar.children.slice(0, 20).forEach((el, i) => {
    console.log(`  ${i + 1}. <${el.tag}> .${el.class}`);
  });
  console.log('\nClean navbar children (first 20):');
  cleanElements.navbar.children.slice(0, 20).forEach((el, i) => {
    console.log(`  ${i + 1}. <${el.tag}> .${el.class}`);
  });

  console.log('\n=== HERO COMPARISON ===');
  console.log(`Hotfix child count: ${hotfixElements.hero.childCount}`);
  console.log(`Clean child count: ${cleanElements.hero.childCount}`);
  console.log('\nHotfix hero children:');
  hotfixElements.hero.children.forEach((el, i) => {
    console.log(`  ${i + 1}. <${el.tag}> .${el.class} - "${el.text}"`);
  });
  console.log('\nClean hero children:');
  cleanElements.hero.children.forEach((el, i) => {
    console.log(`  ${i + 1}. <${el.tag}> .${el.class} - "${el.text}"`);
  });

  // Count differences
  const navbarDiff = Math.abs(hotfixElements.navbar.childCount - cleanElements.navbar.childCount);
  const heroDiff = Math.abs(hotfixElements.hero.childCount - cleanElements.hero.childCount);

  console.log('\n=== SUMMARY ===');
  console.log(`Navbar element difference: ${navbarDiff} elements`);
  console.log(`Hero element difference: ${heroDiff} elements`);

  if (navbarDiff > 0 || heroDiff > 0) {
    console.log('\n⚠️  DIFFERENCES FOUND - Clean version is missing elements!');
  } else {
    console.log('\n✅ Element counts match!');
  }
});
