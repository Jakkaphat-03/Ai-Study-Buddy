import type { NextConfig } from "next";

const securityHeaders = [
  // Do not let the browser guess a response's type from its contents.
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Block framing, which is what makes clickjacking possible.
  { key: "X-Frame-Options", value: "DENY" },
  // Never leak a full document URL to another origin.
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // The app needs none of these devices.
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=()",
  },
  // Force HTTPS for two years once the site has been visited.
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
];

const nextConfig: NextConfig = {
  reactStrictMode: true,

  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
