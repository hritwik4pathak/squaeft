import BuyingTips from "@/components/advice/BuyingTips";
import GuideCards from "@/components/advice/GuideCards";
import { ROUTES } from "@/lib/routes";
import Link from "next/link";

export default function AdvicePage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-700 mb-2">
          Property <span className="text-red-500">Advice</span> & Guides
        </h1>
        <div className="w-10 h-1 bg-red-500 rounded mb-4" />
        <p className="text-slate-400 max-w-xl">
          Expert guidance for buyers, renters and investors to make smarter real estate decisions.
        </p>
      </div>

      <GuideCards />
      <BuyingTips />

      {/* CTA */}
      <div className="mt-12 bg-gradient-to-br from-red-500 to-red-600 rounded-3xl p-8 text-white text-center">
        <h2 className="text-2xl font-bold mb-2">Ready to find your dream home?</h2>
        <p className="text-red-100 text-sm mb-6">Browse thousands of verified properties across India.</p>
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