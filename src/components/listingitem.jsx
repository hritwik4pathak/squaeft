import { ROUTES } from "@/lib/routes";
import Image from "next/image";
import Link from "next/link";
import { FaBath, FaBed } from 'react-icons/fa';
import { MdLocationOn } from 'react-icons/md';

export default function ListingItems({ listing }) {
    const regularPrice = Number(listing?.regularprice ?? 0);
    const discountedPrice = Number(listing?.discountedprice ?? 0);
    const displayPrice = listing?.offer ? discountedPrice : regularPrice;

    // Format price in Indian style (Lac / Cr)
    const formatPrice = (price) => {
        if (price >= 10000000) return `₹${(price / 10000000).toFixed(2)} Cr`;
        if (price >= 100000)   return `₹${(price / 100000).toFixed(0)} Lac`;
        return `₹${price.toLocaleString('en-IN')}`;
    };

    const imageCount = listing?.imageUrls?.length || 0;

    return (
        <Link href={ROUTES.listing(listing._id)}>
            <div className="w-full sm:w-[330px] bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md border border-gray-100 transition-all duration-200 cursor-pointer group">

                {/* Image */}
                <div className="relative w-full h-52 overflow-hidden">
                    <Image
                        src={listing.imageUrls?.[0] || 'https://placehold.co/800x400?text=No+Image'}
                        alt={listing.name || 'Listing'}
                        fill
                        sizes="(max-width: 640px) 100vw, 330px"
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />

                    {/* Image count badge */}
                    {imageCount > 0 && (
                        <div className="absolute bottom-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded-md flex items-center gap-1">
                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            {imageCount}
                        </div>
                    )}

                    {/* Offer badge */}
                    {listing.offer && (
                        <div className="absolute top-2 left-2 bg-green-500 text-white text-xs font-semibold px-2 py-1 rounded-md">
                            OFFER
                        </div>
                    )}

                    {/* Type badge */}
                    <div className={`absolute top-2 right-2 text-white text-xs font-semibold px-2 py-1 rounded-md
                        ${listing.type === 'rent' ? 'bg-blue-500' : 'bg-red-500'}`}>
                        {listing.type === 'rent' ? 'FOR RENT' : 'FOR SALE'}
                    </div>
                </div>

                {/* Content */}
                <div className="p-4 flex flex-col gap-2">
                    {/* Name */}
                    <p className="text-slate-700 font-semibold text-base truncate">
                        {listing.name}
                    </p>

                    {/* Price */}
                    <div className="flex items-center gap-2">
                        <p className="text-lg font-bold text-slate-800">
                            {formatPrice(displayPrice)}
                        </p>
                        {listing.type === 'rent' && (
                            <span className="text-xs text-slate-400 font-normal">/month</span>
                        )}
                        {listing.offer && (
                            <span className="text-xs text-green-600 font-semibold">
                                {formatPrice(regularPrice - discountedPrice)} OFF
                            </span>
                        )}
                    </div>

                    {/* Beds / Baths */}
                    <div className="flex items-center gap-3 text-slate-500 text-sm">
                        <span className="flex items-center gap-1">
                            <FaBed className="text-slate-400" />
                            {listing.bedrooms} {listing.bedrooms > 1 ? 'Beds' : 'Bed'}
                        </span>
                        <span className="text-slate-300">|</span>
                        <span className="flex items-center gap-1">
                            <FaBath className="text-slate-400" />
                            {listing.bathrooms} {listing.bathrooms > 1 ? 'Baths' : 'Bath'}
                        </span>
                        {listing.furnished && (
                            <>
                                <span className="text-slate-300">|</span>
                                <span className="text-xs text-slate-500">Furnished</span>
                            </>
                        )}
                    </div>

                    {/* Address */}
                    <div className="flex items-start gap-1 text-slate-400 text-xs">
                        <MdLocationOn className="text-red-400 mt-0.5 flex-shrink-0" />
                        <p className="truncate">{listing.address}</p>
                    </div>

                    {/* Bottom row */}
                    <div className="flex items-center justify-between mt-1 pt-2 border-t border-gray-50">
                        <span className="text-xs text-slate-400">
                            {listing.parking ? '🅿 Parking' : 'No Parking'}
                        </span>
                        <span className="text-xs text-slate-400">
                            👁 {(listing.views ?? 0).toLocaleString()} views
                        </span>
                    </div>
                </div>
            </div>
        </Link>
    );
}