import { describe, expect, it } from 'vitest';
import {
    cleanBool,
    cleanInt,
    cleanPhone,
    cleanString,
    escapeRegex,
    isValidObjectId,
    validateListingPayload,
} from '@/lib/security/sanitize';

const validImages = ['https://firebasestorage.googleapis.com/x.jpg'];
const validPayload = {
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
    imageUrls: validImages,
    whatsappNumber: '+91 98765 43210',
};

describe('escapeRegex', () => {
    it('escapes all regex metacharacters', () => {
        expect(escapeRegex('.*+?^${}()|[]\\')).toBe('\\.\\*\\+\\?\\^\\$\\{\\}\\(\\)\\|\\[\\]\\\\');
    });

    it('leaves plain text alone', () => {
        expect(escapeRegex('hello world')).toBe('hello world');
    });

    it('coerces non-strings to string before escaping', () => {
        expect(escapeRegex(42)).toBe('42');
    });
});

describe('cleanString', () => {
    it('rejects non-strings (NoSQL operator injection defense)', () => {
        // This is the critical case: an attacker sends `{ "$ne": null }` as JSON body.
        expect(cleanString({ $ne: null })).toBe('');
        expect(cleanString(['evil'])).toBe('');
        expect(cleanString(42)).toBe('');
        expect(cleanString(null)).toBe('');
        expect(cleanString(undefined)).toBe('');
    });

    it('trims and caps length', () => {
        expect(cleanString('  hi  ')).toBe('hi');
        expect(cleanString('a'.repeat(500), { max: 10 })).toBe('a'.repeat(10));
    });

    it('strips control characters but keeps tabs and newlines', () => {
        expect(cleanString('hello\x00world')).toBe('helloworld');
        expect(cleanString('line1\nline2\ttab')).toBe('line1\nline2\ttab');
    });
});

describe('cleanInt', () => {
    it('clamps to min/max', () => {
        expect(cleanInt('5', { min: 1, max: 10 })).toBe(5);
        expect(cleanInt('-100', { min: 0, max: 10 })).toBe(0);
        expect(cleanInt('999', { min: 0, max: 10 })).toBe(10);
    });

    it('falls back when input is not a number', () => {
        expect(cleanInt('abc', { fallback: 7 })).toBe(7);
        expect(cleanInt(undefined, { fallback: 3 })).toBe(3);
    });
});

describe('cleanBool', () => {
    it('only treats strict true as true', () => {
        expect(cleanBool(true)).toBe(true);
        expect(cleanBool('true')).toBe(false);
        expect(cleanBool(1)).toBe(false);
        expect(cleanBool({ $ne: false })).toBe(false);
    });
});

describe('isValidObjectId', () => {
    it('accepts a 24-char hex string', () => {
        expect(isValidObjectId('507f1f77bcf86cd799439011')).toBe(true);
    });

    it('rejects malformed strings', () => {
        expect(isValidObjectId('not-an-id')).toBe(false);
        expect(isValidObjectId('507f1f77bcf86cd79943901')).toBe(false); // too short
        expect(isValidObjectId('507f1f77bcf86cd7994390111')).toBe(false); // too long
        expect(isValidObjectId('507f1f77bcf86cd79943901Z')).toBe(false); // non-hex
    });

    it('rejects non-strings (NoSQL operator injection defense)', () => {
        expect(isValidObjectId({ $gt: '' })).toBe(false);
        expect(isValidObjectId(null)).toBe(false);
        expect(isValidObjectId(undefined)).toBe(false);
        expect(isValidObjectId(123)).toBe(false);
    });
});

describe('cleanPhone', () => {
    it('accepts a normal international number', () => {
        expect(cleanPhone('+91 98765 43210')).toBe('+91 98765 43210');
    });

    it('strips disallowed characters', () => {
        expect(cleanPhone('+91-98<script>765')).toBe('+91-98765');
    });

    it('rejects when total digits < 7 or > 15', () => {
        expect(cleanPhone('123')).toBe('');
        expect(cleanPhone('1234567890123456')).toBe('');
    });

    it('rejects non-strings', () => {
        expect(cleanPhone({ $ne: null })).toBe('');
    });
});

describe('validateListingPayload', () => {
    it('accepts a fully-valid payload', () => {
        const r = validateListingPayload(validPayload);
        expect(r.ok).toBe(true);
        expect(r.value.name).toBe(validPayload.name);
        expect(r.value.imageUrls).toEqual(validImages);
    });

    it('rejects short names', () => {
        const r = validateListingPayload({ ...validPayload, name: 'short' });
        expect(r.ok).toBe(false);
    });

    it('rejects payloads with > 6 images', () => {
        const r = validateListingPayload({
            ...validPayload,
            imageUrls: Array(7).fill('https://firebasestorage.googleapis.com/x.jpg'),
        });
        expect(r.ok).toBe(false);
    });

    it('rejects http (non-HTTPS) image URLs', () => {
        const r = validateListingPayload({
            ...validPayload,
            imageUrls: ['http://insecure.example.com/x.jpg'],
        });
        expect(r.ok).toBe(false);
    });

    it('rejects data: / javascript: image URLs', () => {
        const dataUrl = validateListingPayload({
            ...validPayload,
            imageUrls: ['data:image/png;base64,AAAA'],
        });
        const jsUrl = validateListingPayload({
            ...validPayload,
            // eslint-disable-next-line no-script-url
            imageUrls: ['javascript:alert(1)'],
        });
        expect(dataUrl.ok).toBe(false);
        expect(jsUrl.ok).toBe(false);
    });

    it('rejects offer with discountedprice >= regularprice', () => {
        const r = validateListingPayload({
            ...validPayload,
            offer: true,
            regularprice: 1000,
            discountedprice: 1000,
        });
        expect(r.ok).toBe(false);
    });

    it('forces type to rent or sale (whitelist)', () => {
        const evil = validateListingPayload({ ...validPayload, type: '$ne' });
        expect(evil.ok).toBe(true);
        expect(evil.value.type).toBe('rent'); // falls back to rent, NOT the attacker string
    });

    it('coerces booleans — truthy non-true does not become true', () => {
        const r = validateListingPayload({
            ...validPayload,
            offer: 'yes',
            parking: 1,
            furnished: { $ne: false },
        });
        expect(r.ok).toBe(true);
        expect(r.value.offer).toBe(false);
        expect(r.value.parking).toBe(false);
        expect(r.value.furnished).toBe(false);
    });
});
