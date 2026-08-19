import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["neo4j-driver"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
};

export default nextConfig;
