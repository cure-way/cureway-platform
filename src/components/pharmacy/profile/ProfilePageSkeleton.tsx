"use client";

export default function ProfilePageSkeleton() {
  return (
    <div className="flex gap-8 p-6 animate-pulse">
      {/* Sidebar */}
      <div className="space-y-4 bg-white p-6 rounded-2xl w-72">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-gray-200 rounded w-3/4 h-6" />
        ))}

        <div className="bg-gray-200 mt-6 rounded w-1/2 h-5" />
      </div>

      {/* Main content */}
      <div className="flex-1 space-y-8 max-w-3xl">
        {/* Header */}
        <div className="flex items-center gap-6">
          <div className="bg-gray-200 rounded-full w-28 h-28" />

          <div className="space-y-3">
            <div className="bg-gray-200 rounded w-64 h-6" />
            <div className="bg-gray-200 rounded w-40 h-4" />
          </div>
        </div>

        {/* Pharmacy Info */}
        <div className="space-y-3">
          <div className="bg-gray-200 mb-3 rounded w-40 h-5" />

          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-gray-200 rounded-lg w-full h-16" />
          ))}
        </div>

        {/* Activity */}
        <div className="space-y-3">
          <div className="bg-gray-200 mb-3 rounded w-32 h-5" />

          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="bg-gray-200 rounded-lg w-full h-16" />
          ))}
        </div>
      </div>
    </div>
  );
}
