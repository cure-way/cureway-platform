export function ProductGridSkeleton() {
  return (
    <div className="gap-4 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="relative flex flex-col bg-white border border-primary-light-active rounded-[20px] w-full min-w-40 h-70 md:h-80 overflow-hidden animate-pulse"
        >
          {/* Image area */}
          <div className="relative flex justify-center items-center bg-linear-to-b from-[#f7f8ff] to-[#dfe5ff] mx-2 mt-2 rounded-[20px] h-32 md:h-37.25">
            <div className="bg-gray-300 rounded-xl w-24 md:w-28 h-24 md:h-28" />
          </div>

          {/* Details */}
          <div className="flex flex-col flex-1 gap-3 px-3 md:px-4 pt-3 pb-1">
            {/* Title */}
            <div className="bg-gray-300 rounded w-3/4 h-4" />

            {/* Subtitle */}
            <div className="bg-gray-200 rounded w-2/3 h-3" />

            {/* Dosage */}
            <div className="bg-gray-200 rounded w-1/2 h-3" />

            {/* Price */}
            <div className="flex items-center gap-2 mt-2">
              <div className="bg-gray-300 rounded w-16 h-4" />
              <div className="bg-gray-200 rounded w-12 h-3" />
            </div>
          </div>

          {/* Button */}
          <div className="px-3 pb-3">
            <div className="bg-gray-300 rounded-xl w-full h-10" />
          </div>
        </div>
      ))}
    </div>
  );
}
