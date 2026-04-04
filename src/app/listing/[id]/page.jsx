import { API_ROUTES } from "@/lib/routes";
import Image from "next/image";
import {
    FaBath,
    FaBed,
    FaChair,
    FaMapMarkerAlt,
    FaParking,
} from "react-icons/fa";

export default async function Listing({ params }) {
    let listing = null;
    try {
        const result = await fetch(process.env.BASE_URL + API_ROUTES.listingGet, {
            method: 'POST',
            body: JSON.stringify({ listingId: params.id }),
            cache: 'no-store',
        });
        const data = await result.json();
        listing = data?.[0] || data;
    } catch (error) {
        listing = { title: 'error fetching listing' };
    }

    if (!listing || listing === 'failed to load listing') {
        return (
            <main className="p-3 flex flex-col max-w-6xl mx-auto min-h-screen">
                <h1 className="text-xl mt-10 p-3 text-center font-serif max-w-2xl mx-auto lg:text-2xl">
                    Listing not found...
                </h1>
            </main>
        );
    }

    // ✅ Increment view count every time this page is opened
    try {
        await fetch(process.env.BASE_URL + API_ROUTES.listingView, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ listingId: params.id }),
            cache: 'no-store',
        });
    } catch (_) {
        // silently fail — don't crash the page if view tracking fails
    }

    const regularPrice = Number(listing.regularprice ?? 0);
    const discountedPrice = Number(listing.discountedprice ?? 0);
    const displayPrice = listing.offer ? discountedPrice : regularPrice;

    return (
        <main>
            <div>
                <div className="relative w-full h-[400px]">
                    <Image
                        src={listing?.imageUrls?.[0] || "https://placehold.co/800x400?text=No+Image"}
                        alt={listing?.name || "Listing"}
                        fill
                        priority
                        sizes="100vw"
                        className="object-cover"
                    />
                </div>
                <div className="flex flex-col max-w-4xl mx-auto p-3 my-7 gap-4">
                    <p className="text-2xl font-semibold">
                        {listing.name} - ${' '}
                        {displayPrice.toLocaleString('en-US')}
                        {listing.type === 'rent' && ' / month'}
                    </p>
                    <p className="flex items-center mt-6 gap-2 text-slate-600 text-sm">
                        <FaMapMarkerAlt className="text-green-700" />
                        {listing.address}
                    </p>
                    <div className="flex gap-4">
                        <p className="bg-red-900 w-full max-w-50 text-white text-center p-1 rounded-md">
                            {listing.type === 'rent' ? 'For Rent' : 'For Sale'}
                        </p>
                        {listing.offer && (
                            <p className="bg-green-900 w-full max-w-50 text-white text-center p-1 rounded-md">
                                ${regularPrice - discountedPrice} OFF
                            </p>
                        )}
                    </div>
                    <p className="text-slate-800">
                        <span className="font-semibold text-black">Description - </span>
                        {listing.description}
                    </p>
                    <ul className="text-green-900 font-semibold text-sm flex flex-wrap items-center gap-4 sm:gap-6">
                        <li className="flex items-center gap-1 whitespace-nowrap">
                            <FaBed className="text-lg" />
                            {listing.bedrooms > 1 ? `${listing.bedrooms} Beds` : `${listing.bedrooms} Bed`}
                        </li>
                        <li className="flex items-center gap-1 whitespace-nowrap">
                            <FaBath className="text-lg" />
                            {listing.bathrooms > 1 ? `${listing.bathrooms} Baths` : `${listing.bathrooms} Bath`}
                        </li>
                        <li className="flex items-center gap-1 whitespace-nowrap">
                            <FaParking className="text-lg" />
                            {listing.parking ? 'Parking Spot' : 'No Parking'}
                        </li>
                        <li className="flex items-center gap-1 whitespace-nowrap">
                            <FaChair className="text-lg" />
                            {listing.furnished ? 'Furnished' : 'Not Furnished'}
                        </li>
                    </ul>
                    {/* ✅ Show view count */}
                    <p className="text-xs text-slate-400 mt-2">
                        👁 {(listing.views ?? 0).toLocaleString()} views
                    </p>
                </div>
            </div>
        </main>
    );
}