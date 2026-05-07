import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

// Hoisted mocks — vi.mock factories can't see outer variables, so we use vi.hoisted.
const { mockListing, mockConnect } = vi.hoisted(() => {
    const Listing = { find: undefined };
    return {
        mockListing: Listing,
        mockConnect: () => Promise.resolve(),
    };
});

vi.mock('@/lib/models/listing.model', () => ({ default: mockListing }));
vi.mock('@/lib/mongodb/mongoose', () => ({ connect: mockConnect }));

const { POST } = await import('@/app/api/listing/get/route.js');

const buildReq = (body) =>
    new Request('http://localhost/api/listing/get', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
    });

const callRoute = async (body) => {
    const captured = {};
    const queryChain = {
        sort() { return this; },
        skip() { return this; },
        limit() { return this; },
        lean: async () => [],
    };
    mockListing.find = vi.fn((q) => {
        captured.query = q;
        return queryChain;
    });
    const res = await POST(buildReq(body));
    return { res, captured };
};

describe('POST /api/listing/get — NoSQL injection defenses', () => {
    afterEach(() => vi.restoreAllMocks());

    it('drops searchTerm when it is an object (NoSQL operator injection attempt)', async () => {
        const { res, captured } = await callRoute({ searchTerm: { $ne: null } });
        expect(res.status).toBe(200);
        // The malicious operator must NOT reach the query. Empty $or means searchFilter
        // was NOT applied, which is the secure outcome.
        expect(captured.query.$or).toBeUndefined();
    });

    it('escapes regex metacharacters in searchTerm to prevent regex DoS / semantic break', async () => {
        const { captured } = await callRoute({ searchTerm: '.*(.*)+' });
        expect(captured.query.$or).toBeDefined();
        const namePattern = captured.query.$or[0].name.$regex;
        // Original specials must be backslash-escaped — no raw `.` `*` `(` `+` allowed through.
        expect(namePattern).toBe('\\.\\*\\(\\.\\*\\)\\+');
    });

    it('drops userId filter when it is not a valid ObjectId', async () => {
        const { captured } = await callRoute({ userId: { $gt: '' } });
        expect(captured.query.userid).toBeUndefined();

        const { captured: c2 } = await callRoute({ userId: 'not-an-objectid' });
        expect(c2.query.userid).toBeUndefined();
    });

    it('drops listingId filter when it is not a valid ObjectId', async () => {
        const { captured } = await callRoute({ listingId: { $ne: null } });
        expect(captured.query._id).toBeUndefined();
    });

    it('accepts a valid 24-hex ObjectId for userId', async () => {
        const validId = '507f1f77bcf86cd799439011';
        const { captured } = await callRoute({ userId: validId });
        expect(captured.query.userid).toBe(validId);
    });

    it('whitelists type — rejects arbitrary strings', async () => {
        const { captured } = await callRoute({ type: 'something_evil' });
        expect(captured.query.type).toBeUndefined();
    });

    it('whitelists type — accepts rent and sale', async () => {
        const { captured: rent } = await callRoute({ type: 'rent' });
        expect(rent.query.type).toBe('rent');

        const { captured: sale } = await callRoute({ type: 'sale' });
        expect(sale.query.type).toBe('sale');
    });

    it('clamps limit to a max of 50 (prevents resource exhaustion via huge requests)', async () => {
        // We can't easily inspect skip/limit via the chain we built; instead we install
        // spies on the chain methods.
        let captured;
        const queryChain = {
            sort() { return this; },
            skip(n) { captured = { skip: n, ...captured }; return this; },
            limit(n) { captured = { ...captured, limit: n }; return this; },
            lean: async () => [],
        };
        mockListing.find = vi.fn(() => queryChain);
        await POST(buildReq({ limit: 999_999 }));
        expect(captured.limit).toBe(50);
    });
});

describe('POST /api/listing/get — error handling', () => {
    it('returns a generic message on internal error (no stack/details leaked)', async () => {
        mockListing.find = vi.fn(() => {
            throw new Error('mongoose: connection string foo://leaky-secret');
        });
        const res = await POST(buildReq({}));
        expect(res.status).toBe(500);
        const body = await res.json();
        expect(body.message).toBe('Something went wrong');
        expect(JSON.stringify(body)).not.toContain('leaky-secret');
        expect(JSON.stringify(body)).not.toContain('mongoose');
    });
});
