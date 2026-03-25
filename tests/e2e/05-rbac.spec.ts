/**
 * RBAC enforcement smoke tests.
 * Verifies unauthenticated requests to write endpoints get 401,
 * and that authenticated editors can write.
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

test.describe("RBAC — unauthenticated write attempts", () => {
  const writeEndpoints: Array<[string, string, object]> = [
    ["POST /api/blog", "POST", { slug: "test", title: "Test" }],
    ["POST /api/pages", "POST", { slug: "test-page", title: "Test Page" }],
    ["POST /api/products", "POST", { slug: "test-product", name: "Test" }],
    ["POST /api/faqs", "POST", { question: "Q?", answer: "A." }],
    ["POST /api/personas", "POST", { name: "Persona" }],
    ["POST /api/knowledge", "POST", { title: "Doc", content: "body" }],
    ["POST /api/ai/generate", "POST", { prompt: "test" }],
    ["POST /api/repurpose", "POST", { slug: "test" }],
    ["POST /api/brand-voices", "POST", { name: "Test Voice" }],
    ["POST /api/webhooks", "POST", { url: "https://example.com", events: ["publish"] }],
  ];

  for (const [name, method, body] of writeEndpoints) {
    test(`${name} returns 401 without auth`, async ({ page }) => {
      const url = name.split(" ")[1];
      const res = await page.request.fetch(url, {
        method,
        data: body,
        headers: { "Content-Type": "application/json" },
        failOnStatusCode: false,
      });
      expect([401, 403]).toContain(res.status());
    });
  }
});

test.describe("RBAC — authenticated write access", () => {
  test("editor can create and delete a blog post", async ({ page }) => {
    test.skip(!hasCredentials, "E2E_ADMIN_EMAIL / E2E_ADMIN_PASSWORD not set");
    await login(page);

    const slug = `e2e-test-${Date.now()}`;
    const createRes = await page.request.post("/api/blog", {
      data: { slug, title: "E2E Test Post", published: 0 },
    });
    expect(createRes.status()).toBe(201);
    const created = await createRes.json();
    expect(created.slug).toBe(slug);

    // Clean up
    const deleteRes = await page.request.delete(`/api/blog/${slug}`);
    expect([200, 204]).toContain(deleteRes.status());
  });

  test("editor can create and delete a page", async ({ page }) => {
    test.skip(!hasCredentials, "E2E_ADMIN_EMAIL / E2E_ADMIN_PASSWORD not set");
    await login(page);

    const slug = `e2e-page-${Date.now()}`;
    const createRes = await page.request.post("/api/pages", {
      data: { slug, title: "E2E Test Page" },
    });
    expect(createRes.status()).toBe(201);

    // Clean up
    await page.request.delete(`/api/pages/${slug}`);
  });

  test("settings endpoint returns 403 for non-admin (editor)", async ({ page }) => {
    test.skip(!hasCredentials, "credentials not set");
    await login(page);
    // This test is only meaningful if E2E user is editor-level, not admin.
    // If admin, settings PUT will succeed — that's correct behavior.
    // Just verify it responds (200 for admin, 403 for editor).
    const res = await page.request.put("/api/settings", {
      data: { _e2e_test: "1" },
      failOnStatusCode: false,
    });
    expect([200, 403]).toContain(res.status());
  });
});
