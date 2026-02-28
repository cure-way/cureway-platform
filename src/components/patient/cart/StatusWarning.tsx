import React from "react";

interface Props {
  message?: string;
}

export default function StatusWarning({ message }: Props) {
  return (
    <div className="w-full p-3 mb-4 flex flex-col gap-2 font-[var(--font-montserrat)]">
      <div className="flex items-center justify-between bg-warning-light p-3 rounded-xl">
        <div className="flex items-center gap-2 h-11">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-foreground flex-shrink-0"
          >
            <path d="M3 2v6h6" />
            <path d="M3 8C5.5 4.5 9.5 2 14 2c5.5 0 10 4.5 10 10s-4.5 10-10 10c-4.5 0-8.5-2.5-10-6" />
          </svg>
          <span className="text-t-21-semibold text-foreground">Status</span>
        </div>
        <span className="text-t-14 text-warning-dark">
          Prescription under review
        </span>
      </div>

      <p className="text-t-14 text-neutral-dark pl-1">
        {message ??
          "You can place the order now, prescription items will be processed after approval"}
      </p>
    </div>
  );
}
