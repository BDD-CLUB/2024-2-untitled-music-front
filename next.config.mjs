/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 31536000,
    deviceSizes: [640, 750, 828, 1080, 1200],
    imageSizes: [16, 32, 48, 64, 96],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "soundflyer.s3.ap-northeast-2.amazonaws.com",
        pathname: "/resources/images/**",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "storage.googleapis.com",
        pathname: "/**",
      },
    ],
  },
  // 정적 이미지 최적화
  webpack(config) {
    config.module.rules.push({
      test: /\.(webp)$/i,
      use: [
        {
          loader: 'image-webpack-loader',
          options: {
            webp: {
              quality: 75,
              lossless: false,
              progressive: true,
              optimizationLevel: 3,
            },
          },
        },
      ],
    });
    return config;
  },
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['@/components/ui'],
  },
};

export default nextConfig;
