import Listing from "@/lib/models/listing.model";
import { connect } from "@/lib/mongodb/mongoose";

export const POST = async (req) => {
    try {
        await connect();
        const { listingId } = await req.json();

        if (!listingId) {
            return new Response(
                JSON.stringify({ success: false, message: "listingId is required" }),
                { status: 400, headers: { "Content-Type": "application/json" } }
            );
        }

        await Listing.findByIdAndUpdate(listingId, { $inc: { views: 1 } });

        return new Response(
            JSON.stringify({ success: true }),
            { status: 200, headers: { "Content-Type": "application/json" } }
        );
    } catch (error) {
        console.error("Error incrementing views:", error);
        return new Response(
            JSON.stringify({ success: false, message: error.message }),
            { status: 500, headers: { "Content-Type": "application/json" } }
        );
    }
};