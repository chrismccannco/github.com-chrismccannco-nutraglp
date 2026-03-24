import { NextRequest, NextResponse } from "next/server";
import {
  validateSession,
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  canManageUsers,
} from "@/lib/auth";
import type { UserRole } from "@/lib/auth";
import { writeAudit } from "@/lib/audit";

async function requireAdmin(req: NextRequest) {
  const token = req.cookies.get("admin_token")?.value;
  if (!token) return null;
  const user = await validateSession(token);
  if (!user || !canManageUsers(user.role)) return null;
  return user;
}

/**
 * GET /api/admin/users — List all users (admin only)
 */
export async function GET(req: NextRequest) {
  const admin = await requireAdmin(req);
  if (!admin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  try {
    const users = await getUsers();
    return NextResponse.json({ users });
  } catch (e: unknown) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

/**
 * POST /api/admin/users — Create a new user (admin only)
 * Body: { email, name, password, role }
 */
export async function POST(req: NextRequest) {
  const admin = await requireAdmin(req);
  if (!admin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  try {
    const body = await req.json();
    const { email, name, password, role } = body;
    if (!email || !name || !password || !role) {
      return NextResponse.json({ error: "All fields required" }, { status: 400 });
    }
    if (!["admin", "editor", "viewer"].includes(role)) {
      return NextResponse.json({ error: "Invalid role" }, { status: 400 });
    }
    const id = await createUser(email, name, password, role as UserRole);
    writeAudit("user_created", "user", id, email, { role }, { id: admin.id, email: admin.email });
    return NextResponse.json({ id, email, name, role });
  } catch (e: unknown) {
    const msg = String(e);
    if (msg.includes("UNIQUE")) {
      return NextResponse.json({ error: "Email already exists" }, { status: 409 });
    }
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

/**
 * PUT /api/admin/users — Update a user (admin only)
 * Body: { id, name?, role?, password? }
 */
export async function PUT(req: NextRequest) {
  const admin = await requireAdmin(req);
  if (!admin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  try {
    const body = await req.json();
    const { id, name, role, password } = body;
    if (!id) {
      return NextResponse.json({ error: "User ID required" }, { status: 400 });
    }
    if (role && !["admin", "editor", "viewer"].includes(role)) {
      return NextResponse.json({ error: "Invalid role" }, { status: 400 });
    }
    await updateUser(Number(id), { name, role, password });
    writeAudit("user_updated", "user", id, null, { changedFields: Object.keys({ name, role, password }).filter(k => body[k] !== undefined) }, { id: admin.id, email: admin.email });
    return NextResponse.json({ updated: true });
  } catch (e: unknown) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

/**
 * DELETE /api/admin/users?id=X — Delete a user (admin only)
 */
export async function DELETE(req: NextRequest) {
  const admin = await requireAdmin(req);
  if (!admin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  try {
    const id = req.nextUrl.searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "User ID required" }, { status: 400 });
    }
    // Prevent deleting yourself
    if (Number(id) === admin.id) {
      return NextResponse.json({ error: "Cannot delete your own account" }, { status: 400 });
    }
    await deleteUser(Number(id));
    writeAudit("user_deleted", "user", id, null, {}, { id: admin.id, email: admin.email });
    return NextResponse.json({ deleted: true });
  } catch (e: unknown) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
