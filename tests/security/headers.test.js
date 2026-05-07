import { describe, expect, it } from 'vitest';
import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// next.config.js uses CommonJS — load it via createRequire so vitest's ESM transform
// doesn't choke on `module.exports`.
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);
const nextConfig = require(path.resolve(__dirname, '../../next.config.js'));

const getHeaderMap = async () => {
    const rules = await nextConfig.headers();
    const allHeaders = rules.flatMap((r) => r.headers);
    return Object.fromEntries(allHeaders.map((h) => [h.key, h.value]));
};

describe('next.config.js security headers', () => {
    it('disables the X-Powered-By header that leaks framework info', () => {
        expect(nextConfig.poweredByHeader).toBe(false);
    });

    it('sets HSTS with a long max-age, includeSubDomains, and preload', async () => {
        const h = await getHeaderMap();
        const hsts = h['Strict-Transport-Security'];
        expect(hsts).toContain('max-age=31536000');
        expect(hsts).toContain('includeSubDomains');
        expect(hsts).toContain('preload');
    });

    it('sets X-Frame-Options: DENY to prevent clickjacking', async () => {
        const h = await getHeaderMap();
        expect(h['X-Frame-Options']).toBe('DENY');
    });

    it('sets X-Content-Type-Options: nosniff', async () => {
        const h = await getHeaderMap();
        expect(h['X-Content-Type-Options']).toBe('nosniff');
    });

    it('sets a strict Referrer-Policy', async () => {
        const h = await getHeaderMap();
        expect(h['Referrer-Policy']).toBe('strict-origin-when-cross-origin');
    });

    it('sets Permissions-Policy that blocks camera, microphone, and geolocation', async () => {
        const h = await getHeaderMap();
        const pp = h['Permissions-Policy'];
        expect(pp).toMatch(/camera=\(\)/);
        expect(pp).toMatch(/microphone=\(\)/);
        expect(pp).toMatch(/geolocation=\(\)/);
    });

    it('sets X-XSS-Protection: 1; mode=block', async () => {
        const h = await getHeaderMap();
        expect(h['X-XSS-Protection']).toBe('1; mode=block');
    });

    it('sets Content-Security-Policy with frame-ancestors none and object-src none', async () => {
        const h = await getHeaderMap();
        const csp = h['Content-Security-Policy'];
        expect(csp).toMatch(/frame-ancestors 'none'/);
        expect(csp).toMatch(/object-src 'none'/);
        expect(csp).toMatch(/default-src 'self'/);
        expect(csp).toMatch(/base-uri 'self'/);
        expect(csp).toMatch(/form-action 'self'/);
    });

    it('CSP allows the configured image origins (firebase, clerk)', async () => {
        const h = await getHeaderMap();
        const csp = h['Content-Security-Policy'];
        expect(csp).toMatch(/firebasestorage\.googleapis\.com/);
        expect(csp).toMatch(/clerk\.com/);
    });

    it('headers apply to every path (source: /:path*)', async () => {
        const rules = await nextConfig.headers();
        expect(rules.some((r) => r.source === '/:path*')).toBe(true);
    });
});
