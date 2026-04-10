const insights = [
  { emoji: "📈", title: "Residential Market Boom", desc: "India's residential real estate market is seeing increased demand driven by urbanisation, rising incomes and favorable home loan rates.", tag: "Residential" },
  { emoji: "🏢", title: "Commercial Recovery", desc: "Office space demand is recovering with IT and startup sectors leading absorption in Bangalore, Hyderabad and Pune.", tag: "Commercial" },
  { emoji: "🌆", title: "Tier-2 Cities Rising", desc: "Cities like Lucknow, Jaipur and Coimbatore are seeing 20%+ growth in residential demand due to improved infrastructure.", tag: "Emerging" },
  { emoji: "💰", title: "NRI Investment Surge", desc: "NRI investments in Indian real estate have increased significantly, particularly in premium and luxury segments.", tag: "Investment" },
];

export default function MarketInsights() {
  return (
    <div className="mb-10">
      <h2 className="text-xl font-bold text-slate-700 mb-1">Market Insights</h2>
      <div className="w-8 h-1 bg-red-500 rounded mb-6" />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {insights.map((item, i) => (
          <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-start justify-between mb-3">
              <span className="text-2xl">{item.emoji}</span>
              <span className="text-xs bg-slate-50 text-slate-500 px-2 py-1 rounded-full border border-gray-100 font-medium">
                {item.tag}
              </span>
            </div>
            <h3 className="font-bold text-slate-700 mb-2">{item.title}</h3>
            <p className="text-sm text-slate-400">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}