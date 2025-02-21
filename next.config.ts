import { NextConfig } from 'next';

const { withHighlightConfig } = require('@highlight-run/next/config');

const config: NextConfig = {
  images: {
    unoptimized: true,
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.shopify.com',
        pathname: '/s/files/**'
      },
      {
        protocol: 'https',
        hostname: 'journa.ai',
        pathname: '/**'
      },
      {
        protocol: 'https',
        hostname: 'journatest.blob.core.windows.net',
        pathname: '/**'
      }
    ]
  }
};

module.exports = withHighlightConfig(config);
