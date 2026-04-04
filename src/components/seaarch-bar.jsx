"use client";
import { ROUTES } from "@/lib/routes";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FaSearch } from "react-icons/fa";

const QUICK_FILTERS = [
  { label: "Buy", type: "sale" },
  { label: "Rent", type: "rent" },
  { label: "With Offer", offer: true },
  { label: "Furnished", furnished: true },
];

export default function SearchBar() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeType, setActiveType] = useState("all");

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchTerm.trim()) params.set("searchTerm", searchTerm.trim());
    if (activeType !== "all") params.set("type", activeType);
    router.push(`${ROUTES.search}?${params.toString()}`);
  };

  const handleQuickFilter = (filter) => {
    const params = new URLSearchParams();
    if (filter.type) params.set("type", filter.type);
    if (filter.offer) params.set("offer", "true");
    if (filter.furnished) params.set("furnished", "true");
    router.push(`${ROUTES.search}?${params.toString()}`);
  };

  return (
    <div className="w-full max-w-3xl mx-auto px-4">
      {/* Title */}
      <h2 className="text-2xl sm:text-3xl font-bold text-slate-700 text-center mb-3">
        Find Your <span className="text-red-500">Dream</span> Home
      </h2>
      <p className="text-center text-slate-400 text-sm mb-5">
        Search from thousands of properties across India
      </p>

      {/* Type toggle */}
      <div className="flex justify-center gap-2 mb-4">
        {["all", "rent", "sale"].map((t) => (
          <button
            key={t}
            onClick={() => setActiveType(t)}
            className={`px-5 py-1.5 rounded-full text-sm font-semibold border transition-all
              ${activeType === t
                ? "bg-red-500 text-white border-red-500"
                : "bg-white text-slate-600 border-gray-200 hover:border-red-300"}`}
          >
            {t === "all" ? "All" : t === "rent" ? "Rent" : "Buy"}
          </button>
        ))}
      </div>

      {/* Search input */}
      <form
        onSubmit={handleSearch}
        className="flex items-center bg-white border border-gray-200 rounded-xl shadow-md overflow-hidden"
      >
        <FaSearch className="text-slate-400 ml-4 flex-shrink-0" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by location, property type, keyword..."
          className="flex-1 px-4 py-4 text-sm text-slate-700 focus:outline-none"
          autoComplete="off"
        />
        <button
          type="submit"
          className="bg-red-500 hover:bg-red-600 text-white font-semibold px-6 py-4 text-sm transition-colors"
        >
          Search
        </button>
      </form>

      {/* Quick filters */}
      <div className="flex flex-wrap justify-center gap-2 mt-4">
        {QUICK_FILTERS.map((f, i) => (
          <button
            key={i}
            onClick={() => handleQuickFilter(f)}
            className="px-4 py-1.5 bg-slate-100 hover:bg-red-50 hover:text-red-500 text-slate-500 text-xs font-medium rounded-full transition-colors border border-transparent hover:border-red-200"
          >
            {f.label}
          </button>
        ))}
      </div>
    </div>
  );
}