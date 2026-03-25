export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const { initDb } = await import("./lib/db");
    try {
      await initDb();
    } catch (err) {
      // Log but don't crash startup — DB may already be initialized
      console.error("[instrumentation] DB init failed:", err);
    }
  }
}
