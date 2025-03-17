/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  output: 'standalone',
  // 클라이언트 컴포넌트 문제 해결을 위한 설정
  experimental: {
    appDir: true,
  },
};

module.exports = nextConfig;
