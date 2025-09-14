/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: [], // add external domains if you load images from URLs
  },
  experimental: {
    appDir: true, // enable the app/ directory for Next.js 13
  },
};

module.exports = nextConfig;
