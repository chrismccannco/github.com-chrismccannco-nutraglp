import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
  },
  serverExternalPackages: ["@libsql/client", "libsql", "sharp"],
};

export default withSentryConfig(nextConfig, {
  // Source map uploads — only active when SENTRY_AUTH_TOKEN is set
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,
  silent: true,

  // Smaller client bundles, no source maps exposed to browser
  widenClientFileUpload: true,
  hideSourceMaps: true,
  disableLogger: true,
  automaticVercelMonitors: false,
});
