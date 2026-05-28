import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/proxy/:path*",
        destination: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/:path*`, // Proxying to backend
      },
    ];
  },
};

export default nextConfig;
