type TableSkeletonProps = {
  columns: number;
  rows?: number;
};

export default function TableSkeleton({
  columns,
  rows = 6,
}: TableSkeletonProps) {
  return (
    <div className="bg-white border rounded-xl overflow-hidden">
      {/* Header */}
      <div
        className="gap-4 grid bg-gray-50 px-6 py-4 border-b"
        style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
      >
        {Array.from({ length: columns }).map((_, i) => (
          <div
            key={`header-${i}`}
            className="bg-gray-200 rounded h-4 animate-pulse"
          />
        ))}
      </div>

      {/* Rows */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div
          key={`row-${rowIndex}`}
          className="gap-4 grid px-6 py-4 border-b last:border-none"
          style={{
            gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
          }}
        >
          {Array.from({ length: columns }).map((_, colIndex) => {
            // Make last column look like action button
            if (colIndex === columns - 1) {
              return (
                <div
                  key={`cell-${rowIndex}-${colIndex}`}
                  className="bg-gray-200 rounded-md w-8 h-8 animate-pulse"
                />
              );
            }

            // Make one column look like status badge
            if (colIndex === columns - 2) {
              return (
                <div
                  key={`cell-${rowIndex}-${colIndex}`}
                  className="bg-gray-200 rounded-full w-20 h-6 animate-pulse"
                />
              );
            }

            return (
              <div
                key={`cell-${rowIndex}-${colIndex}`}
                className="bg-gray-200 rounded h-4 animate-pulse"
              />
            );
          })}
        </div>
      ))}
    </div>
  );
}
