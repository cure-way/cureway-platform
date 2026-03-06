"use client";

import { RefreshCw, MoreVertical, Package, PackageX } from "lucide-react";
import Image from "next/image";
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
import { ProductsPageIcon } from "@/components/admin/shared/icons";
import { useAdminInventory } from "@/hooks/admin.hooks";
import type { AdminInventoryItem } from "@/services/admin.service";

/* ------------------------------------------------------------------
   HELPERS
   ------------------------------------------------------------------ */
function stockStatusToBadge(status: string): BadgeVariant {
  switch (status) {
    case "IN_STOCK": return "in-stock";
    case "OUT_OF_STOCK": return "out-of-stock";
    case "LOW_STOCK": return "low-stock";
    default: return "pending";
  }
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

/* ------------------------------------------------------------------
   COLUMNS
   ------------------------------------------------------------------ */
const columns: ColumnDef<AdminInventoryItem>[] = [
  {
    id: "id",
    header: "Pro. ID",
    cell: (p) => (
      <span className="text-[12px] leading-[1.2] font-semibold text-primary-darker">
        {p.id}
      </span>
    ),
  },
  {
    id: "name",
    header: "Product Name",
    className: "flex-1 min-w-50",
    cell: (p) => (
      <div className="flex items-center gap-2">
        {p.medicineImageUrl ? (
          <div className="w-10 h-10 rounded border border-neutral/50 flex items-center justify-center overflow-hidden shrink-0 p-1">
            <Image
              src={p.medicineImageUrl}
              alt={p.medicineName}
              width={28}
              height={28}
              className="object-cover"
            />
          </div>
        ) : (
          <div className="w-10 h-10 rounded border border-neutral/50 flex items-center justify-center shrink-0 bg-neutral-light">
            <Package className="w-5 h-5 text-neutral" />
          </div>
        )}
        <div className="min-w-0">
          <p className="text-[14px] leading-[1.2] font-semibold text-primary-dark truncate">
            {p.medicineName}
          </p>
          <p className="text-[12px] leading-[1.2] text-neutral truncate">
            {p.packDisplayName}
          </p>
        </div>
      </div>
    ),
  },
  {
    id: "category",
    header: "Category",
    cell: (p) => (
      <span className="text-[14px] leading-[1.2] font-semibold text-primary-dark">
        {p.categoryName}
      </span>
    ),
  },
  {
    id: "pharmacy",
    header: "Pharmacy",
    cell: (p) => (
      <span className="text-[14px] leading-[1.2] font-semibold text-primary-dark truncate">
        {p.pharmacy.pharmacyName}
      </span>
    ),
  },
  {
    id: "price",
    header: "Price",
    cell: (p) => (
      <span className="text-[14px] leading-[1.2] font-semibold text-primary-dark">
        {(p.sellPrice ?? 0).toFixed(2)}
      </span>
    ),
  },
  {
    id: "stock",
    header: "Stock",
    cell: (p) => (
      <span className="text-[14px] leading-[1.2] font-semibold text-primary-dark">
        {p.stockQuantity}
      </span>
    ),
  },
  {
    id: "expireDate",
    header: "Expire date",
    cell: (p) => (
      <span className="text-[14px] leading-[1.2] font-semibold text-primary-dark">
        {formatDate(p.expiryDate)}
      </span>
    ),
  },
  {
    id: "status",
    header: "Status",
    cell: (p) => <StatusBadge variant={stockStatusToBadge(p.stockStatus)} />,
  },
];

/* ------------------------------------------------------------------
   PAGE
   ------------------------------------------------------------------ */
export default function AdminProductsPage() {
  const { data, meta, loading, page, limit, search, setPage, setLimit, setSearch, refetch } =
    useAdminInventory();

  const inStockCount = data.filter((p) => p.stockStatus === "IN_STOCK").length;
  const outOfStockCount = data.filter((p) => p.stockStatus === "OUT_OF_STOCK").length;
  const lowStockCount = data.filter((p) => p.stockStatus === "LOW_STOCK").length;

  return (
    <PageShell>
      <MotionStagger className="space-y-3">
        <MotionStaggerItem>
          <PageHeader
            icon={<ProductsPageIcon />}
            title="Products"
            subtitle="Manage your Products"
            actions={
              <>
                <HeaderPrimaryButton>Add new Product</HeaderPrimaryButton>
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
          <AlertBanner
            variant="dashboard"
            title="Medication Risk Alert"
            actionLabel="Review Details"
          />
        </MotionStaggerItem>

        <MotionStaggerItem>
          <StatsBar
            count={`${meta.total} Product${meta.total !== 1 ? "s" : ""}`}
            description="Inventory overview"
          >
            {lowStockCount > 0 && (
              <div className="flex items-center bg-warning-light px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg self-stretch">
                <p className="text-warning-darker">
                  <span className="text-[13px] sm:text-[16px] leading-[1.2] font-medium">
                    Low stock{" "}
                  </span>
                  <span className="text-[12px] sm:text-[14px] leading-[1.2] font-semibold">
                    · {lowStockCount}
                  </span>
                </p>
              </div>
            )}
            <KpiPill
              icon={<Package className="w-6 h-6 text-success-dark" />}
              value={inStockCount}
              label="In stock"
              variant="success"
            />
            <KpiPill
              icon={<PackageX className="w-6 h-6 text-error-dark" />}
              value={outOfStockCount}
              label="Out of stock"
              variant="error"
            />
          </StatsBar>
        </MotionStaggerItem>

        <MotionStaggerItem>
          <DataTable
            data={data}
            columns={columns}
            getRowId={(p) => String(p.id)}
            getRowLabel={(p) => p.medicineName}
            searchPlaceholder="Search Product name, Product ID, Category..."
            selectAllLabel="Select all products"
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
