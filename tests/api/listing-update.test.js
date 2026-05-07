import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const { mockListing, mockCurrentUser } = vi.hoisted(() => ({
    mockListing: { findById: undefined, findByIdAndUpdate: undefined },
    mockCurrentUser: vi.fn(),
}));

vi.mock('@/lib/models/listing.model', () => ({ default: mockListing }));
vi.mock('@/lib/mongodb/mongoose', () => ({ connect: () => Promise.resolve() }));
vi.mock('@clerk/nextjs/server', () => ({ currentUser: mockCurrentUser }));

const { POST } = await import('@/app/api/listing/update/route.js');

const OWNER_ID = '507f1f77bcf86cd799439011';
const ATTACKER_ID = '507f1f77bcf86cd799439099';
const LISTING_ID = '64a000000000000000000001';

const buildReq = (body) =>
    new Request('http://localhost/api/listing/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
    });

const validBody = (overrides = {}) => ({
    listingId: LISTING_ID,
    userMongoId: OWNER_ID,
    name: 'A reasonable listing name',
    description: 'desc',
    address: '1 Main St',
    type: 'rent',
    bedrooms: 2,
    bathrooms: 1,
    regularprice: 1000,
    discountedprice: 0,
    offer: false,
    parking: false,
    furnished: false,
    imageUrls: ['https://firebasestorage.googleapis.com/x.jpg'],
    whatsappNumber: '+91 98765 43210',
    ...overrides,
});

// Helper: mock findById(id).select('userid').lean() chain
const mockFindByIdReturns = (value) => {
    mockListing.findById = vi.fn(() => ({
        select: () => ({ lean: async () => value }),
    }));
};

describe('POST /api/listing/update — IDOR (Insecure Direct Object Reference) fix', () => {
    afterEach(() => vi.restoreAllMocks());

    it('CRITICAL: returns 403 when an authenticated user tries to update a listing owned by someone else', async () => {
        // Attacker is logged in (Clerk session valid) and supplies their own userMongoId
        // — the OLD update route would let them update anyone's listing. The fix verifies
        // existing.userid matches the session user before applying the update.
        mockCurrentUser.mockResolvedValue({
            publicMetadata: { userMongoId: ATTACKER_ID },
        });
        mockFindByIdReturns({ userid: OWNER_ID }); // listing belongs to victim
        mockListing.findByIdAndUpdate = vi.fn();

        const res = await POST(buildReq(validBody({ userMongoId: ATTACKER_ID })));

        expect(res.status).toBe(403);
        // The update must NOT be applied
        expect(mockListing.findByIdAndUpdate).not.toHaveBeenCalled();
    });

    it('returns 401 when client-supplied userMongoId does not match the session', async () => {
        mockCurrentUser.mockResolvedValue({
            publicMetadata: { userMongoId: OWNER_ID },
        });
        mockListing.findByIdAndUpdate = vi.fn();
        const res = await POST(buildReq(validBody({ userMongoId: ATTACKER_ID })));
        expect(res.status).toBe(401);
        expect(mockListing.findByIdAndUpdate).not.toHaveBeenCalled();
    });

    it('returns 401 when no session is present', async () => {
        mockCurrentUser.mockResolvedValue(null);
        const res = await POST(buildReq(validBody()));
        expect(res.status).toBe(401);
    });

    it('returns 404 when the listing does not exist', async () => {
        mockCurrentUser.mockResolvedValue({
            publicMetadata: { userMongoId: OWNER_ID },
        });
        mockFindByIdReturns(null);
        mockListing.findByIdAndUpdate = vi.fn();
        const res = await POST(buildReq(validBody()));
        expect(res.status).toBe(404);
        expect(mockListing.findByIdAndUpdate).not.toHaveBeenCalled();
    });

    it('rejects an invalid (non-ObjectId) listingId with 400', async () => {
        mockCurrentUser.mockResolvedValue({
            publicMetadata: { userMongoId: OWNER_ID },
        });
        mockListing.findById = vi.fn();
        mockListing.findByIdAndUpdate = vi.fn();
        const res = await POST(buildReq(validBody({ listingId: { $ne: null } })));
        expect(res.status).toBe(400);
        expect(mockListing.findById).not.toHaveBeenCalled();
        expect(mockListing.findByIdAndUpdate).not.toHaveBeenCalled();
    });

    it('happy path: owner updating their own listing succeeds', async () => {
        mockCurrentUser.mockResolvedValue({
            publicMetadata: { userMongoId: OWNER_ID },
        });
        mockFindByIdReturns({ userid: OWNER_ID });
        mockListing.findByIdAndUpdate = vi.fn().mockResolvedValue({
            _id: LISTING_ID,
            name: 'updated',
        });
        const res = await POST(buildReq(validBody()));
        expect(res.status).toBe(200);
        expect(mockListing.findByIdAndUpdate).toHaveBeenCalledTimes(1);
    });
});

describe('POST /api/listing/update — input validation', () => {
    beforeEach(() => {
        mockCurrentUser.mockResolvedValue({
            publicMetadata: { userMongoId: OWNER_ID },
        });
        mockFindByIdReturns({ userid: OWNER_ID });
    });
    afterEach(() => vi.restoreAllMocks());

    it('rejects bad payload before checking ownership (cheap rejection first)', async () => {
        mockListing.findByIdAndUpdate = vi.fn();
        const res = await POST(buildReq(validBody({
            imageUrls: ['javascript:alert(1)'],
        })));
        expect(res.status).toBe(400);
        expect(mockListing.findByIdAndUpdate).not.toHaveBeenCalled();
    });
});

describe('POST /api/listing/update — error envelope', () => {
    afterEach(() => vi.restoreAllMocks());

    it('returns generic 500 on internal error (no error.message leak)', async () => {
        mockCurrentUser.mockResolvedValue({
            publicMetadata: { userMongoId: OWNER_ID },
        });
        mockListing.findById = vi.fn(() => {
            throw new Error('mongo replica set credentials = secret123');
        });
        const res = await POST(buildReq(validBody()));
        expect(res.status).toBe(500);
        const body = await res.json();
        expect(body.message).toBe('Something went wrong');
        expect(JSON.stringify(body)).not.toContain('secret123');
    });
});
