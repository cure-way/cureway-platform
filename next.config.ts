import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**.railway.app" },
      { protocol: "https", hostname: "api.cureway.com" },
      { protocol: "https", hostname: "cdn.cureway.com" },
      { protocol: "https", hostname: "cdn.example.com" },
    ],
  },
};

export default nextConfig;
