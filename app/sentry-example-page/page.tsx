"use client";

import * as Sentry from "@sentry/nextjs";
import { useState } from "react";

/**
 * Temporary page to verify Sentry is wired correctly.
 * Sends a test error and a test message to confirm the pipeline.
 * Safe to delete once Sentry is confirmed working.
 */
export default function SentryExamplePage() {
  const [status, setStatus] = useState<"idle" | "sent">("idle");

  function throwTestError() {
    try {
      throw new Error("Sentry test error — ContentFoundry pipeline check");
    } catch (e) {
      Sentry.captureException(e);
      setStatus("sent");
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "#0f172a",
        color: "#f8fafc",
        fontFamily: "system-ui, sans-serif",
        gap: "1.5rem",
      }}
    >
      <h1 style={{ fontSize: "1.25rem", fontWeight: 600, margin: 0 }}>
        Sentry Pipeline Check
      </h1>

      {status === "idle" ? (
        <button
          onClick={throwTestError}
          style={{
            padding: "0.625rem 1.5rem",
            background: "#e11d48",
            color: "#fff",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontSize: "0.875rem",
            fontWeight: 500,
          }}
        >
          Send test error to Sentry
        </button>
      ) : (
        <p style={{ color: "#4ade80", fontSize: "0.875rem" }}>
          ✓ Error sent — check content-foundry.sentry.io/issues/
        </p>
      )}

      <p style={{ color: "#64748b", fontSize: "0.75rem", margin: 0 }}>
        This page exists only for pipeline verification. Safe to ignore.
      </p>
    </div>
  );
}
