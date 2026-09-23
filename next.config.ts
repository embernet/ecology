import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  allowedDevOrigins: [
    'hewie:3000',
    'http://hewie:3000',
    'hewie',
  ],
};

export default nextConfig;
