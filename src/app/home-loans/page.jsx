import Link from "next/link";
import { ROUTES } from "@/lib/routes";
import EMICalculator from "@/components/home-loans/EMICalculator";
import BankComparison from "@/components/home-loans/BankComparison";
import LoanSteps from "@/components/home-loans/LoanSteps";

export default function HomeLoansPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      {/* Hero */}
      <div className="bg-gradient-to-br from-slate-700 to-slate-900 rounded-3xl p-8 mb-10 text-white">
        <h1 className="text-3xl sm:text-4xl font-bold mb-3">Home Loans Made Simple</h1>
        <p className="text-slate-300 text-sm sm:text-base max-w-xl">
          Compare interest rates from top banks, calculate your EMI, and find the best loan for your dream home.
        </p>
        <Link
          href={ROUTES.search}
          className="inline-block mt-6 bg-red-500 hover:bg-red-600 text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition-colors"
        >
          Browse Properties
        </Link>
      </div>

      <EMICalculator />
      <BankComparison />
      <LoanSteps />
    </div>
  );
}