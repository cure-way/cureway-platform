export default function PharmacyMedicineDetailsSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header Skeleton */}
      <div className="space-y-3 bg-white p-6 border rounded-xl">
        <div className="bg-gray-200 rounded w-1/3 h-6" />
        <div className="bg-gray-200 rounded w-1/4 h-4" />
      </div>

      {/* Main Grid */}
      <div className="gap-6 grid grid-cols-1 lg:grid-cols-[2fr_1fr]">
        {/* Left Info Card */}
        <div className="space-y-4 bg-white p-6 border rounded-xl">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-gray-200 rounded h-4" />
          ))}
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          <div className="space-y-4 bg-white p-6 border rounded-xl">
            <div className="bg-gray-200 rounded w-1/2 h-4" />
            <div className="bg-gray-200 rounded h-10" />
            <div className="bg-gray-200 rounded h-10" />
          </div>

          <div className="space-y-4 bg-white p-6 border rounded-xl">
            <div className="bg-gray-200 rounded w-1/3 h-4" />
            <div className="bg-gray-200 rounded h-4" />
            <div className="bg-gray-200 rounded h-4" />
          </div>
        </div>
      </div>
    </div>
  );
}
