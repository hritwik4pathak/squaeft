const banks = [
  { name: "SBI Home Loan", rate: "8.50%", maxAmount: "₹5 Cr", tenure: "30 years", processing: "0.35%" },
  { name: "HDFC Home Loan", rate: "8.70%", maxAmount: "₹10 Cr", tenure: "30 years", processing: "0.50%" },
  { name: "ICICI Home Loan", rate: "8.75%", maxAmount: "₹10 Cr", tenure: "30 years", processing: "0.50%" },
  { name: "Axis Bank", rate: "8.75%", maxAmount: "₹5 Cr", tenure: "30 years", processing: "1.00%" },
  { name: "Kotak Mahindra", rate: "8.85%", maxAmount: "₹5 Cr", tenure: "20 years", processing: "0.50%" },
  { name: "LIC Housing Finance", rate: "8.50%", maxAmount: "₹15 Cr", tenure: "30 years", processing: "Nil" },
];

export default function BankComparison() {
  return (
    <div className="mb-10">
      <h2 className="text-xl font-bold text-slate-700 mb-1">Compare Banks</h2>
      <div className="w-8 h-1 bg-red-500 rounded mb-6" />
      <div className="overflow-x-auto rounded-2xl border border-gray-100 shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-slate-500 font-semibold">
            <tr>
              <th className="text-left px-4 py-3">Bank</th>
              <th className="text-left px-4 py-3">Interest Rate</th>
              <th className="text-left px-4 py-3">Max Amount</th>
              <th className="text-left px-4 py-3">Max Tenure</th>
              <th className="text-left px-4 py-3">Processing Fee</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {banks.map((bank, i) => (
              <tr key={i} className="bg-white hover:bg-slate-50 transition-colors">
                <td className="px-4 py-3 font-semibold text-slate-700">{bank.name}</td>
                <td className="px-4 py-3 text-green-600 font-semibold">{bank.rate}</td>
                <td className="px-4 py-3 text-slate-600">{bank.maxAmount}</td>
                <td className="px-4 py-3 text-slate-600">{bank.tenure}</td>
                <td className="px-4 py-3 text-slate-600">{bank.processing}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-slate-400 mt-2 px-1">
        * Rates are indicative and subject to change. Please check with the bank for latest rates.
      </p>
    </div>
  );
}