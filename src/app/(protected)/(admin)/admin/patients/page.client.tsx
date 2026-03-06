"use client";

import { RefreshCw, MoreVertical, UserCheck } from "lucide-react";
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
import type { ColumnDef } from "@/components/admin/shared";
import type { BadgeVariant } from "@/components/admin/shared";
import { PatientsPageIcon } from "@/components/admin/shared/icons";
import { useAdminPatients } from "@/hooks/admin.hooks";
import type { AdminPatient } from "@/services/admin.service";

/* ------------------------------------------------------------------
   HELPERS
   ------------------------------------------------------------------ */
function statusToBadge(s: string): BadgeVariant {
  return s === "ACTIVE" ? "active" : "unactive";
}

function formatDate(iso: string) {
  const d = new Date(iso);
  return {
    date: d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
    time: d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
  };
}

/* ------------------------------------------------------------------
   COLUMNS
   ------------------------------------------------------------------ */
const columns: ColumnDef<AdminPatient>[] = [
  {
    id: "id",
    header: "Patient ID",
    cell: (p) => (
      <span className="text-[12px] leading-[1.2] font-semibold text-primary-darker">
        #{p.id}
      </span>
    ),
  },
  {
    id: "name",
    header: "Patient Name",
    className: "flex-1 min-w-65",
    cell: (p) => (
      <div className="flex items-center gap-2 h-full">
        <div className="w-10 h-10 rounded-full bg-warning-light flex items-center justify-center shrink-0">
          <span className="text-[14px] leading-[1.2] font-bold text-warning-dark">
            {p.name.charAt(0)}
          </span>
        </div>
        <div className="flex-1 flex flex-col gap-2 justify-center min-w-0">
          <p className="text-[14px] leading-[1.2] font-semibold text-[#393737] truncate">
            {p.name}
          </p>
          <p className="text-[12px] leading-[1.2] font-medium text-neutral truncate">
            {p.phoneNumber}
          </p>
        </div>
      </div>
    ),
  },
  {
    id: "email",
    header: "Email",
    className: "flex-1 min-w-50",
    cell: (p) => (
      <span className="text-[14px] leading-[1.2] font-semibold text-primary-dark">
        {p.email}
      </span>
    ),
  },
  {
    id: "createdAt",
    header: "Joined",
    cell: (p) => {
      const { date, time } = formatDate(p.createdAt);
      return (
        <div className="flex flex-col gap-1">
          <p className="text-[14px] leading-[1.2] font-semibold text-primary-dark">
            {date}
          </p>
          <p className="text-[12px] leading-[1.2] font-normal text-[#393737]">
            {time}
          </p>
        </div>
      );
    },
  },
  {
    id: "status",
    header: "Status",
    cell: (p) => <StatusBadge variant={statusToBadge(p.status)} />,
  },
];

/* ------------------------------------------------------------------
   PAGE
   ------------------------------------------------------------------ */
export default function AdminPatientsPage() {
  const { data, meta, loading, page, limit, search, setPage, setLimit, setSearch, refetch } =
    useAdminPatients();

  const activeCount = data.filter((p) => p.status === "ACTIVE").length;

  return (
    <PageShell>
      <MotionStagger className="space-y-3">
        <MotionStaggerItem>
          <PageHeader
            icon={<PatientsPageIcon />}
            title="Patients"
            subtitle="Manage your patients"
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
            count={`${meta.total} Patient${meta.total !== 1 ? "s" : ""}`}
            description="100% of your customer base"
          >
            <KpiPill
              icon={<UserCheck className="w-6 h-6 text-success-dark" />}
              value={activeCount}
              label="Active Patients"
              variant="success"
            />
          </StatsBar>
        </MotionStaggerItem>

        <MotionStaggerItem>
          <DataTable
            data={data}
            columns={columns}
            getRowId={(p) => String(p.id)}
            getRowLabel={(p) => p.name}
            searchPlaceholder="Search patient name, email, phone..."
            selectAllLabel="Select all patients"
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
