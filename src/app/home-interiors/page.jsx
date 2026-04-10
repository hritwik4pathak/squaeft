import Link from "next/link";
import { ROUTES, SEARCH_ROUTES } from "@/lib/routes";
import InteriorStyles from "@/components/home-interiors/InteriorStyles";
import InteriorPackages from "@/components/home-interiors/InteriorPackages";

export default function HomeInteriorsPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-10">

      {/* Hero */}
      <div className="bg-gradient-to-br from-slate-700 to-slate-900 rounded-3xl p-8 mb-10 text-white">
        <p className="text-red-400 text-sm font-semibold mb-2 uppercase tracking-wider">
          Interior Design
        </p>
        <h1 className="text-3xl sm:text-4xl font-bold mb-3">
          Beautiful Interiors for Every Home
        </h1>
        <p className="text-slate-300 text-sm sm:text-base max-w-xl">
          From modular kitchens to full home transformations — explore interior design packages
          curated for Indian homes at every budget.
        </p>
        <div className="flex gap-3 mt-6 flex-wrap">
          <Link
            href={SEARCH_ROUTES.furnished}
            className="bg-red-500 hover:bg-red-600 text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition-colors"
          >
            Browse Furnished Homes
          </Link>
          <Link
            href={ROUTES.search}
            className="bg-white/10 hover:bg-white/20 text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition-colors"
          >
            All Properties
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
        {[
          { label: "Happy Homes", value: "12,000+", color: "text-red-500" },
          { label: "Design Styles", value: "50+",    color: "text-blue-500" },
          { label: "Cities Covered", value: "30+",   color: "text-green-500" },
          { label: "Avg Delivery",   value: "45 days", color: "text-orange-500" },
        ].map((stat, i) => (
          <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 text-center">
            <p className={`text-2xl font-black ${stat.color}`}>{stat.value}</p>
            <p className="text-xs text-slate-400 mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      <InteriorStyles />
      <InteriorPackages />

      {/* Why Us */}
      <div className="mb-12">
        <h2 className="text-xl font-bold text-slate-700 mb-1">Why Choose SqFt Interiors</h2>
        <div className="w-8 h-1 bg-red-500 rounded mb-6" />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { emoji: "🎨", title: "100+ Design Themes", desc: "Contemporary, minimalist, traditional — pick a style that matches your taste." },
            { emoji: "🔧", title: "End-to-End Execution", desc: "From design to installation, we handle everything so you don't have to." },
            { emoji: "🛡️", title: "10-Year Warranty", desc: "All modular products come with a 10-year manufacturer warranty for peace of mind." },
          ].map((item, i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <span className="text-2xl">{item.emoji}</span>
              <h3 className="font-bold text-slate-700 mt-3 mb-1">{item.title}</h3>
              <p className="text-sm text-slate-400">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-3xl p-8 text-white text-center">
        <h2 className="text-2xl font-bold mb-2">Love a furnished home?</h2>
        <p className="text-red-100 text-sm mb-6">
          Browse thousands of move-in ready furnished properties across India.
        </p>
        <Link
          href={SEARCH_ROUTES.furnished}
          className="bg-white text-red-500 font-bold px-8 py-3 rounded-xl hover:bg-red-50 transition-colors"
        >
          Browse Furnished Properties
        </Link>
      </div>

    </div>
  );
}
