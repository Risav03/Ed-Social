/** @type {import('next').NextConfig} */
const nextConfig = {
    output: "standalone",
    images: {
        domains: ['nifty-tales.s3.amazonaws.com'],
        unoptimized: true,
        remotePatterns: [
            {
              protocol: "https",
              hostname: "**",
            },
        ]
    },
    reactStrictMode: false,
      experimental: {
        serverActions: {
          bodySizeLimit: '5mb',
        },
      },
};

export default nextConfig;
