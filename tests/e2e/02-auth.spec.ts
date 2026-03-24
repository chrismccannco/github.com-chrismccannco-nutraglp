/**
 * Auth smoke tests.
 * Requires E2E_ADMIN_EMAIL and E2E_ADMIN_PASSWORD env vars.
 * Skips gracefully if credentials not provided.
 *
 * Note: admin auth is inline at /admin — no redirect to /admin/login.
 * Login form renders within /admin; on success the form disappears.
 */
import { test, expect } from "@playwright/test";

const EMAIL = process.env.E2E_ADMIN_EMAIL || "";
const PASSWORD = process.env.E2E_ADMIN_PASSWORD || "";
const hasCredentials = EMAIL && PASSWORD;

test.describe("Authentication", () => {
  test("login with wrong credentials shows error", async ({ page }) => {
    await page.goto("/admin");
    await page.getByRole("textbox", { name: /email/i }).fill("wrong@example.com");
    await page.getByRole("textbox", { name: /password/i }).fill("badpassword123");
    await page.getByRole("button", { name: /sign in|log in/i }).click();
    // URL stays at /admin, error message appears
    await expect(page).toHaveURL("https://content-studio-demo.netlify.app/admin");
    await expect(page.locator("body")).toContainText(/invalid|incorrect|wrong|error/i);
  });

  test("successful login reveals admin dashboard", async ({ page }) => {
    test.skip(!hasCredentials, "E2E_ADMIN_EMAIL / E2E_ADMIN_PASSWORD not set");

    await page.goto("/admin");
    await page.getByRole("textbox", { name: /email/i }).fill(EMAIL);
    await page.getByRole("textbox", { name: /password/i }).fill(PASSWORD);
    await page.getByRole("button", { name: /sign in|log in/i }).click();

    // Login form should disappear after successful auth
    await expect(page.getByRole("textbox", { name: /email/i })).not.toBeVisible({ timeout: 10000 });
    await expect(page.locator("body")).not.toBeEmpty();
  });

  test("authenticated user can reach admin dashboard", async ({ page }) => {
    test.skip(!hasCredentials, "E2E_ADMIN_EMAIL / E2E_ADMIN_PASSWORD not set");

    await page.goto("/admin");
    await page.getByRole("textbox", { name: /email/i }).fill(EMAIL);
    await page.getByRole("textbox", { name: /password/i }).fill(PASSWORD);
    await page.getByRole("button", { name: /sign in|log in/i }).click();
    await expect(page.getByRole("textbox", { name: /email/i })).not.toBeVisible({ timeout: 10000 });

    // Navigate to a protected route and confirm access
    await page.goto("/admin/blog");
    await expect(page.getByRole("textbox", { name: /email/i })).not.toBeVisible();
  });
});
