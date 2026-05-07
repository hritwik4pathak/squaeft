import { clerkMiddleware } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { LIMITS, getClientIp, rateLimit } from '@/lib/security/rate-limit';

// Map URL prefixes to rate-limit tiers. Order matters — first match wins.
const RATE_LIMIT_RULES = [
    { prefix: '/api/user/', tier: 'auth' },           // user-sync: tighter
    { prefix: '/api/listing/create', tier: 'write' },
    { prefix: '/api/listing/update', tier: 'write' },
    { prefix: '/api/listing/view', tier: 'write' },
    { prefix: '/api/listing/get', tier: 'read' },
];

const matchRule = (pathname) =>
    RATE_LIMIT_RULES.find((r) => pathname.startsWith(r.prefix));

export default clerkMiddleware(async (auth, req) => {
    const { pathname } = req.nextUrl;

    const rule = matchRule(pathname);
    if (rule) {
        const ip = getClientIp(req);
        const key = `${rule.tier}:${ip}:${rule.prefix}`;
        const { allowed, remaining, retryAfter } = rateLimit(key, LIMITS[rule.tier]);

        if (!allowed) {
            // Server-side log only — never log to client.
            console.warn(
                `[rate-limit] HIT tier=${rule.tier} ip=${ip} path=${pathname} ts=${new Date().toISOString()}`
            );
            return new NextResponse(
                JSON.stringify({ success: false, message: 'Too many requests' }),
                {
                    status: 429,
                    headers: {
                        'Content-Type': 'application/json',
                        'Retry-After': String(retryAfter),
                        'X-RateLimit-Remaining': '0',
                    },
                }
            );
        }

        const res = NextResponse.next();
        res.headers.set('X-RateLimit-Remaining', String(remaining));
        return res;
    }

    return NextResponse.next();
});

export const config = {
    matcher: [
        // Skip Next.js internals and all static files, unless found in search params
        '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
        // Always run for API routes
        '/(api|trpc)(.*)',
    ],
};
