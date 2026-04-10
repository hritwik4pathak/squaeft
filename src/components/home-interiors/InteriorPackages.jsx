const packages = [
  {
    name: "Budget",
    price: "₹2L – ₹5L",
    tag: "Starter",
    color: "border-gray-200",
    tagColor: "bg-slate-100 text-slate-600",
    features: [
      "Basic modular kitchen",
      "Standard flooring",
      "Essential lighting",
      "2–3 rooms covered",
      "30-day delivery",
    ],
  },
  {
    name: "Standard",
    price: "₹5L – ₹10L",
    tag: "Most Popular",
    color: "border-red-400",
    tagColor: "bg-red-500 text-white",
    highlight: true,
    features: [
      "Premium modular kitchen",
      "Wooden / vitrified flooring",
      "Designer lighting & fans",
      "Full home (3–4 rooms)",
      "Wardrobe with sliding doors",
      "45-day delivery",
    ],
  },
  {
    name: "Premium",
    price: "₹10L+",
    tag: "Luxury",
    color: "border-yellow-400",
    tagColor: "bg-yellow-400 text-gray-900",
    features: [
      "Luxury Italian modular kitchen",
      "Imported marble / hardwood",
      "Smart lighting & automation",
      "Complete home transformation",
      "Custom wardrobes & furniture",
      "False ceiling with cove lights",
      "60-day delivery + warranty",
    ],
  },
];

export default function InteriorPackages() {
  return (
    <div className="mb-12">
      <h2 className="text-xl font-bold text-slate-700 mb-1">Interior Packages</h2>
      <div className="w-8 h-1 bg-red-500 rounded mb-6" />
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {packages.map((pkg, i) => (
          <div
            key={i}
            className={`bg-white rounded-2xl border-2 ${pkg.color} shadow-sm p-6 flex flex-col ${pkg.highlight ? "scale-[1.02]" : ""}`}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-700">{pkg.name}</h3>
              <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${pkg.tagColor}`}>
                {pkg.tag}
              </span>
            </div>
            <p className="text-3xl font-black text-slate-800 mb-5">{pkg.price}</p>
            <ul className="flex flex-col gap-2 flex-1">
              {pkg.features.map((f, j) => (
                <li key={j} className="flex items-start gap-2 text-sm text-slate-500">
                  <span className="text-green-500 font-bold mt-0.5">✓</span>
                  {f}
                </li>
              ))}
            </ul>
            <button className={`mt-6 w-full py-2.5 rounded-xl text-sm font-semibold transition-colors
              ${pkg.highlight
                ? "bg-red-500 hover:bg-red-600 text-white"
                : "border border-gray-200 text-slate-600 hover:bg-gray-50"}`}>
              Get Quote
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
