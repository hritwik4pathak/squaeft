import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const { mockListing, mockCurrentUser } = vi.hoisted(() => ({
    mockListing: { create: undefined },
    mockCurrentUser: vi.fn(),
}));

vi.mock('@/lib/models/listing.model', () => ({ default: mockListing }));
vi.mock('@/lib/mongodb/mongoose', () => ({ connect: () => Promise.resolve() }));
vi.mock('@clerk/nextjs/server', () => ({ currentUser: mockCurrentUser }));

// IMPORTANT: relative path matches the route's actual import (`../../../../lib/...`).
// vi.mock canonicalizes by resolved file path, so the @/ mock above still applies
// to the route's relative import — both resolve to the same physical module.
const { POST } = await import('@/app/api/listing/create/route.js');

const buildReq = (body) =>
    new Request('http://localhost/api/listing/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
    });

const VALID_USER_ID = '507f1f77bcf86cd799439011';
const validBody = (overrides = {}) => ({
    userMongoId: VALID_USER_ID,
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

describe('POST /api/listing/create — auth gate', () => {
    afterEach(() => vi.restoreAllMocks());

    it('returns 401 when no Clerk session is present', async () => {
        mockCurrentUser.mockResolvedValue(null);
        const res = await POST(buildReq(validBody()));
        expect(res.status).toBe(401);
    });

    it('returns 401 when Clerk user has no synced userMongoId', async () => {
        mockCurrentUser.mockResolvedValue({ publicMetadata: {} });
        const res = await POST(buildReq(validBody()));
        expect(res.status).toBe(401);
    });

    it('returns 401 when client-supplied userMongoId does not match the session user', async () => {
        mockCurrentUser.mockResolvedValue({
            publicMetadata: { userMongoId: VALID_USER_ID },
        });
        const res = await POST(buildReq(validBody({ userMongoId: 'attacker-supplied-id' })));
        expect(res.status).toBe(401);
    });
});

describe('POST /api/listing/create — input validation', () => {
    beforeEach(() => {
        mockCurrentUser.mockResolvedValue({
            publicMetadata: { userMongoId: VALID_USER_ID },
        });
    });
    afterEach(() => vi.restoreAllMocks());

    it('rejects names shorter than 10 chars', async () => {
        const res = await POST(buildReq(validBody({ name: 'short' })));
        expect(res.status).toBe(400);
    });

    it('rejects http (non-HTTPS) image URLs', async () => {
        const res = await POST(buildReq(validBody({
            imageUrls: ['http://insecure.example.com/x.jpg'],
        })));
        expect(res.status).toBe(400);
    });

    it('rejects more than 6 images', async () => {
        const res = await POST(buildReq(validBody({
            imageUrls: Array(7).fill('https://firebasestorage.googleapis.com/x.jpg'),
        })));
        expect(res.status).toBe(400);
    });

    it('rejects offer with discountedprice >= regularprice', async () => {
        const res = await POST(buildReq(validBody({
            offer: true,
            regularprice: 100,
            discountedprice: 100,
        })));
        expect(res.status).toBe(400);
    });

    it('does not invoke Listing.create on validation failure', async () => {
        mockListing.create = vi.fn().mockResolvedValue({ _id: 'x' });
        await POST(buildReq(validBody({ name: 'short' })));
        expect(mockListing.create).not.toHaveBeenCalled();
    });
});

describe('POST /api/listing/create — happy path & error envelope', () => {
    beforeEach(() => {
        mockCurrentUser.mockResolvedValue({
            publicMetadata: { userMongoId: VALID_USER_ID },
        });
    });
    afterEach(() => vi.restoreAllMocks());

    it('creates the listing and returns 200 on a valid payload', async () => {
        mockListing.create = vi.fn().mockResolvedValue({ _id: 'abc', name: 'x' });
        const res = await POST(buildReq(validBody()));
        expect(res.status).toBe(200);
        expect(mockListing.create).toHaveBeenCalledTimes(1);
        // Ensures the ownership stamp is forced from the session, not the body
        const arg = mockListing.create.mock.calls[0][0];
        expect(arg.userid).toBe(VALID_USER_ID);
    });

    it('returns a generic 500 message and does not leak Mongo error details', async () => {
        mockListing.create = vi.fn().mockRejectedValue(
            new Error('E11000 duplicate key on internal-collection-name')
        );
        const res = await POST(buildReq(validBody()));
        expect(res.status).toBe(500);
        const body = await res.json();
        expect(body.message).toBe('Something went wrong');
        expect(JSON.stringify(body)).not.toContain('E11000');
        expect(JSON.stringify(body)).not.toContain('internal-collection-name');
    });
});
