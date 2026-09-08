import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true,
  },
  async redirects() {
    return [
      {
        source: '/about',
        destination: '/gioi-thieu',
        permanent: true,
      },
      {
        source: '/contact',
        destination: '/lien-he',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
