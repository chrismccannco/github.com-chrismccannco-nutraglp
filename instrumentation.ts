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
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function onRequestError(...args: any[]) {
  const Sentry = await import("@sentry/nextjs");
  // captureRequestError is the v10 API; falls back gracefully if not present
  if (typeof Sentry.captureRequestError === "function") {
    await (Sentry.captureRequestError as (...a: unknown[]) => unknown)(...args);
  } else {
    Sentry.captureException(args[0]);
  }
}
