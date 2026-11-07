import type { NextConfig } from "next";

/**
 * No `images.remotePatterns` are configured on purpose.
 *
 * The previous entries (**.railway.app, api.cureway.com, cdn.cureway.com,
 * cdn.example.com) pointed at hosts that are retired or never existed, and no
 * code produced image URLs on any of them. Every image is a local asset under
 * public/, so leaving the list empty also guarantees next/image cannot be
 * pointed at a remote host.
 */
const nextConfig: NextConfig = {
  images: {
    remotePatterns: [],
  },
};

export default nextConfig;
