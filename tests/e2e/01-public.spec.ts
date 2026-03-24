/**
 * Public-facing smoke tests — no auth required.
 * Verifies core pages load and return content.
 */
import { test, expect } from "@playwright/test";

test.describe("Public pages", () => {
  test("home page loads", async ({ page }) => {
    await page.goto("/");
    await expect(page).not.toHaveTitle(/404|not found/i);
    await expect(page.locator("body")).not.toBeEmpty();
  });

  test("ContentFoundry landing page loads", async ({ page }) => {
    await page.goto("/contentfoundry");
    await expect(page).toHaveTitle(/ContentFoundry/i);
    // Feature grid should include Preview Links (new feature)
    await expect(page.getByRole("heading", { name: "Preview Links" })).toBeVisible();
  });

  test("blog index loads", async ({ page }) => {
    await page.goto("/blog");
    await expect(page).not.toHaveTitle(/404|error/i);
    await expect(page.locator("body")).not.toBeEmpty();
  });

  test("sentry example page loads", async ({ page }) => {
    await page.goto("/sentry-example-page");
    // Just needs a 200, not a 404
    expect(page.url()).toContain("sentry-example-page");
    await expect(page.locator("body")).not.toBeEmpty();
  });

  test("admin login page is accessible", async ({ page }) => {
    await page.goto("/admin/login");
    await expect(page.getByRole("textbox", { name: /email/i })).toBeVisible();
    await expect(page.getByRole("textbox", { name: /password/i })).toBeVisible();
  });

  test("admin route redirects to login when unauthenticated", async ({ page }) => {
    await page.goto("/admin");
    // Unauthenticated /admin now redirects to /admin/login
    await expect(page).toHaveURL(/\/admin\/login/, { timeout: 10000 });
    await expect(page.getByRole("textbox", { name: /email/i })).toBeVisible();
  });

  test("preview route without token redirects to login", async ({ page }) => {
    await page.goto("/preview/some-nonexistent-slug");
    await expect(page).toHaveURL(/\/admin\/login/);
  });

  test("preview blog route without token redirects to login", async ({ page }) => {
    await page.goto("/preview/blog/some-slug");
    await expect(page).toHaveURL(/\/admin\/login/);
  });
});
