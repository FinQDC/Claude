/** @type {import('next').NextConfig} */
const basePath = process.env.BASE_PATH || ''
process.env.NEXT_PUBLIC_BASE_PATH = basePath

const nextConfig = {
  output: 'export',
  basePath,
  assetPrefix: basePath || undefined,
  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
    ],
  },
}

module.exports = nextConfig
