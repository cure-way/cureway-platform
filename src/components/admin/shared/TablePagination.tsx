"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface TablePaginationProps {
  currentPage: number;
  totalPages: number;
  rowsPerPage: number;
  onPageChange?: (page: number) => void;
  onRowsPerPageChange?: (rows: number) => void;
  className?: string;
}

export default function TablePagination({
  currentPage,
  totalPages,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
  className,
}: TablePaginationProps) {
  const pages = Array.from(
    { length: Math.min(totalPages, 3) },
    (_, i) => i + 1,
  );

  return (
    <div
      className={cn(
        "flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-3",
        className,
      )}
    >
      {/* Rows per page */}
      <div className="flex items-center gap-2 text-t-17 text-[#393737]">
        <span className="font-medium">Row per page</span>
        <button
          onClick={() => onRowsPerPageChange?.(rowsPerPage)}
          className="flex items-center gap-2 px-3 py-3 border border-primary-light-active rounded-xl text-primary font-medium"
          aria-label={`Rows per page: ${rowsPerPage}`}
        >
          {rowsPerPage}
          <ChevronRight className="w-4 h-4 rotate-90" />
        </button>
        <span className="font-medium">Entries</span>
      </div>

      {/* Page navigation */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange?.(currentPage - 1)}
          disabled={currentPage <= 1}
          className="w-11 h-11 flex items-center justify-center rounded-lg hover:bg-neutral-light transition-colors disabled:opacity-40"
          aria-label="Previous page"
        >
          <ChevronLeft className="w-4 h-4 text-primary" />
        </button>

        <div className="flex items-center gap-1">
          {pages.map((page) => (
            <button
              key={page}
              onClick={() => onPageChange?.(page)}
              className={cn(
                "w-11 h-11 flex items-center justify-center rounded-lg text-t-14-semibold transition-colors",
                page === currentPage
                  ? "bg-primary text-white"
                  : "border border-primary-light-active text-primary font-medium hover:bg-primary-light",
              )}
              aria-current={page === currentPage ? "page" : undefined}
            >
              {page}
            </button>
          ))}
        </div>

        <button
          onClick={() => onPageChange?.(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className="w-11 h-11 flex items-center justify-center rounded-lg hover:bg-neutral-light transition-colors disabled:opacity-40"
          aria-label="Next page"
        >
          <ChevronRight className="w-4 h-4 text-primary" />
        </button>
      </div>
    </div>
  );
}
