"use client";
import { useState } from "react";

export default function EMICalculator() {
  const [amount, setAmount] = useState("");
  const [rate, setRate] = useState("");
  const [tenure, setTenure] = useState("");
  const [emi, setEmi] = useState(null);

  const calculate = (e) => {
    e.preventDefault();
    const P = Number(amount);
    const R = Number(rate) / 12 / 100;
    const N = Number(tenure) * 12;
    if (!P || !R || !N) return;
    const result = (P * R * Math.pow(1 + R, N)) / (Math.pow(1 + R, N) - 1);
    setEmi(result);
  };

  const totalPayable = emi ? emi * Number(tenure) * 12 : null;
  const totalInterest = totalPayable ? totalPayable - Number(amount) : null;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-10">
      <h2 className="text-xl font-bold text-slate-700 mb-1">EMI Calculator</h2>
      <div className="w-8 h-1 bg-red-500 rounded mb-6" />
      <form onSubmit={calculate} className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
        <div>
          <label className="text-sm font-semibold text-slate-600 mb-1 block">Loan Amount (₹)</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="e.g. 5000000"
            className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-300"
          />
        </div>
        <div>
          <label className="text-sm font-semibold text-slate-600 mb-1 block">Interest Rate (%)</label>
          <input
            type="number"
            value={rate}
            onChange={(e) => setRate(e.target.value)}
            placeholder="e.g. 8.5"
            step="0.1"
            className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-300"
          />
        </div>
        <div>
          <label className="text-sm font-semibold text-slate-600 mb-1 block">Tenure (Years)</label>
          <input
            type="number"
            value={tenure}
            onChange={(e) => setTenure(e.target.value)}
            placeholder="e.g. 20"
            className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-300"
          />
        </div>
        <button
          type="submit"
          className="sm:col-span-3 bg-red-500 hover:bg-red-600 text-white font-semibold py-2.5 rounded-lg text-sm transition-colors"
        >
          Calculate EMI
        </button>
      </form>

      {emi ? (
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-red-50 rounded-xl p-4 text-center">
            <p className="text-xs text-slate-400 mb-1">Monthly EMI</p>
            <p className="text-xl font-black text-red-500">
              ₹{Math.round(emi).toLocaleString("en-IN")}
            </p>
          </div>
          <div className="bg-slate-50 rounded-xl p-4 text-center">
            <p className="text-xs text-slate-400 mb-1">Total Payable</p>
            <p className="text-xl font-black text-slate-700">
              ₹{Math.round(totalPayable).toLocaleString("en-IN")}
            </p>
          </div>
          <div className="bg-orange-50 rounded-xl p-4 text-center">
            <p className="text-xs text-slate-400 mb-1">Total Interest</p>
            <p className="text-xl font-black text-orange-500">
              ₹{Math.round(totalInterest).toLocaleString("en-IN")}
            </p>
          </div>
        </div>
      ) : (
        <div className="bg-slate-50 rounded-xl p-4 text-center text-slate-400 text-sm">
          Fill in the fields above and click Calculate to see your EMI
        </div>
      )}
    </div>
  );
}