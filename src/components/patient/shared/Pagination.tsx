"use client";

interface Props {
  currentPage: number;
  totalPages?: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  currentPage,
  totalPages = 1,
  onPageChange,
}: Props) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex justify-center items-center gap-2">
      {pages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`px-4 py-2 rounded-lg border text-sm ${
            page === currentPage
              ? "bg-(--color-primary) text-white border-(--color-primary)"
              : "border-gray-300 hover:bg-gray-100"
          }`}
        >
          {page}
        </button>
      ))}
    </div>
  );
}
