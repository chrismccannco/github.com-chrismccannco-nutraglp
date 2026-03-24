"use client";

import * as Sentry from "@sentry/nextjs";
import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html>
      <body
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          fontFamily: "system-ui, sans-serif",
          background: "#0f172a",
          color: "#f8fafc",
          gap: "1rem",
        }}
      >
        <h2 style={{ fontSize: "1.25rem", fontWeight: 600 }}>
          Something went wrong
        </h2>
        <button
          onClick={reset}
          style={{
            padding: "0.5rem 1.25rem",
            background: "#3b82f6",
            color: "#fff",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontSize: "0.875rem",
          }}
        >
          Try again
        </button>
      </body>
    </html>
  );
}
