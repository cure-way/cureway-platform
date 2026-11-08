"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import SettingsSidebar from "@/components/admin/settings/SettingsSidebar";
import { MotionStagger, MotionStaggerItem } from "@/components/admin/shared";
import { PageContainer } from "@/components/shared";

/* ------------------------------------------------------------------
   BREADCRUMB MAPPING
   ------------------------------------------------------------------ */
const sectionLabels: Record<string, string> = {
  profile: "Profile",
  security: "Security",
  notification: "Notification",
  "connected-app": "Connected App",
  system: "System Settings",
  app: "App Settings",
  website: "Website Settings",
  other: "Other Settings",
};

const parentLabels: Record<string, string> = {
  profile: "General Settings",
  security: "General Settings",
  notification: "General Settings",
  "connected-app": "General Settings",
};

export default function AdminSettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);
  // e.g. ["admin", "settings", "security"]
  const lastSegment = segments[segments.length - 1] ?? "";
  const currentLabel = sectionLabels[lastSegment];
  const parent = parentLabels[lastSegment];

  return (
    <PageContainer as={MotionStagger}
      className="bg-neutral-light-hover space-y-6"
    >
      {/* Page Header + Breadcrumb */}
      <MotionStaggerItem>
        <div className="space-y-1 sm:space-y-2">
          <h1 className="text-page-title text-primary-darker">Settings</h1>
          {currentLabel && (
            /* A breadcrumb trail is navigation, not prose: the global
               touch-target rule deliberately skips links inside <p>, so
               these links would have had no hit area. <nav> renders
               identically here (Tailwind preflight zeroes <p> margins). */
            <nav
              aria-label="Breadcrumb"
              className="text-t-14 sm:text-t-17 font-normal text-neutral leading-snug"
            >
              <Link href="/admin/settings/profile" className="hover:underline">
                Settings
              </Link>
              {parent && (
                <>
                  /
                  <Link
                    href="/admin/settings/profile"
                    className="hover:underline"
                  >
                    {parent}
                  </Link>
                </>
              )}
              /
              <span className="text-[12px] sm:text-t-17 font-medium text-primary">
                {currentLabel}
              </span>
            </nav>
          )}
        </div>
      </MotionStaggerItem>

      {/* Main Content: Sidebar + Page */}
      <MotionStaggerItem>
        <div className="flex flex-col lg:flex-row gap-3 sm:gap-4 items-stretch lg:items-start">
          <SettingsSidebar />
          <div className="flex-1 min-w-0">{children}</div>
        </div>
      </MotionStaggerItem>
    </PageContainer>
  );
}
