import Link from "next/link";
import { ROUTES, SEARCH_ROUTES } from "@/lib/routes";

const categories = [
  {
    title: "Owner Properties",
    subtitle: "Explore →",
    href: SEARCH_ROUTES.forSale,
    bg: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&q=80",
  },
  {
    title: "Ready to Move",
    subtitle: "Explore →",
    href: SEARCH_ROUTES.forRent,
    bg: "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=400&q=80",
  },
  {
    title: "Budget Homes",
    subtitle: "Explore →",
    href: SEARCH_ROUTES.allListings,   // ✅ fixed — SEARCH_ROUTES.budget doesn't exist
    bg: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&q=80",
  },
  {
    title: "Premium Villas",
    subtitle: "Explore →",
    href: SEARCH_ROUTES.villas,        // ✅ fixed — replaced hardcoded string
    bg: "https://images.unsplash.com/photo-1613977257363-707ba9348227?w=400&q=80",
  },
];

export default function PropertyCategories() {
  return (
    <div className="w-full my-6">
      <div className="mb-4">
        <h2 className="text-2xl font-semibold text-slate-700">
          We&apos;ve got properties for everyone
        </h2>
        <div className="mt-1.5 w-10 h-1 bg-red-500 rounded-full" />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {categories.map((cat, i) => (
          <Link key={i} href={cat.href ?? ROUTES.search}>  {/* ✅ fallback so href is never undefined */}
            <div
              className="relative rounded-xl overflow-hidden h-48 sm:h-56 cursor-pointer group"
              style={{
                backgroundImage: `url(${cat.bg})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-all duration-300" />
              <div className="absolute bottom-4 left-4 text-white z-10">
                <p className="text-xl font-bold drop-shadow">{cat.title}</p>
                <p className="text-sm mt-1 font-medium text-slate-200 group-hover:underline">
                  {cat.subtitle}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}