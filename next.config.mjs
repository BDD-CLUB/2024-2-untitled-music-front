/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 60 * 60 * 24 * 30,
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 64, 96, 128, 256],
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
      test: /\.(webp|avif)$/i,
      use: [
        {
          loader: 'image-webpack-loader',
          options: {
            webp: {
              quality: 50,
              lossless: false,
              progressive: true,
              optimizationLevel: 3,
            },
            avif: {
              quality: 50,
              lossless: false,
              speed: 5,
            },
          },
        },
      ],
    });
    return config;
  },
};

export default nextConfig;
