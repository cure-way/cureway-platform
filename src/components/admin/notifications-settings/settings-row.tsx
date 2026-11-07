"use client";

import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------
   TOGGLE SWITCH
   44 × 27 px — matches Figma vector toggle exactly.
   ON  = success green   (bg-success)
   OFF = neutral gray    (bg-neutral-light-active)
   ------------------------------------------------------------------ */
function ToggleSwitch({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={cn(
        "relative inline-flex h-[27px] w-[44px] shrink-0 cursor-pointer items-center rounded-full transition-colors duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30",
        checked ? "bg-success" : "bg-neutral-light-active",
      )}
    >
      <span
        className={cn(
          "pointer-events-none inline-block h-[21px] w-[21px] rounded-full bg-white shadow-sm transition-transform duration-200 ease-in-out",
          checked ? "translate-x-[20px]" : "translate-x-[3px]",
        )}
      />
    </button>
  );
}

/* ------------------------------------------------------------------
   SETTINGS ROW
   Each row is a bordered card with title, description, and toggle.
   ------------------------------------------------------------------ */
export interface SettingsRowData {
  id: string;
  title: string;
  description: string;
  defaultValue: boolean;
}

interface SettingsRowProps {
  title: string;
  description: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}

export default function SettingsRow({
  title,
  description,
  checked,
  onChange,
}: SettingsRowProps) {
  return (
    <div className="flex items-center gap-4 p-4 border border-border rounded-xl">
      {/* Text content */}
      <div className="flex-1 min-w-0 space-y-4">
        <h3 className="text-t-17 font-semibold text-neutral-darker leading-snug">
          {title}
        </h3>
        <p className="text-t-17 font-normal text-neutral leading-snug max-w-[500px]">
          {description}
        </p>
      </div>

      {/* Toggle */}
      <ToggleSwitch checked={checked} onChange={onChange} />
    </div>
  );
}
