export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const { initDb } = await import("./lib/db");
    try {
      await initDb();
    } catch (err) {
      console.error("[instrumentation] DB init failed:", err);
    }
  }
}
