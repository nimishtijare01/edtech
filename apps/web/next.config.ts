import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Required for Tauri
  // output: "export",
  // Note: We can't use "export" yet because we have API routes and server actions in the web app
  // For Tauri, we would either need to move API calls to the real backend, or use a custom server.
};

export default nextConfig;
