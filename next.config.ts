import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
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
      {
        protocol: "https",
        hostname: "leptonstoragepro.blob.core.windows.net",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
