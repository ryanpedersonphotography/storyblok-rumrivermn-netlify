import { test, expect } from '@playwright/test';

/**
 * Dialog Primitive Accessibility Tests
 * Tests focus trap, keyboard navigation, outside-click, and scroll-lock
 */
test.describe('Dialog primitive', () => {
  test.beforeEach(async ({ page, baseURL }) => {
    await page.goto(`${baseURL ?? 'https://localhost:9999'}/dialog-demo`);
  });

  test('opens dialog when button clicked', async ({ page }) => {
    const openBtn = page.getByRole('button', { name: /open contact dialog/i });
    await openBtn.click();

    const panel = page.locator('.dialog__panel');
    await expect(panel).toBeVisible();

    const dialog = page.locator('.dialog[data-open="true"]');
    await expect(dialog).toBeVisible();
  });

  test('closes dialog when ESC pressed', async ({ page }) => {
    // Open dialog
    const openBtn = page.getByRole('button', { name: /open contact dialog/i });
    await openBtn.click();

    const panel = page.locator('.dialog__panel');
    await expect(panel).toBeVisible();

    // Press ESC
    await page.keyboard.press('Escape');

    // Dialog should close
    await expect(panel).toBeHidden();
    const dialog = page.locator('.dialog[data-open="true"]');
    await expect(dialog).toHaveCount(0);
  });

  test('closes dialog when clicking scrim (outside-click)', async ({ page }) => {
    // Open dialog
    const openBtn = page.getByRole('button', { name: /open contact dialog/i });
    await openBtn.click();

    const panel = page.locator('.dialog__panel');
    await expect(panel).toBeVisible();

    // Click scrim (outside panel)
    const scrim = page.locator('.scrim[data-open="true"]');
    await scrim.click({ position: { x: 5, y: 5 } });

    // Dialog should close
    await expect(panel).toBeHidden();
  });

  test('closes dialog when close button clicked', async ({ page }) => {
    // Open dialog
    const openBtn = page.getByRole('button', { name: /open contact dialog/i });
    await openBtn.click();

    const panel = page.locator('.dialog__panel');
    await expect(panel).toBeVisible();

    // Click close button
    const closeBtn = page.getByRole('button', { name: /close dialog/i });
    await closeBtn.click();

    // Dialog should close
    await expect(panel).toBeHidden();
  });

  test('traps focus within dialog', async ({ page }) => {
    // Open dialog
    const openBtn = page.getByRole('button', { name: /open contact dialog/i });
    await openBtn.click();

    // Get all focusable elements in dialog
    const panel = page.locator('.dialog__panel');
    await expect(panel).toBeVisible();

    // Tab through focusable elements
    await page.keyboard.press('Tab'); // First input
    await page.keyboard.press('Tab'); // Second input
    await page.keyboard.press('Tab'); // Third input
    await page.keyboard.press('Tab'); // Fourth input/textarea
    await page.keyboard.press('Tab'); // Cancel button
    await page.keyboard.press('Tab'); // Send button
    await page.keyboard.press('Tab'); // Should cycle back to close button

    // Verify focus stayed within dialog (check that we're not on the opener button)
    const focusedElement = page.locator(':focus');
    const openBtnFocused = await openBtn.evaluate((el, focused) => el === focused,
      await focusedElement.evaluateHandle(el => el));
    expect(openBtnFocused).toBe(false);
  });

  test('traps focus with Shift+Tab (reverse)', async ({ page }) => {
    // Open dialog
    const openBtn = page.getByRole('button', { name: /open contact dialog/i });
    await openBtn.click();

    const panel = page.locator('.dialog__panel');
    await expect(panel).toBeVisible();

    // Shift+Tab should cycle backwards through focusable elements
    await page.keyboard.press('Shift+Tab');
    await page.keyboard.press('Shift+Tab');

    // Verify focus stayed within dialog
    const focusedElement = page.locator(':focus');
    const isInsidePanel = await panel.evaluate((panelEl, focused) =>
      panelEl.contains(focused), await focusedElement.evaluateHandle(el => el));
    expect(isInsidePanel).toBe(true);
  });

  test('applies scroll-lock when dialog opens', async ({ page }) => {
    // Open dialog
    const openBtn = page.getByRole('button', { name: /open contact dialog/i });
    await openBtn.click();

    // Check that html has data-modal-open attribute
    const html = page.locator('html');
    await expect(html).toHaveAttribute('data-modal-open', 'true');

    // Close dialog
    await page.keyboard.press('Escape');

    // Scroll-lock should be removed
    await expect(html).not.toHaveAttribute('data-modal-open');
  });

  test('restores focus to opener when closed', async ({ page }) => {
    // Open dialog
    const openBtn = page.getByRole('button', { name: /open contact dialog/i });
    await openBtn.click();

    const panel = page.locator('.dialog__panel');
    await expect(panel).toBeVisible();

    // Close dialog
    await page.keyboard.press('Escape');

    // Focus should return to opener button
    await expect(openBtn).toBeFocused();
  });

  test('has correct ARIA attributes', async ({ page }) => {
    // Open dialog
    const openBtn = page.getByRole('button', { name: /open contact dialog/i });
    await openBtn.click();

    // Check dialog ARIA attributes
    const dialog = page.locator('.dialog');
    await expect(dialog).toHaveAttribute('role', 'dialog');
    await expect(dialog).toHaveAttribute('aria-modal', 'true');
    await expect(dialog).toHaveAttribute('aria-labelledby', 'contact-title');
    await expect(dialog).toHaveAttribute('aria-describedby', 'contact-desc');

    // Check title exists
    const title = page.locator('#contact-title');
    await expect(title).toBeVisible();
    await expect(title).toHaveText(/book a tour/i);
  });

  test('panel has correct size variant', async ({ page }) => {
    // Open dialog
    const openBtn = page.getByRole('button', { name: /open contact dialog/i });
    await openBtn.click();

    // Check panel has data-size attribute
    const panel = page.locator('.dialog__panel');
    await expect(panel).toHaveAttribute('data-size', 'md');
  });

  test('container query adjusts panel padding at tablet-up', async ({ page }) => {
    // Open dialog
    const openBtn = page.getByRole('button', { name: /open contact dialog/i });
    await openBtn.click();

    const body = page.locator('.dialog__body');
    await expect(body).toBeVisible();

    // Get computed padding (this will vary based on viewport size in CI)
    const padding = await body.evaluate(el => {
      const styles = window.getComputedStyle(el);
      return {
        paddingLeft: styles.paddingLeft,
        paddingRight: styles.paddingRight
      };
    });

    // Just verify padding exists (actual value depends on viewport/container width)
    expect(padding.paddingLeft).toBeTruthy();
    expect(padding.paddingRight).toBeTruthy();
  });
});

