"use client";
import Link from "next/link";
import { FaSearch } from 'react-icons/fa';
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const navItems = [
  { label: "Buy", links: ["Flats in India", "Builder Floors", "Independent Houses", "Villas", "Plots"] },
  { label: "Rent", links: ["Flats for Rent", "Houses for Rent", "PG / Co-living", "Commercial Spaces"] },
  { label: "Sell", links: ["Post Property Free", "Seller Dashboard", "Pricing Guide"] },
  { label: "Home Loans", links: ["Check Eligibility", "EMI Calculator", "Compare Banks", "Apply Now"] },
  { label: "Home Interiors", links: ["Modular Kitchen", "Living Room", "Bedroom", "Full Home Design"] },
  { label: "Advice", links: ["Buying Guide", "Renting Tips", "Legal Help", "Market Trends"], badge: "NEW" },
  { label: "Help", links: ["FAQs", "Contact Us", "Report an Issue"] },
];

const PLACEHOLDERS = [
  "Search...",
  "1 BHK Flat",
  "2 BHK Flat",
  "3 BHK Flat",
  "Villa for Sale",
  "House for Rent",
  "Studio Apartment",
  "PG near Metro",
];

// TIMING
const PAUSE_MS = 2000;   // how long each word stays visible
const SLIDE_MS = 400;    // how long the slide animation takes

function AnimatedPlaceholder({ isFocused }) {
  const [current, setCurrent] = useState(0);
  const [next, setNext] = useState(1);
  const [phase, setPhase] = useState("idle"); // "idle" | "sliding"

  useEffect(() => {
    if (isFocused) return;

    // Step 1: wait PAUSE_MS, then start slide
    const pauseTimer = setTimeout(() => {
      setPhase("sliding");

      // Step 2: after slide completes, snap to next and reset
      const slideTimer = setTimeout(() => {
        setCurrent((prev) => (prev + 1) % PLACEHOLDERS.length);
        setNext((prev) => (prev + 1) % PLACEHOLDERS.length);
        setPhase("idle");
      }, SLIDE_MS);

      return () => clearTimeout(slideTimer);
    }, PAUSE_MS);

    return () => clearTimeout(pauseTimer);
  }, [current, isFocused]); // re-runs every time current changes

  const sliding = phase === "sliding";

  return (
    <div
      className="relative overflow-hidden pointer-events-none select-none"
      style={{ height: "20px", width: "100%" }}
    >
      {/* Current word — slides UP and out */}
      <span
        className="absolute left-0 text-slate-400 text-sm whitespace-nowrap"
        style={{
          transition: sliding ? `transform ${SLIDE_MS}ms ease-in-out, opacity ${SLIDE_MS}ms ease-in-out` : "none",
          transform: sliding ? "translateY(-100%)" : "translateY(0%)",
          opacity: sliding ? 0 : 1,
        }}
      >
        {PLACEHOLDERS[current]}
      </span>

      {/* Next word — slides UP from below */}
      <span
        className="absolute left-0 text-slate-400 text-sm whitespace-nowrap"
        style={{
          transition: sliding ? `transform ${SLIDE_MS}ms ease-in-out, opacity ${SLIDE_MS}ms ease-in-out` : "none",
          transform: sliding ? "translateY(0%)" : "translateY(100%)",
          opacity: sliding ? 1 : 0,
        }}
      >
        {PLACEHOLDERS[next]}
      </span>
    </div>
  );
}

