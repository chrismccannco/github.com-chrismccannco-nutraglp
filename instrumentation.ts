export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    await import("./sentry.server.config");

    const { initDb } = await import("./lib/db");
    try {
      await initDb();
    } catch (err) {
      // Log but don't crash startup — DB may already be initialized
      console.error("[instrumentation] DB init failed:", err);
    }
  }

  if (process.env.NEXT_RUNTIME === "edge") {
    await import("./sentry.edge.config");
  }
}

// Automatically captures unhandled server-side errors in Next.js App Router
export { onRequestError } from "@sentry/nextjs";
