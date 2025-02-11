export default {
  images: {
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
  },
  env: {
    PRINTFUL_API_KEY: process.env.PRINTFUL_API_KEY
  }
};
