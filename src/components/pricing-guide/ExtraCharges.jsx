const charges = [
  {
    name: "Stamp Duty",
    range: "4% – 7%",
    desc: "Paid to the state government on the property value. Varies by state.",
    example: "On ₹50L property → ₹2L – ₹3.5L",
  },
  {
    name: "Registration Fee",
    range: "0.5% – 1%",
    desc: "Paid at the sub-registrar office when registering the property in your name.",
    example: "On ₹50L property → ₹25K – ₹50K",
  },
  {
    name: "GST (Under Construction)",
    range: "5%",
    desc: "Applicable only on under-construction properties. Not on ready-to-move.",
    example: "On ₹50L property → ₹2.5L",
  },
  {
    name: "Brokerage / Agent Fee",
    range: "1% – 2%",
    desc: "Paid to the property agent or broker. Negotiable in most cases.",
    example: "On ₹50L property → ₹50K – ₹1L",
  },
  {
    name: "Home Loan Processing Fee",
    range: "0.25% – 1%",
    desc: "One-time fee charged by the bank for processing your home loan application.",
    example: "On ₹40L loan → ₹10K – ₹40K",
  },
  {
    name: "Society Maintenance Deposit",
    range: "₹25K – ₹2L",
    desc: "One-time deposit paid to the housing society for maintenance corpus.",
    example: "Varies by society",
  },
];

export default function ExtraCharges() {
  return (
    <div className="mb-10">
      <h2 className="text-xl font-bold text-slate-700 mb-1">Hidden Costs to Budget For</h2>
      <div className="w-8 h-1 bg-red-500 rounded mb-2" />
      <p className="text-sm text-slate-400 mb-6">
        The property price is just the beginning — budget an extra 8–12% for these charges.
      </p>
      <div className="flex flex-col gap-3">
        {charges.map((c, i) => (
          <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex gap-4">
            <span className="text-red-400 font-black text-lg flex-shrink-0 w-6">
              {String(i + 1).padStart(2, "0")}
            </span>
            <div className="flex-1">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <p className="font-semibold text-slate-700">{c.name}</p>
                <span className="text-sm font-bold text-red-500 bg-red-50 px-3 py-0.5 rounded-full">
                  {c.range}
                </span>
              </div>
              <p className="text-sm text-slate-400 mt-1">{c.desc}</p>
              <p className="text-xs text-slate-300 mt-1 italic">{c.example}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}