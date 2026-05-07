import Listing from "@/lib/models/listing.model";
import { connect } from "@/lib/mongodb/mongoose";
import { currentUser } from "@clerk/nextjs/server";
import { isValidObjectId, validateListingPayload } from "@/lib/security/sanitize";

export const POST = async (req) => {
    try {
        const user = await currentUser();
        if (!user) {
            return new Response(
                JSON.stringify({ success: false, message: 'Unauthorized' }),
                { status: 401 }
            );
        }

        await connect();
        const data = await req.json().catch(() => ({}));

        const userMongoId = user?.publicMetadata?.userMongoId;
        if (!userMongoId || userMongoId !== data.userMongoId) {
            return new Response(
                JSON.stringify({ success: false, message: 'Unauthorized' }),
                { status: 401 }
            );
        }

        if (!isValidObjectId(data.listingId)) {
            return new Response(
                JSON.stringify({ success: false, message: 'Invalid listing id' }),
                { status: 400 }
            );
        }

        const result = validateListingPayload(data);
        if (!result.ok) {
            return new Response(
                JSON.stringify({ success: false, message: result.error }),
                { status: 400 }
            );
        }

        // CRITICAL: verify the listing actually belongs to the authenticated user.
        // Without this check, any logged-in user could update ANY listing by passing
        // their own userMongoId + someone else's listingId (Insecure Direct Object
        // Reference / IDOR). The previous version had this bug.
        const existing = await Listing.findById(data.listingId).select('userid').lean();
        if (!existing) {
            return new Response(
                JSON.stringify({ success: false, message: 'Listing not found' }),
                { status: 404 }
            );
        }
        if (String(existing.userid) !== String(userMongoId)) {
            return new Response(
                JSON.stringify({ success: false, message: 'Forbidden' }),
                { status: 403 }
            );
        }

        const updated = await Listing.findByIdAndUpdate(
            data.listingId,
            { $set: result.value },
            { new: true }
        );

        return new Response(JSON.stringify({ success: true, data: updated }), { status: 200 });
    } catch (error) {
        console.error('Error updating listing:', error);
        return new Response(
            JSON.stringify({ success: false, message: 'Something went wrong' }),
            { status: 500 }
        );
    }
};
