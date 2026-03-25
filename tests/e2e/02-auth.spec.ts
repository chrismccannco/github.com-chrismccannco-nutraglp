/**
 * Auth smoke tests.
 * Requires E2E_ADMIN_EMAIL and E2E_ADMIN_PASSWORD env vars.
 * Skips gracefully if credentials not provided.
 *
 * Unauthenticated /admin redirects to /admin/login.
 * On successful login, redirected back to the original destination.
 */
import { test, expect, type Page } from "@playwright/test";

const EMAIL = process.env.E2E_ADMIN_EMAIL || "";
const PASSWORD = process.env.E2E_ADMIN_PASSWORD || "";
const hasCredentials = EMAIL && PASSWORD;

async function login(page: Page) {
  await page.goto("/admin/login");
  await page.getByRole("textbox", { name: /email/i }).fill(EMAIL);
  await page.getByRole("textbox", { name: /password/i }).fill(PASSWORD);
  await page.getByRole("button", { name: /sign in/i }).click();
  // Wait for redirect away from login page
  await expect(page).not.toHaveURL(/\/admin\/login/, { timeout: 10000 });
}

test.describe("Authentication", () => {
  test("login with wrong credentials shows error", async ({ page }) => {
    await page.goto("/admin/login");
    await page.getByRole("textbox", { name: /email/i }).fill("wrong@example.com");
    await page.getByRole("textbox", { name: /password/i }).fill("badpassword123");
    await page.getByRole("button", { name: /sign in/i }).click();
    // URL stays at /admin/login, error message appears
    await expect(page).toHaveURL(/\/admin\/login/);
    await expect(page.locator("body")).toContainText(/invalid|incorrect|wrong|error/i);
  });

  test("unauthenticated /admin redirects to /admin/login", async ({ page }) => {
    await page.goto("/admin");
    await expect(page).toHaveURL(/\/admin\/login/, { timeout: 10000 });
    await expect(page.getByRole("textbox", { name: /email/i })).toBeVisible();
  });

  test("successful login redirects to admin dashboard", async ({ page }) => {
    test.skip(!hasCredentials, "E2E_ADMIN_EMAIL / E2E_ADMIN_PASSWORD not set");
    await login(page);
    // Should be on /admin (or wherever next param pointed), not the login page
    await expect(page).not.toHaveURL(/\/admin\/login/);
    await expect(page.locator("body")).not.toBeEmpty();
  });

  test("authenticated user can reach admin dashboard", async ({ page }) => {
    test.skip(!hasCredentials, "E2E_ADMIN_EMAIL / E2E_ADMIN_PASSWORD not set");
    await login(page);

    // Navigate to a protected route and confirm no login redirect
    await page.goto("/admin/blog");
    await expect(page).not.toHaveURL(/\/admin\/login/);
    await expect(page.locator("h1, h2").first()).toBeVisible();
  });
});
