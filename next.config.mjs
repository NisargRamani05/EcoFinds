/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: '**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  // --- ADD THESE LINES TO FIX THE BUILD ERROR ---
  compiler: {
    swcMinify: true,
  },
  experimental: {
    appDir: true,
    typedRoutes: true,
  },
  // ---------------------------------------------
};

export default nextConfig;