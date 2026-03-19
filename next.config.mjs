/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  turbopack: {},
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
      },
      {
        protocol: "http",
        hostname: "**",
        port: "8000",
        pathname: "/media/**",
      },
    ],
  },
  transpilePackages: ["@floating-ui/core", "@floating-ui/dom", "@floating-ui/react"],
};

export default nextConfig;
