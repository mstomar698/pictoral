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

  test('shows undo and redo controls in subheader', async ({ page }) => {
    await page.goto('/');
    const undo = page.getByTitle('Undo (Ctrl+Z)');
    const redo = page.getByTitle('Redo (Ctrl+Y)');
    await expect(undo).toBeVisible();
    await expect(redo).toBeVisible();
    await expect(undo).toBeDisabled();
    await expect(redo).toBeDisabled();
  });

  test('shows save and restore actions', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('button', { name: 'Save' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Restore' })).toBeVisible();
  });

  test('opens basic tool with adjustment controls', async ({ page }) => {
    await page.goto('/');
    await page.locator('#tool-basic').click();
    await expect(page.getByText('Black & White')).toBeVisible();
    await expect(page.getByText('Auto enhance')).toBeVisible();
  });

  test('opens text tool with placement flow', async ({ page }) => {
    await page.goto('/');
    await page.locator('#tool-text').click();
    await expect(page.getByRole('button', { name: 'Click canvas to place' })).toBeVisible();
    await expect(page.locator('.editor-textarea')).toBeVisible();
  });
});
