import { ReactNode } from "react";
import type { Column } from "@/types/pharmacyTypes";

interface SimpleTableProps<T extends { id: string | number }> {
  data: T[];
  columns: readonly Column<T>[];
  onRowClick?: (row: T) => void;
  renderCell?: (row: T, column: Column<T>) => ReactNode;
}

export default function SimpleTable<T extends { id: string | number }>({
  data,
  columns,
  onRowClick,
  renderCell,
}: SimpleTableProps<T>) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-gray-500 text-xs uppercase tracking-wide">
            {columns.map((col) => (
              <th
                key={String(col.key)}
                className={`text-left py-2 ${
                  col.hideOnMobile ? "hidden md:table-cell" : ""
                }`}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {data.map((row) => (
            <tr
              key={row.id}
              onClick={() => onRowClick?.(row)}
              className={`border-t hover:bg-gray-50 ${
                onRowClick ? "cursor-pointer" : ""
              }`}
            >
              {columns.map((col) => (
                <td
                  key={String(col.key)}
                  className={`py-3 ${
                    col.hideOnMobile ? "hidden md:table-cell" : ""
                  }`}
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
  );
}
