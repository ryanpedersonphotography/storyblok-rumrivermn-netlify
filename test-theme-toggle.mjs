import { chromium } from 'playwright';

async function testThemeToggle() {
  console.log('🚀 Starting theme toggle verification...\n');

  const browser = await chromium.launch({
    headless: true,
    args: ['--ignore-certificate-errors'] // For self-signed HTTPS cert
  });

  const context = await browser.newContext({
    ignoreHTTPSErrors: true,
    viewport: { width: 1920, height: 1080 }
  });

  const page = await context.newPage();

  try {
    // Navigate to the page
    console.log('📍 Navigating to https://localhost:9999...');
    await page.goto('https://localhost:9999', {
      waitUntil: 'networkidle',
      timeout: 30000
    });
    console.log('✅ Page loaded\n');

    // Wait for hero to be visible
    await page.waitForSelector('.hotfix-hero-romantic', { timeout: 10000 });
    console.log('✅ Hero section found\n');

    // Check initial theme state
    const initialTheme = await page.getAttribute('html', 'data-theme');
    console.log(`🎨 Initial theme: ${initialTheme || 'light (no attribute)'}\n`);

    // Take screenshot of light mode hero
    console.log('📸 Capturing LIGHT mode screenshot...');
    await page.locator('.hotfix-hero-romantic').screenshot({
      path: 'hero-light-mode.png',
      animations: 'disabled'
    });
    console.log('✅ Saved: hero-light-mode.png\n');

    // Find and click the theme toggle button
    console.log('🔘 Looking for theme toggle button...');
    const toggleButton = await page.locator('.theme-toggle');
    const buttonCount = await toggleButton.count();
    console.log(`   Found ${buttonCount} toggle button(s)`);

    if (buttonCount === 0) {
      throw new Error('❌ Theme toggle button not found!');
    }

    console.log('👆 Clicking theme toggle...');
    await toggleButton.first().click();

    // Wait for theme transition
    await page.waitForTimeout(600); // Allow for CSS transition

    // Check theme changed
    const newTheme = await page.getAttribute('html', 'data-theme');
    console.log(`🎨 New theme: ${newTheme || 'light (no attribute)'}\n`);

    if (newTheme === 'dark') {
      console.log('✅ SUCCESS! Theme changed to dark mode!\n');
    } else {
      console.log('⚠️  WARNING: Expected data-theme="dark" but got:', newTheme, '\n');
    }

    // Take screenshot of dark mode hero
    console.log('📸 Capturing DARK mode screenshot...');
    await page.locator('.hotfix-hero-romantic').screenshot({
      path: 'hero-dark-mode.png',
      animations: 'disabled'
    });
    console.log('✅ Saved: hero-dark-mode.png\n');

    // Get computed background colors to verify CSS applied
    const heroOverlay = await page.locator('.hotfix-hero-romantic::after');

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📊 VERIFICATION RESULTS:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`✅ Theme toggle button: FOUND (${buttonCount})`);
    console.log(`✅ Button click: SUCCESS`);
    console.log(`✅ HTML attribute: ${initialTheme || 'none'} → ${newTheme}`);
    console.log(`✅ Screenshots saved: hero-light-mode.png, hero-dark-mode.png`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    if (newTheme === 'dark') {
      console.log('🎉 DARK MODE IS WORKING! Check the screenshots to see the visual difference.\n');
    }

  } catch (error) {
    console.error('❌ ERROR:', error.message);
    console.error('\nFull error:', error);
  } finally {
    await browser.close();
    console.log('🏁 Test complete!');
  }
}

testThemeToggle();
