/**
 * Unit tests for middleware token validation logic.
 * Tests the regex from middleware.ts without importing next/server.
 * Run: node --import=tsx/esm --test tests/unit/middleware.test.ts
 */
import { describe, it, before } from "node:test";
import assert from "node:assert/strict";

// Mirror the token validation regex from middleware.ts
const TOKEN_REGEX = /^[0-9a-f]{64}$/;

process.env.ENCRYPTION_KEY =
  "a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2";
process.env.NODE_ENV = "test";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let generateToken: any;
before(async () => {
  const auth = await import("../../lib/auth.ts");
  generateToken = auth.generateToken;
});

describe("token format regex", () => {
  it("accepts a valid 64-char lowercase hex token", () => {
    assert.ok(TOKEN_REGEX.test("a".repeat(64)));
  });

  it("rejects too short (63 chars)", () => {
    assert.ok(!TOKEN_REGEX.test("a".repeat(63)));
  });

  it("rejects too long (65 chars)", () => {
    assert.ok(!TOKEN_REGEX.test("a".repeat(65)));
  });

  it("rejects uppercase hex", () => {
    assert.ok(!TOKEN_REGEX.test("A".repeat(64)));
  });

  it("rejects non-hex characters", () => {
    assert.ok(!TOKEN_REGEX.test("z".repeat(64)));
    assert.ok(!TOKEN_REGEX.test("g".repeat(64)));
  });

  it("rejects empty string", () => {
    assert.ok(!TOKEN_REGEX.test(""));
  });

  it("rejects JWT-shaped strings", () => {
    assert.ok(
      !TOKEN_REGEX.test(
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.payload.sig"
      )
    );
  });

  it("accepts a real generateToken() output", () => {
    const token = generateToken();
    assert.ok(TOKEN_REGEX.test(token), `token should match: ${token}`);
  });
});
