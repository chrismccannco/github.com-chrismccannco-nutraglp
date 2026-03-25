/**
 * Preview token smoke tests.
 * Verifies token gating works — invalid/missing tokens redirect to login,
 * and the API creates tokens correctly for authenticated users.
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
  await expect(page.getByRole("textbox", { name: /email/i })).not.toBeVisible({ timeout: 10000 });
}

test.describe("Preview token gating", () => {
  test("preview page without token redirects to login", async ({ page }) => {
    await page.goto("/preview/home");
    await expect(page).toHaveURL(/\/admin\/login/);
  });

  test("preview blog without token redirects to login", async ({ page }) => {
    await page.goto("/preview/blog/test-post");
    await expect(page).toHaveURL(/\/admin\/login/);
  });

  test("preview with invalid token redirects to login", async ({ page }) => {
    await page.goto("/preview/home?token=totallyinvalidtoken");
    await expect(page).toHaveURL(/\/admin\/login/);
  });

  test("preview blog with invalid token redirects to login", async ({ page }) => {
    await page.goto("/preview/blog/test-post?token=totallyinvalidtoken");
    await expect(page).toHaveURL(/\/admin\/login/);
  });

  test("API POST /api/preview/tokens requires auth", async ({ page }) => {
    const res = await page.request.post("/api/preview/tokens", {
      data: { content_type: "page", slug: "home" },
    });
    expect(res.status()).toBe(401);
  });

  test("API GET /api/preview/tokens requires auth", async ({ page }) => {
    const res = await page.request.get("/api/preview/tokens?slug=home&type=page");
    expect(res.status()).toBe(401);
  });

  test("authenticated user can create a preview token", async ({ page }) => {
    test.skip(!hasCredentials, "E2E_ADMIN_EMAIL / E2E_ADMIN_PASSWORD not set");
    await login(page);

    const res = await page.request.post("/api/preview/tokens", {
      data: { content_type: "blog_post", slug: "test-e2e-slug", label: "E2E test" },
    });
    expect(res.status()).toBe(201);
    const json = await res.json();
    expect(json).toHaveProperty("token");
    expect(json).toHaveProperty("preview_url");
    expect(json.preview_url).toContain("token=");
    expect(json.expires_at).toBeTruthy();

    // Clean up — revoke the token
    await page.request.delete(`/api/preview/tokens?id=${json.id}`);
  });

  test("authenticated admin sees preview content without token", async ({ page }) => {
    test.skip(!hasCredentials, "E2E_ADMIN_EMAIL / E2E_ADMIN_PASSWORD not set");
    await login(page);

    // Admin session should bypass token check — may 404 on content but not redirect to login
    await page.goto("/preview/home");
    await expect(page).not.toHaveURL(/\/admin\/login/);
  });
});
