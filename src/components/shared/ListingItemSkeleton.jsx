export default function ListingItemSkeleton() {
  return (
    <div className="w-full sm:w-[330px] bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
      {/* Image area */}
      <div className="w-full h-52 bg-gray-200 animate-pulse" />

      {/* Content */}
      <div className="p-4 flex flex-col gap-3">
        {/* Name */}
        <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4" />

        {/* Price */}
        <div className="h-5 bg-gray-200 rounded animate-pulse w-1/2" />

        {/* Beds / Baths */}
        <div className="flex gap-3">
          <div className="h-3 bg-gray-200 rounded animate-pulse w-16" />
          <div className="h-3 bg-gray-200 rounded animate-pulse w-16" />
        </div>

        {/* Address */}
        <div className="h-3 bg-gray-200 rounded animate-pulse w-2/3" />

        {/* Bottom row */}
        <div className="flex justify-between mt-1 pt-2 border-t border-gray-50">
          <div className="h-3 bg-gray-200 rounded animate-pulse w-16" />
          <div className="h-3 bg-gray-200 rounded animate-pulse w-16" />
        </div>
      </div>
    </div>
  );
}