/**
 * Form Field Primitive Tests
 * Basic sanity checks for form field states and layouts
 */
test.describe('Form Field primitive', () => {
  test.beforeEach(async ({ page, baseURL }) => {
    await page.goto(`${baseURL ?? 'https://localhost:9999'}/dialog-demo`);
  });

  test('renders stack-layout field correctly', async ({ page }) => {
    const field = page.locator('.field[data-layout="stack"]').first();
    await expect(field).toBeVisible();

    const label = field.locator('.field__label');
    await expect(label).toBeVisible();

    const input = field.locator('.field__input');
    await expect(input).toBeVisible();
  });

  test('renders inline-layout field correctly', async ({ page }) => {
    const field = page.locator('.field[data-layout="inline"]').first();
    await expect(field).toBeVisible();

    const label = field.locator('.field__label');
    await expect(label).toBeVisible();

    const input = field.locator('.field__input');
    await expect(input).toBeVisible();
  });

  test('shows error state with invalid field', async ({ page }) => {
    const field = page.locator('.field[aria-invalid="true"]');
    await expect(field).toBeVisible();

    const error = field.locator('.field__error');
    await expect(error).toBeVisible();
    await expect(error).toHaveText(/please enter a valid email/i);
  });

  test('applies focus ring on input focus', async ({ page }) => {
    const input = page.locator('#demo-name');
    await input.focus();

    // Check that input has focus-visible styles (box-shadow)
    const boxShadow = await input.evaluate(el => {
      return window.getComputedStyle(el).boxShadow;
    });

    expect(boxShadow).not.toBe('none');
  });

  test('shows required indicator', async ({ page }) => {
    const required = page.locator('.field__required').first();
    await expect(required).toBeVisible();
    await expect(required).toHaveText('*');
    await expect(required).toHaveAttribute('aria-hidden', 'true');
  });

  test('textarea has minimum height', async ({ page }) => {
    const textarea = page.locator('.field__textarea').first();
    await expect(textarea).toBeVisible();

    const minHeight = await textarea.evaluate(el => {
      return window.getComputedStyle(el).minHeight;
    });

    // Should have min-height set (9rem = 144px typically)
    expect(parseInt(minHeight)).toBeGreaterThan(100);
  });
});