export default function Navbar() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [openSection, setOpenSection] = useState(null);
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const router = useRouter();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchValue.trim()) router.push(`/search?searchTerm=${searchValue}`);
  };

  return (
    <>
      <style>{`
        @keyframes slideIn {
          from { transform: translateX(100%); }
          to   { transform: translateX(0); }
        }
        @keyframes fadeInBg {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        .drawer { animation: slideIn 0.28s cubic-bezier(.4,0,.2,1) forwards; }
        .drawer-bg { animation: fadeInBg 0.28s ease forwards; }
      `}</style>

      <header className="bg-slate-200 shadow-md relative z-50">
        <div className="flex justify-between items-center max-w-6xl mx-auto p-3">

          {/* Logo */}
          <Link href='/'>
            <h1 className="font-bold text-sm sm:text-xl flex flex-wrap">
              <span className="text-slate-500">SqFt</span>
              <span className="text-slate-700">Estate</span>
            </h1>
          </Link>

          {/* Search with animated placeholder */}
          <form onSubmit={handleSearch} className="bg-slate-100 p-3 rounded-lg flex items-center gap-2 relative">
            {!searchFocused && !searchValue && (
              <div className="absolute left-3 top-1/2 -translate-y-1/2 w-24 sm:w-56">
                <AnimatedPlaceholder isFocused={searchFocused} />
              </div>
            )}
            <input
              type='text'
              name='search'
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              className="bg-transparent focus:outline-none w-24 sm:w-64 text-sm text-slate-700 caret-slate-600"
              autoComplete="off"
            />
            <button type="submit">
              <FaSearch className='text-slate-600' />
            </button>
          </form>

          {/* Desktop nav */}
          <ul className="flex gap-4 items-center">
            <Link href='/'>
              <li className="hidden sm:inline text-slate-700 hover:underline">Home</li>
            </Link>
            <Link href='/about'>
              <li className="hidden sm:inline text-slate-700 hover:underline">About</li>
            </Link>
            <SignedIn>
              <Link href='/create-listing'>
                <li className="hidden sm:inline bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors duration-150 list-none">
                  + List Property
                </li>
              </Link>
              <UserButton />
            </SignedIn>
            <SignedOut>
              <Link href='/sign-in'>
                <li className="hidden sm:inline text-slate-700 hover:underline">Sign In</li>
              </Link>
            </SignedOut>

            {/* Hamburger — mobile only */}
            <button
              className="sm:hidden flex flex-col justify-center items-center gap-1.5 w-8 h-8"
              onClick={() => setDrawerOpen(true)}
              aria-label="Open menu"
            >
              <span className="block w-6 h-0.5 bg-slate-700 rounded"></span>
              <span className="block w-6 h-0.5 bg-slate-700 rounded"></span>
              <span className="block w-6 h-0.5 bg-slate-700 rounded"></span>
            </button>
          </ul>
        </div>
      </header>

      {/* Overlay */}
      {drawerOpen && (
        <div
          className="drawer-bg fixed inset-0 bg-black/40 z-50"
          onClick={() => setDrawerOpen(false)}
        />
      )}

      {/* Slide-in Drawer */}
      {drawerOpen && (
        <div className="drawer fixed top-0 right-0 h-full w-72 bg-white shadow-2xl z-50 flex flex-col overflow-y-auto">
          <div className="flex justify-between items-center px-5 py-4 border-b border-gray-100 bg-slate-200">
            <h2 className="font-bold text-slate-700 text-lg">
              <span className="text-slate-500">SqFt</span>Estate
            </h2>
            <button
              onClick={() => setDrawerOpen(false)}
              className="text-slate-500 hover:text-slate-800 text-2xl leading-none"
              aria-label="Close menu"
            >
              ✕
            </button>
          </div>

          <div className="flex flex-col px-4 py-3 gap-1">
            <Link href='/' onClick={() => setDrawerOpen(false)}
              className="py-2.5 px-2 text-slate-700 font-medium hover:bg-slate-50 rounded-lg">
              Home
            </Link>
            <Link href='/about' onClick={() => setDrawerOpen(false)}
              className="py-2.5 px-2 text-slate-700 font-medium hover:bg-slate-50 rounded-lg">
              About
            </Link>
            <SignedIn>
              <Link href='/create-listing' onClick={() => setDrawerOpen(false)}
                className="py-2.5 px-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg text-sm transition-colors duration-150">
                + List Property
              </Link>
            </SignedIn>
            <SignedOut>
              <Link href='/sign-in' onClick={() => setDrawerOpen(false)}
                className="py-2.5 px-2 text-slate-700 font-medium hover:bg-slate-50 rounded-lg">
                Sign In
              </Link>
            </SignedOut>

            <div className="border-t border-gray-100 my-2" />

            {navItems.map((item, i) => (
              <div key={i}>
                <button
                  onClick={() => setOpenSection(openSection === i ? null : i)}
                  className="w-full flex justify-between items-center py-2.5 px-2 text-slate-700 font-medium hover:bg-slate-50 rounded-lg"
                >
                  <span className="flex items-center gap-2">
                    {item.label}
                    {item.badge && (
                      <span className="bg-yellow-400 text-gray-900 text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                        {item.badge}
                      </span>
                    )}
                  </span>
                  <svg
                    className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${openSection === i ? 'rotate-180' : ''}`}
                    fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {openSection === i && (
                  <div className="ml-4 flex flex-col gap-0.5 mb-1">
                    {item.links.map((link, j) => (
                      <Link
                        key={j}
                        href={`/search?q=${encodeURIComponent(link)}`}
                        onClick={() => setDrawerOpen(false)}
                        className="py-2 px-3 text-sm text-slate-500 hover:text-red-500 hover:bg-red-50 rounded-lg"
                      >
                        {link}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-auto px-5 py-4 border-t border-gray-100 flex items-center gap-3">
            <SignedIn>
              <UserButton />
              <span className="text-sm text-slate-600">My Account</span>
            </SignedIn>
          </div>
        </div>
      )}
    </>
  );
}