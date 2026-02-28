"use client";

import React from "react";

interface Props {
  onClick: () => void;
}

export default function AddProductButton({ onClick }: Props) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-4 p-4 rounded-2xl border border-dashed border-border hover:border-primary hover:bg-accent transition-all group mt-2 font-[var(--font-montserrat)]"
    >
      <div className="w-10 h-10 rounded-full border-2 border-border group-hover:border-primary flex items-center justify-center flex-shrink-0 transition-colors">
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          className="text-muted-foreground group-hover:text-primary transition-colors"
        >
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
      </div>

      <div className="text-left">
        <p className="text-t-17-semibold text-foreground group-hover:text-primary transition-colors">
          Add another Product
        </p>
        <p className="text-t-14 text-muted-foreground">
          Choose from your saved products
        </p>
      </div>
    </button>
  );
}
