// Security headers applied to every response. Notes:
//   * CSP intentionally allows 'unsafe-inline' on script-src because Next.js inlines
//     hydration scripts; a strict CSP requires per-request nonces wired through Next's
//     metadata API (out-of-scope auto-fix). Even non-strict CSP is a meaningful defense
//     against injected <script src=...> attacks because script-src restricts origins.
//   * X-XSS-Protection is set because the user requested it. OWASP recommends NOT
//     setting it in modern apps (deprecated in modern browsers, can introduce its own
//     vulnerabilities in legacy IE). It's harmless here.
const securityHeaders = [
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=31536000; includeSubDomains; preload',
  },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
  },
  { key: 'X-XSS-Protection', value: '1; mode=block' },
  {
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      // Next.js requires inline scripts for hydration. Without nonces this must be
      // 'unsafe-inline'; tighten with a nonce-based middleware later if needed.
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.clerk.accounts.dev https://clerk.com https://*.clerk.com",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: https://firebasestorage.googleapis.com https://placehold.co https://images.unsplash.com https://img.clerk.com https://*.clerk.com",
      "font-src 'self' data:",
      "connect-src 'self' https://*.clerk.accounts.dev https://clerk.com https://*.clerk.com https://*.googleapis.com https://*.firebaseio.com wss://*.firebaseio.com",
      "frame-src 'self' https://*.clerk.com https://challenges.cloudflare.com",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "object-src 'none'",
    ].join('; '),
  },
];

const nextConfig = {
  // Removes the X-Powered-By: Next.js header that leaks framework info.
  poweredByHeader: false,

  env: {
    BASE_URL: process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : 'http://localhost:3000',
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'firebasestorage.googleapis.com' },
      { protocol: 'https', hostname: 'placehold.co' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'img.clerk.com' },
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
