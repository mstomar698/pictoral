import { test, expect } from '@playwright/test';

test.describe('Pictoral editor shell', () => {
  test('loads the editor home page with branding', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('link', { name: 'Pictoral' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Login' })).toBeVisible();
  });

  test('renders the canvas workspace', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('#canvas')).toBeVisible();
    await expect(page.locator('#canvas-container')).toBeVisible();
  });

  test('shows the tool pane sidebar', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('#tool-prop-list')).toBeAttached();
    const toolIcons = page.locator('.tool-icon');
    await expect(toolIcons.first()).toBeVisible();
  });

  test('navigates to the login page', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: 'Login' }).click();
    await expect(page).toHaveURL(/\/login$/);
    await expect(page.getByText('LOGIN PAGE')).toBeVisible();
  });

  test('returns to the editor from login', async ({ page }) => {
    await page.goto('/login');
    await page.getByRole('link', { name: 'Pictoral' }).click();
    await expect(page).toHaveURL(/\/$/);
    await expect(page.locator('#canvas')).toBeVisible();
  });
});
