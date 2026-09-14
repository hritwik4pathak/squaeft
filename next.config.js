// Security headers applied to every response. Notes:
//   * CSP intentionally allows 'unsafe-inline' on script-src because Next.js inlines
//     hydration scripts; a strict CSP requires per-request nonces wired through Next's
//     metadata API (out-of-scope auto-fix).
//   * X-XSS-Protection is set because the user requested it. OWASP recommends NOT
//     setting it in modern apps, but it is harmless here.

const securityHeaders = [
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=31536000; includeSubDomains; preload',
  },

  {
    key: 'X-Frame-Options',
    value: 'DENY',
  },

  {
    key: 'X-Content-Type-Options',
    value: 'nosniff',
  },

  {
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin',
  },

  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
  },

  {
    key: 'X-XSS-Protection',
    value: '1; mode=block',
  },

  {
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",

      // Next.js hydration + Clerk
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.clerk.accounts.dev https://clerk.com https://*.clerk.com",

      // Styles
      "style-src 'self' 'unsafe-inline'",

      // Images
      "img-src 'self' data: https://*.supabase.co https://placehold.co https://images.unsplash.com https://img.clerk.com https://*.clerk.com",

      // Fonts
      "font-src 'self' data:",

      // API / network connections
      "connect-src 'self' https://*.clerk.accounts.dev https://clerk.com https://*.clerk.com https://*.googleapis.com https://*.supabase.co",

      // Frames
      "frame-src 'self' https://*.clerk.com https://challenges.cloudflare.com",

      // Prevent clickjacking
      "frame-ancestors 'none'",

      // Restrict base URL
      "base-uri 'self'",

      // Restrict form submissions
      "form-action 'self'",

      // Disable plugins
      "object-src 'none'",
    ].join('; '),
  },
];

const nextConfig = {
  // Removes the X-Powered-By: Next.js header
  poweredByHeader: false,

  env: {
    BASE_URL: process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : 'http://localhost:3000',
  },

  // Next.js Image configuration
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
      },

      {
        protocol: 'https',
        hostname: 'placehold.co',
      },

      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },

      {
        protocol: 'https',
        hostname: 'img.clerk.com',
      },
    ],
  },

  async headers() {
    return [
      {
        source: '/:path*',
        headers: securityHeaders,
      },
    ];
  },
};

module.exports = nextConfig;