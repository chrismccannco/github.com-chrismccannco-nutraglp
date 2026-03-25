/**
 * ContentFoundry API client.
 * All requests go through the v1 REST API using an API key.
 */

const BASE_URL = process.env.CONTENTFOUNDRY_BASE_URL?.replace(/\/$/, "") ?? "";
const API_KEY = process.env.CONTENTFOUNDRY_API_KEY ?? "";

if (!BASE_URL) {
  process.stderr.write(
    "CONTENTFOUNDRY_BASE_URL is required (e.g. https://your-site.com)\n"
  );
}
if (!API_KEY) {
  process.stderr.write(
    "CONTENTFOUNDRY_API_KEY is required — generate one in Admin → API Keys\n"
  );
}

export class CfApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public body?: unknown
  ) {
    super(`ContentFoundry API error ${status}: ${message}`);
  }
}

interface RequestOptions {
  params?: Record<string, string | number | boolean | undefined>;
  body?: unknown;
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
}

export async function cfFetch<T>(
  path: string,
  { params, body, method = "GET" }: RequestOptions = {}
): Promise<T> {
  const url = new URL(`${BASE_URL}/api/v1${path}`);

  if (params) {
    for (const [k, v] of Object.entries(params)) {
      if (v !== undefined && v !== null) {
        url.searchParams.set(k, String(v));
      }
    }
  }

  const res = await fetch(url.toString(), {
    method,
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });

  if (!res.ok) {
    let message = res.statusText;
    try {
      const err = (await res.json()) as { error?: string };
      message = err.error ?? message;
    } catch {
      // ignore parse errors
    }
    throw new CfApiError(res.status, message);
  }

  return res.json() as Promise<T>;
}

/** Wrap a tool handler so API errors return readable MCP text instead of throwing. */
export function handleApiError(err: unknown): { content: Array<{ type: "text"; text: string }> } {
  if (err instanceof CfApiError) {
    return {
      content: [
        {
          type: "text",
          text: `Error ${err.status}: ${err.message}. Check that CONTENTFOUNDRY_API_KEY has the required permissions and that CONTENTFOUNDRY_BASE_URL is correct.`,
        },
      ],
    };
  }
  const msg = err instanceof Error ? err.message : String(err);
  return { content: [{ type: "text", text: `Unexpected error: ${msg}` }] };
}
