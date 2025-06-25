/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'media.wired.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
