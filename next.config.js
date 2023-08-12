/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: "*.unsplash.com",
      },
    ],
  },
};

module.exports = nextConfig;
