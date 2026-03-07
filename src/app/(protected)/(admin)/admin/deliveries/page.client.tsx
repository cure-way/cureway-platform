"use client";

import {
  RefreshCw,
  MoreVertical,
  UserCheck,
  UserPlus,
  Star,
  Bike,
  Car,
  Clock,
  X,
  ArrowUpRight,
} from "lucide-react";
import { useState } from "react";
import {
  PageShell,
  PageHeader,
  HeaderPrimaryButton,
  HeaderIconButton,
  StatsBar,
  KpiPill,
  DataTable,
  StatusBadge,
  AlertBanner,
  MotionStagger,
  MotionStaggerItem,
} from "@/components/admin/shared";
import type { ColumnDef, BadgeVariant } from "@/components/admin/shared";
import { DeliveriesPageIcon } from "@/components/admin/shared/icons";
import { useAdminDeliveries } from "@/hooks/admin.hooks";
import type { AdminDelivery } from "@/services/admin.service";

/* ------------------------------------------------------------------
   HELPERS
   ------------------------------------------------------------------ */
function deliveryStatusToBadge(status: string): BadgeVariant {
  switch (status) {
    case "DELIVERED":
      return "delivered";
    case "PENDING":
      return "pending";
    case "ASSIGNED":
      return "assigned";
    case "PICKUP_IN_PROGRESS":
      return "pickup-in-progress";
    case "EN_ROUTE":
      return "en-route";
    default:
      return "pending";
  }
}

function formatDate(iso: string) {
  const d = new Date(iso);
  return {
    date: d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }),
    time: d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
  };
}

/* ------------------------------------------------------------------
   COLUMNS
   ------------------------------------------------------------------ */
const columns: ColumnDef<AdminDelivery>[] = [
  {
    id: "id",
    header: "ID",
    cell: (d) => (
      <span className="text-[12px] leading-[1.2] font-semibold text-primary-darker">
        #{d.orderId}
      </span>
    ),
  },
  {
    id: "deliverer",
    header: "Deliverer Info",
    className: "flex-1 min-w-55",
    cell: (d) => {
      if (!d.driver) {
        return (
          <span className="text-[14px] leading-[1.2] font-medium text-neutral">
            Unassigned
          </span>
        );
      }
      return (
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-warning-light flex items-center justify-center shrink-0">
            <span className="text-[14px] leading-[1.2] font-bold text-warning-dark">
              {d.driver.name.charAt(0)}
            </span>
          </div>
          <div className="min-w-0">
            <p className="text-[14px] leading-[1.2] font-semibold text-neutral-darker truncate">
              {d.driver.name}
            </p>
            <p className="text-[12px] leading-[1.2] font-medium text-neutral truncate">
              {d.driver.phoneNumber}
            </p>
          </div>
        </div>
      );
    },
  },
  {
    id: "vehicle",
    header: "Vehicle",
    cell: (d) => {
      if (!d.driver) {
        return <span className="text-[12px] text-neutral">—</span>;
      }
      const isBike =
        d.driver.vehicleName?.toLowerCase().includes("bike") ||
        d.driver.vehicleName?.toLowerCase().includes("motorcycle");
      return (
        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            {isBike ? (
              <Bike className="w-5 h-4 text-primary-dark shrink-0" />
            ) : (
              <Car className="w-5 h-5 text-primary-dark shrink-0" />
            )}
            <span className="text-[14px] leading-[1.2] font-semibold text-neutral-darker">
              {d.driver.vehicleName}
            </span>
          </div>
          <p className="text-[12px] leading-[1.2] font-medium text-neutral">
            {d.driver.vehiclePlate}
          </p>
        </div>
      );
    },
  },
  {
    id: "earning",
    header: "Earning",
    cell: (d) => (
      <span className="text-[14px] leading-[1.2] font-semibold text-primary-dark">
        {d.earning != null ? `$${d.earning.toFixed(2)}` : "—"}
      </span>
    ),
  },
  {
    id: "date",
    header: "Date",
    cell: (d) => {
      const { date, time } = formatDate(d.createdAt);
      return (
        <div className="flex flex-col gap-1">
          <p className="text-[14px] leading-[1.2] font-semibold text-primary-dark">
            {date}
          </p>
          <p className="text-[12px] leading-[1.2] text-neutral-darker">
            {time}
          </p>
        </div>
      );
    },
  },
  {
    id: "rating",
    header: "Rating",
    cell: (d) => {
      if (d.rating == null) {
        return <span className="text-[12px] text-neutral">—</span>;
      }
      return (
        <div className="flex items-center gap-1">
          <Star className="w-4 h-4 text-warning fill-warning" />
          <span className="text-[12px] leading-[1.2] font-semibold text-neutral-darker">
            {d.rating}
          </span>
        </div>
      );
    },
  },
  {
    id: "status",
    header: "Status",
    cell: (d) => <StatusBadge variant={deliveryStatusToBadge(d.status)} />,
  },
];

/* ------------------------------------------------------------------
   PAGE
   ------------------------------------------------------------------ */
