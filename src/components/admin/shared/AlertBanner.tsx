import { type ReactNode } from "react";
import { AlertCircle, ArrowUpRight } from "lucide-react";

/* ── Custom SVG icon (dashboard variant) ── */
function AlertErrorSvg() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="56"
      height="56"
      viewBox="0 0 56 56"
      fill="none"
      className="w-10 h-10 sm:w-14 sm:h-14"
    >
      <path
        d="M28 0C12.5236 0 0 12.5236 0 28C0 43.4764 12.5236 56 28 56C43.4764 56 56 43.4764 56 28C56 12.5236 43.4764 0 28 0ZM25.4545 12.7273C25.4545 11.3018 26.5745 10.1818 28 10.1818C29.4255 10.1818 30.5455 11.3018 30.5455 12.7273V28C30.5455 29.4255 29.4255 30.5455 28 30.5455C26.5745 30.5455 25.4545 29.4255 25.4545 28V12.7273ZM28 45.8182C25.2 45.8182 22.9091 43.5273 22.9091 40.7273C22.9091 37.9273 25.2 35.6364 28 35.6364C30.8 35.6364 33.0909 37.9273 33.0909 40.7273C33.0909 43.5273 30.8 45.8182 28 45.8182Z"
        fill="#A13434"
      />
    </svg>
  );
}

function ArrowRightRotated() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      style={{ transform: "rotate(90deg)" }}
    >
      <path
        d="M12 21V3M12 3L20.5 11.5M12 3L3.5 11.5"
        stroke="#212F4D"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* ── Variants ── */
const variants = {
  /** Error-themed for orders / deliveries pages */
  error: {
    wrapper:
      "bg-error-light border border-error-light-active rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center gap-3",
    iconWrap:
      "w-14 h-14 rounded-full bg-error-light-active flex items-center justify-center shrink-0",
    title: "text-xl leading-normal font-extrabold text-error-darker",
    description: "text-sm leading-[1.2] text-error-dark/70",
    button:
      "flex items-center gap-2 px-4 py-2.5 border border-error-dark rounded-xl text-sm leading-[1.2] font-semibold text-error-dark hover:bg-error-light-active transition-colors shrink-0",
    defaultIcon: <AlertCircle className="w-7 h-7 text-error-dark" />,
    actionIcon: <ArrowUpRight className="w-4 h-4" />,
  },
  /** Dashboard-style: white bg, left accent border */
  dashboard: {
    wrapper:
      "flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-5 bg-white rounded-xl border-l-4 border-error-light-active pl-4 sm:pl-8 pr-4 sm:pr-6 py-4 sm:py-5",
    iconWrap: "shrink-0 w-10 h-10 sm:w-14 sm:h-14",
    title: "text-base sm:text-lg font-semibold leading-[1.2] text-error-darker",
    description:
      "text-xs sm:text-sm font-normal leading-[1.2] text-neutral max-w-[500px]",
    button:
      "flex items-center gap-2 bg-white border border-secondary-light-active rounded-2xl px-3 sm:px-4 py-2.5 sm:py-3 shrink-0 hover:bg-neutral-light transition-colors text-xs sm:text-sm font-semibold leading-[1.2] text-primary-dark w-full sm:w-auto justify-center sm:justify-start",
    defaultIcon: <AlertErrorSvg />,
    actionIcon: <ArrowRightRotated />,
  },
} as const;

export type AlertBannerVariant = keyof typeof variants;

export interface AlertBannerProps {
  /** Main alert heading */
  title: string;
  /** Optional secondary text (used in dashboard variant) */
  description?: string;
  /** Button label */
  actionLabel: string;
  /** Click handler for the action button */
  onAction?: () => void;
  /** Override the default icon */
  icon?: ReactNode;
  /** Visual variant — "error" (default) or "dashboard" */
  variant?: AlertBannerVariant;
}

export default function AlertBanner({
  title,
  description,
  actionLabel,
  onAction,
  icon,
  variant = "error",
}: AlertBannerProps) {
  const v = variants[variant];

  return (
    <div className={v.wrapper} role="alert">
      {/* Icon */}
      <div className={v.iconWrap}>{icon ?? v.defaultIcon}</div>

      {/* Text */}
      <div className="flex-1 flex items-center self-stretch min-w-0">
        <div
          className={`flex-1 flex flex-col gap-1 sm:gap-2 justify-center ${
            variant === "dashboard"
              ? "sm:border-r sm:border-black/10 sm:pr-4"
              : ""
          }`}
        >
          <h2 className={v.title}>{title}</h2>
          {description && <p className={v.description}>{description}</p>}
        </div>
      </div>

      {/* Action */}
      <button className={v.button} onClick={onAction}>
        <span>{actionLabel}</span>
        {v.actionIcon}
      </button>
    </div>
  );
}
