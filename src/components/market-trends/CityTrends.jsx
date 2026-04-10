const trends = [
  { city: "Mumbai", change: "+8.2%", avg: "₹18,500/sqft", demand: "High", hot: false },
  { city: "Bangalore", change: "+12.4%", avg: "₹9,200/sqft", demand: "Very High", hot: true },
  { city: "Delhi NCR", change: "+6.8%", avg: "₹8,100/sqft", demand: "High", hot: false },
  { city: "Hyderabad", change: "+15.1%", avg: "₹7,400/sqft", demand: "Very High", hot: true },
  { city: "Pune", change: "+9.3%", avg: "₹7,800/sqft", demand: "High", hot: false },
  { city: "Chennai", change: "+5.6%", avg: "₹6,900/sqft", demand: "Moderate", hot: false },
];

export default function CityTrends() {
  return (
    <div className="mb-10">
      <h2 className="text-xl font-bold text-slate-700 mb-1">City-wise Price Trends</h2>
      <div className="w-8 h-1 bg-red-500 rounded mb-6" />
      <div className="overflow-x-auto rounded-2xl border border-gray-100 shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-slate-500 font-semibold">
            <tr>
              <th className="text-left px-4 py-3">City</th>
              <th className="text-left px-4 py-3">YoY Change</th>
              <th className="text-left px-4 py-3">Avg Price</th>
              <th className="text-left px-4 py-3">Demand</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {trends.map((t, i) => (
              <tr key={i} className="bg-white hover:bg-slate-50 transition-colors">
                <td className="px-4 py-3 font-semibold text-slate-700 flex items-center gap-2">
                  {t.city}
                  {t.hot && <span className="text-xs bg-red-50 text-red-500 px-2 py-0.5 rounded-full font-semibold">🔥 Hot</span>}
                </td>
                <td className="px-4 py-3 text-green-600 font-bold">{t.change}</td>
                <td className="px-4 py-3 text-slate-600">{t.avg}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-semibold
                    ${t.demand === "Very High" ? "bg-red-50 text-red-500" :
                      t.demand === "High" ? "bg-orange-50 text-orange-500" :
                      "bg-slate-50 text-slate-500"}`}>
                    {t.demand}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-slate-400 mt-2 px-1">* Data is indicative based on market research. Actual prices may vary.</p>
    </div>
  );
}