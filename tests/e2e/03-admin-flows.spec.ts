/**
 * Admin flow smoke tests.
 * Requires E2E_ADMIN_EMAIL and E2E_ADMIN_PASSWORD env vars.
 */
import { test, expect, type Page } from "@playwright/test";

const EMAIL = process.env.E2E_ADMIN_EMAIL || "";
const PASSWORD = process.env.E2E_ADMIN_PASSWORD || "";
const hasCredentials = EMAIL && PASSWORD;

async function login(page: Page) {
  await page.goto("/admin");
  await page.getByRole("textbox", { name: /email/i }).fill(EMAIL);
  await page.getByRole("textbox", { name: /password/i }).fill(PASSWORD);
  await page.getByRole("button", { name: /sign in|log in/i }).click();
  // Wait for login form to disappear (inline auth at /admin)
  await expect(page.getByRole("textbox", { name: /email/i })).not.toBeVisible({ timeout: 10000 });
}

test.describe("Admin flows", () => {
  test.beforeEach(async ({ page }) => {
    test.skip(!hasCredentials, "E2E_ADMIN_EMAIL / E2E_ADMIN_PASSWORD not set");
    await login(page);
  });

  test("blog list loads", async ({ page }) => {
    await page.goto("/admin/blog");
    await expect(page).not.toHaveURL(/\/admin\/login/);
    await expect(page.locator("h1, h2").first()).toBeVisible();
  });

  test("pages list loads", async ({ page }) => {
    await page.goto("/admin/pages");
    await expect(page).not.toHaveURL(/\/admin\/login/);
    await expect(page.locator("h1, h2").first()).toBeVisible();
  });

  test("products list loads", async ({ page }) => {
    await page.goto("/admin/products");
    await expect(page).not.toHaveURL(/\/admin\/login/);
    await expect(page.locator("h1, h2").first()).toBeVisible();
  });

  test("media library loads", async ({ page }) => {
    await page.goto("/admin/media");
    await expect(page).not.toHaveURL(/\/admin\/login/);
    await expect(page.locator("body")).not.toBeEmpty();
  });

  test("settings page loads", async ({ page }) => {
    await page.goto("/admin/settings");
    await expect(page).not.toHaveURL(/\/admin\/login/);
    await expect(page.locator("body")).not.toBeEmpty();
  });

  test("audit log loads", async ({ page }) => {
    await page.goto("/admin/audit");
    await expect(page).not.toHaveURL(/\/admin\/login/);
    await expect(page.getByText("Audit Log")).toBeVisible();
  });

  test("audit log filter panel opens", async ({ page }) => {
    await page.goto("/admin/audit");
    await page.getByRole("button", { name: /filter/i }).click();
    await expect(page.getByLabel(/entity type/i)).toBeVisible();
    await expect(page.getByLabel(/action/i)).toBeVisible();
    await expect(page.getByPlaceholder(/email address/i)).toBeVisible();
  });

  test("users page loads (admin only)", async ({ page }) => {
    await page.goto("/admin/users");
    await expect(page).not.toHaveURL(/\/admin\/login/);
    await expect(page.locator("body")).not.toBeEmpty();
  });

  test("API GET /api/audit returns data with user fields", async ({ page }) => {
    const res = await page.request.get("/api/audit?limit=5");
    expect(res.status()).toBe(200);
    const json = await res.json();
    expect(json).toHaveProperty("data");
    expect(json).toHaveProperty("total");
    // Verify actor fields are present on entries (may be null for old entries)
    if (json.data.length > 0) {
      expect(json.data[0]).toHaveProperty("user_email");
      expect(json.data[0]).toHaveProperty("user_id");
    }
  });
});
