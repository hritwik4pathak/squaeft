import Listing from "@/lib/models/listing.model";
import { connect } from "@/lib/mongodb/mongoose";
import { currentUser } from "@clerk/nextjs/server";
export const POST = async (req) => {
    try {
        await connect();
        const data = await req.json();
        if (!user || user.publicMetadata.userMongoId !== data.userMongoId) {
            return new Response('Unauthorized', { 
                status: 401,
             });
        }
        const newPost = await Listing.findByIdAndUpdate(
            data.listingId,
            {
                $set: {
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
            },
         },
        { new: true }
        );
        await newListing.save();
        return new Response(JSON.stringify(newListing), {
            status: 200,
        });
    } catch (error) {
        console.log('error updating listing:', error);
        return new Response('error updating listing', {
            status: 500,
        });
    }
};
