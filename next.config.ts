import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // We explicitly type 'config' as 'any' to satisfy TypeScript
  webpack: (config: any, { isServer }: { isServer: boolean }) => {
    if (!isServer) {
      // Ensure resolve.fallback exists
      config.resolve = config.resolve || {};
      config.resolve.fallback = config.resolve.fallback || {};

      // Disable fs and path on the client side
      config.resolve.fallback.fs = false;
      config.resolve.fallback.path = false;
    }
    return config;
  },
};

export default nextConfig;