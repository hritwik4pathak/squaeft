// In-memory IP rate limiter. Important caveats:
//   * Per-instance only — does NOT share state across multiple Vercel instances /
//     serverless invocations. For production with autoscaling, swap the underlying
//     `hits` Map for Redis (Upstash Ratelimit) or a Vercel KV-backed store.
//   * Survives within a single warm function invocation. A cold start = empty bucket.
//   * Good enough to blunt single-IP brute-force / scraping; not a defense against
//     distributed attacks, which need a WAF / Cloudflare / Vercel Firewall.

const buckets = new Map();

const now = () => Date.now();

const evictOld = (windowMs) => {
    const cutoff = now() - windowMs;
    for (const [key, entry] of buckets) {
        if (entry.resetAt < cutoff) buckets.delete(key);
    }
};

// Returns { allowed, remaining, retryAfter } where retryAfter is seconds.
export const rateLimit = (key, { max, windowMs }) => {
    if (!key) return { allowed: true, remaining: max, retryAfter: 0 };

    const t = now();
    let entry = buckets.get(key);

    if (!entry || entry.resetAt <= t) {
        entry = { count: 0, resetAt: t + windowMs };
        buckets.set(key, entry);
    }

    entry.count += 1;
    const remaining = Math.max(0, max - entry.count);
    const allowed = entry.count <= max;
    const retryAfter = allowed ? 0 : Math.ceil((entry.resetAt - t) / 1000);

    if (buckets.size > 5000) evictOld(windowMs);

    return { allowed, remaining, retryAfter };
};

export const getClientIp = (req) => {
    // Trust order: x-forwarded-for (set by Vercel/proxy), x-real-ip, fallback.
    const xff = req.headers.get?.('x-forwarded-for');
    if (xff) return xff.split(',')[0].trim();
    const real = req.headers.get?.('x-real-ip');
    if (real) return real.trim();
    return 'unknown';
};

// Tiered limits keyed by route prefix. Tune these per-route as your traffic shape evolves.
export const LIMITS = {
    // Mutation endpoints — tighter
    write: { max: 30, windowMs: 60_000 },          // 30 writes/min/IP
    // Read endpoints — looser
    read: { max: 120, windowMs: 60_000 },          // 120 reads/min/IP
    // Sensitive auth-adjacent endpoints
    auth: { max: 10, windowMs: 15 * 60_000 },      // 10/15min/IP
};
