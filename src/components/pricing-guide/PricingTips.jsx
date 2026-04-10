const tips = [
  { title: "Research Circle Rates", desc: "Check the government-set circle rate for the area — it determines stamp duty and sets a baseline for fair pricing." },
  { title: "Compare Recent Sales", desc: "Look at actual sale prices (not listing prices) of similar properties in the same locality over the last 6 months." },
  { title: "Factor in Floor & View", desc: "Higher floors and open views add 5–15% premium. Ground floor units are typically priced 10–20% lower." },
  { title: "Negotiate on Extras", desc: "If the seller won't budge on price, negotiate on extras — parking spot, modular kitchen, white goods, or registry charges." },
  { title: "Watch Out for Super Built-Up", desc: "Super built-up area includes common areas. Carpet area is 70–80% of super built-up — always price on carpet area." },
  { title: "Budget for Hidden Costs", desc: "Add 8–12% on top of the sale price for stamp duty, registration, GST (on under-construction), brokerage, and legal fees." },
];

export default function PricingTips() {
  return (
    <div className="mb-10">
      <h2 className="text-xl font-bold text-slate-700 mb-1">Pricing Tips</h2>
      <div className="w-8 h-1 bg-red-500 rounded mb-6" />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {tips.map((tip, i) => (
          <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex gap-4">
            <span className="text-red-400 font-black text-xl flex-shrink-0">
              {String(i + 1).padStart(2, "0")}
            </span>
            <div>
              <p className="font-semibold text-slate-700 mb-1">{tip.title}</p>
              <p className="text-sm text-slate-400">{tip.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
