"use client";

import * as React from "react";

type SwitchProps = {
  checked: boolean;
  onCheckedChange: (v: boolean) => void;
  ariaLabel?: string;
};

export function Switch({ checked, onCheckedChange, ariaLabel }: SwitchProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={ariaLabel ?? "toggle"}
      onClick={() => onCheckedChange(!checked)}
      className={[
        "relative inline-flex h-[20px] w-[32px] items-center rounded-full border transition",
        checked ? "border-[rgba(0,0,0,0.2)] bg-[#279543]" : "border-[#D9D9D9] bg-[#EAEAEA]",
      ].join(" ")}
    >
      <span
        className={[
          "absolute h-[14px] w-[14px] rounded-full bg-white shadow-sm transition",
          checked ? "translate-x-[14px]" : "translate-x-[2px]",
        ].join(" ")}
      />
    </button>
  );
}