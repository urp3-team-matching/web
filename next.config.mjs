/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: process.env.NODE_ENV === 'development',
  },
  experimental: {
    instrumentationHook: true,
  }
};

export default nextConfig;
