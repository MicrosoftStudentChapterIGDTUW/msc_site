/** @type {import('next').NextConfig} */
const nextConfig = {
  // This tells Webpack to ignore 'fs' and 'path' on the client side
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
      };
    }
    return config;
  },
};

export default nextConfig;