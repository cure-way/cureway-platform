"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { ReactNode } from "react";
import StatusDropdown from "./StatusDropdown";
import { Column } from "@/types/pharmacyTypes";
import { ROWS_PER_PAGE_OPTIONS } from "@/utils/pharmacyConstants";
export interface DataTableProps<T extends { id: string | number }> {
  data: T[];
  columns: readonly Column<T>[];

  onRowClick?: (row: T) => void;
  renderCell?: (row: T, column: Column<T>) => ReactNode;

  /** Pagination */
  rowsPerPageOptions?: number[];
  defaultRowsPerPage?: number;

  totalItems: number;
  currentPage: number;
  rowsPerPage: number;
  onPageChange: (page: number) => void;
  onRowsPerPageChange: (rows: number) => void;
}

export default function DataTable<T extends { id: string | number }>({
  data,
  columns,
  onRowClick,
  renderCell,
  totalItems,
  currentPage,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
}: DataTableProps<T>) {
  const totalPages = Math.ceil(totalItems / rowsPerPage);
  return (
    <div className="shadow-sm border border-gray-300 rounded-2xl overflow-hidden">
      {/* TABLE */}
      <div>
        <table className="w-full text-sm table-fixed">
          <thead className="top-0 z-10 sticky bg-gray-100">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.header}
                  className={`px-5 py-4 font-medium text-(--color-primary) text-left
                    ${col.hideOnMobile ? "hidden sm:table-cell" : ""}
                  `}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {data.map((row, index) => (
              <tr
                key={row.id}
                onClick={() => onRowClick?.(row)}
                className={`border-t border-gray-200 transition
                  ${index % 2 === 0 ? "bg-gray-50" : "bg-white"}
                  ${onRowClick ? "cursor-pointer hover:bg-gray-100" : ""}
                `}
              >
                {columns.map((col) => (
                  <td
                    key={String(col.key)}
                    className={`px-5 py-3.5 align-middle
                    ${col.hideOnMobile ? "hidden sm:table-cell" : ""}
                  `}
                  >
                    {renderCell
                      ? renderCell(row, col)
                      : String(row[col.key as keyof T])}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* FOOTER */}
      <div className="flex sm:flex-row flex-col flex-wrap justify-between items-center gap-4 px-5 py-4 border-gray-300 border-t">
        <div className="flex items-center gap-2 text-gray-700 text-sm">
          <span className="text-(--color-primary) font-medium">
            Rows per page
          </span>

          <StatusDropdown
            options={ROWS_PER_PAGE_OPTIONS}
            direction="up"
            value={String(rowsPerPage)}
            onChange={(value) => onRowsPerPageChange(Number(value))}
          />
        </div>

        <div className="flex gap-2">
          <button
            disabled={currentPage === 1}
            onClick={() => onPageChange(currentPage - 1)}
            className="disabled:opacity-50 p-2 border border-gray-300 rounded-lg"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {Array.from({ length: totalPages }).map((_, i) => {
            const p = i + 1;
            return (
              <button
                key={p}
                onClick={() => onPageChange(p)}
                className={`h-9 w-9 rounded-lg text-sm font-medium ${
                  p === currentPage
                    ? "bg-(--color-primary) text-white"
                    : "border border-gray-300 text-(--color-primary) hover:bg-gray-100"
                }`}
              >
                {p}
              </button>
            );
          })}

          <button
            disabled={currentPage === totalPages}
            onClick={() => onPageChange(currentPage + 1)}
            className="disabled:opacity-50 p-2 border border-gray-300 rounded-lg"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
