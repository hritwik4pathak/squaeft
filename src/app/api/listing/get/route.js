import Listing from "@/lib/models/listing.model";
import { connect } from "@/lib/mongodb/mongoose";

export const POST = async (req) => {
    try {
        await connect();
        const data = await req.json();

        const startIndex = parseInt(data.startIndex) || 0;
        const limit = parseInt(data.limit) || 9;

        // Sort
        let sortField = { updatedAt: data.order === 'asc' ? 1 : -1 };
        if (data.sortBy === 'views') {
            sortField = { views: -1 };
        }

        // ✅ FIX: only filter by offer/parking/furnished if explicitly set to true
        // If not provided or false, show all (don't restrict)
        const offerFilter = data.offer === true ? { offer: true } : {};
        const parkingFilter = data.parking === true ? { parking: true } : {};
        const furnishedFilter = data.furnished === true ? { furnished: true } : {};

        // ✅ FIX: type filter — only restrict if a specific type is passed
        const typeFilter =
            data.type && data.type !== 'all'
                ? { type: data.type }
                : {};

        // Search term filter
        const searchFilter = data.searchTerm
            ? {
                $or: [
                    { name: { $regex: data.searchTerm, $options: 'i' } },
                    { description: { $regex: data.searchTerm, $options: 'i' } },
                    { address: { $regex: data.searchTerm, $options: 'i' } },
                ],
              }
            : {};

        // Bedroom/bathroom filters
        const bedroomFilter = data.bedrooms ? { bedrooms: Number(data.bedrooms) } : {};
        const bathroomFilter = data.bathrooms ? { bathrooms: Number(data.bathrooms) } : {};

        // User/listing ID filters
        const userFilter = data.userId ? { userid: data.userId } : {};
        const listingIdFilter = data.listingId ? { _id: data.listingId } : {};

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

        const listings = await Listing.find(query)
            .sort(sortField)
            .skip(startIndex)
            .limit(limit);

        return new Response(JSON.stringify(listings), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });

    } catch (error) {
        console.error('Error getting listing:', error);
        return new Response(
            JSON.stringify({ success: false, message: error.message }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
};