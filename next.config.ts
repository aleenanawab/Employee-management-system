import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    NEXTAUTH_URL: process.env.NEXTAUTH_URL ?? `http://localhost:${process.env.PORT ?? 3000}`,
  },
};

export default nextConfig;
