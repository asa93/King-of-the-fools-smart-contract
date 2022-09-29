/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  env: {
    CONTRACT_ADDRESS: process.env.CONTRACT_ADDRESS,
    CHAIN: process.env.CHAIN,
  },
};

module.exports = nextConfig;
