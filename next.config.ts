import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
  },
  serverExternalPackages: ["@libsql/client", "libsql", "@imgly/background-removal-node", "onnxruntime-node", "sharp"],
};

export default nextConfig;
