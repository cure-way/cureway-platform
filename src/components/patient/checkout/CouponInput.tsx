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
  const [state, setState] = useState<CouponState>(
    appliedCode ? "applied" : "idle",
  );

  useEffect(() => {
    if (!appliedCode) {
      setState("idle");
      setCode("");
    } else {
      setState("applied");
      setCode(appliedCode);
    }
  }, [appliedCode]);

  const handleChange = (val: string) => {
    const upper = val.toUpperCase();
    setCode(upper);
    setState(upper.trim() ? "typing" : "idle");
  };

  const handleApply = async () => {
    if (!code.trim() || state === "loading") return;
    setState("loading");
    try {
      await onApply(code.trim());
      setState("applied");
    } catch {
      setState(code.trim() ? "typing" : "idle");
    }
  };

  const handleRemove = () => {
    setCode("");
    setState("idle");
    onRemove?.();
  };

  const containerCls = [
    "flex items-center gap-2 rounded-2xl border transition-all",
    state === "typing" || state === "loading"
      ? "h-16 border-foreground px-4 py-3"
      : state === "applied"
        ? "h-16 border-success-light-active bg-accent px-4 py-3"
        : "h-[52px] border-border px-2.5 py-2",
    "bg-card",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className="font-[var(--font-montserrat)]">
      <div className={containerCls}>
        {/* Ticket icon */}
        <div className="w-9 h-9 rounded-lg  flex items-center justify-center flex-shrink-0">
          <Image src="/icons/coupon.png" alt="coupon" width={24} height={24} />
        </div>
        <input
          type="text"
          value={code}
          onChange={(e) => handleChange(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleApply()}
          placeholder="Enter your coupon"
          disabled={state === "loading" || state === "applied"}
          className={`flex-1 border-none outline-none bg-transparent text-t-14 min-w-0 font-[var(--font-montserrat)] ${state === "applied" ? "text-foreground font-semibold" : "text-neutral-dark"}`}
        />
        {state === "idle" && (
          <button className="bg-neutral text-card rounded-lg px-3.5 py-1.5 text-t-12 font-medium flex-shrink-0 cursor-default">
            Apply
          </button>
        )}
        {state === "typing" && (
          <button
            onClick={handleApply}
            className="w-[68px] h-10 bg-primary text-card rounded-xl text-t-14-semibold flex-shrink-0 hover:bg-primary-hover transition-colors border-none cursor-pointer"
          >
            Apply
          </button>
        )}
        {state === "loading" && (
          <button
            disabled
            className="w-14 h-10 bg-secondary rounded-xl flex items-center justify-center flex-shrink-0 border-none cursor-not-allowed"
          >
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          </button>
        )}
        {state === "applied" && (
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
              stroke="hsl(var(--success-darker))"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M2 12l7 7L22 5" />
              <path d="M8 12l4 4 7-7" />
            </svg>
          </button>
        )}
      </div>
      {state === "applied" && discountPercent !== undefined && (
        <p className="text-t-14 text-neutral flex items-center gap-1.5 mt-2">
          <span className="text-base text-neutral">•</span>
          This Promo code will save {discountPercent}%
        </p>
      )}
    </div>
  );
}
