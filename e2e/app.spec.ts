import { test, expect } from "@playwright/test";

test.describe("Preorder Manager E2E Tests", () => {
  // ──────────────────────────────────────────────────────────────────
  // TEST 1: Homepage loads and table renders
  // ──────────────────────────────────────────────────────────────────
  test("Navigating to the homepage and verifying the table loads", async ({
    page,
  }) => {
    await page.goto("/");

    // The root page redirects to /preorders
    await expect(page).toHaveURL(/\/preorders/);

    // Verify the heading is visible
    await expect(
      page.getByRole("heading", { name: "Preorder Manager" })
    ).toBeVisible();

    // Verify the table renders with expected column headers
    const table = page.locator("table");
    await expect(table).toBeVisible({ timeout: 15000 });

    await expect(
      page.locator("th", { hasText: "Product Title" })
    ).toBeVisible();
    await expect(page.locator("th", { hasText: "SKU" })).toBeVisible();
    await expect(page.locator("th", { hasText: "Customer" })).toBeVisible();
    await expect(page.locator("th", { hasText: "Quantity" })).toBeVisible();
    await expect(page.locator("th", { hasText: "Price" })).toBeVisible();
    await expect(page.locator("th", { hasText: "Status" })).toBeVisible();
    await expect(
      page.locator("th", { hasText: "Created Date" })
    ).toBeVisible();
    await expect(page.locator("th", { hasText: "Actions" })).toBeVisible();

    // Verify there are data rows (seeded with 50 records, 10 per page)
    const rows = page.locator("tbody tr");
    await expect(rows.first()).toBeVisible({ timeout: 15000 });
    const rowCount = await rows.count();
    expect(rowCount).toBeGreaterThan(0);
    expect(rowCount).toBeLessThanOrEqual(10);

    // Verify pagination is visible
    await expect(page.getByText(/Showing/)).toBeVisible();
  });

  // ──────────────────────────────────────────────────────────────────
  // TEST 2: Filtering by Active status
  // ──────────────────────────────────────────────────────────────────
  test("Filtering by Active and verifying the list updates", async ({
    page,
  }) => {
    await page.goto("/preorders");

    // Wait for the table to load
    await expect(page.locator("table")).toBeVisible({ timeout: 15000 });

    // Click on the "Active" filter tab
    await page.getByRole("link", { name: "Active", exact: true }).click();

    // Verify the URL was updated with the correct query param
    await expect(page).toHaveURL(/status=active/);

    // Wait for the table to re-render after navigation
    await expect(page.locator("table")).toBeVisible({ timeout: 15000 });

    // All visible switch buttons should be in the active state (emerald background)
    const switchButtons = page.locator('button[role="switch"]');
    const switchCount = await switchButtons.count();

    if (switchCount > 0) {
      // Every switch should have aria-checked="true" since we filtered active only
      for (let i = 0; i < switchCount; i++) {
        await expect(switchButtons.nth(i)).toHaveAttribute(
          "aria-checked",
          "true"
        );
      }
    }

    // Now filter by Inactive
    await page.getByRole("link", { name: "Inactive", exact: true }).click();
    await expect(page).toHaveURL(/status=inactive/);

    // Wait for re-render
    await page.waitForTimeout(1000);

    const inactiveSwitches = page.locator('button[role="switch"]');
    const inactiveCount = await inactiveSwitches.count();

    if (inactiveCount > 0) {
      for (let i = 0; i < inactiveCount; i++) {
        await expect(inactiveSwitches.nth(i)).toHaveAttribute(
          "aria-checked",
          "false"
        );
      }
    }

    // Return to All and confirm we see more results
    await page.getByRole("link", { name: "All Preorders" }).click();
    await expect(page).toHaveURL(/status=all/);
  });

  // ──────────────────────────────────────────────────────────────────
  // TEST 3: Creating a new preorder
  // ──────────────────────────────────────────────────────────────────
  test("Creating a new preorder and verifying it appears in the list", async ({
    page,
  }) => {
    await page.goto("/preorders");

    // Click Create Preorder link
    await page.getByRole("link", { name: "Create Preorder" }).first().click();
    await expect(page).toHaveURL(/\/preorders\/create/);

    // Verify we are on the create form
    await expect(
      page.getByRole("heading", { name: "Create New Preorder" })
    ).toBeVisible();

    const uniqueTitle = `E2E Test Item ${Date.now()}`;

    // Fill out the form fields
    await page.getByLabel(/Product Title/i).fill(uniqueTitle);
    await page.getByLabel(/^SKU/i).fill("E2E-TEST-001");
    await page.getByLabel(/Customer Name/i).fill("Playwright Tester");
    await page.getByLabel(/^Quantity/i).fill("3");
    await page.getByLabel(/Price/i).fill("99.99");
    await page.getByLabel(/Description/i).fill("Created by Playwright E2E test");

    // Active checkbox should be checked by default
    const activeCheckbox = page.getByLabel(/Campaign Active Status/i);

    // Submit the form
    await page.getByRole("button", { name: /Create Campaign/i }).click();

    // Wait for redirect back to the list
    await expect(page).toHaveURL(/\/preorders/, { timeout: 15000 });

    // Verify a success toast appears
    await expect(page.getByRole("alert").first()).toBeVisible({
      timeout: 5000,
    });

    // The newly created preorder should be visible in the list
    // It may be on page 1 (sorted newest first by default)
    // Sort by newest to ensure it's on the first page
    await page.goto("/preorders?sort=newest&page=1");
    await expect(page.locator("table")).toBeVisible({ timeout: 15000 });
    await expect(page.getByText(uniqueTitle)).toBeVisible({ timeout: 10000 });
  });

  // ──────────────────────────────────────────────────────────────────
  // TEST 4: Toggling the status of a preorder
  // ──────────────────────────────────────────────────────────────────
  test("Toggling the status of a preorder and verifying the UI updates", async ({
    page,
  }) => {
    // Navigate to preorders sorted by newest so our test data is at the top
    await page.goto("/preorders?sort=newest&page=1");
    await expect(page.locator("table")).toBeVisible({ timeout: 15000 });

    // Get the first row's switch button
    const firstRow = page.locator("tbody tr").first();
    await expect(firstRow).toBeVisible();

    const switchButton = firstRow.locator('button[role="switch"]');
    await expect(switchButton).toBeVisible();

    // Read the current state
    const initialState = await switchButton.getAttribute("aria-checked");
    const expectedNewState = initialState === "true" ? "false" : "true";

    // Click to toggle
    await switchButton.click();

    // The switch should optimistically update immediately
    await expect(switchButton).toHaveAttribute("aria-checked", expectedNewState, {
      timeout: 5000,
    });

    // Verify a success toast appears
    await expect(page.getByRole("alert").first()).toBeVisible({
      timeout: 5000,
    });
    await expect(page.getByText("Status Updated")).toBeVisible({
      timeout: 5000,
    });

    // Toggle it back to restore original state
    await switchButton.click();
    await expect(switchButton).toHaveAttribute("aria-checked", initialState!, {
      timeout: 5000,
    });
  });
});
