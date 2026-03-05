import React from "react";

interface Props {
  quantity: number;
  onIncrease: () => void;
  onDecrease: () => void;
}

export default function QuantityControl({ quantity, onIncrease, onDecrease }: Props) {
  return (
    <div className="w-28 md:w-36 flex justify-center flex-shrink-0">
      <div className="flex items-center gap-4">
        <button
          onClick={onDecrease}
          disabled={quantity <= 1}
          className="w-8 h-8 rounded-full bg-primary-light flex items-center justify-center transition-opacity disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary-light-hover"
        >
          <div className="w-3 h-0.5 bg-primary" />
        </button>

        <span className="text-t-25 font-medium text-foreground min-w-[20px] text-center font-[var(--font-montserrat)]">
          {quantity}
        </span>

        <button
          onClick={onIncrease}
          className="w-8 h-8 rounded-full bg-primary-light flex items-center justify-center hover:bg-primary-light-hover transition-colors"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="hsl(var(--primary))"
            strokeWidth="2.5"
          >
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </button>
      </div>
    </div>
  );
}
