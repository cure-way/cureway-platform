"use client";

import { MoreHorizontal } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import TableSearch from "./TableSearch";
import TablePagination from "./TablePagination";
import { tableRowVariants } from "./motion";

/* ── Column definition ── */

export interface ColumnDef<TData> {
  /** Unique column identifier */
  id: string;
  /** Header label text */
  header: string;
  /**
   * Sizing class(es) applied to the column wrapper.
   * Default: "flex-1"
   * Examples: "flex-1", "flex-1 min-w-65", "flex-1 min-w-50"
   */
  className?: string;
  /** Render cell content for a given row */
  cell: (row: TData) => React.ReactNode;
}

/* ── DataTable props ── */

export interface DataTableProps<TData> {
  data: TData[];
  /**
   * Column definitions. The **first** column is treated as the ID column
   * and rendered alongside the row checkbox.
   */
  columns: ColumnDef<TData>[];
  /** Unique key for each row (used for React keys) */
  getRowId: (row: TData, index: number) => string;
  /** Human-readable row label (used for aria-labels) */
  getRowLabel: (row: TData) => string;
  /** Search bar placeholder */
  searchPlaceholder?: string;
  /** "Select all" checkbox aria-label */
  selectAllLabel?: string;
  /** Min-width utility class for the scrollable container. Default: "min-w-225" */
  minWidthClass?: string;
  currentPage?: number;
  totalPages?: number;
  rowsPerPage?: number;
  onPageChange?: (page: number) => void;
  onRowsPerPageChange?: (rows: number) => void;
  /** Controlled search value */
  searchValue?: string;
  /** Search callback */
  onSearch?: (value: string) => void;
  /** Loading state */
  loading?: boolean;
}

/**
 * Generic admin data table card.
 *
 * Renders a white card with: search toolbar → rounded table container
 * (header + rows with checkbox + actions) → pagination.
 *
 * Matches the canonical /admin/patients layout exactly.
 */
export default function DataTable<TData>({
  data,
  columns,
  getRowId,
  getRowLabel,
  searchPlaceholder = "Search...",
  selectAllLabel = "Select all",
  minWidthClass = "min-w-225",
  currentPage = 1,
  totalPages = 3,
  rowsPerPage = 10,
  onPageChange,
  onRowsPerPageChange,
  searchValue,
  onSearch,
  loading = false,
}: DataTableProps<TData>) {
  // First column = ID column (rendered with checkbox)
  const [idCol, ...contentCols] = columns;
  const shouldReduce = useReducedMotion();

  return (
    <div className="bg-white border border-border rounded-[20px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] pb-4 px-4">
      <TableSearch
        placeholder={searchPlaceholder}
        value={searchValue}
        onSearch={onSearch}
      />

      <div className="overflow-x-auto">
        <div
          className={`${minWidthClass} rounded-2xl border border-neutral-light-active overflow-hidden`}
        >
          {/* ── Header Row ── */}
          <div className="flex items-center h-14 bg-secondary-light border-t-2 border-secondary px-4 py-3 rounded-t-2xl">
            {/* ID column header (with checkbox) */}
            <div
              className={`flex items-center gap-2 ${idCol.className ?? "flex-1"}`}
            >
              <input
                type="checkbox"
                className="w-4 h-4 rounded accent-primary"
                aria-label={selectAllLabel}
              />
              <span className="text-[14px] leading-[1.2] font-semibold text-[#393737]">
                {idCol.header}
              </span>
            </div>

            {/* Content column headers */}
            {contentCols.map((col) => (
              <span
                key={col.id}
                className={`${col.className ?? "flex-1"} text-[14px] leading-[1.2] font-semibold text-[#393737]`}
              >
                {col.header}
              </span>
            ))}

            {/* Actions column header (visually hidden) */}
            <span className="w-13.75 text-[14px] leading-[1.2] font-semibold text-[#393737] opacity-0">
              Actions
            </span>
          </div>

          {/* ── Body Rows ── */}
          <div>
            {loading ? (
              <div className="flex items-center justify-center h-40 text-[14px] leading-[1.2] font-medium text-neutral">
                <div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full" />
              </div>
            ) : data.length === 0 ? (
              <div className="flex items-center justify-center h-40 text-[14px] leading-[1.2] font-medium text-neutral">
                No results found
              </div>
            ) : (
              data.map((row, idx) => (
                <motion.div
                  key={getRowId(row, idx)}
                  initial={shouldReduce ? false : "hidden"}
                  animate={shouldReduce ? undefined : "visible"}
                  variants={shouldReduce ? undefined : tableRowVariants}
                  className={`flex items-center h-16 px-4 py-3 border-t border-border transition-colors hover:bg-secondary-light/30 ${
                    idx % 2 === 1 ? "bg-neutral-light" : ""
                  }`}
                >
                  {/* ID cell (with checkbox) */}
                  <div
                    className={`flex items-center gap-0.5 ${idCol.className ?? "flex-1"}`}
                  >
                    <input
                      type="checkbox"
                      className="w-4 h-4 rounded accent-primary"
                      aria-label={`Select ${getRowLabel(row)}`}
                    />
                    {idCol.cell(row)}
                  </div>

                  {/* Content cells */}
                  {contentCols.map((col) => (
                    <div key={col.id} className={col.className ?? "flex-1"}>
                      {col.cell(row)}
                    </div>
                  ))}

                  {/* Actions cell */}
                  <div className="w-13.75 flex justify-end">
                    <button
                      className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-neutral-light transition-colors"
                      aria-label={`Actions for ${getRowLabel(row)}`}
                    >
                      <MoreHorizontal className="w-5 h-5 text-neutral-dark" />
                    </button>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </div>

      <TablePagination
        currentPage={currentPage}
        totalPages={totalPages}
        rowsPerPage={rowsPerPage}
        onPageChange={onPageChange}
        onRowsPerPageChange={onRowsPerPageChange}
        className="pt-3"
      />
    </div>
  );
}
