import mongoose from 'mongoose';

// Escape regex metacharacters so user input cannot break out of a $regex query.
// Without this, a searchTerm of `.*` or `(?:` could be used to craft denial-of-service
// or alter query semantics.
export const escapeRegex = (input) =>
    String(input).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// Coerce to a clean string: rejects objects (which is how NoSQL operator injection
// arrives — e.g. `{ "$ne": null }` over JSON). Trims and caps length.
export const cleanString = (value, { max = 200 } = {}) => {
    if (value === undefined || value === null) return '';
    if (typeof value !== 'string') return '';
    // Strip control characters except \n and \t
    const stripped = value.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');
    return stripped.trim().slice(0, max);
};

export const cleanInt = (value, { min, max, fallback = 0 } = {}) => {
    const n = Number.parseInt(value, 10);
    if (!Number.isFinite(n)) return fallback;
    if (typeof min === 'number' && n < min) return min;
    if (typeof max === 'number' && n > max) return max;
    return n;
};

export const cleanBool = (value) => value === true;

export const isValidObjectId = (id) =>
    typeof id === 'string' && mongoose.Types.ObjectId.isValid(id) && /^[a-f0-9]{24}$/i.test(id);

// Loose phone number sanitizer for WhatsApp: keep digits, +, spaces, dashes, parens.
// Reject anything that doesn't end up with at least 7 digits.
export const cleanPhone = (value) => {
    const s = cleanString(value, { max: 32 });
    const allowed = s.replace(/[^\d+\s()-]/g, '');
    const digits = allowed.replace(/\D/g, '');
    if (digits.length < 7 || digits.length > 15) return '';
    return allowed;
};

// Validates a listing payload from create/update. Returns { ok, value, error }.
export const validateListingPayload = (data) => {
    const name = cleanString(data?.name, { max: 80 });
    if (name.length < 10) return { ok: false, error: 'Invalid name' };

    const description = cleanString(data?.description, { max: 4000 });
    if (description.length < 1) return { ok: false, error: 'Invalid description' };

    const address = cleanString(data?.address, { max: 300 });
    if (address.length < 1) return { ok: false, error: 'Invalid address' };

    const type = data?.type === 'sale' ? 'sale' : 'rent';

    const bedrooms = cleanInt(data?.bedrooms, { min: 1, max: 10, fallback: 1 });
    const bathrooms = cleanInt(data?.bathrooms, { min: 1, max: 10, fallback: 1 });

    const regularprice = cleanInt(data?.regularprice, { min: 0, max: 100_000_000, fallback: 0 });
    const discountedprice = cleanInt(data?.discountedprice, { min: 0, max: 100_000_000, fallback: 0 });

    const offer = cleanBool(data?.offer);
    const parking = cleanBool(data?.parking);
    const furnished = cleanBool(data?.furnished);

    if (offer && discountedprice >= regularprice) {
        return { ok: false, error: 'Discounted price must be less than regular price' };
    }

    // imageUrls: must be an array of HTTPS strings, max 6, each <= 2KB
    const rawImages = Array.isArray(data?.imageUrls) ? data.imageUrls : [];
    if (rawImages.length < 1 || rawImages.length > 6) {
        return { ok: false, error: 'Must provide between 1 and 6 images' };
    }
    const imageUrls = [];
    for (const url of rawImages) {
        if (typeof url !== 'string' || url.length > 2048) {
            return { ok: false, error: 'Invalid image URL' };
        }
        if (!/^https:\/\//i.test(url)) {
            return { ok: false, error: 'Image URLs must be HTTPS' };
        }
        imageUrls.push(url);
    }

    const whatsappNumber = cleanPhone(data?.whatsappNumber);

    return {
        ok: true,
        value: {
            name,
            description,
            address,
            type,
            bedrooms,
            bathrooms,
            regularprice,
            discountedprice,
            offer,
            parking,
            furnished,
            imageUrls,
            whatsappNumber,
        },
    };
};
