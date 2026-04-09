import type { NextConfig } from "next";
import withPWAInit from "@ducanh2912/next-pwa";

const withPWA = withPWAInit({
  dest: "public",
  disable: process.env.NODE_ENV === "development", // Se desactiva en dev para que no moleste la caché
  register: true,
  workbox: {
    skipWaiting: true,
  },
} as any);

/** @type {import('next').NextConfig} */
const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  turbopack: {},
};

export default withPWA(nextConfig);
