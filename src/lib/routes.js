// src/lib/routes.js
// ─────────────────────────────────────────────────────────────
// Central route config for the entire project.
// Import and use these instead of hardcoding URLs anywhere.
// ─────────────────────────────────────────────────────────────

// ── Base builders (internal helpers) ────────────────────────
const BASE = "/search";

const search = (params = {}) => {
  const query = new URLSearchParams();
  if (params.type)       query.set("type", params.type);
  if (params.searchTerm) query.set("searchTerm", params.searchTerm);
  if (params.offer)      query.set("offer", "true");
  if (params.furnished)  query.set("furnished", "true");
  if (params.parking)    query.set("parking", "true");
  const qs = query.toString();
  return qs ? `${BASE}?${qs}` : BASE;
};

// ── Main page routes ─────────────────────────────────────────
export const ROUTES = {
  home:          "/",
  about:         "/about",
  search:        BASE,
  createListing: "/create-listing",
  signIn:        "/sign-in",
  signUp:        "/sign-up",
  profile:       "/profile",
  readMe:        "/read-me",
  faqs:    "/FAQs",
  contact: "/contact",

  // Dynamic routes — call as a function: ROUTES.listing(id)
  listing:       (id) => `/listing/${id}`,
  updateListing: (id) => `/update-listing/${id}`,
};

// ── Search / filter routes ───────────────────────────────────
export const SEARCH_ROUTES = {

  // ── Buy ──────────────────────────────────────────────────
  flatsInIndia:      search({ type: "sale", searchTerm: "Flat" }),
  builderFloors:     search({ type: "sale", searchTerm: "Builder Floor" }),
  independentHouses: search({ type: "sale", searchTerm: "Independent House" }),
  villas:            search({ type: "sale", searchTerm: "Villa" }),
  plots:             search({ type: "sale", searchTerm: "Plot" }),
  forSale:           search({ type: "sale" }),

  // ── Rent ─────────────────────────────────────────────────
  flatsForRent:      search({ type: "rent", searchTerm: "Flat" }),
  housesForRent:     search({ type: "rent", searchTerm: "House" }),
  pgColiving:        search({ type: "rent", searchTerm: "PG" }),
  commercialSpaces:  search({ type: "rent", searchTerm: "Commercial" }),
  forRent:           search({ type: "rent" }),

  // ── Filters ───────────────────────────────────────────────
  allListings:       search(),
  withOffer:         search({ offer: true }),
  furnished:         search({ furnished: true }),
  withParking:       search({ parking: true }),

  // ── Interiors ─────────────────────────────────────────────
  modularKitchen:    search({ searchTerm: "Kitchen" }),
  livingRoom:        search({ searchTerm: "Living Room" }),
  bedroom:           search({ searchTerm: "Bedroom" }),
  fullHomeDesign:    search({ furnished: true }),

  // ── Dynamic helper ────────────────────────────────────────
  custom: (params) => search(params),
};

// ── API routes ───────────────────────────────────────────────
export const API_ROUTES = {
  listingGet:    "/api/listing/get",
  listingCreate: "/api/listing/create",
  listingUpdate: "/api/listing/update",
  listingView:   "/api/listing/view",
  webhook:       "/api/webhook",
  
};

// ── Static nav link resolver ─────────────────────────────────
export const LINK_MAP = {

  // ── Buy ──────────────────────────────────────────────────
  "Flats in India":       SEARCH_ROUTES.flatsInIndia,
  "Builder Floors":       SEARCH_ROUTES.builderFloors,
  "Independent Houses":   SEARCH_ROUTES.independentHouses,
  "Villas":               SEARCH_ROUTES.villas,
  "Plots":                SEARCH_ROUTES.plots,

  // ── Rent ─────────────────────────────────────────────────
  "Flats for Rent":       SEARCH_ROUTES.flatsForRent,
  "Houses for Rent":      SEARCH_ROUTES.housesForRent,
  "PG / Co-living":       SEARCH_ROUTES.pgColiving,
  "Commercial Spaces":    SEARCH_ROUTES.commercialSpaces,

  // ── Sell ─────────────────────────────────────────────────
  "Post Property Free":   ROUTES.createListing,
  "Seller Dashboard":     ROUTES.profile,
  "Pricing Guide":        SEARCH_ROUTES.forSale,

  // ── Home Loans ───────────────────────────────────────────
  "Check Eligibility":    ROUTES.search,
  "EMI Calculator":       ROUTES.search,
  "Compare Banks":        ROUTES.search,
  "Apply Now":            ROUTES.search,

  // ── Home Interiors ───────────────────────────────────────
  "Modular Kitchen":      SEARCH_ROUTES.modularKitchen,
  "Living Room":          SEARCH_ROUTES.livingRoom,
  "Bedroom":              SEARCH_ROUTES.bedroom,
  "Full Home Design":     SEARCH_ROUTES.fullHomeDesign,

  // ── Advice ───────────────────────────────────────────────
  "Buying Guide":         SEARCH_ROUTES.forSale,
  "Renting Tips":         SEARCH_ROUTES.forRent,
  "Legal Help":           ROUTES.search,
  "Market Trends":        ROUTES.search,

  // ── Help ─────────────────────────────────────────────────
  "FAQs":            ROUTES.faqs,
"Contact Us":      ROUTES.contact,
"Report an Issue": ROUTES.about,
};