"use client";

import { Search, Mic, Columns2, ArrowDownUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface TableSearchProps {
  placeholder?: string;
  className?: string;
  value?: string;
  onSearch?: (value: string) => void;
}

export default function TableSearch({
  placeholder = "Search medicine, pharmacy..",
  className,
  value,
  onSearch,
}: TableSearchProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-4 border-b border-border/50 py-4",
        className,
      )}
    >
      {/* Search input */}
      <div className="flex flex-1 items-center gap-2.5 h-12 rounded-3xl bg-secondary-light pl-4 pr-2 py-4">
        <Search className="w-6 h-6 text-neutral shrink-0" />
        <input
          type="text"
          placeholder={placeholder}
          value={value ?? ""}
          onChange={(e) => onSearch?.(e.target.value)}
          className="flex-1 bg-transparent text-[16px] font-medium text-foreground placeholder:text-neutral outline-none min-w-0"
          aria-label="Search table"
        />
        <button
          className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-secondary-light-active transition-colors shrink-0"
          aria-label="Voice search"
        >
          <Mic className="w-5 h-5 text-primary" />
        </button>
      </div>

      {/* Filter icons */}
      <div className="hidden sm:flex items-center gap-3">
        <button
          className="w-12 h-12 flex items-center justify-center rounded-xl border border-primary-light-active hover:bg-primary-light transition-colors"
          aria-label="Toggle columns"
        >
          <Columns2 className="w-4 h-4 text-primary-dark" />
        </button>
        <button
          className="w-12 h-12 flex items-center justify-center rounded-xl border border-primary-light-active hover:bg-primary-light transition-colors"
          aria-label="Sort data"
        >
          <ArrowDownUp className="w-4 h-4 text-primary-dark" />
        </button>
      </div>
    </div>
  );
}
