
import ListingItems from "@/components/shared/listingitem";
import PropertyCategories from "@/components/home/Propertycategories";
import SearchBar from "@/components/home/seaarch-bar";
import { connect } from "@/lib/mongodb/mongoose";
import Listing from "@/lib/models/listing.model";
import { SEARCH_ROUTES } from "@/lib/routes";
import Link from "next/link";

async function getListings(query, sort, limit) {
    await connect();
    const results = await Listing.find(query).sort(sort).limit(limit).lean();
    // lean() returns plain objects — serialize _id and dates for client components
    return JSON.parse(JSON.stringify(results));
}

export default async function Home() {
    const [rentlistings, salelistings, offlistings, popularlistings] = await Promise.all([
        getListings({ type: 'rent' },          { updatedAt: 1 }, 4),
        getListings({ type: 'sale' },          { updatedAt: 1 }, 4),
        getListings({ offer: true },           { updatedAt: 1 }, 4),
        getListings({},                        { views: -1 },    4),
    ]);

    return (
        <div className="flex flex-col gap-6 pt-6 px-3 w-full mx-auto">
            {/* Search Bar above Hero Banner */}
            <SearchBar />

            {/* Offer Listings */}
            {offlistings.length > 0 && (
                <div>
                    <div className="my-3">
                        <h2 className="text-2xl font-semibold text-slate-600">Special Offers</h2>
                        <Link className="text-sm text-blue-800 hover:underline"
                        href={SEARCH_ROUTES.withOffer}>
                            Show more offers
                        </Link>
                    </div>
                    <div className="flex flex-wrap gap-4">
                        {offlistings.map((listing) => (
                            <ListingItems key={listing._id} listing={listing} />
                        ))}
                    </div>
                </div>
            )}

            <PropertyCategories />

            {/* Popular Listings */}
            {popularlistings.length > 0 && (
                <div>
                    <div className="my-3">
                        <h2 className="text-2xl font-semibold text-slate-600">Popular Places</h2>
                        <p className="text-sm text-slate-400">Most viewed listings</p>
                    </div>
                    <div className="flex flex-wrap gap-4">
                        {popularlistings.map((listing) => (
                            <ListingItems key={listing._id} listing={listing} />
                        ))}
                    </div>
                </div>
            )}

            {/* Recent Rent */}
            {rentlistings.length > 0 && (
                <div>
                    <div className="my-3">
                        <h2 className="text-2xl font-semibold text-slate-600">Recent Places for Rent</h2>
                        <Link className="text-sm text-blue-800 hover:underline"
                         href={SEARCH_ROUTES.forRent}>
                            Show more rentals
                        </Link>
                    </div>
                    <div className="flex flex-wrap gap-4">
                        {rentlistings.map((listing) => (
                            <ListingItems key={listing._id} listing={listing} />
                        ))}
                    </div>
                </div>
            )}

            {/* Recent Buy */}
            {salelistings.length > 0 && (
                <div>
                    <div className="my-3">
                        <h2 className="text-2xl font-semibold text-slate-600">Recent Places to Buy</h2>
                        <Link className="text-sm text-blue-800 hover:underline"
                         href={SEARCH_ROUTES.forSale}>
                            Show more properties for sale
                        </Link>
                    </div>
                    <div className="flex flex-wrap gap-4">
                        {salelistings.map((listing) => (
                            <ListingItems key={listing._id} listing={listing} />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
