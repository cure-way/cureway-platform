"use client";

import {
  RefreshCw,
  MoreVertical,
  Pill,
  ShieldCheck,
  ShieldAlert,
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
import { PharmacyPageIcon } from "@/components/admin/shared/icons";
import { useAdminPharmacies } from "@/hooks/admin.hooks";
import type { AdminPharmacy } from "@/services/admin.service";

/* ------------------------------------------------------------------
   HELPERS
   ------------------------------------------------------------------ */
function verificationToBadge(status: string): BadgeVariant {
  switch (status) {
    case "VERIFIED": return "verified";
    case "REJECTED": return "rejected";
    case "UNDER_REVIEW": return "under-review";
    default: return "pending";
  }
}

/* ------------------------------------------------------------------
   COLUMNS
   ------------------------------------------------------------------ */
const columns: ColumnDef<AdminPharmacy>[] = [
  {
    id: "id",
    header: "Pha. ID",
    cell: (p) => (
      <span className="text-[12px] leading-[1.2] font-semibold text-primary-darker">
        #{p.id}
      </span>
    ),
  },
  {
    id: "name",
    header: "Pharmacy Name",
    className: "flex-1 min-w-50",
    cell: (p) => (
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-2xl bg-secondary-light-active flex items-center justify-center shrink-0">
          <Pill className="w-4 h-4 text-primary-dark" />
        </div>
        <div className="min-w-0">
          <p className="text-[14px] leading-[1.2] font-semibold text-primary-dark truncate">
            {p.pharmacyName}
          </p>
          <p className="text-[12px] leading-[1.2] font-medium text-neutral truncate">
            {p.phoneNumber}
          </p>
        </div>
      </div>
    ),
  },
  {
    id: "location",
    header: "Location",
    className: "flex-1 min-w-50",
    cell: (p) => (
      <div>
        <p className="text-[14px] leading-[1.2] font-semibold text-primary-dark truncate">
          {p.cityName}
        </p>
        {p.addressLine && (
          <p className="text-[12px] leading-[1.2] font-medium text-neutral truncate">
            {p.addressLine}
          </p>
        )}
      </div>
    ),
  },
  {
    id: "phone",
    header: "Phone",
    cell: (p) => (
      <span className="text-[14px] leading-[1.2] font-semibold text-primary-dark">
        {p.phoneNumber}
      </span>
    ),
  },
  {
    id: "verification",
    header: "Verification",
    cell: (p) => <StatusBadge variant={verificationToBadge(p.verificationStatus)} />,
  },
];

/* ------------------------------------------------------------------
   PAGE
   ------------------------------------------------------------------ */
export default function AdminPharmaciesPage() {
  const { data, meta, loading, page, limit, search, setPage, setLimit, setSearch, refetch } =
    useAdminPharmacies();

  const verifiedCount = data.filter((p) => p.verificationStatus === "VERIFIED").length;
  const underReviewCount = data.filter((p) => p.verificationStatus === "UNDER_REVIEW").length;

  return (
    <PageShell>
      <MotionStagger className="space-y-3">
        <MotionStaggerItem>
          <PageHeader
            icon={<PharmacyPageIcon />}
            title="Pharmacies"
            subtitle="Manage your pharmacies"
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
          <StatsBar
            count={`${meta.total} Pharmac${meta.total !== 1 ? "ies" : "y"}`}
            description="100% of your Pharmacies base"
          >
            <KpiPill
              icon={<ShieldCheck className="w-6 h-6 text-success-dark" />}
              value={verifiedCount}
              label="Verified"
              variant="success"
            />
            <KpiPill
              icon={<ShieldAlert className="w-6 h-6 text-warning-dark" />}
              value={underReviewCount}
              label="Under Review"
              variant="warning"
            />
          </StatsBar>
        </MotionStaggerItem>

        <MotionStaggerItem>
          <DataTable
            data={data}
            columns={columns}
            getRowId={(p) => String(p.id)}
            getRowLabel={(p) => p.pharmacyName}
            searchPlaceholder="Search Pharmacies, ID number, location..."
            selectAllLabel="Select all pharmacies"
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
