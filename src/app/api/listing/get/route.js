import Listing from "@/lib/models/listing.model";
import { connect } from "@/lib/mongodb/mongoose";

export const POST = async (req) => {
    try {
        await connect();
        const data = await req.json();

        const startIndex = parseInt(data.startIndex) || 0;
        const limit = parseInt(data.limit) || 9;

        // ✅ support sorting by views (popular) or updatedAt (recent)
        let sortField = { updatedAt: data.order === 'asc' ? 1 : -1 };
        if (data.sortBy === 'views') {
            sortField = { views: -1 }; // most viewed first
        }

        let offer = data.offer;
        if (offer === undefined || offer === 'false') {
            offer = { $in: [false, true] };
        }

        let furnished = data.furnished;
        if (furnished === undefined || furnished === 'false') {
            furnished = { $in: [false, true] };
        }

        let parking = data.parking;
        if (parking === undefined || parking === 'false') {
            parking = { $in: [false, true] };
        }

        let type = data.type;
        if (type === undefined || type === 'all') {
            type = { $in: ['rent', 'sale'] };
        }

        const listing = await Listing.find({
            ...(data.userId && { userId: data.userId }),
            ...(data.listingId && { _id: data.listingId }),
            ...(data.searchTerm && {
                $or: [
                    { name: { $regex: data.searchTerm, $options: 'i' } },
                    { description: { $regex: data.searchTerm, $options: 'i' } },
                ],
            }),
            offer,
            furnished,
            parking,
            type,
        })
            .sort(sortField)
            .skip(startIndex)
            .limit(limit);

        return new Response(JSON.stringify(listing), {
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