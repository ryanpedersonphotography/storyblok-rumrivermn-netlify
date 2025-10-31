import { chromium } from 'playwright';

async function testPort7777() {
  console.log('🔍 Testing PORT 7777...\n');

  const browser = await chromium.launch({
    headless: true,
    args: ['--ignore-certificate-errors']
  });

  const context = await browser.newContext({
    ignoreHTTPSErrors: true,
    viewport: { width: 1920, height: 1080 }
  });

  const page = await context.newPage();

  try {
    console.log('📍 Navigating to http://localhost:7777...');
    await page.goto('http://localhost:7777', {
      waitUntil: 'networkidle',
      timeout: 30000
    });
    console.log('✅ Page loaded\n');

    // Check for theme toggle button
    const toggleButton = await page.locator('.theme-toggle');
    const buttonCount = await toggleButton.count();
    console.log(`🔘 Theme toggle buttons found: ${buttonCount}\n`);

    if (buttonCount === 0) {
      console.log('❌ NO THEME TOGGLE BUTTON ON PORT 7777!\n');
      console.log('This is likely a different branch/worktree without the theme toggle.\n');
    } else {
      console.log('✅ Theme toggle exists on port 7777\n');
    }

    // Check for dark mode CSS
    const initialTheme = await page.getAttribute('html', 'data-theme');
    console.log(`🎨 Initial theme: ${initialTheme || 'none (light)'}\n`);

  } catch (error) {
    console.error('❌ ERROR:', error.message);
  } finally {
    await browser.close();
  }
}

testPort7777();
