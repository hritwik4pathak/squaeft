"use client";
import { useState } from "react";

export default function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Message sent successfully! 🚀");
    setForm({ name: "", email: "", message: "" });
  };

  // 🔥 ADD YOUR FIREBASE IMAGE LINKS HERE
  const images = [
    "", // paste firebase image URL 1
    "", // paste firebase image URL 2
    "", // paste firebase image URL 3
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">

      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-gray-800">Contact Us</h1>
        <p className="text-gray-500 mt-2">
          We re here to help you with buying, renting, or selling properties.
        </p>
      </div>

      {/* 🔥 Image Section (Firebase Ready) */}
      <div className="grid sm:grid-cols-3 gap-4 mb-10">
        {images.map((img, i) => (
          <div
            key={i}
            className="h-48 w-full rounded-lg border border-dashed border-gray-300 flex items-center justify-center text-gray-400 text-sm"
          >
            {img ? (
              <img
                src={img}
                alt={`support-${i}`}
                className="w-full h-full object-cover rounded-lg"
              />
            ) : (
              "Add Firebase Image URL"
            )}
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-8">

        {/* Contact Info */}
        <div className="bg-white p-6 rounded-xl shadow border">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            Customer Support
          </h2>

          <div className="space-y-4 text-gray-600">

            <div>
              <p className="font-medium">📧 Email</p>
              <p>support@propertyhub.com</p>
            </div>

            <div>
              <p className="font-medium">📞 Phone</p>
              <p>+91 98765 43210</p>
            </div>

            <div>
              <p className="font-medium">📍 Address</p>
              <p>New Delhi, India</p>
            </div>

            <div>
              <p className="font-medium">🕒 Working Hours</p>
              <p>Mon - Sat: 9:00 AM – 7:00 PM</p>
            </div>

          </div>

          <div className="mt-6 p-4 bg-red-50 rounded-lg text-sm text-gray-600">
            Need urgent help? Our support team usually responds within 24 hours.
          </div>
        </div>

        {/* Contact Form */}
        <div className="bg-white p-6 rounded-xl shadow border">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            Send us a Message
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">

            <input
              type="text"
              placeholder="Your Name"
              value={form.name}
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-300"
              required
            />

            <input
              type="email"
              placeholder="Your Email"
              value={form.email}
              onChange={(e) =>
                setForm({ ...form, email: e.target.value })
              }
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-300"
              required
            />

            <textarea
              rows="5"
              placeholder="Your Message..."
              value={form.message}
              onChange={(e) =>
                setForm({ ...form, message: e.target.value })
              }
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-300"
              required
            />

            <button
              type="submit"
              className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-2 rounded-lg transition"
            >
              Send Message
            </button>

          </form>
        </div>
      </div>
    </div>
  );
}