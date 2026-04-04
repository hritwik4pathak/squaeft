"use client";
import ListingItems from "@/components/listingitem";
import { API_ROUTES } from "@/lib/routes";
import { useSearchParams } from "next/navigation";
import { Suspense, useCallback, useEffect, useState } from "react";

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
  bedrooms: "any",
  bathrooms: "any",
};

// ✅ Inner component that uses useSearchParams
function SearchContent() {
  const searchParams = useSearchParams();

  const [filters, setFilters] = useState({
    ...DEFAULT_FILTERS,
    searchTerm: searchParams.get("searchTerm") || searchParams.get("q") || "",
    type: searchParams.get("type") || "all",
    offer: searchParams.get("offer") === "true",
    parking: searchParams.get("parking") === "true",
    furnished: searchParams.get("furnished") === "true",
  });

  const [listings, setListings] = useState([]);
  const [popularListings, setPopularListings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const fetchListings = useCallback(async (currentFilters, startIndex = 0) => {
    setLoading(true);
    try {
      const body = {
        ...(currentFilters.searchTerm && { searchTerm: currentFilters.searchTerm }),
        ...(currentFilters.type !== "all" && { type: currentFilters.type }),
        ...(currentFilters.offer && { offer: true }),
        ...(currentFilters.parking && { parking: true }),
        ...(currentFilters.furnished && { furnished: true }),
        ...(currentFilters.order === "views"
          ? { sortBy: "views" }
          : { order: currentFilters.order }),
        ...(currentFilters.bedrooms !== "any" && { bedrooms: Number(currentFilters.bedrooms) }),
        ...(currentFilters.bathrooms !== "any" && { bathrooms: Number(currentFilters.bathrooms) }),
        limit: 9,
        startIndex,
      };

      const res = await fetch(API_ROUTES.listingGet, {
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
      setListings([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchPopular = useCallback(async () => {
    try {
      const res = await fetch(API_ROUTES.listingGet, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sortBy: "views", limit: 4 }),
      });
      const data = await res.json();
      setPopularListings(Array.isArray(data) ? data : []);
    } catch {
      setPopularListings([]);
    }
  }, []);

  // ✅ Re-run when URL params change
  useEffect(() => {
    const newFilters = {
      ...DEFAULT_FILTERS,
      searchTerm: searchParams.get("searchTerm") || searchParams.get("q") || "",
      type: searchParams.get("type") || "all",
      offer: searchParams.get("offer") === "true",
      parking: searchParams.get("parking") === "true",
      furnished: searchParams.get("furnished") === "true",
    };
    setFilters(newFilters);
    fetchListings(newFilters);
    fetchPopular();
  }, [searchParams]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleApply = (e) => {
    e.preventDefault();
    fetchListings(filters);
    setSidebarOpen(false);
  };

  const handleReset = () => {
    setFilters(DEFAULT_FILTERS);
    fetchListings(DEFAULT_FILTERS);
  };

  const FilterPanel = () => (
    <form onSubmit={handleApply} className="flex flex-col gap-5">
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

      <div>
        <label className="text-sm font-semibold text-slate-600 mb-2 block">Property Type</label>
        <div className="flex gap-2 flex-wrap">
          {[
            { label: "All", value: "all" },
            { label: "Rent", value: "rent" },
            { label: "Buy", value: "sale" },
          ].map((t) => (
            <button
              key={t.value}
              type="button"
              onClick={() => handleFilterChange("type", t.value)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-all
                ${filters.type === t.value
                  ? "bg-red-500 text-white border-red-500"
                  : "bg-white text-slate-600 border-gray-200 hover:border-red-300"}`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

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
        <aside className="hidden lg:block w-64 flex-shrink-0">
          <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-5 sticky top-20">
            <h2 className="text-base font-bold text-slate-700 mb-4">Filters</h2>
            <FilterPanel />
          </div>
        </aside>

        <div className="flex-1 min-w-0">
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
                  onClick={() => fetchListings(filters, listings.length)}
                  className="px-8 py-2.5 border border-red-500 text-red-500 hover:bg-red-50 font-semibold rounded-lg text-sm transition-colors"
                >
                  {loading ? "Loading..." : "Show More"}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {sidebarOpen && (
        <>
          <div className="fixed inset-0 bg-black/40 z-50" onClick={() => setSidebarOpen(false)} />
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

// ✅ Default export wraps SearchContent in Suspense — required for useSearchParams in Next.js 15
export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-slate-400 text-lg">Loading...</div>
      </div>
    }>
      <SearchContent />
    </Suspense>
  );
}