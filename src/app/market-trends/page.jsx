import Link from "next/link";
import { ROUTES } from "@/lib/routes";
import CityTrends from "@/components/market-trends/CityTrends";
import MarketInsights from "@/components/market-trends/MarketInsights";

export default function MarketTrendsPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      {/* Hero */}
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-8 mb-10 text-white">
        <p className="text-red-400 text-sm font-semibold mb-2 uppercase tracking-wider">Real Estate India</p>
        <h1 className="text-3xl sm:text-4xl font-bold mb-3">Market Trends 2025</h1>
        <p className="text-slate-300 text-sm sm:text-base max-w-xl">
          Stay ahead with the latest price movements, demand insights and investment opportunities across Indian cities.
        </p>
        <Link
          href={ROUTES.search}
          className="inline-block mt-6 bg-red-500 hover:bg-red-600 text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition-colors"
        >
          Explore Properties
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
        {[
          { label: "Avg YoY Growth", value: "9.6%", color: "text-green-500" },
          { label: "Top City", value: "Hyderabad", color: "text-red-500" },
          { label: "Fastest Growing", value: "+15.1%", color: "text-orange-500" },
          { label: "NRI Investment", value: "↑ 35%", color: "text-blue-500" },
        ].map((stat, i) => (
          <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 text-center">
            <p className={`text-2xl font-black ${stat.color}`}>{stat.value}</p>
            <p className="text-xs text-slate-400 mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      <CityTrends />
      <MarketInsights />

      {/* CTA */}
      <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-3xl p-8 text-white text-center">
        <h2 className="text-2xl font-bold mb-2">Invest in the right property</h2>
        <p className="text-red-100 text-sm mb-6">Browse verified listings across India fastest growing cities.</p>
        <Link
          href={ROUTES.search}
          className="bg-white text-red-500 font-bold px-8 py-3 rounded-xl hover:bg-red-50 transition-colors"
        >
          Browse Properties
        </Link>
      </div>
    </div>
  );
}