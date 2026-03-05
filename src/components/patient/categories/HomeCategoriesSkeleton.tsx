export function HomeCategoriesSkeleton() {
  return (
    <div className="gap-4 grid grid-cols-2 md:grid-cols-4 animate-pulse">
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className="flex flex-col gap-4 border border-neutral rounded-2xl overflow-hidden"
        >
          {/* Image block */}
          <div className="flex justify-center items-center bg-linear-to-b from-[#f7f8ff] to-[#dfe5ff] p-3 rounded-2xl w-full h-36 md:h-42.75">
            <div className="bg-gray-300 rounded-xl w-24 md:w-28 h-24 md:h-28" />
          </div>

          {/* Text block */}
          <div className="flex flex-col items-center gap-2 px-2 pb-4">
            <div className="bg-gray-300 rounded w-3/4 h-5" />
            <div className="bg-gray-200 rounded w-2/3 h-4" />
          </div>
        </div>
      ))}
    </div>
  );
}
