/** @type {import('next').NextConfig} */
const isMobile = process.env.BUILD_TARGET === 'mobile';

const nextConfig = {
  output: isMobile ? 'export' : undefined,
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    unoptimized: isMobile,
    remotePatterns: [
      { protocol: 'https', hostname: 'images.pexels.com' },
      { protocol: 'https', hostname: 'lh3.googleusercontent.com' },
    ],
    formats: ['image/avif', 'image/webp'],
  },
  experimental: {
    optimizePackageImports: ['lucide-react', 'framer-motion', '@radix-ui/react-dialog', '@radix-ui/react-tabs'],
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  ...(!isMobile && {
    async rewrites() {
      return [
        {
          source: '/api/:path*',
          destination: `${process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000'}/:path*`,
        },
      ];
    },
  }),
};

module.exports = nextConfig;
