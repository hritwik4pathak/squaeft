import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { LIMITS, getClientIp, rateLimit } from '@/lib/security/rate-limit';

describe('rateLimit', () => {
    beforeEach(() => {
        vi.useFakeTimers();
        vi.setSystemTime(new Date('2025-01-01T00:00:00Z'));
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it('allows requests up to max within the window', () => {
        const opts = { max: 3, windowMs: 60_000 };
        const k = 'test:ip-A';
        for (let i = 0; i < 3; i++) {
            const r = rateLimit(k, opts);
            expect(r.allowed).toBe(true);
        }
    });

    it('blocks the (max+1)th request and returns retryAfter > 0', () => {
        const opts = { max: 2, windowMs: 60_000 };
        const k = 'test:ip-B';
        rateLimit(k, opts);
        rateLimit(k, opts);
        const blocked = rateLimit(k, opts);
        expect(blocked.allowed).toBe(false);
        expect(blocked.retryAfter).toBeGreaterThan(0);
        expect(blocked.retryAfter).toBeLessThanOrEqual(60);
    });

    it('resets after the window elapses', () => {
        const opts = { max: 1, windowMs: 30_000 };
        const k = 'test:ip-C';
        expect(rateLimit(k, opts).allowed).toBe(true);
        expect(rateLimit(k, opts).allowed).toBe(false);

        vi.advanceTimersByTime(31_000);

        expect(rateLimit(k, opts).allowed).toBe(true);
    });

    it('isolates buckets by key (one IP being blocked does not block others)', () => {
        const opts = { max: 1, windowMs: 60_000 };
        rateLimit('test:ip-D', opts);
        expect(rateLimit('test:ip-D', opts).allowed).toBe(false);
        expect(rateLimit('test:ip-E', opts).allowed).toBe(true);
    });

    it('returns allowed without consuming when key is empty', () => {
        const r = rateLimit('', { max: 1, windowMs: 60_000 });
        expect(r.allowed).toBe(true);
    });

    it('exposes documented tier presets', () => {
        expect(LIMITS.write.max).toBeGreaterThan(0);
        expect(LIMITS.read.max).toBeGreaterThanOrEqual(LIMITS.write.max);
        expect(LIMITS.auth.windowMs).toBeGreaterThanOrEqual(LIMITS.write.windowMs);
    });
});

describe('getClientIp', () => {
    const fakeReq = (headers) => ({
        headers: { get: (k) => headers[k.toLowerCase()] ?? null },
    });

    it('prefers x-forwarded-for first hop', () => {
        const req = fakeReq({ 'x-forwarded-for': '1.2.3.4, 5.6.7.8' });
        expect(getClientIp(req)).toBe('1.2.3.4');
    });

    it('falls back to x-real-ip', () => {
        const req = fakeReq({ 'x-real-ip': '9.9.9.9' });
        expect(getClientIp(req)).toBe('9.9.9.9');
    });

    it('returns "unknown" when no header is present', () => {
        const req = fakeReq({});
        expect(getClientIp(req)).toBe('unknown');
    });
});
