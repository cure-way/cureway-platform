"use client";

import {
  RefreshCw,
  MoreVertical,
  PackageCheck,
  Truck,
  Clock,
  Timer,
  PackageX,
  Pill,
} from "lucide-react";
import {
  PageShell,
  PageHeader,
  HeaderIconButton,
  StatsBar,
  KpiPill,
  DataTable,
  StatusBadge,
  MotionStagger,
  MotionStaggerItem,
} from "@/components/admin/shared";
import type { ColumnDef, BadgeVariant } from "@/components/admin/shared";
import { OrdersPageIcon } from "@/components/admin/shared/icons";
import { useAdminOrders } from "@/hooks/admin.hooks";
import type { AdminOrder } from "@/services/admin.service";

/* ------------------------------------------------------------------
   HELPERS
   ------------------------------------------------------------------ */
function orderStatusToBadge(status: string): BadgeVariant {
  switch (status) {
    case "DELIVERED":
      return "delivered";
    case "PENDING":
      return "pending";
    case "PROCESSING":
      return "processing";
    case "OUT_FOR_DELIVERY":
      return "en-route";
    case "ACCEPTED":
    case "PARTIALLY_ACCEPTED":
      return "accepted";
    case "REJECTED":
      return "rejected";
    case "CANCELLED":
      return "cancelled";
    default:
      return "pending";
  }
}

function paymentStatusToBadge(status: string): BadgeVariant {
  switch (status) {
    case "PAID":
    case "paid":
      return "paid";
    case "PENDING":
    case "pending":
      return "pending";
    default:
      return "pending";
  }
}

function deliveryStatusToBadge(status: string): BadgeVariant {
  switch (status) {
    case "DELIVERED":
      return "delivered";
    case "PENDING":
      return "pending";
    case "EN_ROUTE":
      return "en-route";
    case "ASSIGNED":
      return "assigned";
    case "PICKUP_IN_PROGRESS":
      return "pickup-in-progress";
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
const columns: ColumnDef<AdminOrder>[] = [
  {
    id: "id",
    header: "Order ID",
    cell: (o) => (
      <span className="text-[12px] leading-[1.2] font-semibold text-primary-darker">
        #{o.id}
      </span>
    ),
  },
  {
    id: "customer",
    header: "Customer",
    className: "flex-1 min-w-55",
    cell: (o) => (
      <div className="flex items-center gap-2">
        <div className="w-10 h-10 rounded-full bg-warning-light flex items-center justify-center shrink-0">
          <span className="text-[14px] leading-[1.2] font-bold text-warning-dark">
            {o.patient.name.charAt(0)}
          </span>
        </div>
        <div className="min-w-0">
          <p className="text-[14px] leading-[1.2] font-semibold text-neutral-darker truncate">
            {o.patient.name}
          </p>
        </div>
      </div>
    ),
  },
  {
    id: "pharmacy",
    header: "Pharmacy",
    className: "flex-1 min-w-45",
    cell: (o) => (
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-2xl bg-secondary-light-active flex items-center justify-center shrink-0">
          <Pill className="w-4 h-4 text-primary-dark" />
        </div>
        <div className="min-w-0">
          <p className="text-[14px] leading-[1.2] font-semibold text-primary-dark truncate">
            {o.pharmacyLabel}
          </p>
        </div>
      </div>
    ),
  },
  {
    id: "date",
    header: "Date",
    cell: (o) => {
      const { date, time } = formatDate(o.createdAt);
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
    id: "amount",
    header: "Amount",
    cell: (o) => (
      <span className="text-[14px] leading-[1.2] font-semibold text-primary-dark">
        {o.currency} {(o.totalAmount ?? 0).toFixed(2)}
      </span>
    ),
  },
  {
    id: "payment",
    header: "Payment",
    cell: (o) => (
      <StatusBadge variant={paymentStatusToBadge(o.payment?.status ?? "")} />
    ),
  },
  {
    id: "delivery",
    header: "Delivery",
    cell: (o) => (
      <StatusBadge variant={deliveryStatusToBadge(o.delivery?.status ?? "")} />
    ),
  },
];

/* ------------------------------------------------------------------
   PAGE
   ------------------------------------------------------------------ */
export default function AdminOrdersPage() {
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
  } = useAdminOrders();

  const deliveredCount = data.filter((o) => o.status === "DELIVERED").length;
  const pendingCount = data.filter((o) => o.status === "PENDING").length;
  const processingCount = data.filter((o) => o.status === "PROCESSING").length;
  const enRouteCount = data.filter(
    (o) => o.status === "OUT_FOR_DELIVERY",
  ).length;
  const cancelledCount = data.filter(
    (o) => o.status === "CANCELLED" || o.status === "REJECTED",
  ).length;

  return (
    <PageShell>
      <MotionStagger className="space-y-3">
        <MotionStaggerItem>
          <PageHeader
            icon={<OrdersPageIcon />}
            title="Orders / Prescriptions"
            subtitle="Manage your orders"
            actions={
              <>
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

        <MotionStaggerItem>
          <StatsBar count={`${meta.total} Order${meta.total !== 1 ? "s" : ""}`}>
            <KpiPill
              icon={<PackageCheck className="w-6 h-6 text-success-dark" />}
              value={deliveredCount}
              label="Delivered"
              variant="success"
            />
            <KpiPill
              icon={<Truck className="w-6 h-6 text-secondary-dark" />}
              value={enRouteCount}
              label="On way"
              variant="info"
            />
            <KpiPill
              icon={<Clock className="w-6 h-6 text-warning-dark" />}
              value={processingCount}
              label="Processing"
              variant="warning"
            />
            <KpiPill
              icon={<Timer className="w-6 h-6 text-warning-dark" />}
              value={pendingCount}
              label="Pending"
              variant="warning"
            />
            <KpiPill
              icon={<PackageX className="w-6 h-6 text-error-dark" />}
              value={cancelledCount}
              label="Cancelled"
              variant="error"
            />
          </StatsBar>
        </MotionStaggerItem>

        <MotionStaggerItem>
          <DataTable
            data={data}
            columns={columns}
            getRowId={(o) => String(o.id)}
            getRowLabel={(o) => `order #${o.id}`}
            searchPlaceholder="Search order ID, customer name, pharmacy..."
            selectAllLabel="Select all orders"
            minWidthClass="min-w-275"
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
