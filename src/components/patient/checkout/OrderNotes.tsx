"use client";
import React, { useState } from "react";
import { ChevronUp, ChevronDown } from "lucide-react";
import Image from "next/image";

interface Props {
  notes: string;
  onChange: (notes: string) => void;
  maxLength?: number;
}
export function OrderNotes({ notes, onChange, maxLength = 500 }: Props) {
  const [collapsed, setCollapsed] = useState(false);
  return (
    <div className="font-[var(--font-montserrat)]">
      <div
        className={`flex items-center justify-between ${collapsed ? "" : "mb-3"}`}
      >
        <h2 className="text-t-30-semibold text-foreground leading-tight">
          Order Notes
        </h2>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="bg-transparent border-none cursor-pointer p-1 flex items-center text-neutral-dark hover:text-primary transition-colors"
        >
          {collapsed ? <ChevronDown size={20} /> : <ChevronUp size={20} />}
        </button>
      </div>
      <div
        className={`overflow-hidden transition-all duration-300 ${collapsed ? "max-h-0" : "max-h-[200px]"}`}
      >
        <div className="rounded-2xl p-3 border border-neutral-light-active bg-card min-h-[148px]">
          <div className="flex items-start gap-2.5">
            <Image src="/icons/note.png" alt="note" width={24} height={24} />
            <textarea
              value={notes}
              onChange={(e) => onChange(e.target.value)}
              maxLength={maxLength}
              placeholder="Keep a note If You want.."
              className="flex-1 bg-transparent border-none outline-none resize-none text-t-14-semibold text-foreground placeholder:text-muted-foreground placeholder:font-normal leading-tight p-0 min-h-[80px] font-[var(--font-montserrat)]"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
