/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "soundflyer.s3.ap-northeast-2.amazonaws.com",
        pathname: "/resources/images/**",
      },
    ],
  },
};

export default nextConfig;
