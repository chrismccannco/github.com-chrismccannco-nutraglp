/**
 * Webhook dispatch system.
 * Fires HTTP POST to registered webhook endpoints when content events occur.
 */

import { getDb } from "./db";
import { createHmac } from "crypto";

export type WebhookEvent =
  | "page.published"
  | "page.updated"
  | "page.unpublished"
  | "blog.published"
  | "blog.updated"
  | "blog.unpublished"
  | "product.updated"
  | "media.uploaded"
  | "media.deleted";

interface WebhookEndpoint {
  id: number;
  url: string;
  events: string[];
  secret: string | null;
  enabled: boolean;
}

/**
 * Dispatch a webhook event to all matching endpoints.
 * Runs async / fire-and-forget — does not block the caller.
 */
export async function dispatchWebhook(
  event: WebhookEvent,
  payload: Record<string, unknown>
) {
  try {
    const db = getDb();
    const result = await db.execute(
      "SELECT id, url, events, secret, enabled FROM webhook_endpoints WHERE enabled = 1"
    );

    const endpoints: WebhookEndpoint[] = result.rows.map((r) => ({
      id: Number(r.id),
      url: String(r.url),
      events: JSON.parse(String(r.events || "[]")),
      secret: r.secret ? String(r.secret) : null,
      enabled: Boolean(r.enabled),
    }));

    const matching = endpoints.filter(
      (ep) => ep.events.includes(event) || ep.events.includes("*")
    );

    const body = JSON.stringify({
      event,
      timestamp: new Date().toISOString(),
      data: payload,
    });

    for (const ep of matching) {
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
        "X-ContentFoundry-Event": event,
      };

      // Sign payload with HMAC-SHA256 if secret is configured
      if (ep.secret) {
        const signature = createHmac("sha256", ep.secret)
          .update(body)
          .digest("hex");
        headers["X-ContentFoundry-Signature"] = `sha256=${signature}`;
      }

      // Fire and forget — don't await, don't block
      fetch(ep.url, {
        method: "POST",
        headers,
        body,
        signal: AbortSignal.timeout(10000),
      })
        .then(async () => {
          await db.execute({
            sql: "UPDATE webhook_endpoints SET last_triggered_at = CURRENT_TIMESTAMP WHERE id = ?",
            args: [ep.id],
          });
        })
        .catch((err) => {
          console.error(`Webhook ${ep.id} failed:`, err.message);
        });
    }
  } catch (err) {
    console.error("Webhook dispatch error:", err);
  }
}
