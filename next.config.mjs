/** @type {import('next').NextConfig} */
const nextConfig = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
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
