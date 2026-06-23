import { test, expect } from '@playwright/test';

test.describe('Preorder Manager E2E Tests', () => {

  test('Navigating to the homepage and verifying the table loads', async ({ page }) => {
    await page.goto('/');
    
    // Verify the heading is visible
    await expect(page.getByRole('heading', { name: 'Preorders' })).toBeVisible();
    
    // Verify the table is visible
    const table = page.locator('table');
    await expect(table).toBeVisible();

    // Verify there are column headers
    await expect(page.locator('th', { hasText: 'Name' })).toBeVisible();
    await expect(page.locator('th', { hasText: 'Status' })).toBeVisible();
  });

  test('Filtering by Active and verifying the list updates', async ({ page }) => {
    await page.goto('/');
    
    // Click on the "Active" filter tab
    const activeTab = page.locator('a', { hasText: /^Active$/ });
    await activeTab.click();

    // Verify the URL was updated
    await expect(page).toHaveURL(/\?status=Active/);

    // After filtering by Active, there should be NO "Inactive" rows in the table.
    // To do this, let's wait for any requests to settle or just wait for the UI to update.
    // In our UI, the status column contains the toggle button. We check its appearance or state.
    // Since the row status isn't explicitly printed as text but as a toggle switch, we check the toggles.
    // A toggle switch in Active state has the inner span translated (`translate-x-6`).
    
    // Ensure all rows displayed (if any) are active.
    // Wait for the table to be stable
    await page.waitForTimeout(500); // brief wait for Server Action re-render
    
    const rows = page.locator('tbody tr');
    const rowCount = await rows.count();
    
    // If there are rows, verify none of them have the "Inactive" visual state
    // "bg-neutral-200" is used for Inactive buttons. "bg-neutral-900" is Active.
    if (rowCount > 0 && !(await page.getByText('No preorders found.').isVisible())) {
      const inactiveButtons = rows.locator('button.bg-neutral-200');
      await expect(inactiveButtons).toHaveCount(0);
    }
  });

  test('Creating a new preorder and verifying it appears in the list', async ({ page }) => {
    await page.goto('/');
    
    // Click Create Preorder
    await page.getByRole('link', { name: 'Create Preorder' }).click();
    await expect(page).toHaveURL('/new');

    const uniqueName = `Test Preorder ${Date.now()}`;

    // Fill out the form
    await page.getByLabel(/Name \*/).fill(uniqueName);
    await page.getByLabel(/Product Count/).fill('5');
    await page.getByLabel(/Preorder When/).selectOption('out-of-stock');
    await page.getByLabel(/Starts At \*/).fill('2026-12-01T10:00');
    
    // Save
    await page.getByRole('button', { name: 'Save Changes' }).click();

    // Verify redirection to home
    await expect(page).toHaveURL('/');

    // Verify the new preorder is in the list
    await expect(page.getByText(uniqueName)).toBeVisible();
  });

  test('Toggling the status of a preorder and verifying the UI updates', async ({ page }) => {
    await page.goto('/');

    // Let's create a specific preorder just for toggling so we don't depend on existing data
    await page.getByRole('link', { name: 'Create Preorder' }).click();
    
    const toggleTestName = `Toggle Test ${Date.now()}`;
    await page.getByLabel(/Name \*/).fill(toggleTestName);
    await page.getByLabel(/Starts At \*/).fill('2026-12-01T10:00');
    await page.getByLabel(/Status/).selectOption('Active');
    await page.getByRole('button', { name: 'Save Changes' }).click();

    await expect(page).toHaveURL('/');

    // Find the row with this name
    const row = page.locator('tr', { hasText: toggleTestName });
    await expect(row).toBeVisible();

    // Find the toggle button in this row. It should initially be Active (bg-neutral-900).
    const toggleButton = row.locator('button').first();
    await expect(toggleButton).toHaveClass(/bg-neutral-900/);

    // Click to toggle
    await toggleButton.click();

    // Wait for the server action to complete and UI to update
    // The button should now have the Inactive class (bg-neutral-200)
    await expect(toggleButton).toHaveClass(/bg-neutral-200/, { timeout: 10000 });

    // Clean up: delete the row
    page.on('dialog', dialog => dialog.accept()); // Accept the confirmation dialog
    await row.locator('button').nth(1).click(); // Click the Trash icon (which is the 2nd button, or use lucide-react Trash2)
    
    // Verify it was deleted
    await expect(row).not.toBeVisible();
  });

});
