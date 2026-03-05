export default function ReportSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header */}
      <div className="space-y-2">
        <div className="bg-gray-300 rounded w-64 h-6" />
        <div className="bg-gray-200 rounded w-40 h-4" />
      </div>

      {/* Top Section (Stats + Donut) */}
      <div className="flex flex-wrap md:flex-nowrap gap-4">
        {/* Stats Grid */}
        <div className="gap-4 grid grid-cols-2 grow">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-white p-4 border rounded-xl h-32">
              <div className="bg-gray-200 mb-6 rounded w-1/2 h-4" />
              <div className="bg-gray-300 rounded w-1/3 h-8" />
              <div className="bg-gray-200 mt-2 rounded w-2/3 h-3" />
            </div>
          ))}
        </div>

        {/* Donut Card */}
        <div className="flex flex-col justify-center items-center bg-white p-6 border rounded-xl max-w-full md:max-w-100 h-72 grow">
          <div className="bg-gray-200 rounded-full w-40 h-40" />
          <div className="space-y-2 mt-6 w-full">
            <div className="bg-gray-200 mx-auto rounded w-1/2 h-3" />
            <div className="bg-gray-200 mx-auto rounded w-1/3 h-3" />
          </div>
        </div>
      </div>

      {/* Bottom Section (Weekly + Top Medicine) */}
      <div className="flex md:flex-row flex-col gap-4">
        {/* Weekly Orders Chart */}
        <div className="bg-white p-6 border rounded-xl h-96 grow">
          <div className="bg-gray-200 mx-auto mb-6 rounded w-40 h-4" />

          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="bg-gray-100 rounded w-full h-4" />
            ))}
          </div>
        </div>

        {/* Top Medicine */}
        <div className="bg-white p-6 border rounded-xl max-w-full md:max-w-100 h-96 grow">
          <div className="bg-gray-200 mx-auto mb-8 rounded w-32 h-4" />

          <div className="space-y-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="flex justify-between items-center bg-gray-100 p-3 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div className="bg-gray-300 rounded-lg w-10 h-10" />
                  <div className="bg-gray-200 rounded w-24 h-3" />
                </div>

                <div className="bg-gray-200 rounded w-12 h-3" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
