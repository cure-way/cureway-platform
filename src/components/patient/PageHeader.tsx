"use client";

import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
}

export function PageHeader({ title, subtitle }: PageHeaderProps) {
  const router = useRouter();

  return (
    <div className="flex flex-col gap-3 w-full">
      <div className="flex items-center justify-between gap-12">
        <h1 className="text-t-36 font-bold text-black leading-[1.2]">
          {title}
        </h1>
        <button
          type="button"
          onClick={() => router.back()}
          className="flex items-center gap-2 shrink-0 hover:opacity-70 transition-opacity"
          aria-label="Go back"
        >
          <ChevronLeft className="w-6 h-6 text-black" />
          <span className="text-t-21 font-bold text-black">Back</span>
        </button>
      </div>
      {subtitle && (
        <p className="text-t-21 font-semibold text-black/60 leading-[1.2]">
          {subtitle}
        </p>
      )}
    </div>
  );
}
