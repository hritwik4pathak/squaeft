import Listing from "@/lib/models/listing.model";
import { connect } from "@/lib/mongodb/mongoose";
import { isValidObjectId } from "@/lib/security/sanitize";

export const POST = async (req) => {
    try {
        await connect();
        const { listingId } = await req.json().catch(() => ({}));

        if (!isValidObjectId(listingId)) {
            return new Response(
                JSON.stringify({ success: false, message: "Invalid listing id" }),
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
            JSON.stringify({ success: false, message: "Something went wrong" }),
            { status: 500, headers: { "Content-Type": "application/json" } }
        );
    }
};
