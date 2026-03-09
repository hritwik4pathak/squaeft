import ListingItems from "@/components/listingitem";
import Link from "next/link";
export default async function Home() {
  let rentlistings = null;
  try {
    const result = await fetch(process.env.URL+ '/api/listing/get', {
        method: 'POST',
        body : JSON.stringify({
            type: 'rent',
            limit: 4,
            order: 'asc'
        }),
        cache: 'no-store',
    });
    const data = await result.json();
    rentlistings = data;
  }catch (error) {
    rentlistings = {title: 'Failed to load listings'};
  }
  let salelistings = null;
  try {
    const result = await fetch(process.env.URL+ '/api/listing/get', {
        method: 'POST',
        body : JSON.stringify({
            type: 'sale',
            limit: 4,
            order: 'asc'
        }),
        cache: 'no-store',
    });
    const data = await result.json();
    salelistings = data;
  }
  catch (error) {
    salelistings = {title: 'Failed to load listings'};
  }
  let offlistings = null;
  try {
    const result = await fetch(process.env.URL+ '/api/listing/get', {
        method: 'POST',
        body : JSON.stringify({
            offer: true,
            limit: 4,
            order: 'asc'
        }),
        cache: 'no-store',
    });
    const data = await result.json();
    offlistings = data;
  }
  catch (error) {
    offlistings = {title: 'Failed to load listings'};
  }
  return (
    <div className="flex flex-col gap-6 p-28 px-3 max-w-6xl mx-auto">
      <h1 className="text-slate-700 font-bold text-3xl lg:text-6xl">
        Find Your <span className="text-slate-500">Dream</span>
        <br />
        Home with ease
      </h1>
      <div className="text-gray-400 text-xs sm:text-sm">
        (.....) is the best place to find your dream home.
        <br />
        We have a wide range of listings for rent and sale, as well as special offers.
        <br /> Whether looking for a cozy apartment or a spacious house, we have something for everyone.
      </div>
      <Link
        href={'/search'}
        className="text-xs sm:text-sm text-blue-800 font-bold hover:underline"
      >
        Let&apos;s find your dream home
      </Link>
      <img
        src="https://images.unsplash.com/photo-1501183638714-841dd81dca9e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aG91c2V8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60"
        className="w-full h-[550px] object-cover "
        alt="House"
      />

      {offlistings && offlistings.length > 0 && (
        <div>
          <div className="my-3">
            <h2 className="text-2xl font-semibold text-slate-600">
              Rent Offers
            </h2>
            <Link
              className="text-sm text-blue-800 hover:underline"
              href={'/search?offer=true'}
            >
              Show more Listings
            </Link>
          </div>
          <div className="flex flex-wrap gap-4">
            {offlistings.map((listing) => (
              <ListingItems key={listing.id} listing={listing} />
            ))}
          </div>
        </div>
      )}

      {rentlistings && rentlistings.length > 0 && (
        <div>
          <div className="my-3">
            <h2 className="text-2xl font-semibold text-slate-600">
              Recent place for Rent
            </h2>
            <Link
              className="text-sm text-blue-800 hover:underline"
              href={'/search?type=rent'}
            >
              Show more places for Listings
            </Link>
          </div>
          <div className="flex flex-wrap gap-4">
            {rentlistings.map((listing) => (
              <ListingItems key={listing.id} listing={listing} />
            ))}
          </div>
        </div>
      )}

      {salelistings && salelistings.length > 0 && (
        <div>
          <div className="my-3">
            <h2 className="text-2xl font-semibold text-slate-600">
              Recent place for Sale
            </h2>
            <Link
              className="text-sm text-blue-800 hover:underline"
              href={'/search?type=sale'}
            >
              Show more places for Listings
            </Link>
          </div>
          <div className="flex flex-wrap gap-4">
            {salelistings.map((listing) => (
              <ListingItems key={listing.id} listing={listing} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 
    