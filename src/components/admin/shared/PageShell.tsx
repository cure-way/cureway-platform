"use client";

import { cn } from "@/lib/utils";
import { PageContainer } from "@/components/shared";

interface PageShellProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Page wrapper for admin routes.
 *
 * It delegates its width and gutters to the shared PageContainer's dashboard
 * variant, so admin and pharmacy land on identical edges. It used to set its
 * own asymmetric padding (pl-4 pr-6), which matched nothing else in the app.
 */
export default function PageShell({ children, className }: PageShellProps) {
  return (
    <div className="flex-1 bg-neutral-light">
      <PageContainer variant="dashboard" className={cn("space-y-4", className)}>
        {children}
      </PageContainer>
    </div>
  );
}
