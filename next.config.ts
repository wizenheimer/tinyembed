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
    
    return config;
  },
};

export default nextConfig;