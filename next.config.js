/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['nissantourapi.azurewebsites.net'],
       remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.builder.io",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
    ],
  },
}

module.exports = nextConfig
