import './src/env.mjs';

/** @type {import('next').NextConfig} */
const config = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'i.scdn.co',
        port: '',
        pathname: '/image/**',
      },
    ],
  },
  eslint: {
    dirs: ['src'],
  },
  experimental: {
    serverActions: true,
  },
};

export default config;
