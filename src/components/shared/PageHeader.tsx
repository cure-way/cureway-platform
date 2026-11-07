"use client";

import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * The one page header, used by every route in all three roles.
 *
 *   [back]  Title                              [actions]
 *           Subtitle
 *
 * It replaces four separate header components whose titles ranged from 17px
 * regular (admin) to 48px bold (patient) — the single biggest reason the three
 * areas read as three different products. Sizes come from docs/design-spec.md
 * §3, which maps them onto the existing text-t-* scale.
 */
export function PageHeader({
  title,
  subtitle,
  icon,
  backHref,
  onBack,
  showBack = false,
  actions,
  className,
}: {
  title: string;
  subtitle?: string;
  /** Optional cue for the dashboard areas; rendered at 24px. */
  icon?: React.ReactNode;
  /** Where Back goes. Omit both and Back uses history. */
  backHref?: string;
  onBack?: () => void;
  showBack?: boolean;
  /** Right-aligned slot; wraps below the title on mobile. */
  actions?: React.ReactNode;
  className?: string;
}) {
  const router = useRouter();

  const handleBack = () => {
    if (onBack) return onBack();
    if (backHref) return router.push(backHref);
    router.back();
  };

  return (
    <div className={cn("mb-6 flex flex-col gap-2", className)}>
      {/* Back sits above the title, aligned to the same left edge — it is a
          small control, not a heading. It used to be floated to the far right
          at 20-26px, as large as the title it sat beside. */}
      {showBack && (
        <button
          type="button"
          onClick={handleBack}
          className="-ml-1 inline-flex w-fit items-center gap-1 rounded-lg text-t-14 font-medium text-neutral-dark transition-colors hover:text-primary"
        >
          <ChevronLeft className="h-5 w-5" aria-hidden="true" />
          Back
        </button>
      )}

      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex min-w-0 flex-1 items-start gap-3">
          {icon && (
            <span
              className="mt-0.5 shrink-0 text-primary [&>svg]:h-6 [&>svg]:w-6"
              aria-hidden="true"
            >
              {icon}
            </span>
          )}

          <div className="min-w-0">
            <h1 className="text-page-title text-primary-darker">{title}</h1>
            {subtitle && (
              <p className="mt-1 text-t-14 text-neutral-dark">{subtitle}</p>
            )}
          </div>
        </div>

        {actions && (
          <div className="flex min-w-0 max-w-full flex-wrap items-center gap-2">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
}

export default PageHeader;
