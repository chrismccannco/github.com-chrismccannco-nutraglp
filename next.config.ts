import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
  },
  serverExternalPackages: ["@libsql/client", "libsql", "@libsql/linux-arm64-gnu"],
};

export default nextConfig;
