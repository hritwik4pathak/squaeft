import Link from "next/link";
import { SEARCH_ROUTES } from "@/lib/routes";

const styles = [
  {
    emoji: "🍳",
    title: "Modular Kitchen",
    desc: "Sleek, space-efficient kitchens with custom cabinets, countertops and smart storage solutions.",
    tag: "Kitchen",
    href: SEARCH_ROUTES.modularKitchen,
    color: "bg-orange-50 border-orange-100",
  },
  {
    emoji: "🛋️",
    title: "Living Room",
    desc: "Elegant living spaces with curated furniture, lighting and décor to reflect your personal style.",
    tag: "Living",
    href: SEARCH_ROUTES.livingRoom,
    color: "bg-blue-50 border-blue-100",
  },
  {
    emoji: "🛏️",
    title: "Bedroom",
    desc: "Comfortable, serene bedrooms with smart wardrobes, ambient lighting and quality finishes.",
    tag: "Bedroom",
    href: SEARCH_ROUTES.bedroom,
    color: "bg-purple-50 border-purple-100",
  },
  {
    emoji: "🏠",
    title: "Full Home Design",
    desc: "Complete interior transformation — every room designed to perfection as one cohesive vision.",
    tag: "Full Home",
    href: SEARCH_ROUTES.fullHomeDesign,
    color: "bg-green-50 border-green-100",
  },
];

export default function InteriorStyles() {
  return (
    <div className="mb-12">
      <h2 className="text-xl font-bold text-slate-700 mb-1">Interior Styles</h2>
      <div className="w-8 h-1 bg-red-500 rounded mb-6" />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {styles.map((s, i) => (
          <Link key={i} href={s.href}>
            <div className={`${s.color} border rounded-2xl p-6 hover:shadow-md transition-all cursor-pointer group`}>
              <div className="flex items-start justify-between mb-3">
                <span className="text-3xl">{s.emoji}</span>
                <span className="text-xs font-semibold bg-white px-2 py-1 rounded-full text-slate-500 border border-gray-100">
                  {s.tag}
                </span>
              </div>
              <h3 className="font-bold text-slate-700 text-lg mb-1 group-hover:text-red-500 transition-colors">
                {s.title}
              </h3>
              <p className="text-sm text-slate-500">{s.desc}</p>
              <p className="text-sm text-red-500 font-semibold mt-4">Explore →</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
