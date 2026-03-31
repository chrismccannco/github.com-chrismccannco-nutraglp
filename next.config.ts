import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
  },
  serverExternalPackages: ["@libsql/client", "libsql", "sharp"],
  async redirects() {
    return [
      { source: "/investors", destination: "/", permanent: false },
      { source: "/investors/:path*", destination: "/", permanent: false },
    ];
  },
};

export default nextConfig;
