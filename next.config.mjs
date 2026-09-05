/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Support larger request bodies for medical PDF/Image uploads
  experimental: {
    serverActions: {
      bodySizeLimit: "20mb",
    },
  },
};

export default nextConfig;
