export function OrdersSummarySkeleton() {
  return (
    <div className="gap-4 grid sm:grid-cols-2 mb-6 animate-pulse">
      {Array.from({ length: 2 }).map((_, i) => (
        <div
          key={i}
          className="flex items-center gap-4 bg-white p-4 border rounded-xl"
        >
          <div className="bg-gray-200 rounded-lg w-10 h-10" />

          <div className="flex-1 space-y-2">
            <div className="bg-gray-200 rounded w-24 h-3" />
            <div className="bg-gray-300 rounded w-16 h-5" />
          </div>
        </div>
      ))}
    </div>
  );
}
