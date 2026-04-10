"use client";
import ProfileHeader from "@/components/profile/ProfileHeader";
import UserListings from "@/components/profile/UserListings";
import { API_ROUTES, ROUTES } from "@/lib/routes";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function ProfilePage() {
  const { user, isLoaded, isSignedIn } = useUser();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState(null);

  useEffect(() => {
    if (!isLoaded || !isSignedIn) return;
    const fetchListings = async () => {
      try {
        const res = await fetch(API_ROUTES.listingGet, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: user.publicMetadata.userMongoId }),
        });
        const data = await res.json();
        // Ensure all listings are plain objects with _id as string
        const safeListings = Array.isArray(data)
          ? data.map(item => ({ ...item, _id: item._id?.toString?.() || "" }))
          : [];
        setListings(safeListings);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchListings();
  }, [isLoaded, isSignedIn, user]);

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this listing?")) return;
    setDeleteLoading(id);
    try {
      const res = await fetch(`/api/listing/delete/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success !== false) {
        setListings((prev) => prev.filter((l) => l._id !== id));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setDeleteLoading(null);
    }
  };

  if (!isLoaded) return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* ProfileHeader skeleton */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-8 flex items-center gap-5">
        <div className="w-16 h-16 rounded-full bg-gray-200 animate-pulse shrink-0" />
        <div className="flex-1 flex flex-col gap-2">
          <div className="h-5 w-40 bg-gray-200 rounded animate-pulse" />
          <div className="h-3 w-56 bg-gray-200 rounded animate-pulse" />
          <div className="h-3 w-24 bg-gray-200 rounded animate-pulse" />
        </div>
        <div className="h-9 w-28 bg-gray-200 rounded-lg animate-pulse" />
      </div>

      {/* Listings skeleton */}
      <div className="mb-4 flex items-center justify-between">
        <div className="h-5 w-32 bg-gray-200 rounded animate-pulse" />
        <div className="h-3 w-12 bg-gray-200 rounded animate-pulse" />
      </div>
      <div className="flex flex-col gap-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-32 bg-gray-100 rounded-xl animate-pulse" />
        ))}
      </div>
    </div>
  );

  if (!isSignedIn) return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4">
      <p className="text-slate-500">You need to sign in to view your profile.</p>
      <Link href={ROUTES.signIn} className="bg-red-500 text-white px-6 py-2 rounded-lg font-semibold">
        Sign In
      </Link>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <ProfileHeader user={user} />
      <UserListings
        listings={listings}
        loading={loading}
        onDelete={handleDelete}
        deleteLoading={deleteLoading}
      />
    </div>
  );
}