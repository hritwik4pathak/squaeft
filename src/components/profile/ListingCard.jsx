"use client";
import Link from "next/link";
import Image from "next/image";
import { ROUTES } from "@/lib/routes";
import { FaBed, FaBath, FaEdit, FaTrash } from "react-icons/fa";
import { MdLocationOn } from "react-icons/md";

export default function ListingCard({ listing, onDelete, deleteLoading }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm flex gap-4 p-4 hover:shadow-md transition-all">
      {/* Image */}
      <div className="relative w-28 h-24 flex-shrink-0 rounded-xl overflow-hidden">
        <Image
          src={listing.imageUrls?.[0] || "https://placehold.co/200x150?text=No+Image"}
          alt={listing.name}
          fill
          className="object-cover"
        />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <Link href={ROUTES.listing(listing._id)}>
          <p className="font-semibold text-slate-700 truncate hover:text-red-500 transition-colors">
            {listing.name}
          </p>
        </Link>
        <div className="flex items-center gap-1 text-xs text-slate-400 mt-1">
          <MdLocationOn className="text-red-400 flex-shrink-0" />
          <span className="truncate">{listing.address}</span>
        </div>
        <div className="flex items-center gap-3 mt-2 text-xs text-slate-500 flex-wrap">
          <span className={`px-2 py-0.5 rounded-full font-semibold
            ${listing.type === 'rent' ? 'bg-blue-50 text-blue-500' : 'bg-red-50 text-red-500'}`}>
            {listing.type === 'rent' ? 'For Rent' : 'For Sale'}
          </span>
          <span className="flex items-center gap-1"><FaBed /> {listing.bedrooms} Bed</span>
          <span className="flex items-center gap-1"><FaBath /> {listing.bathrooms} Bath</span>
          <span>👁 {listing.views ?? 0} views</span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-2 flex-shrink-0">
        <Link
          href={ROUTES.updateListing(listing._id)}
          className="flex items-center gap-1 text-xs bg-slate-50 hover:bg-slate-100 text-slate-600 px-3 py-1.5 rounded-lg transition-colors"
        >
          <FaEdit /> Edit
        </Link>
        <button
          onClick={() => onDelete(listing._id)}
          disabled={deleteLoading === listing._id}
          className="flex items-center gap-1 text-xs bg-red-50 hover:bg-red-100 text-red-500 px-3 py-1.5 rounded-lg transition-colors"
        >
          <FaTrash /> {deleteLoading === listing._id ? "..." : "Delete"}
        </button>
      </div>
    </div>
  );
}