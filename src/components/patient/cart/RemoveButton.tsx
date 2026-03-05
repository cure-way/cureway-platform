import React from "react";

interface Props {
  onRemove: () => void;
}

export default function RemoveButton({ onRemove }: Props) {
  return (
    <button
      onClick={onRemove}
      className="w-full h-11 flex items-center gap-3 bg-card border border-border rounded-xl px-4 text-t-14 text-muted-foreground hover:text-primary transition-colors cursor-pointer font-[var(--font-montserrat)]"
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M2 4h12M5.333 4V2.667a1.333 1.333 0 0 1 1.334-1.334h2.666a1.333 1.333 0 0 1 1.334 1.334V4m2 0v9.333a1.333 1.333 0 0 1-1.334 1.334H4.667a1.333 1.333 0 0 1-1.334-1.334V4h9.334Z" />
      </svg>
      Remove
    </button>
  );
}
