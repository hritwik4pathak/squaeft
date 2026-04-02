import ListingItems from "@/components/listingitem";
import Image from "next/image";
import Link from "next/link";

export default async function Home() {
    // Fetch all 4 listing types in parallel
    const fetcher = async (body) => {
        try {
            const result = await fetch(process.env.BASE_URL + '/api/listing/get', {
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
        <div className="flex flex-col gap-6 p-28 px-3 w-full mx-auto">
            {/* Hero Banner */}
            <div className="relative w-full h-96 mb-6 overflow-hidden">
                <Image
                    src="/Assets/home-page.png"
                    alt="Home background"
                    fill
                    priority
                    sizes="100vw"
                    className="object-cover"
                />
                <div className="absolute inset-0 bg-opacity-20"></div>
                <h1 className="absolute top-8 left-8 z-20 text-slate-700 font-bold text-3xl lg:text-6xl drop-shadow-lg">
                    Find Your <span className="text-slate-300">Dream</span>
                    <br />
                    Home with ease
                </h1>
                <div className="relative z-10 text-center px-6 flex flex-col items-center justify-center h-full">
                    <div className="text-green-800 mt-53 text-xs sm:text-sm font-semibold drop-shadow-lg">
                        (.....) is the best place to find your dream home.
                        <br />
                        We have a wide range of listings for rent and sale, as well as special offers.
                        <br /> Whether looking for a cozy apartment or a spacious house, we have something for everyone.
                    </div>
                    <Link
                        href={'/search'}
                        className="mt-4 inline-block text-xs sm:text-sm text-white font-bold hover:underline bg-orange-500 bg-opacity-80 px-4 py-2 rounded"
                    >
                        Let&apos;s find your dream home
                    </Link>
                </div>
            </div>

            {/* Offer Listings */}
            {offlistings.length > 0 && (
                <div>
                    <div className="my-3">
                        <h2 className="text-2xl font-semibold text-slate-600">Special Offers</h2>
                        <Link className="text-sm text-blue-800 hover:underline" href={'/search?offer=true'}>
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
                        <Link className="text-sm text-blue-800 hover:underline" href={'/search?type=rent'}>
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
                        <Link className="text-sm text-blue-800 hover:underline" href={'/search?type=sale'}>
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