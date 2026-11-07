"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";
import { notifyUnbuilt } from "@/lib/showcase/notify";
import { useSidebar } from "@/contexts/SidebarContext";
import {
  sidebarVariants,
  spring,
  duration,
} from "@/components/admin/shared/motion";
import {
  SidebarCloseIcon,
  SidebarCollapseIcon,
  DashboardIcon,
  UsersIcon,
  SidebarPharmacyIcon,
  MedicinesIcon,
  PrescriptionsIcon,
  TruckIcon,
  PromotionsIcon,
  CategoriesIcon,
  ReportsIcon,
  SupportIcon,
  SettingsIcon,
  ComputerIcon,
  MobileIcon,
  InternetIcon,
  DocumentationIcon,
  ChangelogIcon,
} from "@/components/admin/shared/icons";

/* ═══════════════════════════════════════════════════════
   Types & Navigation Data
   ═══════════════════════════════════════════════════════ */

interface NavItem {
  label: string;
  href: string;
  icon: React.FC<{ className?: string }>;
  matchPrefix?: string;
  badge?: string;
  /**
   * No route exists for this entry in the app. It stays in the sidebar so the
   * intended scope is still visible, but it does not navigate or prefetch —
   * Next.js prefetching these produced a 404 for every one on every page view.
   */
  unbuilt?: boolean;
}

const mainNav: NavItem[] = [
  {
    label: "Dashboard/Overview",
    href: "/admin/dashboard",
    icon: DashboardIcon,
    matchPrefix: "/admin/dashboard",
  },
];

const healthcareNav: NavItem[] = [
  {
    label: "Patients",
    href: "/admin/patients",
    icon: UsersIcon,
    matchPrefix: "/admin/patients",
  },
  {
    label: "Pharmacies",
    href: "/admin/pharmacies",
    icon: SidebarPharmacyIcon,
    matchPrefix: "/admin/pharmacies",
  },
  {
    label: "Products",
    href: "/admin/products",
    icon: MedicinesIcon,
    matchPrefix: "/admin/products",
  },
  {
    label: "Orders",
    href: "/admin/orders",
    icon: PrescriptionsIcon,
    matchPrefix: "/admin/orders",
  },
  {
    label: "Deliveries",
    href: "/admin/deliveries",
    icon: TruckIcon,
    matchPrefix: "/admin/deliveries",
  },
  {
    label: "Promotions",
    href: "/admin/promotions",
    unbuilt: true,
    icon: PromotionsIcon,
    matchPrefix: "/admin/promotions",
  },
  {
    label: "Categories",
    href: "/admin/categories",
    unbuilt: true,
    icon: CategoriesIcon,
    matchPrefix: "/admin/categories",
  },
  {
    label: "Reports",
    href: "/admin/reports",
    unbuilt: true,
    icon: ReportsIcon,
    matchPrefix: "/admin/reports",
  },
  {
    label: "Customer Queries",
    href: "/admin/customer-queries",
    unbuilt: true,
    icon: SupportIcon,
    matchPrefix: "/admin/customer-queries",
  },
];

const settingsNav: NavItem[] = [
  { label: "General Settings", href: "/admin/settings", icon: SettingsIcon },
  {
    label: "System Settings",
    href: "/admin/settings/system",
    unbuilt: true,
    icon: ComputerIcon,
  },
  { label: "App Settings", href: "/admin/settings/app", icon: MobileIcon, unbuilt: true },
  {
    label: "Website Settings",
    href: "/admin/settings/website",
    unbuilt: true,
    icon: InternetIcon,
  },
];

const helpNav: NavItem[] = [
  {
    label: "Documentation",
    href: "/admin/documentation",
    unbuilt: true,
    icon: DocumentationIcon,
  },
  {
    label: "Changelog",
    href: "/admin/changelog",
    unbuilt: true,
    icon: ChangelogIcon,
    badge: "V2.2.4",
  },
];

/* ═══════════════════════════════════════════════════════
   NavSection Component
   ═══════════════════════════════════════════════════════ */

