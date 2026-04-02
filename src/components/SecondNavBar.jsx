"use client";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";

const navItems = [
  {
    label: "Buy",
    links: ["Flats in India", "Builder Floors", "Independent Houses", "Villas", "Plots"],
  },
  {
    label: "Rent",
    links: ["Flats for Rent", "Houses for Rent", "PG / Co-living", "Commercial Spaces"],
  },
  {
    label: "Sell",
    links: ["Post Property Free", "Seller Dashboard", "Pricing Guide"],
  },
  {
    label: "Home Loans",
    links: ["Check Eligibility", "EMI Calculator", "Compare Banks", "Apply Now"],
  },
  {
    label: "Home Interiors",
    links: ["Modular Kitchen", "Living Room", "Bedroom", "Full Home Design"],
  },
  {
    label: "Advice",
    links: ["Buying Guide", "Renting Tips", "Legal Help", "Market Trends"],
    badge: "NEW",
  },
  {
    label: "Help",
    links: ["FAQs", "Contact Us", "Report an Issue"],
  },
];

export default function SecondaryNav() {
  const [openIndex, setOpenIndex] = useState(null);
  const navRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (navRef.current && !navRef.current.contains(e.target)) {
        setOpenIndex(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav
      ref={navRef}
      className="w-full bg-white border-b border-gray-200 shadow-sm z-40"
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      {/* Google Font */}
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&display=swap');`}</style>

      <div className="max-w-7xl mx-auto px-4 flex items-center gap-1">
        {navItems.map((item, i) => (
          <div key={i} className="relative">
            <button
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
              className={`flex items-center gap-1 px-4 py-3.5 text-sm font-medium transition-all duration-150 border-b-2 whitespace-nowrap
                ${openIndex === i
                  ? "border-red-500 text-red-600"
                  : "border-transparent text-gray-600 hover:text-red-500 hover:border-red-300"
                }`}
            >
              {item.label}
              {item.badge && (
                <span className="ml-1 bg-yellow-400 text-gray-900 text-[10px] font-bold px-1.5 py-0.5 rounded-full leading-none">
                  {item.badge}
                </span>
              )}
              {/* Chevron */}
              <svg
                className={`w-3.5 h-3.5 ml-0.5 transition-transform duration-200 ${openIndex === i ? "rotate-180 text-red-500" : "text-gray-400"}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Dropdown */}
            {openIndex === i && (
              <div className="absolute top-full left-0 mt-0 w-52 bg-white border border-gray-100 rounded-b-lg shadow-lg z-50 py-1 animate-fadeIn">
                {item.links.map((link, j) => (
                  <Link
                    key={j}
                    href={`/search?q=${encodeURIComponent(link)}`}
                    onClick={() => setOpenIndex(null)}
                    className="block px-4 py-2.5 text-sm text-gray-600 hover:bg-red-50 hover:text-red-600 transition-colors duration-100"
                  >
                    {link}
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-4px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn { animation: fadeIn 0.15s ease-out forwards; }
      `}</style>
    </nav>
  );
}