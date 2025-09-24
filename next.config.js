const withPWA = require("next-pwa")({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development",
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
  compiler: {
    styledComponents: {
      ssr: true,
      displayName: true,
    },
  },
};

module.exports = withPWA(nextConfig);
