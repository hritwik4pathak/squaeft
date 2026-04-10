"use client";
import { ROUTES } from "@/lib/routes";
import Link from "next/link";
import ListingCard from "./ListingCard";

export default function UserListings({ listings, loading, onDelete, deleteLoading }) {
  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-700">Your Listings</h2>
        <p className="text-sm text-slate-400">{listings.length} total</p>
      </div>

      {loading ? (
        <div className="flex flex-col gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-32 bg-gray-100 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : listings.length === 0 ? (
        <div className="text-center py-20 text-slate-400">
          <p className="text-5xl mb-4">🏠</p>
          <p className="text-lg font-medium">No listings yet</p>
          <Link
            href={ROUTES.createListing}
            className="mt-4 inline-block bg-red-500 text-white px-6 py-2 rounded-lg text-sm font-semibold"
          >
            Create your first listing
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {listings.map((listing) => (
            <ListingCard
              key={listing._id}
              listing={listing}
              onDelete={onDelete}
              deleteLoading={deleteLoading}
            />
          ))}
        </div>
      )}
    </div>
  );
}