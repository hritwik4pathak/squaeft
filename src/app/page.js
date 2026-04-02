import ListingItems from "@/components/listingitem";
import Image from "next/image";
import Link from "next/link";
export default async function Home() {
  let rentlistings = null;
  try {
    const result = await fetch(process.env.BASE_URL+ '/api/listing/get', {
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
    const result = await fetch(process.env.BASE_URL+ '/api/listing/get', {
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
    const result = await fetch(process.env.BASE_URL+ '/api/listing/get', {
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
    <div className="flex flex-col gap-6 p-28 px-3 w-full mx-auto">
      <div className="relative w-full h-96 mb-6 overflow-hidden">
        <Image
          src="/Assets/home-page.png"
          alt="Home background"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0  bg-opacity-20"></div>
        <h1
          className="absolute top-8 left-8 z-20 text-slate-700 font-bold text-3xl lg:text-6xl drop-shadow-lg"
        >
          Find Your <span className="text-slate-300">Dream</span>
          <br />
          Home with ease
        </h1>
        <div className="relative z-10 text-center px-6 flex flex-col items-center justify-center h-full">
          <div className="text-green-800 mt-53 text-xs sm:text-sm font-semibold drop-shadow-lg">
            (.....) is the best place to find your dream home.
            <br />
            We have a wide range of listings for rent and sale, as well as special offers.
            <br /> Whether looking for a cozy apartment or a spacious house, we have something for everyone.
          </div>
          <Link
            href={'/search'}
            className="mt-4 inline-block text-xs sm:text-sm text-white font-bold hover:underline bg-orange-500 bg-opacity-80 px-4 py-2 rounded"
          >
            Let&apos;s find your dream home
          </Link>
        </div>
      </div>

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
    