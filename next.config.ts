import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    allowedDevOrigins: ["http://10.110.235.149:3000"],
  },
};

export default nextConfig;
