import ExtraCharges from "@/components/pricing-guide/ExtraCharges";
import PricingTips from "@/components/pricing-guide/PricingTips";
import { ROUTES, SEARCH_ROUTES } from "@/lib/routes";
import Link from "next/link";

export default function PricingGuidePage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-10">

      {/* Hero */}
      <div className="bg-gradient-to-br from-slate-700 to-slate-900 rounded-3xl p-8 mb-10 text-white">
        <p className="text-red-400 text-sm font-semibold mb-2 uppercase tracking-wider">
          Seller Guide
        </p>
        <h1 className="text-3xl sm:text-4xl font-bold mb-3">Property Pricing Guide</h1>
        <p className="text-slate-300 text-sm sm:text-base max-w-xl">
          Understand property prices across India, hidden costs to budget for, and tips to get the best deal.
        </p>
        <div className="flex gap-3 mt-6 flex-wrap">
          <Link
            href={ROUTES.createListing}
            className="bg-red-500 hover:bg-red-600 text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition-colors"
          >
            List Your Property
          </Link>
          <Link
            href={SEARCH_ROUTES.forSale}
            className="bg-white/10 hover:bg-white/20 text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition-colors"
          >
            Browse for Sale
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
        {[
          { label: "Avg Budget Home", value: "₹35L", color: "text-green-500" },
          { label: "Avg Mid Segment", value: "₹85L", color: "text-blue-500" },
          { label: "Avg Premium", value: "₹2.5 Cr", color: "text-orange-500" },
          { label: "Extra Costs", value: "8–12%", color: "text-red-500" },
        ].map((s, i) => (
          <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 text-center">
            <p className={`text-xl font-black ${s.color}`}>{s.value}</p>
            <p className="text-xs text-slate-400 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      <ExtraCharges />
      <PricingTips />

      {/* CTA */}
      <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-3xl p-8 text-white text-center">
        <h2 className="text-2xl font-bold mb-2">Ready to list your property?</h2>
        <p className="text-red-100 text-sm mb-6">
          Reach thousands of verified buyers and renters across India.
        </p>
        <Link
          href={ROUTES.createListing}
          className="bg-white text-red-500 font-bold px-8 py-3 rounded-xl hover:bg-red-50 transition-colors"
        >
          List for Free
        </Link>
      </div>
    </div>
  );
}