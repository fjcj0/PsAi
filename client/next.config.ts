import type { NextConfig } from "next";
const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: "/api/auth/:path*",
        destination: "http://localhost:5205/api/auth/:path*",
      },
      {
        source: "/api/message/:path*",
        destination: "http://localhost:5205/api/message/:path*",
      },
    ];
  },
};
export default nextConfig;