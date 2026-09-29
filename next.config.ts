import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
    ],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          // X-Frame-Options can't allowlist a host, so framing is controlled
          // by CSP frame-ancestors only. Allows the EthioDeploy dashboard
          // preview to embed this site; everything else is still blocked.
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
          { key: 'Content-Security-Policy', value: "frame-ancestors 'self' https://ethiodeploy.com https://*.ethiodeploy.com" },
        ],
      },
    ];
  },
};

export default nextConfig;
