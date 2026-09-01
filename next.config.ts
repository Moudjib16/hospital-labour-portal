import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Keep Node-only packages (PostgreSQL driver and Prisma adapter) as native
  // Node requires instead of bundling them, so they can access Node built-ins
  // (net, tls, dns, fs) without resolution errors.
  serverExternalPackages: ["pg", "@prisma/adapter-pg"],
};

export default nextConfig;
