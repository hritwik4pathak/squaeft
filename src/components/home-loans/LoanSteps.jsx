const steps = [
  { step: "01", title: "Check Eligibility", desc: "Assess your income, credit score and existing liabilities to determine loan eligibility." },
  { step: "02", title: "Choose a Lender", desc: "Compare interest rates, processing fees and tenure options from top banks." },
  { step: "03", title: "Submit Documents", desc: "Prepare identity proof, income proof, property documents and bank statements." },
  { step: "04", title: "Loan Sanction", desc: "Bank reviews your application and sanctions the loan amount." },
  { step: "05", title: "Disbursement", desc: "Loan amount is disbursed directly to the seller or builder." },
];

export default function LoanSteps() {
  return (
    <div>
      <h2 className="text-xl font-bold text-slate-700 mb-1">How to Apply</h2>
      <div className="w-8 h-1 bg-red-500 rounded mb-6" />
      <div className="flex flex-col gap-4">
        {steps.map((s, i) => (
          <div key={i} className="flex gap-4 bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <span className="text-2xl font-black text-red-100 flex-shrink-0">{s.step}</span>
            <div>
              <p className="font-semibold text-slate-700">{s.title}</p>
              <p className="text-sm text-slate-400 mt-1">{s.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}