"use client";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

const navItems = [
  {
    label: "Buy",
    links: [
      "Flats in India",
      "Builder Floors",
      "Independent Houses",
      "Villas",
      "Plots",
    ],
  },
  {
    label: "Rent",
    links: [
      "Flats for Rent",
      "Houses for Rent",
      "PG / Co-living",
      "Commercial Spaces",
    ],
  },
  {
    label: "Sell",
    links: ["Post Property Free", "Seller Dashboard", "Pricing Guide"],
  },
  {
    label: "Home Loans",
    links: [
      "Check Eligibility",
      "EMI Calculator",
      "Compare Banks",
      "Apply Now",
    ],
  },
  {
    label: "Home Interiors",
    links: [
      "Modular Kitchen",
      "Living Room",
      "Bedroom",
      "Full Home Design",
    ],
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

function NavItem({ item, isOpen, onToggle, onClose }) {
  const btnRef = useRef(null);
  const [dropdownStyle, setDropdownStyle] = useState({});

  const updatePosition = useCallback(() => {
    if (btnRef.current) {
      const rect = btnRef.current.getBoundingClientRect();
      setDropdownStyle({
        position: "fixed",
        top: rect.bottom,
        left: rect.left,
        zIndex: 9999,
        minWidth: "200px",
      });
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      updatePosition();
      window.addEventListener("scroll", updatePosition, true);
      window.addEventListener("resize", updatePosition);
      return () => {
        window.removeEventListener("scroll", updatePosition, true);
        window.removeEventListener("resize", updatePosition);
      };
    }
  }, [isOpen, updatePosition]);

  // 🔥 Routing Logic
  const getHref = (link) => {
    // ✅ Static Pages
    if (link === "FAQs") return "/FAQs";
    if (link === "Contact Us") return "/contact";
      if (link === "Post Property Free") return "/create-listing";

    if (link === "Report an Issue") return "/report";

    // ✅ Default Search Routing
    return `/Search?searchTerm=${encodeURIComponent(link)}${
      item.label === "Rent"
        ? "&type=rent"
        : item.label === "Buy"
        ? "&type=sale"
        : ""
    }`;
  };

  return (
    <div className="relative flex-shrink-0">
      <button
        ref={btnRef}
        onClick={() => {
          updatePosition();
          onToggle();
        }}
        className={`flex items-center gap-1 px-4 py-3.5 text-sm font-medium transition-all duration-150 border-b-2 whitespace-nowrap
          ${
            isOpen
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
        <svg
          className={`w-3.5 h-3.5 ml-0.5 transition-transform duration-200 ${
            isOpen ? "rotate-180 text-red-500" : "text-gray-400"
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isOpen && (
        <div
          style={dropdownStyle}
          className="bg-white border border-gray-100 rounded-b-lg shadow-lg py-1 animate-fadeIn"
        >
          {item.links.map((link, j) => (
            <Link
              key={j}
              href={getHref(link)}
              onClick={onClose}
              className="block px-4 py-2.5 text-sm text-gray-600 hover:bg-red-50 hover:text-red-600 transition-colors duration-100"
            >
              {link}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

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
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&display=swap');
        .secondary-nav-scroll::-webkit-scrollbar { display: none; }
        .secondary-nav-scroll { -ms-overflow-style: none; scrollbar-width: none; }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-4px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn { animation: fadeIn 0.15s ease-out forwards; }
      `}</style>

      <nav
        ref={navRef}
        className="hidden sm:block w-full bg-white border-b border-gray-200 shadow-sm sticky top-0 z-40"
        style={{ fontFamily: "'DM Sans', sans-serif" }}
      >
        <div className="secondary-nav-scroll max-w-7xl mx-auto px-4 overflow-x-auto">
          <div className="flex items-center gap-1 w-max">
            {navItems.map((item, i) => (
              <NavItem
                key={i}
                item={item}
                isOpen={openIndex === i}
                onToggle={() =>
                  setOpenIndex(openIndex === i ? null : i)
                }
                onClose={() => setOpenIndex(null)}
              />
            ))}
          </div>
        </div>
      </nav>
    </>
  );
}