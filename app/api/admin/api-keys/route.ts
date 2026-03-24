import { NextRequest, NextResponse } from "next/server";
import { validateSession } from "@/lib/auth";
import { createApiKey, listApiKeys, revokeApiKey, deleteApiKey } from "@/lib/api-keys";
import type { ApiPermission } from "@/lib/api-keys";
import { writeAudit } from "@/lib/audit";

async function getUser(req: NextRequest) {
  const token = req.cookies.get("admin_token")?.value;
  if (!token) return null;
  return validateSession(token);
}

/**
 * GET /api/admin/api-keys — List all API keys (admin only)
 */
export async function GET(req: NextRequest) {
  const user = await getUser(req);
  if (!user || user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const keys = await listApiKeys();
  return NextResponse.json(keys);
}

/**
 * POST /api/admin/api-keys — Create a new API key (admin only)
 * Body: { name, permissions?: string[], rate_limit?: number }
 */
export async function POST(req: NextRequest) {
  const user = await getUser(req);
  if (!user || user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { name, permissions, rate_limit } = body;

  if (!name || typeof name !== "string") {
    return NextResponse.json({ error: "Name is required" }, { status: 400 });
  }

  const perms = Array.isArray(permissions)
    ? (permissions.filter((p: string) => ["read", "write", "delete"].includes(p)) as ApiPermission[])
    : ["read" as ApiPermission];

  const result = await createApiKey(name, perms, rate_limit || 1000, user.id);

  writeAudit("api_key_created", "api_key", result.key.id, name, { permissions: perms }, { id: user.id, email: user.email });
  return NextResponse.json({
    key: result.key,
    rawKey: result.rawKey,
    message: "Store this key securely. It will not be shown again.",
  }, { status: 201 });
}

/**
 * DELETE /api/admin/api-keys — Revoke or delete a key
 * Body: { id, action: "revoke" | "delete" }
 */
export async function DELETE(req: NextRequest) {
  const user = await getUser(req);
  if (!user || user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { id, action } = body;

  if (!id) {
    return NextResponse.json({ error: "Key ID is required" }, { status: 400 });
  }

  if (action === "delete") {
    await deleteApiKey(id);
  } else {
    await revokeApiKey(id);
  }

  writeAudit("api_key_revoked", "api_key", id, null, { action: action || "revoke" }, { id: user.id, email: user.email });
  return NextResponse.json({ ok: true });
}