function NavSection({
  title,
  items,
  isLast,
  collapsed,
}: {
  title: string;
  items: NavItem[];
  isLast?: boolean;
  collapsed: boolean;
}) {
  const pathname = usePathname();
  const shouldReduce = useReducedMotion();

  return (
    <div className={cn(!isLast && "border-b border-[#EFEDED] pb-[12px]")}>
      <AnimatePresence initial={false}>
        {!collapsed && (
          <motion.p
            key="section-title"
            initial={shouldReduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: duration.fast }}
            className="text-[14px] font-medium text-[#393737] px-[12px] pb-[4px]"
          >
            {title}
          </motion.p>
        )}
      </AnimatePresence>
      <div className="flex flex-col">
        {items.map((item) => {
          const isActive = item.matchPrefix
            ? pathname.startsWith(item.matchPrefix)
            : pathname === item.href;
          const Icon = item.icon;

          const className = cn(
            "flex items-center gap-[12px] p-[12px] rounded-[12px] transition-colors w-full text-left",
            isActive
              ? "bg-[#EFF3FB] text-[#334EAC]"
              : "text-[#989593] hover:bg-[#EFF3FB]/50 hover:text-[#474545]",
            collapsed && "justify-center",
          );

          const inner = (
            <>
              <Icon className="w-[24px] h-[24px] shrink-0" />
              <AnimatePresence initial={false}>
                {!collapsed && (
                  <motion.span
                    key="label"
                    initial={shouldReduce ? false : { opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: "auto" }}
                    exit={{ opacity: 0, width: 0 }}
                    transition={{ duration: duration.fast }}
                    className="text-t-17 font-medium whitespace-nowrap truncate overflow-hidden"
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
              <AnimatePresence initial={false}>
                {!collapsed && item.badge && (
                  <motion.span
                    key="badge"
                    initial={shouldReduce ? false : { opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: duration.fast }}
                    className="ml-auto bg-[#334EAC] text-[#EBEDF7] text-[12px] font-medium px-[16px] py-[4px] rounded-[4px] whitespace-nowrap"
                  >
                    {item.badge}
                  </motion.span>
                )}
              </AnimatePresence>
            </>
          );

          // Entries with no route render as a button: no navigation and, more
          // importantly, no Next.js prefetch (which 404'd on every page view).
          if (item.unbuilt) {
            return (
              <button
                key={item.href}
                type="button"
                onClick={() => notifyUnbuilt(item.label)}
                title={collapsed ? item.label : undefined}
                className={className}
              >
                {inner}
              </button>
            );
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              title={collapsed ? item.label : undefined}
              className={className}
            >
              {inner}
            </Link>
          );
        })}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   AdminSidebar Component
   ═══════════════════════════════════════════════════════ */

export default function AdminSidebar() {
  const { isOpen, close, isDesktopCollapsed, toggleDesktopCollapsed } =
    useSidebar();
  const collapsed = isDesktopCollapsed;

  const navSections = (isCollapsed: boolean) => (
    <>
      <NavSection title="Main" items={mainNav} collapsed={isCollapsed} />
      <NavSection
        title="Healthcare"
        items={healthcareNav}
        collapsed={isCollapsed}
      />
      <NavSection
        title="Settings"
        items={settingsNav}
        collapsed={isCollapsed}
      />
      <NavSection title="Help" items={helpNav} isLast collapsed={isCollapsed} />
    </>
  );

  return (
    <>
      {/* â”€â”€ Mobile backdrop â”€â”€ */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: duration.normal }}
            className="fixed inset-0 z-40 bg-black/40 lg:hidden"
            onClick={close}
          />
        )}
      </AnimatePresence>

      {/* â”€â”€ Mobile drawer â”€â”€ */}
      <aside
        className={cn(
          "fixed top-[var(--showcase-bar-h,0px)] bottom-0 left-0 z-50 w-80 bg-white flex flex-col border-r border-[#EFEDED] transition-transform duration-300 lg:hidden",
          isOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        {/* Mobile header */}
        <div className="h-[96px] flex items-center pl-[20px] pr-[16px] border-b border-[#EFEDED] shrink-0">
          <Link
            href="/admin/dashboard"
            className="flex items-center gap-[12px]"
          >
            <Image
              src="/logo.png"
              alt="CUREWAY"
              width={40}
              height={40}
              className="rounded-full"
            />
            <span className="text-t-25 font-black text-[#121B3C]">
              CUREWAY
            </span>
          </Link>
          <button
            onClick={close}
            className="ml-auto text-[#989593] hover:text-[#474545] transition-colors cursor-pointer"
            aria-label="Close sidebar"
          >
            <SidebarCloseIcon />
          </button>
        </div>

        {/* Mobile nav */}
        <nav className="flex-1 overflow-y-auto py-[16px] pl-[20px] pr-[12px] flex flex-col gap-[12px]">
          {navSections(false)}
        </nav>
      </aside>

      {/* â”€â”€ Desktop sidebar â”€â”€ */}
      <motion.aside
        animate={collapsed ? "collapsed" : "expanded"}
        variants={sidebarVariants}
        transition={spring.snappy}
        className="hidden lg:flex flex-col bg-white border-r border-[#EFEDED] h-[calc(100dvh-var(--showcase-bar-h,0px))] sticky top-[var(--showcase-bar-h,0px)] shrink-0 overflow-hidden"
      >
        {/* Desktop header */}
        <div
          className={cn(
            "h-[96px] flex items-center border-b border-[#EFEDED] shrink-0",
            collapsed ? "justify-center px-[12px]" : "pl-[20px] pr-[16px]",
          )}
        >
          {collapsed ? (
            <button
              onClick={toggleDesktopCollapsed}
              className="text-[#334EAC] hover:opacity-80 transition-opacity cursor-pointer"
              aria-label="Expand sidebar"
            >
              <SidebarCollapseIcon className="w-[28px] h-[28px] rotate-180" />
            </button>
          ) : (
            <>
              <Link
                href="/admin/dashboard"
                className="flex items-center gap-[12px]"
              >
                <Image
                  src="/logo.png"
                  alt="CUREWAY"
                  width={40}
                  height={40}
                  className="rounded-full"
                />
                <span className="text-t-25 font-black text-[#121B3C]">
                  CUREWAY
                </span>
              </Link>
              <button
                onClick={toggleDesktopCollapsed}
                className="ml-auto text-[#334EAC] hover:opacity-80 transition-opacity cursor-pointer"
                aria-label="Collapse sidebar"
              >
                <SidebarCollapseIcon />
              </button>
            </>
          )}
        </div>

        {/* Desktop nav */}
        <nav
          className={cn(
            "flex-1 overflow-y-auto py-[16px] flex flex-col gap-[12px]",
            collapsed ? "px-[8px]" : "pl-[20px] pr-[12px]",
          )}
        >
          {navSections(collapsed)}
        </nav>
      </motion.aside>
    </>
  );
}
