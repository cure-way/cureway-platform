"use client";
import Image from "next/image";
import React, { useState, useEffect } from "react";

interface Props {
  onApply: (
    code: string,
  ) => Promise<{ discountValue: number; discountType: string } | void>;
  onRemove?: () => void;
  appliedCode?: string;
  discountPercent?: number;
}
type CouponState = "idle" | "typing" | "loading" | "applied";

export function CouponInput({
  onApply,
  onRemove,
  appliedCode,
  discountPercent,
}: Props) {
  const [code, setCode] = useState(appliedCode ?? "");
  const [isLocalLoading, setIsLocalLoading] = useState(false);


  let currentState: CouponState = "idle";
  
  if (isLocalLoading) {
    currentState = "loading";
  } else if (appliedCode) {
    currentState = "applied";
  } else if (code.trim()) {
    currentState = "typing";
  }

  
  useEffect(() => {
    if (!appliedCode) {
      setCode("");
    } else {
      setCode(appliedCode);
    }
  }, [appliedCode]);

  const handleChange = (val: string) => {
    const upper = val.toUpperCase();
    setCode(upper);
  };

  const handleApply = async () => {
    if (!code.trim() || isLocalLoading) return;
    setIsLocalLoading(true);
    try {
      await onApply(code.trim());
    } catch (err) {
      console.error("Failed to apply coupon", err);
    } finally {
      setIsLocalLoading(false);
    }
  };

  const handleRemove = () => {
    setCode("");
    onRemove?.();
  };

  const containerCls = [
    "flex items-center gap-2 rounded-2xl border transition-all",
    currentState === "typing" || currentState === "loading"
      ? "h-16 border-foreground px-4 py-3"
      : currentState === "applied"
        ? "h-16 border-success-light-active bg-accent px-4 py-3"
        : "h-[52px] border-border px-2.5 py-2",
    "bg-card",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className="font-[var(--font-montserrat)]">
      <div className={containerCls}>
        <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0">
          <Image src="/icons/coupon.png" alt="coupon" width={24} height={24} />
        </div>
        <input
          type="text"
          value={code}
          onChange={(e) => handleChange(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleApply()}
          placeholder="Enter your coupon"
          disabled={currentState === "loading" || currentState === "applied"}
          className={`flex-1 border-none outline-none bg-transparent text-t-14 min-w-0 font-[var(--font-montserrat)] ${currentState === "applied" ? "text-foreground font-semibold" : "text-neutral-dark"}`}
        />
        
        {currentState === "idle" && (
          <button className="bg-neutral text-card rounded-lg px-3.5 py-1.5 text-t-12 font-medium flex-shrink-0 cursor-default">
            Apply
          </button>
        )}
        
        {currentState === "typing" && (
          <button
            onClick={handleApply}
            className="w-[68px] h-10 bg-primary text-card rounded-xl text-t-14-semibold flex-shrink-0 hover:bg-primary-hover transition-colors border-none cursor-pointer"
          >
            Apply
          </button>
        )}
        
        {currentState === "loading" && (
          <button
            disabled
            className="w-14 h-10 bg-secondary rounded-xl flex items-center justify-center flex-shrink-0 border-none cursor-not-allowed"
          >
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          </button>
        )}
        
        {currentState === "applied" && (
          <button
            onClick={handleRemove}
            className="w-[104px] h-10 bg-success-light-active rounded-xl flex items-center justify-center gap-1.5 flex-shrink-0 border-none cursor-pointer"
          >
            <span className="text-t-12 font-medium text-success-darker whitespace-nowrap">
              Applied
            </span>
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              className="text-success-darker"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M2 12l7 7L22 5" />
            </svg>
          </button>
        )}
      </div>
      
      {currentState === "applied" && discountPercent !== undefined && (
        <p className="text-t-14 text-neutral flex items-center gap-1.5 mt-2">
          <span className="text-base text-neutral">•</span>
          {"This Promo code will save "}{discountPercent}%
        </p>
      )}
    </div>
  );
}