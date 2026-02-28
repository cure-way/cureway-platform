import React from "react";

export default function CartTableHeader() {
  return (
    <div className="hidden md:flex items-center pb-3 mb-4 border-b border-border font-[var(--font-montserrat)]">
      <div className="flex-1">
        <span className="text-t-17 text-muted-foreground font-medium tracking-wide">
          PRODUCT
        </span>
      </div>

      <div className="w-36 text-center">
        <span className="text-t-17 text-muted-foreground font-medium tracking-wide">
          QUANTITY
        </span>
      </div>

      <div className="w-36 text-center">
        <span className="text-t-17 text-muted-foreground font-medium tracking-wide">
          UNIT PRICE
        </span>
      </div>

      <div className="w-36 text-center">
        <span className="text-t-17 text-muted-foreground font-medium tracking-wide">
          TOTAL
        </span>
      </div>
    </div>
  );
}
