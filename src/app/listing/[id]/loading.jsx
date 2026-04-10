export default function ListingLoading() {
  return (
    <main>
      <div>
        {/* Hero image skeleton */}
        <div className="relative w-full h-[400px] bg-gray-200 animate-pulse" />

        <div className="flex flex-col max-w-4xl mx-auto p-3 my-7 gap-4">
          {/* Title / price */}
          <div className="h-8 w-3/4 bg-gray-200 rounded animate-pulse" />

          {/* Address */}
          <div className="h-4 w-1/2 bg-gray-200 rounded animate-pulse" />

          {/* Badges */}
          <div className="flex gap-4">
            <div className="h-8 w-24 bg-gray-200 rounded animate-pulse" />
            <div className="h-8 w-28 bg-gray-200 rounded animate-pulse" />
          </div>

          {/* Description */}
          <div className="flex flex-col gap-2">
            <div className="h-4 bg-gray-200 rounded animate-pulse" />
            <div className="h-4 bg-gray-200 rounded animate-pulse w-5/6" />
            <div className="h-4 bg-gray-200 rounded animate-pulse w-4/6" />
          </div>

          {/* Amenities */}
          <div className="flex gap-4 flex-wrap">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-5 w-20 bg-gray-200 rounded animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
