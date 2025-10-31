/**
 * Utility to extract computed CSS styles from DOM elements
 * Captures actual rendered values after all CSS variables are resolved
 */

import { Page, Locator } from '@playwright/test';

export interface ExtractedStyles {
  // Layout & Positioning
  position?: string;
  display?: string;
  flexDirection?: string;
  alignItems?: string;
  justifyContent?: string;
  gap?: string;

  // Dimensions
  width?: string;
  height?: string;
  minWidth?: string;
  maxWidth?: string;
  minHeight?: string;
  maxHeight?: string;

  // Spacing
  padding?: string;
  paddingTop?: string;
  paddingRight?: string;
  paddingBottom?: string;
  paddingLeft?: string;
  margin?: string;
  marginTop?: string;
  marginRight?: string;
  marginBottom?: string;
  marginLeft?: string;

  // Colors
  color?: string;
  backgroundColor?: string;
  borderColor?: string;

  // Typography
  fontFamily?: string;
  fontSize?: string;
  fontWeight?: string;
  lineHeight?: string;
  letterSpacing?: string;
  textAlign?: string;
  textTransform?: string;

  // Border & Effects
  border?: string;
  borderRadius?: string;
  boxShadow?: string;
  opacity?: string;

  // Transform & Animation
  transform?: string;
  transition?: string;

  // Z-index
  zIndex?: string;
}

/**
 * Extract computed styles from an element
 * @param page - Playwright page object
 * @param locator - Element locator
 * @returns Object containing computed style values
 */
export async function extractStyles(
  page: Page,
  locator: Locator
): Promise<ExtractedStyles> {
  const element = await locator.elementHandle();

  if (!element) {
    throw new Error('Element not found');
  }

  const styles = await page.evaluate((el) => {
    const computed = window.getComputedStyle(el);

    return {
      // Layout & Positioning
      position: computed.position,
      display: computed.display,
      flexDirection: computed.flexDirection,
      alignItems: computed.alignItems,
      justifyContent: computed.justifyContent,
      gap: computed.gap,

      // Dimensions
      width: computed.width,
      height: computed.height,
      minWidth: computed.minWidth,
      maxWidth: computed.maxWidth,
      minHeight: computed.minHeight,
      maxHeight: computed.maxHeight,

      // Spacing
      padding: computed.padding,
      paddingTop: computed.paddingTop,
      paddingRight: computed.paddingRight,
      paddingBottom: computed.paddingBottom,
      paddingLeft: computed.paddingLeft,
      margin: computed.margin,
      marginTop: computed.marginTop,
      marginRight: computed.marginRight,
      marginBottom: computed.marginBottom,
      marginLeft: computed.marginLeft,

      // Colors
      color: computed.color,
      backgroundColor: computed.backgroundColor,
      borderColor: computed.borderColor,

      // Typography
      fontFamily: computed.fontFamily,
      fontSize: computed.fontSize,
      fontWeight: computed.fontWeight,
      lineHeight: computed.lineHeight,
      letterSpacing: computed.letterSpacing,
      textAlign: computed.textAlign,
      textTransform: computed.textTransform,

      // Border & Effects
      border: computed.border,
      borderRadius: computed.borderRadius,
      boxShadow: computed.boxShadow,
      opacity: computed.opacity,

      // Transform & Animation
      transform: computed.transform,
      transition: computed.transition,

      // Z-index
      zIndex: computed.zIndex,
    };
  }, element);

  return styles;
}

/**
 * Extract styles from an element in a specific state
 * @param page - Playwright page object
 * @param locator - Element locator
 * @param state - State to test ('hover', 'focus', 'active')
 * @returns Object containing computed style values in that state
 */
export async function extractStylesInState(
  page: Page,
  locator: Locator,
  state: 'hover' | 'focus' | 'active'
): Promise<ExtractedStyles> {
  // Trigger the state
  switch (state) {
    case 'hover':
      await locator.hover();
      break;
    case 'focus':
      await locator.focus();
      break;
    case 'active':
      // Active state is tricky - we'll use a mouse down without release
      await locator.dispatchEvent('mousedown');
      break;
  }

  // Wait a bit for CSS transitions to settle
  await page.waitForTimeout(100);

  // Extract styles
  const styles = await extractStyles(page, locator);

  // Clean up active state if needed
  if (state === 'active') {
    await locator.dispatchEvent('mouseup');
  }

  return styles;
}

/**
 * Extract styles from multiple child elements within a parent
 * @param page - Playwright page object
 * @param parentLocator - Parent element locator
 * @param childSelector - CSS selector for child elements
 * @returns Array of style objects for each child
 */
export async function extractChildrenStyles(
  page: Page,
  parentLocator: Locator,
  childSelector: string
): Promise<ExtractedStyles[]> {
  const children = parentLocator.locator(childSelector);
  const count = await children.count();

  const stylesArray: ExtractedStyles[] = [];

  for (let i = 0; i < count; i++) {
    const child = children.nth(i);
    const styles = await extractStyles(page, child);
    stylesArray.push(styles);
  }

  return stylesArray;
}
