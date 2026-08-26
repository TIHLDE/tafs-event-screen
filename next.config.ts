import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "tihlde.org",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "*.tihlde.org",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
