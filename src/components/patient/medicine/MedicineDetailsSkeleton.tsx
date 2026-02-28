export default function MedicineDetailsSkeleton() {
  return (
    <div className="bg-gray-50 pb-12 min-h-screen">
      <div className="space-y-8 mx-auto px-4 sm:px-6 py-8 max-w-5xl">
        <div className="bg-white shadow-sm p-6 sm:p-8 border border-gray-200 rounded-2xl animate-pulse">
          <div className="gap-8 grid grid-cols-1 lg:grid-cols-2">
            {/* Image */}
            <div className="bg-gray-200 border border-gray-200 rounded-xl w-full aspect-square" />

            {/* Right Content */}
            <div className="space-y-6">
              {/* Title Section */}
              <div className="space-y-3">
                <div className="bg-gray-200 rounded w-3/4 h-8" />
                <div className="bg-gray-200 rounded w-1/2 h-4" />
                <div className="bg-gray-200 rounded w-1/3 h-4" />
              </div>

              {/* Price */}
              <div className="bg-gray-200 rounded w-1/4 h-10" />

              {/* Badges */}
              <div className="flex flex-wrap gap-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="bg-gray-200 rounded-lg w-24 h-8" />
                ))}
              </div>

              {/* Quantity */}
              <div className="space-y-3">
                <div className="bg-gray-200 rounded w-20 h-4" />

                <div className="flex items-center gap-3">
                  <div className="bg-gray-200 rounded-lg w-10 h-10" />
                  <div className="bg-gray-200 rounded w-12 h-6" />
                  <div className="bg-gray-200 rounded-lg w-10 h-10" />
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <div className="bg-gray-200 rounded-lg w-full h-14" />
                <div className="bg-gray-200 rounded-lg w-32 h-14" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
