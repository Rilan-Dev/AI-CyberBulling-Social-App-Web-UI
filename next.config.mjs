/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['localhost'],
    remotePatterns: [
      {
        protocol: 'http',
        hostname: '**',
        port: '8000',
        pathname: '/media/**',
      },
    ],
  },
  transpilePackages: ['@floating-ui/core', '@floating-ui/dom', '@floating-ui/react'],
  webpack: (config) => {
    // This is needed to handle .mjs files properly
    config.module.rules.push({
      test: /\.mjs$/,
      include: /node_modules/,
      type: 'javascript/auto',
    });
    
    return config;
  },
};

export default nextConfig;
