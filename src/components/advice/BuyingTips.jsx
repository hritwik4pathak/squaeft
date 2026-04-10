const tips = [
  { title: "Set a Budget", desc: "Include stamp duty (5-7%), registration (1%), and moving costs in your total budget." },
  { title: "Check RERA Registration", desc: "Always verify the project is RERA registered before booking a flat or plot." },
  { title: "Verify Title Documents", desc: "Get a lawyer to verify the property title, encumbrance certificate and sale deed." },
  { title: "Inspect the Property", desc: "Visit the property multiple times at different times of day before finalising." },
  { title: "Negotiate the Price", desc: "Always negotiate — sellers typically have 5-10% room for negotiation." },
  { title: "Check Amenities & Society", desc: "Verify maintenance charges, amenities, water supply and society rules." },
];

export default function BuyingTips() {
  return (
    <div>
      <h2 className="text-xl font-bold text-slate-700 mb-1">Quick Buying Tips</h2>
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