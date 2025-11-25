import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    webpackBuildWorker: false, // recommended for stability
  },
  turbo: {
    resolveAlias: {}, // must be an object (not false)
  },
};

export default nextConfig;
