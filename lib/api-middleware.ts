/**
 * Middleware helpers for the public API (v1).
 * Validates API key from Authorization header and checks permissions.
 */

import { NextRequest, NextResponse } from "next/server";
import { validateApiKey, hasPermission } from "./api-keys";
import type { ApiPermission, ApiKey } from "./api-keys";

export interface ApiContext {
  key: ApiKey;
}

type ApiHandler = (req: NextRequest, ctx: ApiContext) => Promise<NextResponse>;

/**
 * Wraps a route handler with API key authentication and permission checks.
 */
export function withApiKey(permission: ApiPermission, handler: ApiHandler) {
  return async (req: NextRequest): Promise<NextResponse> => {
    // Extract key from Authorization header
    const authHeader = req.headers.get("authorization");
    if (!authHeader) {
      return apiError(401, "Missing Authorization header. Use: Authorization: Bearer nglp_...");
    }

    const parts = authHeader.split(" ");
    if (parts.length !== 2 || parts[0] !== "Bearer") {
      return apiError(401, "Invalid Authorization format. Use: Bearer nglp_...");
    }

    const rawKey = parts[1];
    const result = await validateApiKey(rawKey);

    if (!result.valid || !result.key) {
      return apiError(result.error === "Rate limit exceeded" ? 429 : 401, result.error || "Invalid API key");
    }

    if (!hasPermission(result.key, permission)) {
      return apiError(403, `This key does not have '${permission}' permission`);
    }

    // Add CORS and rate limit headers
    const response = await handler(req, { key: result.key });
    response.headers.set("X-RateLimit-Limit", String(result.key.rate_limit));
    response.headers.set("X-RateLimit-Remaining", String(Math.max(0, result.key.rate_limit - result.key.requests_today - 1)));
    response.headers.set("Access-Control-Allow-Origin", "*");
    response.headers.set("Access-Control-Allow-Headers", "Authorization, Content-Type");
    return response;
  };
}

function apiError(status: number, message: string): NextResponse {
  const res = NextResponse.json(
    { error: message, status },
    { status }
  );
  res.headers.set("Access-Control-Allow-Origin", "*");
  return res;
}

/**
 * Handle CORS preflight for public API routes.
 */
export function corsOptions(): NextResponse {
  const res = new NextResponse(null, { status: 204 });
  res.headers.set("Access-Control-Allow-Origin", "*");
  res.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.headers.set("Access-Control-Allow-Headers", "Authorization, Content-Type");
  res.headers.set("Access-Control-Max-Age", "86400");
  return res;
}
