import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: 'tests',
  fullyParallel: true,
  timeout: 45_000,
  expect: {
    toHaveScreenshot: {
      maxDiffPixelRatio: 0.02, // tighten/loosen later
      animations: 'disabled',
    },
  },
  use: {
    headless: true,
    browserName: 'chromium',
    viewport: { width: 1280, height: 900 },
    deviceScaleFactor: 1, // keep stable
    colorScheme: 'light',
    timezoneId: 'America/Chicago',
    locale: 'en-US',
    javaScriptEnabled: true,
    ignoreHTTPSErrors: true,
  },
  reporter: [['list'], ['html', { open: 'never' }]],
});
