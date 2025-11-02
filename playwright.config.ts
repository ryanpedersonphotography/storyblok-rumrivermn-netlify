import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright Configuration for Container Query Visual Regression Testing
 *
 * This config defines two projects:
 * - 'cq': Standard Chromium with container queries enabled (default)
 * - 'no-cq': Chromium with --disable-blink-features=CSSContainerQueries
 *
 * Visual snapshots are shared between projects to detect fallback drift.
 */
export default defineConfig({
  testDir: 'tests',
  fullyParallel: true,

  use: {
    baseURL: process.env.PW_BASE_URL ?? 'https://localhost:9999',
    viewport: { width: 1200, height: 900 },
    colorScheme: 'light',
    locale: 'en-US',
    timezoneId: 'America/Chicago',
    ignoreHTTPSErrors: true,
    video: 'off',
    screenshot: 'on',
    trace: 'off'
  },

  // Shared snapshot path ensures cq and no-cq projects use same baseline
  snapshotPathTemplate: '{testDir}/__screenshots__/{testFilePath}/{arg}{ext}',

  projects: [
    {
      name: 'cq',
      use: { ...devices['Desktop Chrome'] }
    },
    {
      name: 'no-cq',
      use: {
        ...devices['Desktop Chrome'],
        launchOptions: {
          args: ['--disable-blink-features=CSSContainerQueries']
        }
      }
    }
  ],
});
