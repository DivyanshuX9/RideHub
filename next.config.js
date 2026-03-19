/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
  experimental: {
    optimizePackageImports: ['lucide-react', 'framer-motion']
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://ridehub-backend-o9o8.onrender.com/:path*',
      },
    ];
  },
};

module.exports = nextConfig;
