import { currentUser } from "@clerk/nextjs/server";
import Listing from "../../../../lib/models/listing.model";
import { connect } from "../../../../lib/mongodb/mongoose";
import { validateListingPayload } from "@/lib/security/sanitize";

export const POST = async (req) => {
  try {
    const user = await currentUser();
    if (!user) {
      return new Response(
        JSON.stringify({ success: false, message: "Unauthorized" }),
        { status: 401 }
      );
    }

    await connect();
    const data = await req.json().catch(() => ({}));

    const userMongoId = user?.publicMetadata?.userMongoId;

    // Two checks: (1) user actually has a synced Mongo record, (2) the client-provided
    // userMongoId matches what Clerk has on file. Mismatch = client trying to spoof.
    if (!userMongoId || userMongoId !== data.userMongoId) {
      return new Response(
        JSON.stringify({ success: false, message: "Unauthorized" }),
        { status: 401 }
      );
    }

    const result = validateListingPayload(data);
    if (!result.ok) {
      return new Response(
        JSON.stringify({ success: false, message: result.error }),
        { status: 400 }
      );
    }

    const newListing = await Listing.create({
      userid: userMongoId,
      ...result.value,
    });

    return new Response(
      JSON.stringify({ success: true, data: newListing }),
      { status: 200 }
    );
  } catch (error) {
    // Never leak error.message — it can include schema details, stack, mongo errors.
    console.error("Error creating listing:", error);
    return new Response(
      JSON.stringify({ success: false, message: "Something went wrong" }),
      { status: 500 }
    );
  }
};
