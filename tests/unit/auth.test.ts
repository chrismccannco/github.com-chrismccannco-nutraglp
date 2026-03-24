/**
 * Unit tests for lib/auth.ts — pure crypto functions, no DB required.
 * Run: node --import=tsx/esm --test tests/unit/auth.test.ts
 */
import { describe, it, before } from "node:test";
import assert from "node:assert/strict";

process.env.ENCRYPTION_KEY =
  "a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2";
process.env.NODE_ENV = "test";

// Loaded in before() so env vars are set first
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let auth: any;

before(async () => {
  auth = await import("../../lib/auth.ts");
});

describe("hashPassword / verifyPassword", () => {
  it("bcrypt round-trip — correct password passes", async () => {
    const hash = await auth.hashPassword("hunter2");
    assert.ok(await auth.verifyPassword("hunter2", hash));
  });

  it("bcrypt round-trip — wrong password fails", async () => {
    const hash = await auth.hashPassword("hunter2");
    assert.ok(!(await auth.verifyPassword("wrongpass", hash)));
  });

  it("legacy SHA-256 hash — correct password passes", async () => {
    const data = new TextEncoder().encode("nutraglp_admin_v1_legacypass");
    const buf = await crypto.subtle.digest("SHA-256", data);
    const legacyHash = Array.from(new Uint8Array(buf))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
    assert.equal(legacyHash.length, 64);
    assert.ok(!legacyHash.startsWith("$2"));
    assert.ok(await auth.verifyPassword("legacypass", legacyHash));
  });

  it("legacy SHA-256 hash — wrong password fails", async () => {
    const data = new TextEncoder().encode("nutraglp_admin_v1_legacypass");
    const buf = await crypto.subtle.digest("SHA-256", data);
    const legacyHash = Array.from(new Uint8Array(buf))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
    assert.ok(!(await auth.verifyPassword("wrong", legacyHash)));
  });
});

describe("generateToken", () => {
  it("returns a 64-char hex string", () => {
    const token = auth.generateToken();
    assert.match(token, /^[0-9a-f]{64}$/);
  });

  it("returns unique tokens on each call", () => {
    const tokens = new Set(
      Array.from({ length: 20 }, () => auth.generateToken())
    );
    assert.equal(tokens.size, 20);
  });
});

describe("encryptApiKey / decryptApiKey", () => {
  it("round-trips an API key", async () => {
    const original = "sk-ant-api-testkey12345";
    const encrypted = await auth.encryptApiKey(original);
    assert.ok(encrypted.startsWith("enc:"), "should have enc: prefix");
    const decrypted = await auth.decryptApiKey(encrypted);
    assert.equal(decrypted, original);
  });

  it("produces different ciphertext each time (random IV)", async () => {
    const enc1 = await auth.encryptApiKey("same-value");
    const enc2 = await auth.encryptApiKey("same-value");
    assert.notEqual(enc1, enc2);
  });

  it("passes through legacy plaintext (no enc: prefix)", async () => {
    assert.equal(await auth.decryptApiKey("plain-old-key"), "plain-old-key");
  });

  it("handles empty string gracefully", async () => {
    assert.equal(await auth.encryptApiKey(""), "");
    assert.equal(await auth.decryptApiKey(""), "");
  });

  it("returns empty string on corrupted ciphertext", async () => {
    assert.equal(await auth.decryptApiKey("enc:notvalidbase64!!!"), "");
  });
});

describe("role helpers", () => {
  it("canManageUsers: admin only", () => {
    assert.ok(auth.canManageUsers("admin"));
    assert.ok(!auth.canManageUsers("editor"));
    assert.ok(!auth.canManageUsers("viewer"));
  });

  it("canEditContent: admin and editor", () => {
    assert.ok(auth.canEditContent("admin"));
    assert.ok(auth.canEditContent("editor"));
    assert.ok(!auth.canEditContent("viewer"));
  });

  it("canManageSettings: admin only", () => {
    assert.ok(auth.canManageSettings("admin"));
    assert.ok(!auth.canManageSettings("editor"));
    assert.ok(!auth.canManageSettings("viewer"));
  });
});
