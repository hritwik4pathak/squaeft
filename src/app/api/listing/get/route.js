import Listing from "@/lib/models/listing.model";
import { connect } from "@/lib/mongodb/mongoose";
import {
    cleanBool,
    cleanInt,
    cleanString,
    escapeRegex,
    isValidObjectId,
} from "@/lib/security/sanitize";

export const POST = async (req) => {
    try {
        await connect();
        const data = await req.json().catch(() => ({}));

        const startIndex = cleanInt(data.startIndex, { min: 0, max: 10_000, fallback: 0 });
        const limit = cleanInt(data.limit, { min: 1, max: 50, fallback: 9 });

        // Sort — whitelist only known fields/orders
        let sortField = { updatedAt: data.order === 'asc' ? 1 : -1 };
        if (data.sortBy === 'views') {
            sortField = { views: -1 };
        }

        const offerFilter = cleanBool(data.offer) ? { offer: true } : {};
        const parkingFilter = cleanBool(data.parking) ? { parking: true } : {};
        const furnishedFilter = cleanBool(data.furnished) ? { furnished: true } : {};

        const typeWhitelist = new Set(['rent', 'sale']);
        const typeFilter = typeWhitelist.has(data.type) ? { type: data.type } : {};

        // Search term: coerce to string, cap length, escape regex specials.
        // This blocks NoSQL operator injection (`{ "$ne": null }`) and regex DoS.
        const rawSearch = cleanString(data.searchTerm, { max: 100 });
        const searchFilter = rawSearch
            ? (() => {
                const safe = escapeRegex(rawSearch);
                return {
                    $or: [
                        { name: { $regex: safe, $options: 'i' } },
                        { description: { $regex: safe, $options: 'i' } },
                        { address: { $regex: safe, $options: 'i' } },
                    ],
                };
            })()
            : {};

        const bedroomFilter =
            data.bedrooms !== undefined && data.bedrooms !== null && data.bedrooms !== ''
                ? { bedrooms: cleanInt(data.bedrooms, { min: 1, max: 20, fallback: 1 }) }
                : {};
        const bathroomFilter =
            data.bathrooms !== undefined && data.bathrooms !== null && data.bathrooms !== ''
                ? { bathrooms: cleanInt(data.bathrooms, { min: 1, max: 20, fallback: 1 }) }
                : {};

        // ID filters: only accept valid ObjectIds; otherwise return no results
        // for that filter rather than letting an injected operator through.
        const userFilter = isValidObjectId(data.userId) ? { userid: data.userId } : {};
        const listingIdFilter = isValidObjectId(data.listingId) ? { _id: data.listingId } : {};

        const query = {
            ...userFilter,
            ...listingIdFilter,
            ...searchFilter,
            ...typeFilter,
            ...offerFilter,
            ...parkingFilter,
            ...furnishedFilter,
            ...bedroomFilter,
            ...bathroomFilter,
        };

        const raw = await Listing.find(query)
            .sort(sortField)
            .skip(startIndex)
            .limit(limit)
            .lean();

        const listings = JSON.parse(JSON.stringify(raw));

        return new Response(JSON.stringify(listings), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.error('Error getting listing:', error);
        return new Response(
            JSON.stringify({ success: false, message: 'Something went wrong' }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
};
