
import ListingItems from "@/components/listingitem";
import PropertyCategories from "@/components/Propertycategories";
import SearchBar from "@/components/seaarch-bar";
import { API_ROUTES, SEARCH_ROUTES } from "@/lib/routes";
import Link from "next/link";

export default async function Home() {
    // Fetch all 4 listing types in parallel
    const fetcher = async (body) => {
        try {
            const result = await fetch(process.env.BASE_URL + API_ROUTES.listingGet, {
                method: 'POST',
                body: JSON.stringify(body),
                cache: 'no-store',
            });
            const data = await result.json();
            return Array.isArray(data) ? data : [];
        } catch {
            return [];
        }
    };

    const [rentlistings, salelistings, offlistings, popularlistings] = await Promise.all([
        fetcher({ type: 'rent', limit: 4, order: 'asc' }),
        fetcher({ type: 'sale', limit: 4, order: 'asc' }),
        fetcher({ offer: true, limit: 4, order: 'asc' }),
        fetcher({ limit: 4, order: 'asc', sortBy: 'views' }), // most viewed
    ]);


    return (
        <div className="flex flex-col gap-6 pt-6 px-3 w-full mx-auto">
            {/* Search Bar above Hero Banner */}
            <SearchBar />
            {/* Hero Banner */}
            

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