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
  experimental: {
    serverActions: true,
    swcPlugins: [['@swc-jotai/react-refresh', {}]],
  },
  transpilePackages: ['jotai-devtools'],
};

export default config;
