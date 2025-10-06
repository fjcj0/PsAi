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
        destination: `${process.env.NEXT_PUBLIC_SERVER_URL}/api/auth/:path*`,
      },
      {
        source: "/api/message/:path*",
        destination: `${process.env.NEXT_PUBLIC_SERVER_URL}/api/message/:path*`,
      },
    ];
  },
};
export default nextConfig;