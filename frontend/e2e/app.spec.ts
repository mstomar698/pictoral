import { test, expect, type Page } from '@playwright/test';

async function prepareEditor(page: Page) {
  const imageLoaded = page.waitForResponse((resp) => resp.url().includes('main.jpg') && resp.ok());
  await page.goto('/');
  await imageLoaded.catch(() => {});
  const cookieBtn = page.getByRole('button', { name: 'Accept all' });
  if (await cookieBtn.isVisible().catch(() => false)) {
    await cookieBtn.click();
  }
}

test.describe('Pictoral editor shell', () => {
  test('loads the editor home page with branding', async ({ page }) => {
    await prepareEditor(page);
    await expect(page.getByRole('link', { name: /Pictoral/i })).toBeVisible();
    await expect(page).toHaveTitle(/Pictoral/);
    await expect(page.getByRole('link', { name: 'Sign in' })).toBeVisible();
  });

  test('renders the canvas workspace', async ({ page }) => {
    await prepareEditor(page);
    await expect(page.locator('#canvas')).toBeVisible();
    await expect(page.locator('#canvas-container')).toBeVisible();
  });

  test('shows the tool pane sidebar', async ({ page }) => {
    await prepareEditor(page);
    await expect(page.locator('#tool-prop-list')).toBeAttached();
    const toolIcons = page.locator('.tool-icon');
    await expect(toolIcons.first()).toBeVisible();
  });

  test('navigates to the login page and guest sign-in', async ({ page }) => {
    await prepareEditor(page);
    await page.getByRole('link', { name: 'Sign in' }).click();
    await expect(page).toHaveURL(/\/login$/);
    await expect(page.getByRole('heading', { name: /Sign in to Pictoral/i })).toBeVisible();
    await page.getByRole('button', { name: /Continue as guest/i }).click();
    await expect(page).toHaveURL('/');
    await expect(page.getByText('Guest')).toBeVisible();
  });

  test('shows legal pages from footer', async ({ page }) => {
    await prepareEditor(page);
    await page.locator('.editor-footer-legal').getByRole('link', { name: 'Privacy' }).click();
    await expect(page).toHaveURL(/\/privacy$/);
    await expect(page.getByRole('heading', { name: 'Privacy Policy' })).toBeVisible();
  });

  test('shows undo and redo controls in subheader', async ({ page }) => {
    await prepareEditor(page);
    const undo = page.getByTitle('Undo (Ctrl+Z)');
    const redo = page.getByTitle('Redo (Ctrl+Y)');
    await expect(undo).toBeVisible();
    await expect(redo).toBeVisible();
    await expect(undo).toBeDisabled();
    await expect(redo).toBeDisabled();
  });

  test('shows save and restore actions', async ({ page }) => {
    await prepareEditor(page);
    await expect(page.getByRole('button', { name: 'Save' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Restore' })).toBeVisible();
  });

  test('opens basic tool with adjustment controls', async ({ page }) => {
    await prepareEditor(page);
    await page.locator('#tool-basic').click();
    await expect(page.getByText('Black & White')).toBeVisible();
    await expect(page.getByText('Auto enhance')).toBeVisible();
  });

  test('opens text tool with placement flow', async ({ page }) => {
    await prepareEditor(page);
    await page.locator('#tool-text').click();
    await expect(page.getByRole('button', { name: 'Click canvas to place' })).toBeVisible();
    await expect(page.locator('.editor-textarea')).toBeVisible();
  });

  test('opens filter tool with blur controls', async ({ page }) => {
    await prepareEditor(page);
    await page.locator('#tool-filter').click();
    await expect(page.getByText('BLUR', { exact: true })).toBeVisible();
    await page.locator('#filter-gaussianblur').click();
    await expect(page.getByText('Gaussian Blur', { exact: true })).toBeVisible();
  });

  test('opens sharpen filter panel', async ({ page }) => {
    await prepareEditor(page);
    await page.locator('#tool-filter').click();
    await page.locator('#filter-sharpen').click();
    await expect(page.getByText('Strength')).toBeVisible();
  });

  test('undo after basic edit via keyboard', async ({ page }) => {
    await prepareEditor(page);
    await page.locator('#tool-basic').click();
    await page.getByText('Auto enhance').click();
    await page.locator('.apply-btn').click();
    await expect(page.getByTitle('Undo (Ctrl+Z)')).toBeEnabled({ timeout: 3000 });
    await page.keyboard.press('Control+Z');
    await expect(page.getByTitle('Undo (Ctrl+Z)')).toBeDisabled({ timeout: 3000 });
  });
});
