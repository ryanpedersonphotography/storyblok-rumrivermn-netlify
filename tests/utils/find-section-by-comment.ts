/**
 * Utility to find DOM elements by data-section attributes
 * Used for reliable section identification in CSS comparison tests
 *
 * Marker format: data-section="hero"
 */

import { Page, Locator } from '@playwright/test';

/**
 * Find a section element by its data-section attribute
 * @param page - Playwright page object
 * @param sectionName - Name of the section (e.g., 'hero', 'faq', 'testimonials')
 * @returns The section element or null if not found
 */
export async function findSectionByComment(
  page: Page,
  sectionName: string
): Promise<Locator | null> {
  // Look for element with data-section attribute
  const selector = `[data-section="${sectionName}"]`;
  const element = page.locator(selector).first();

  // Check if element exists
  const count = await element.count();
  if (count === 0) {
    return null;
  }

  return element;
}

/**
 * Wait for a section to be visible by its data-section attribute
 * @param page - Playwright page object
 * @param sectionName - Name of the section
 * @param timeout - Maximum time to wait in milliseconds (default: 10000)
 * @returns The section element or throws if not found
 */
export async function waitForSectionByComment(
  page: Page,
  sectionName: string,
  timeout: number = 10000
): Promise<Locator> {
  const selector = `[data-section="${sectionName}"]`;
  const element = page.locator(selector).first();

  try {
    await element.waitFor({ state: 'visible', timeout });
    return element;
  } catch (error) {
    throw new Error(`Section "${sectionName}" not found within ${timeout}ms`);
  }
}

/**
 * Check if a section exists by its data-section attribute
 * @param page - Playwright page object
 * @param sectionName - Name of the section
 * @returns true if the section exists, false otherwise
 */
export async function sectionExists(
  page: Page,
  sectionName: string
): Promise<boolean> {
  const element = await findSectionByComment(page, sectionName);
  return element !== null;
}
