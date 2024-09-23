/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: true,
  },
  api: {
    bodyParser: {
      sizeLimit: "50mb", // Set to the maximum allowed size
    },
  },
};

export default nextConfig;
