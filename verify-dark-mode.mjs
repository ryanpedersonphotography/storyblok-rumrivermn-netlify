import puppeteer from 'puppeteer';
import { writeFileSync } from 'fs';

async function verifyDarkMode() {
  console.log('🚀 Launching browser...');
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--ignore-certificate-errors']
  });
  const page = await browser.newPage();

  // Set viewport
  await page.setViewport({ width: 1920, height: 1080 });

  // Navigate to the site
  console.log('📍 Navigating to https://localhost:9999...');
  await page.goto('https://localhost:9999', { waitUntil: 'networkidle0' });

  // Wait for page to fully load
  await new Promise(resolve => setTimeout(resolve, 2000));

  // Force dark mode
  console.log('🌙 Setting dark mode...');
  await page.evaluate(() => {
    document.documentElement.setAttribute('data-theme', 'dark');
  });

  await new Promise(resolve => setTimeout(resolve, 1000));

  // Take full page screenshot
  console.log('📸 Taking full page screenshot...');
  await page.screenshot({
    path: 'dark-mode-full-page.png',
    fullPage: true
  });

  console.log('✅ Screenshot saved: dark-mode-full-page.png');

  // Now analyze the colors of each section
  console.log('\n🎨 Analyzing section backgrounds...');

  const sections = [
    { name: 'Hero', selector: '.hotfix-hero-romantic' },
    { name: 'Spaces', selector: '.spaces-section' },
    { name: 'Alternating Blocks', selector: '.hotfix-alternating-blocks' },
    { name: 'Rum River Experience', selector: '.rum-river-experience' },
    { name: 'Love Stories Gallery', selector: '.love-stories-gallery' },
    { name: 'Brand Social Proof', selector: '.hotfix-brand-quote-section' },
    { name: 'Testimonials', selector: '.hotfix-social-proof' },
    { name: 'History Carousel', selector: '.hotfix-history-section' },
    { name: 'Pricing', selector: '.pricing-section' },
    { name: 'Schedule Form', selector: '.hotfix-schedule-tour' },
    { name: 'Map', selector: '.hotfix-map-section' },
    { name: 'Footer', selector: '.hotfix-footer' }
  ];

  const results = [];

  for (const section of sections) {
    const color = await page.evaluate((selector) => {
      const element = document.querySelector(selector);
      if (!element) return null;

      const style = window.getComputedStyle(element);
      return {
        background: style.backgroundColor,
        backgroundImage: style.backgroundImage
      };
    }, section.selector);

    if (color) {
      results.push({
        section: section.name,
        selector: section.selector,
        ...color
      });

      console.log(`\n${section.name}:`);
      console.log(`  Background: ${color.background}`);
      console.log(`  BG Image: ${color.backgroundImage.substring(0, 100)}${color.backgroundImage.length > 100 ? '...' : ''}`);
    } else {
      console.log(`\n❌ ${section.name}: Element not found (${section.selector})`);
    }
  }

  // Save results to file
  writeFileSync('dark-mode-analysis.json', JSON.stringify(results, null, 2));
  console.log('\n📊 Analysis saved to dark-mode-analysis.json');

  // Check if CSS variables are defined
  console.log('\n🔍 Checking CSS variables...');
  const cssVars = await page.evaluate(() => {
    const root = document.documentElement;
    const computedStyle = window.getComputedStyle(root);

    return {
      'surface-0': computedStyle.getPropertyValue('--surface-0'),
      'surface-1': computedStyle.getPropertyValue('--surface-1'),
      'surface-2': computedStyle.getPropertyValue('--surface-2'),
      'surface-3': computedStyle.getPropertyValue('--surface-3'),
      'surface-4': computedStyle.getPropertyValue('--surface-4'),
      'rose-veil-8': computedStyle.getPropertyValue('--rose-veil-8'),
      'grad-section-soft': computedStyle.getPropertyValue('--grad-section-soft'),
      'grad-section-deep': computedStyle.getPropertyValue('--grad-section-deep'),
      'glass-bg': computedStyle.getPropertyValue('--glass-bg')
    };
  });

  console.log('\nCSS Variables:');
  for (const [key, value] of Object.entries(cssVars)) {
    console.log(`  --${key}: ${value || '❌ NOT DEFINED'}`);
  }

  await browser.close();
  console.log('\n✅ Done!');
}

verifyDarkMode().catch(console.error);
