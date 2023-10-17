/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:3100/:path*', // 将此处的URL替换为你的API服务器的URL
      },
    ];
  },
  images: {
    domains: ['images.pexels.com'],
  },
  experimental: {
    serverActions: true,
  },
};
module.exports = nextConfig;
