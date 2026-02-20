import { currentUser } from "@clerk/nextjs/server";
import Listing from "../../../../lib/models/listing.model";
import { connect } from "../../../../lib/mongodb/mongoose";
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
    const data = await req.json();

    const userMongoId = user?.publicMetadata?.userMongoId;

    if (!userMongoId || userMongoId !== data.userMongoId) {
      return new Response(
        JSON.stringify({ success: false, message: "Unauthorized" }),
        { status: 401 }
      );
    }

    const newListing = await Listing.create({
      userid: userMongoId,
      name: data.name,
      description: data.description,
      regularprice: data.regularprice,
      discountedprice: data.discountedprice,
      address: data.address,
      bathrooms: data.bathrooms,
      bedrooms: data.bedrooms,
      furnished: data.furnished,
      parking: data.parking,
      type: data.type,
      offer: data.offer,
      imageUrls: data.imageUrls,
    });

    return new Response(
      JSON.stringify({ success: true, data: newListing }),
      { status: 200 }
    );

  } catch (error) {
    console.error("Error creating listing:", error);

    return new Response(
      JSON.stringify({
        success: false,
        message: error.message || "Server error",
      }),
      { status: 500 }
    );
  }
};
