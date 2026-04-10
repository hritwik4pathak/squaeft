"use client";
import { ROUTES } from "@/lib/routes";
import Image from "next/image";
import Link from "next/link";
import { FaPlus } from "react-icons/fa";

export default function ProfileHeader({ user }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-8 flex items-center gap-5">
      <Image
        src={user.imageUrl}
        alt={user.fullName}
        width={64}
        height={64}
        className="rounded-full object-cover border-2 border-red-100"
      />
      <div className="flex-1">
        <h1 className="text-xl font-bold text-slate-700">{user.fullName}</h1>
        <p className="text-sm text-slate-400">{user.primaryEmailAddress?.emailAddress}</p>
        <p className="text-xs text-slate-300 mt-0.5">
          Member since {new Date(user.createdAt).getFullYear()}
        </p>
      </div>
      <Link
        href={ROUTES.createListing}
        className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
      >
        <FaPlus className="text-xs" /> New Listing
      </Link>
    </div>
  );
}