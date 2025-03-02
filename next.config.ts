import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  webpack: (config) => {
    // This is necessary for WebAssembly compilation which might be needed by tinylm
    config.experiments = {
      asyncWebAssembly: true,
      layers: true,
    };

    // Disable webpack cache to prevent 'Unable to snapshot resolve dependencies' warnings
    config.cache = false;

    return config;
  },
};

export default nextConfig;