"use client";

import { WelcomeCalendarIcon } from "@/components/admin/shared/icons";
import { useAuth } from "@/features/auth";

export default function WelcomeSection() {
  const { user } = useAuth();
  const today = new Date();
  const dateLabel = today.toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
  });

  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-[8px] pb-[8px]">
      {/* Greeting */}
      <div className="flex-1 flex flex-col gap-[4px] sm:gap-[8px] min-w-0">
        <h1 className="text-page-title text-primary-darker">
          Welcome{user?.name ? ` ${user.name}` : " Admin"} 👋🏻
        </h1>
        <p className="mt-1 text-t-14 text-neutral-dark">
          Here&apos;s a quick overview of today&apos;s operations
        </p>
      </div>

      {/* Date Badge */}
      <div className="flex items-center gap-2 sm:gap-[16px] px-3 sm:px-[16px] py-[3px] rounded-lg border border-border bg-white self-start sm:self-stretch shrink-0 overflow-hidden">
        <span className="[&>svg]:w-4 [&>svg]:h-4 sm:[&>svg]:w-auto sm:[&>svg]:h-auto">
          <WelcomeCalendarIcon />
        </span>
        <span className="text-t-12-semibold text-neutral-dark whitespace-nowrap">
          Today &middot; {dateLabel}
        </span>
      </div>
    </div>
  );
}
