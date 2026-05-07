import { connect } from "@/lib/mongodb/mongoose";
import Listing from "@/lib/models/listing.model";
import User from "@/lib/models/user.model";
import { API_ROUTES } from "@/lib/routes";
import {
    FaBath,
    FaBed,
    FaChair,
    FaMapMarkerAlt,
    FaParking,
    FaWhatsapp,
} from "react-icons/fa";
import ImageGallery from "@/components/shared/ImageGallery";

export default async function ListingPage({ params }) {
    const { id } = await params;

    let listing = null;
    let seller = null;

    try {
        await connect();
        const rawListing = await Listing.findById(id).lean();
        listing = rawListing ? JSON.parse(JSON.stringify(rawListing)) : null;

        if (listing?.userid) {
            const rawSeller = await User.findById(listing.userid).lean();
            seller = rawSeller ? JSON.parse(JSON.stringify(rawSeller)) : null;
        }
    } catch (error) {
        console.error("Error fetching listing:", error);
    }

    // Fire-and-forget view counter
    if (listing) {
        fetch(`${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}${API_ROUTES.listingView}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ listingId: id }),
            cache: "no-store",
        }).catch(() => {});
    }

    if (!listing) {
        return (
            <main className="p-3 flex flex-col max-w-6xl mx-auto min-h-screen">
                <h1 className="text-xl mt-10 p-3 text-center font-serif max-w-2xl mx-auto lg:text-2xl">
                    Listing not found...
                </h1>
            </main>
        );
    }

    const regularPrice = Number(listing.regularprice ?? 0);
    const discountedPrice = Number(listing.discountedprice ?? 0);
    const displayPrice = listing.offer ? discountedPrice : regularPrice;

    const formatPrice = (price) => {
        if (price >= 10000000) return `₹${(price / 10000000).toFixed(2)} Cr`;
        if (price >= 100000) return `₹${(price / 100000).toFixed(0)} Lac`;
        return `₹${price.toLocaleString("en-IN")}`;
    };

    const sellerName = seller
        ? `${seller.firstName}${seller.lastName ? " " + seller.lastName : ""}`
        : "Property Owner";

    const waNumber = listing.whatsappNumber?.replace(/\D/g, "");
    const waLink = waNumber ? `https://wa.me/${waNumber}` : null;

    return (
        <main className="max-w-5xl mx-auto px-4 py-8">
            {/* Photo gallery */}
            <ImageGallery images={listing.imageUrls} name={listing.name} />

            <div className="mt-8 flex flex-col lg:flex-row gap-8">
                {/* Left — property details */}
                <div className="flex-1 flex flex-col gap-5">
                    {/* Title & price */}
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800">{listing.name}</h1>
                        <p className="text-2xl font-semibold text-slate-700 mt-1">
                            {formatPrice(displayPrice)}
                            {listing.type === "rent" && (
                                <span className="text-base font-normal text-slate-400"> / month</span>
                            )}
                        </p>
                    </div>

                    {/* Badges */}
                    <div className="flex gap-3 flex-wrap">
                        <span className={`text-white text-sm font-semibold px-4 py-1.5 rounded-full
                            ${listing.type === "rent" ? "bg-blue-600" : "bg-red-600"}`}>
                            {listing.type === "rent" ? "For Rent" : "For Sale"}
                        </span>
                        {listing.offer && (
                            <span className="bg-green-600 text-white text-sm font-semibold px-4 py-1.5 rounded-full">
                                {formatPrice(regularPrice - discountedPrice)} OFF
                            </span>
                        )}
                    </div>

                    {/* Address */}
                    <p className="flex items-start gap-2 text-slate-600 text-sm">
                        <FaMapMarkerAlt className="text-green-600 mt-0.5 shrink-0" />
                        {listing.address}
                    </p>

                    {/* Description */}
                    <div>
                        <p className="text-sm font-semibold text-slate-800 mb-1">Description</p>
                        <p className="text-slate-600 text-sm leading-relaxed">{listing.description}</p>
                    </div>

                    {/* Features */}
                    <ul className="grid grid-cols-2 gap-3 text-sm text-slate-700">
                        <li className="flex items-center gap-2 bg-slate-50 rounded-lg px-3 py-2">
                            <FaBed className="text-slate-500" />
                            {listing.bedrooms} {listing.bedrooms > 1 ? "Beds" : "Bed"}
                        </li>
                        <li className="flex items-center gap-2 bg-slate-50 rounded-lg px-3 py-2">
                            <FaBath className="text-slate-500" />
                            {listing.bathrooms} {listing.bathrooms > 1 ? "Baths" : "Bath"}
                        </li>
                        <li className="flex items-center gap-2 bg-slate-50 rounded-lg px-3 py-2">
                            <FaParking className="text-slate-500" />
                            {listing.parking ? "Parking Spot" : "No Parking"}
                        </li>
                        <li className="flex items-center gap-2 bg-slate-50 rounded-lg px-3 py-2">
                            <FaChair className="text-slate-500" />
                            {listing.furnished ? "Furnished" : "Not Furnished"}
                        </li>
                    </ul>

                    <p className="text-xs text-slate-400">
                        👁 {(listing.views ?? 0).toLocaleString()} views
                    </p>
                </div>

                {/* Right — seller contact card */}
                <div className="w-full lg:w-72 shrink-0">
                    <div className="border border-gray-200 rounded-2xl p-5 flex flex-col gap-4 shadow-sm">
                        <p className="text-sm font-semibold text-slate-500 uppercase tracking-wide">
                            Listed by
                        </p>

                        {/* Seller info */}
                        <div className="flex items-center gap-3">
                            {seller?.profilePicture ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                    src={seller.profilePicture}
                                    alt={sellerName}
                                    className="w-12 h-12 rounded-full object-cover border border-gray-200"
                                />
                            ) : (
                                <div className="w-12 h-12 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 font-bold text-lg">
                                    {sellerName.charAt(0).toUpperCase()}
                                </div>
                            )}
                            <div>
                                <p className="font-semibold text-slate-800">{sellerName}</p>
                                {seller?.email && (
                                    <p className="text-xs text-slate-400 truncate">{seller.email}</p>
                                )}
                            </div>
                        </div>

                        {/* WhatsApp contact */}
                        {waLink ? (
                            <a
                                href={waLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-4 rounded-xl transition-colors duration-150"
                            >
                                <FaWhatsapp className="text-xl" />
                                Chat on WhatsApp
                            </a>
                        ) : (
                            <p className="text-xs text-slate-400 text-center">
                                No WhatsApp number provided
                            </p>
                        )}

                        {listing.whatsappNumber && (
                            <p className="text-center text-sm text-slate-500">
                                {listing.whatsappNumber}
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
}
