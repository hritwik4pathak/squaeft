"use client";
import ListingItems from "@/components/listingitem";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

const SORT_OPTIONS = [
  { label: "Newest First", value: "desc" },
  { label: "Oldest First", value: "asc" },
  { label: "Most Popular", value: "views" },
];

const DEFAULT_FILTERS = {
  searchTerm: "",
  type: "all",
  offer: false,
  parking: false,
  furnished: false,
  order: "desc",
  minPrice: "",
  maxPrice: "",
  bedrooms: "any",
  bathrooms: "any",
};

export default function SearchPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [filters, setFilters] = useState({
    ...DEFAULT_FILTERS,
    searchTerm: searchParams.get("searchTerm") || searchParams.get("q") || "",
    type: searchParams.get("type") || "all",
    offer: searchParams.get("offer") === "true",
  });

  const [listings, setListings] = useState([]);
  const [popularListings, setPopularListings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const fetchListings = useCallback(async (customFilters, startIndex = 0) => {
    setLoading(true);
    try {
      const body = {
        searchTerm: customFilters.searchTerm,
        type: customFilters.type === "all" ? undefined : customFilters.type,
        offer: customFilters.offer || undefined,
        parking: customFilters.parking || undefined,
        furnished: customFilters.furnished || undefined,
        order: customFilters.order === "views" ? "desc" : customFilters.order,
        sortBy: customFilters.order === "views" ? "views" : undefined,
        limit: 9,
        startIndex,
        ...(customFilters.bedrooms !== "any" && { bedrooms: Number(customFilters.bedrooms) }),
        ...(customFilters.bathrooms !== "any" && { bathrooms: Number(customFilters.bathrooms) }),
      };

      const res = await fetch("/api/listing/get", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      const results = Array.isArray(data) ? data : [];

      if (startIndex === 0) {
        setListings(results);
      } else {
        setListings((prev) => [...prev, ...results]);
      }
      setShowMore(results.length === 9);
    } catch (err) {
      console.error("Search error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchPopular = useCallback(async () => {
    try {
      const res = await fetch("/api/listing/get", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sortBy: "views", limit: 4 }),
      });
      const data = await res.json();
      setPopularListings(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Popular fetch error:", err);
    }
  }, []);

  // Initial load
  useEffect(() => {
    fetchListings(filters);
    fetchPopular();
  }, []);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchListings(filters);
    setSidebarOpen(false);
    // Update URL
    const params = new URLSearchParams();
    if (filters.searchTerm) params.set("searchTerm", filters.searchTerm);
    if (filters.type !== "all") params.set("type", filters.type);
    if (filters.offer) params.set("offer", "true");
    setSidebarOpen(false);
  };

  const handleReset = () => {
    setFilters(DEFAULT_FILTERS);
    fetchListings(DEFAULT_FILTERS);
  };

  const handleShowMore = () => {
    fetchListings(filters, listings.length);
  };

  const FilterPanel = () => (
    <form onSubmit={handleSearch} className="flex flex-col gap-5">
      {/* Search Term */}
      <div>
        <label className="text-sm font-semibold text-slate-600 mb-1 block">Keyword</label>
        <input
          type="text"
          placeholder="Search listings..."
          value={filters.searchTerm}
          onChange={(e) => handleFilterChange("searchTerm", e.target.value)}
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-300"
        />
      </div>

      {/* Type */}
      <div>
        <label className="text-sm font-semibold text-slate-600 mb-2 block">Property Type</label>
        <div className="flex gap-2 flex-wrap">
          {["all", "rent", "sale"].map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => handleFilterChange("type", t)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-all
                ${filters.type === t
                  ? "bg-red-500 text-white border-red-500"
                  : "bg-white text-slate-600 border-gray-200 hover:border-red-300"}`}
            >
              {t === "all" ? "All" : t === "rent" ? "Rent" : "Buy"}
            </button>
          ))}
        </div>
      </div>

      {/* Bedrooms */}
      <div>
        <label className="text-sm font-semibold text-slate-600 mb-2 block">Bedrooms</label>
        <div className="flex gap-2 flex-wrap">
          {["any", "1", "2", "3", "4"].map((b) => (
            <button
              key={b}
              type="button"
              onClick={() => handleFilterChange("bedrooms", b)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-all
                ${filters.bedrooms === b
                  ? "bg-red-500 text-white border-red-500"
                  : "bg-white text-slate-600 border-gray-200 hover:border-red-300"}`}
            >
              {b === "any" ? "Any" : `${b}+`}
            </button>
          ))}
        </div>
      </div>

      {/* Bathrooms */}
      <div>
        <label className="text-sm font-semibold text-slate-600 mb-2 block">Bathrooms</label>
        <div className="flex gap-2 flex-wrap">
          {["any", "1", "2", "3"].map((b) => (
            <button
              key={b}
              type="button"
              onClick={() => handleFilterChange("bathrooms", b)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-all
                ${filters.bathrooms === b
                  ? "bg-red-500 text-white border-red-500"
                  : "bg-white text-slate-600 border-gray-200 hover:border-red-300"}`}
            >
              {b === "any" ? "Any" : `${b}+`}
            </button>
          ))}
        </div>
      </div>

      {/* Amenities */}
      <div>
        <label className="text-sm font-semibold text-slate-600 mb-2 block">Amenities</label>
        <div className="flex flex-col gap-2">
          {[
            { key: "offer", label: "Has Offer / Discount" },
            { key: "parking", label: "Parking Available" },
            { key: "furnished", label: "Furnished" },
          ].map(({ key, label }) => (
            <label key={key} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={filters[key]}
                onChange={(e) => handleFilterChange(key, e.target.checked)}
                className="accent-red-500 w-4 h-4"
              />
              <span className="text-sm text-slate-600">{label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Sort */}
      <div>
        <label className="text-sm font-semibold text-slate-600 mb-1 block">Sort By</label>
        <select
          value={filters.order}
          onChange={(e) => handleFilterChange("order", e.target.value)}
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-300"
        >
          {SORT_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </div>

      <div className="flex gap-2">
        <button
          type="submit"
          className="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold py-2 rounded-lg text-sm transition-colors"
        >
          Apply Filters
        </button>
        <button
          type="button"
          onClick={handleReset}
          className="px-4 border border-gray-200 text-slate-500 hover:bg-gray-50 font-medium py-2 rounded-lg text-sm transition-colors"
        >
          Reset
        </button>
      </div>
    </form>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">

      {/* Page Title */}
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-700">
          {filters.searchTerm
            ? `Results for "${filters.searchTerm}"`
            : filters.type === "rent"
            ? "Properties for Rent"
            : filters.type === "sale"
            ? "Properties for Sale"
            : "All Properties in India"}
        </h1>
        <div className="mt-1.5 w-10 h-1 bg-red-500 rounded-full" />
      </div>

      <div className="flex gap-6">
        {/* Sidebar — desktop */}
        <aside className="hidden lg:block w-64 flex-shrink-0">
          <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-5 sticky top-20">
            <h2 className="text-base font-bold text-slate-700 mb-4">Filters</h2>
            <FilterPanel />
          </div>
        </aside>

        {/* Main content */}
        <div className="flex-1 min-w-0">

          {/* Mobile filter bar */}
          <div className="flex items-center justify-between mb-4 lg:hidden">
            <p className="text-sm text-slate-500">{listings.length} listings found</p>
            <button
              onClick={() => setSidebarOpen(true)}
              className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-gray-50"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 4h18M7 8h10M11 12h4" />
              </svg>
              Filters
            </button>
          </div>

          {/* Popular Section */}
          {popularListings.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-slate-600 mb-1">🔥 Popular Properties</h2>
              <div className="w-8 h-0.5 bg-red-500 rounded mb-4" />
              <div className="flex flex-wrap gap-4">
                {popularListings.map((listing) => (
                  <ListingItems key={listing._id} listing={listing} />
                ))}
              </div>
            </div>
          )}

          {/* Results Section */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <h2 className="text-xl font-semibold text-slate-600">
                {filters.order === "views" ? "Most Viewed" : "Recent Listings"}
              </h2>
              <p className="text-sm text-slate-400 hidden lg:block">{listings.length} results</p>
            </div>
            <div className="w-8 h-0.5 bg-red-500 rounded mb-4" />

            {loading ? (
              <div className="flex flex-wrap gap-4">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="w-full sm:w-[330px] h-72 bg-gray-100 rounded-xl animate-pulse" />
                ))}
              </div>
            ) : listings.length === 0 ? (
              <div className="text-center py-20 text-slate-400">
                <p className="text-5xl mb-4">🏠</p>
                <p className="text-lg font-medium">No listings found</p>
                <p className="text-sm mt-1">Try adjusting your filters</p>
              </div>
            ) : (
              <div className="flex flex-wrap gap-4">
                {listings.map((listing) => (
                  <ListingItems key={listing._id} listing={listing} />
                ))}
              </div>
            )}

            {showMore && (
              <div className="text-center mt-8">
                <button
                  onClick={handleShowMore}
                  className="px-8 py-2.5 border border-red-500 text-red-500 hover:bg-red-50 font-semibold rounded-lg text-sm transition-colors"
                >
                  {loading ? "Loading..." : "Show More"}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile filter drawer */}
      {sidebarOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/40 z-50"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl z-50 p-5 max-h-[85vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-base font-bold text-slate-700">Filters</h2>
              <button onClick={() => setSidebarOpen(false)} className="text-slate-400 text-xl">✕</button>
            </div>
            <FilterPanel />
          </div>
        </>
      )}
    </div>
  );
}