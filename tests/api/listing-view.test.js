import { afterEach, describe, expect, it, vi } from 'vitest';

const { mockListing } = vi.hoisted(() => ({
    mockListing: { findByIdAndUpdate: undefined },
}));

vi.mock('@/lib/models/listing.model', () => ({ default: mockListing }));
vi.mock('@/lib/mongodb/mongoose', () => ({ connect: () => Promise.resolve() }));

const { POST } = await import('@/app/api/listing/view/route.js');

const buildReq = (body) =>
    new Request('http://localhost/api/listing/view', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
    });

describe('POST /api/listing/view — ObjectId validation', () => {
    afterEach(() => vi.restoreAllMocks());

    it('rejects a non-string listingId (NoSQL operator injection attempt)', async () => {
        mockListing.findByIdAndUpdate = vi.fn();
        const res = await POST(buildReq({ listingId: { $gt: '' } }));
        expect(res.status).toBe(400);
        expect(mockListing.findByIdAndUpdate).not.toHaveBeenCalled();
    });

    it('rejects a malformed string listingId', async () => {
        mockListing.findByIdAndUpdate = vi.fn();
        const res = await POST(buildReq({ listingId: 'not-an-id' }));
        expect(res.status).toBe(400);
        expect(mockListing.findByIdAndUpdate).not.toHaveBeenCalled();
    });

    it('rejects missing listingId', async () => {
        mockListing.findByIdAndUpdate = vi.fn();
        const res = await POST(buildReq({}));
        expect(res.status).toBe(400);
        expect(mockListing.findByIdAndUpdate).not.toHaveBeenCalled();
    });

    it('accepts a valid 24-hex ObjectId and increments views', async () => {
        const id = '64a000000000000000000001';
        mockListing.findByIdAndUpdate = vi.fn().mockResolvedValue({});
        const res = await POST(buildReq({ listingId: id }));
        expect(res.status).toBe(200);
        expect(mockListing.findByIdAndUpdate).toHaveBeenCalledWith(id, { $inc: { views: 1 } });
    });

    it('returns generic 500 on internal failure (no error.message leak)', async () => {
        mockListing.findByIdAndUpdate = vi.fn(() => {
            throw new Error('internal mongo path /var/lib/mongodb/db.0');
        });
        const res = await POST(buildReq({ listingId: '64a000000000000000000001' }));
        expect(res.status).toBe(500);
        const body = await res.json();
        expect(body.message).toBe('Something went wrong');
        expect(JSON.stringify(body)).not.toContain('/var/lib/mongodb');
    });
});