export default function AdminDeliveriesPage() {
  const {
    data,
    meta,
    loading,
    page,
    limit,
    search,
    setPage,
    setLimit,
    setSearch,
    refetch,
  } = useAdminDeliveries();

  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [trackCode, setTrackCode] = useState("");

  const deliveredCount = data.filter((d) => d.status === "DELIVERED").length;
  const enRouteCount = data.filter(
    (d) => d.status === "EN_ROUTE" || d.status === "PICKUP_IN_PROGRESS",
  ).length;

  function handleRemoveRecent(idx: number) {
    setRecentSearches((prev) => prev.filter((_, i) => i !== idx));
  }

  function handleTrack() {
    const code = trackCode.trim();
    if (!code) return;
    setRecentSearches((prev) =>
      [code, ...prev.filter((s) => s !== code)].slice(0, 5),
    );
    setTrackCode("");
  }

  return (
    <PageShell>
      <MotionStagger className="space-y-3">
        <MotionStaggerItem>
          <PageHeader
            icon={<DeliveriesPageIcon />}
            title="Deliveries"
            subtitle="Manage your deliveries"
            actions={
              <>
                <HeaderPrimaryButton>Add new delivery</HeaderPrimaryButton>
                <HeaderIconButton
                  icon={<RefreshCw className="w-6 h-6 text-neutral-dark" />}
                  label="Refresh"
                  onClick={refetch}
                />
                <HeaderIconButton
                  icon={<MoreVertical className="w-6 h-6 text-neutral-dark" />}
                  label="More options"
                />
              </>
            }
          />
        </MotionStaggerItem>

        {/* ── Alert Banner ── */}
        <MotionStaggerItem>
          <AlertBanner
            variant="dashboard"
            title="Delivery Needs Review"
            actionLabel="Review Details"
          />
        </MotionStaggerItem>

        <MotionStaggerItem>
          <StatsBar
            count={`${meta.total} Deliver${meta.total !== 1 ? "ies" : "y"}`}
            description="All deliveries"
          >
            <KpiPill
              icon={<UserCheck className="w-6 h-6 text-success-dark" />}
              value={deliveredCount}
              label="Delivered"
              variant="success"
            />
            <KpiPill
              icon={<UserPlus className="w-6 h-6 text-primary-dark" />}
              value={enRouteCount}
              label="In progress"
              variant="secondary"
            />
          </StatsBar>
        </MotionStaggerItem>

        {/* ── Tracking Card ── */}
        <MotionStaggerItem>
          <div className="bg-white border border-border rounded-xl p-3 sm:p-4 space-y-3 sm:space-y-4">
            {/* Recent Tags */}
            {recentSearches.length > 0 && (
              <div className="flex flex-wrap items-center gap-2">
                <div className="flex items-center gap-1 text-neutral">
                  <Clock className="w-5 h-5" />
                  <span className="text-[14px] leading-[1.2] font-medium">
                    Recent:
                  </span>
                </div>
                {recentSearches.map((tag, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-4 py-1 sm:py-1.5 bg-neutral-light rounded-lg text-[12px] sm:text-[14px] leading-[1.2] font-medium text-neutral-darker"
                  >
                    {tag}
                    <button
                      className="hover:text-error-dark transition-colors"
                      aria-label={`Remove ${tag}`}
                      onClick={() => handleRemoveRecent(idx)}
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </span>
                ))}
              </div>
            )}

            {/* Order Code Tracker */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3">
              <span className="text-[13px] sm:text-[14px] leading-[1.2] font-medium text-neutral-darker whitespace-nowrap">
                Type your Order code:
              </span>
              <div className="flex flex-1 w-full sm:w-auto gap-2">
                <input
                  type="text"
                  placeholder="#"
                  value={trackCode}
                  onChange={(e) => setTrackCode(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleTrack()}
                  className="flex-1 min-w-0 h-10 sm:h-12 px-3 sm:px-4 border border-border rounded-xl text-[14px] sm:text-[16px] leading-[1.2] font-semibold text-primary-darker placeholder:text-neutral focus:outline-none focus:ring-2 focus:ring-primary-dark/20 transition-shadow"
                />
                <button
                  onClick={handleTrack}
                  className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-5 h-10 sm:h-12 bg-primary-dark text-white rounded-xl text-[12px] sm:text-[14px] leading-[1.2] font-semibold hover:bg-primary-dark-hover transition-colors shrink-0"
                >
                  Track Order
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </MotionStaggerItem>

        <MotionStaggerItem>
          <DataTable
            data={data}
            columns={columns}
            getRowId={(d) => String(d.id)}
            getRowLabel={(d) => `delivery #${d.orderId}`}
            searchPlaceholder="Search deliverer name, order ID..."
            selectAllLabel="Select all deliveries"
            minWidthClass="min-w-300"
            loading={loading}
            searchValue={search}
            onSearch={setSearch}
            currentPage={page}
            totalPages={meta.totalPages}
            rowsPerPage={limit}
            onPageChange={setPage}
            onRowsPerPageChange={setLimit}
          />
        </MotionStaggerItem>
      </MotionStagger>
    </PageShell>
  );
}
