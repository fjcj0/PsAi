import type { NextConfig } from "next";
const nextConfig: NextConfig = {
  images: {
    domains: ["lh3.googleusercontent.com"],
  }, async rewrites() {
    return [
      {
        source: "/api/auth/:path*",
        destination: "http://localhost:5205/api/auth/:path*",
      },
    ];
  },
};
export default nextConfig;