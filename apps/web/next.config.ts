import type { NextConfig } from "next";
import withPWAInit from "@ducanh2912/next-pwa";

const withPWA = withPWAInit({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
});

const nextConfig: NextConfig = {
  // Required for Tauri
  // output: "export",
  // Note: We can't use "export" yet because we have API routes and server actions in the web app
  // For Tauri, we would either need to move API calls to the real backend, or use a custom server.
};

export default withPWA(nextConfig);
