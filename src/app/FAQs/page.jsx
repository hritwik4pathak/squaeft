"use client";
import { useState } from "react";

const faqs = [
  {
    category: "General",
    questions: [
      {
        q: "What is this platform?",
        a: "This platform helps users buy, rent, and sell properties across India with advanced search filters and real-time listings.",
      },
      {
        q: "Is it free to use?",
        a: "Yes, searching and browsing properties is completely free for all users.",
      },
      {
        q: "Do I need to create an account?",
        a: "You can browse listings without an account, but posting or saving properties requires login.",
      },
    ],
  },
  {
    category: "Buying Property",
    questions: [
      {
        q: "How can I find properties for sale?",
        a: "Use the search filters and select 'Buy' to view available properties for sale.",
      },
      {
        q: "Can I directly contact the seller?",
        a: "Yes, each listing provides contact details of the owner or agent.",
      },
      {
        q: "Are listings verified?",
        a: "We try to verify listings, but we recommend users independently verify property details.",
      },
    ],
  },
  {
    category: "Renting Property",
    questions: [
      {
        q: "How do I search for rental properties?",
        a: "Select 'Rent' from the navigation or filters to view rental listings.",
      },
      {
        q: "What details are available for rental listings?",
        a: "You can view rent, location, amenities, furnishing status, and contact details.",
      },
      {
        q: "Can I filter by budget or bedrooms?",
        a: "Yes, you can filter by price range, bedrooms, bathrooms, and more.",
      },
    ],
  },
  {
    category: "Selling Property",
    questions: [
      {
        q: "How do I post my property?",
        a: "Go to 'Sell' → 'Post Property Free' and fill in your property details.",
      },
      {
        q: "Is posting property free?",
        a: "Basic listings are free, but premium promotions may be available.",
      },
      {
        q: "How long will my listing stay active?",
        a: "Listings remain active for a specific duration and can be renewed anytime.",
      },
    ],
  },
  {
    category: "Filters & Search",
    questions: [
      {
        q: "How do filters work?",
        a: "Filters allow you to refine results by type (rent/sale), price, bedrooms, amenities, and more.",
      },
      {
        q: "Why am I not seeing any listings?",
        a: "This may happen if filters are too strict. Try resetting filters or broadening your search.",
      },
      {
        q: "Can I save my search preferences?",
        a: "Currently, saved searches are not available, but you can bookmark pages.",
      },
    ],
  },
  {
    category: "Technical & Support",
    questions: [
      {
        q: "The page is not updating when I change filters?",
        a: "Ensure your internet connection is stable. Try refreshing or reapplying filters.",
      },
      {
        q: "How can I report an issue?",
        a: "Go to the Help section and use 'Report an Issue' to contact support.",
      },
      {
        q: "Is my data secure?",
        a: "Yes, we follow standard security practices to protect user data.",
      },
    ],
  },
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  let count = 0;

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">
        Frequently Asked Questions
      </h1>
      <p className="text-gray-500 mb-8">
        Find answers to common questions about buying, renting, and selling properties.
      </p>

      {faqs.map((section, i) => (
        <div key={i} className="mb-8">
          <h2 className="text-xl font-semibold text-red-500 mb-4">
            {section.category}
          </h2>

          <div className="space-y-3">
            {section.questions.map((item, j) => {
              const index = count++;
              return (
                <div
                  key={index}
                  className="border border-gray-200 rounded-lg overflow-hidden"
                >
                  <button
                    onClick={() => toggle(index)}
                    className="w-full flex justify-between items-center px-4 py-3 text-left font-medium text-gray-700 hover:bg-gray-50"
                  >
                    {item.q}
                    <span className="text-xl">
                      {openIndex === index ? "−" : "+"}
                    </span>
                  </button>

                  {openIndex === index && (
                    <div className="px-4 pb-4 text-sm text-gray-600">
                      {item.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}