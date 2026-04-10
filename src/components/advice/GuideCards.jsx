import Link from "next/link";
import { ROUTES } from "@/lib/routes";

const guides = [
  { emoji: "🏠", title: "Buying Guide", desc: "Step-by-step guide to buying your first home in India — from budget planning to registration.", href: ROUTES.advice, color: "bg-red-50 border-red-100", tag: "Buy" },
  { emoji: "🔑", title: "Renting Tips", desc: "Everything you need to know about renting — agreements, deposits, tenant rights and more.", href: ROUTES.advice, color: "bg-blue-50 border-blue-100", tag: "Rent" },
  { emoji: "⚖️", title: "Legal Help", desc: "Understand property documents, RERA regulations, stamp duty and registration charges.", href: ROUTES.advice, color: "bg-yellow-50 border-yellow-100", tag: "Legal" },
  { emoji: "📈", title: "Market Trends", desc: "Stay updated with the latest real estate market trends, price movements and investment hotspots.", href: ROUTES.marketTrends, color: "bg-green-50 border-green-100", tag: "Trends" },
];

export default function GuideCards() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
      {guides.map((g, i) => (
        <Link key={i} href={g.href}>
          <div className={`${g.color} border rounded-2xl p-6 hover:shadow-md transition-all cursor-pointer group`}>
            <div className="flex items-start justify-between mb-3">
              <span className="text-3xl">{g.emoji}</span>
              <span className="text-xs font-semibold bg-white px-2 py-1 rounded-full text-slate-500 border border-gray-100">
                {g.tag}
              </span>
            </div>
            <h3 className="font-bold text-slate-700 text-lg mb-1 group-hover:text-red-500 transition-colors">
              {g.title}
            </h3>
            <p className="text-sm text-slate-500">{g.desc}</p>
            <p className="text-sm text-red-500 font-semibold mt-4">Read more →</p>
          </div>
        </Link>
      ))}
    </div>
  );
}