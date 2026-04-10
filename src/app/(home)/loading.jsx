import ListingItemSkeleton from "@/components/shared/ListingItemSkeleton";

export default function HomeLoading() {
  return (
    <div className="flex flex-col gap-6 pt-6 px-3 w-full mx-auto">
      {/* Search bar skeleton */}
      <div className="h-12 bg-gray-200 rounded-xl animate-pulse max-w-2xl mx-auto w-full" />

      {/* Listing sections */}
      {[...Array(3)].map((_, s) => (
        <div key={s}>
          <div className="my-3 flex flex-col gap-2">
            <div className="h-6 w-48 bg-gray-200 rounded animate-pulse" />
            <div className="h-3 w-24 bg-gray-200 rounded animate-pulse" />
          </div>
          <div className="flex flex-wrap gap-4">
            {[...Array(4)].map((_, i) => (
              <ListingItemSkeleton key={i} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
