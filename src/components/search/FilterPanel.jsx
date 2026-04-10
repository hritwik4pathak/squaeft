"use client";

export const SORT_OPTIONS = [
  { label: "Newest First", value: "desc" },
  { label: "Oldest First", value: "asc" },
  { label: "Most Popular", value: "views" },
];

export const DEFAULT_FILTERS = {
  searchTerm: "",
  type: "all",
  offer: false,
  parking: false,
  furnished: false,
  order: "desc",
  bedrooms: "any",
  bathrooms: "any",
};

export default function FilterPanel({ filters, onFilterChange, onApply, onReset }) {
  return (
    <form onSubmit={onApply} className="flex flex-col gap-5">
      <div>
        <label className="text-sm font-semibold text-slate-600 mb-1 block">Keyword</label>
        <input
          type="text"
          placeholder="Search listings..."
          value={filters.searchTerm}
          onChange={(e) => onFilterChange("searchTerm", e.target.value)}
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
              onClick={() => onFilterChange("type", t.value)}
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
              onClick={() => onFilterChange("bedrooms", b)}
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
              onClick={() => onFilterChange("bathrooms", b)}
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
                onChange={(e) => onFilterChange(key, e.target.checked)}
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
          onChange={(e) => onFilterChange("order", e.target.value)}
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
          onClick={onReset}
          className="px-4 border border-gray-200 text-slate-500 hover:bg-gray-50 font-medium py-2 rounded-lg text-sm transition-colors"
        >
          Reset
        </button>
      </div>
    </form>
  );
}
