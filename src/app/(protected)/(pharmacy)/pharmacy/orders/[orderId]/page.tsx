"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  FiArrowLeft,
  FiRefreshCw,
  FiCheck,
  FiX,
  FiPackage,
  FiAlertCircle,
  FiUser,
  FiMapPin,
  FiShoppingBag,
} from "react-icons/fi";
import {
  pharmacyOrdersApiService,
  mapPharmacyOrderStatus,
} from "@/services/api.service";
import type {
  PharmacyOrderDetailDto,
  PharmacyOrderDecisionDto,
  PharmacyOrderStatusUpdateDto,
} from "@/types/api.types";

// ── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

function StatusBadge({ status }: { status: string }) {
  const label = mapPharmacyOrderStatus(status);

  const colorMap: Record<string, string> = {
    PENDING:          "bg-yellow-100 text-yellow-700 border-yellow-200",
    ACCEPTED:         "bg-blue-100 text-blue-700 border-blue-200",
    PREPARING:        "bg-indigo-100 text-indigo-700 border-indigo-200",
    READY_FOR_PICKUP: "bg-teal-100 text-teal-700 border-teal-200",
    OUT_FOR_DELIVERY: "bg-cyan-100 text-cyan-700 border-cyan-200",
    DELIVERED:        "bg-green-100 text-green-700 border-green-200",
    REJECTED:         "bg-red-100 text-red-700 border-red-200",
    CANCELLED:        "bg-gray-100 text-gray-600 border-gray-200",
  };

  const cls = colorMap[status] ?? "bg-gray-100 text-gray-600 border-gray-200";

  return (
    <span className={`inline-flex rounded-full px-4 py-1.5 text-sm font-medium border ${cls}`}>
      {label}
    </span>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default function PharmacyOrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = Number(params.orderId);

  const [order,         setOrder]         = useState<PharmacyOrderDetailDto | null>(null);
  const [loading,       setLoading]       = useState(true);
  const [error,         setError]         = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError,   setActionError]   = useState<string | null>(null);

  // Rejection reason input (shown when rejecting)
  const [showRejectInput,   setShowRejectInput]   = useState(false);
  const [rejectionReason,   setRejectionReason]   = useState("");

  // ── Fetch order ────────────────────────────────────────────────────────

  const fetchOrder = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await pharmacyOrdersApiService.getOrderById(orderId);
      setOrder(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load order");
    } finally {
      setLoading(false);
    }
  }, [orderId]);

  useEffect(() => {
    fetchOrder();
  }, [fetchOrder]);

  // ── Accept / Reject ────────────────────────────────────────────────────

  const handleDecision = async (decision: "ACCEPTED" | "REJECTED", reason?: string) => {
    setActionLoading(true);
    setActionError(null);
    try {
      const dto: PharmacyOrderDecisionDto = {
        decision,
        ...(reason ? { rejectionReason: reason } : {}),
      };
      const updated = await pharmacyOrdersApiService.updateDecision(orderId, dto);
      setOrder(updated);
      setShowRejectInput(false);
      setRejectionReason("");
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "Action failed");
    } finally {
      setActionLoading(false);
    }
  };

  // ── Status update ──────────────────────────────────────────────────────

  const handleStatusUpdate = async (status: "PREPARING" | "READY_FOR_PICKUP") => {
    setActionLoading(true);
    setActionError(null);
    try {
      const dto: PharmacyOrderStatusUpdateDto = { status };
      const updated = await pharmacyOrdersApiService.updateStatus(orderId, dto);
      setOrder(updated);
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "Status update failed");
    } finally {
      setActionLoading(false);
    }
  };

  // ── Render ──────────────────────────────────────────────────────────────

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 gap-2 text-gray-400 text-sm">
        <FiRefreshCw className="animate-spin text-lg" />
        Loading order…
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3 text-center">
        <FiAlertCircle className="text-3xl text-red-400" />
        <p className="text-gray-700 font-medium">{error}</p>
        <button
          onClick={fetchOrder}
          className="text-sm text-(--color-primary) underline hover:opacity-75"
        >
          Try again
        </button>
      </div>
    );
  }

  if (!order) return null;

  const isPending   = order.status === "PENDING";
  const isAccepted  = order.status === "ACCEPTED";
  const isPreparing = order.status === "PREPARING";

  return (
    <div className="flex flex-col gap-5 max-w-3xl">
      {/* Back + header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => router.back()}
          className="flex items-center justify-center w-9 h-9 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 transition text-gray-600"
        >
          <FiArrowLeft />
        </button>
        <div>
          <h1 className="font-semibold text-(--color-primary) text-lg leading-tight m-0">
            Order #{order.id}
          </h1>
          <p className="text-gray-500 text-sm m-0">{formatDate(order.createdAt)}</p>
        </div>
        <div className="ml-auto">
          <StatusBadge status={order.status} />
        </div>
      </div>

      {/* Action error */}
      {actionError && (
        <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-red-700 text-sm">
          <FiAlertCircle className="flex-shrink-0" />
          {actionError}
        </div>
      )}

      {/* ── Action buttons (PENDING: accept / reject) ─────────────────── */}
      {isPending && !showRejectInput && (
        <div className="flex gap-3">
          <button
            onClick={() => handleDecision("ACCEPTED")}
            disabled={actionLoading}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-green-600 text-white text-sm font-medium
                       hover:bg-green-700 transition disabled:opacity-50"
          >
            <FiCheck />
            Accept Order
          </button>
          <button
            onClick={() => setShowRejectInput(true)}
            disabled={actionLoading}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-600 text-white text-sm font-medium
                       hover:bg-red-700 transition disabled:opacity-50"
          >
            <FiX />
            Reject Order
          </button>
        </div>
      )}

      {/* Rejection reason input */}
      {isPending && showRejectInput && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex flex-col gap-3">
          <p className="text-red-700 font-medium text-sm m-0">Provide a rejection reason (optional)</p>
          <textarea
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
            rows={3}
            placeholder="e.g. Item out of stock…"
            className="w-full rounded-lg border border-red-200 bg-white px-3 py-2 text-sm text-gray-700
                       placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-300 resize-none"
          />
          <div className="flex gap-2">
            <button
              onClick={() => handleDecision("REJECTED", rejectionReason)}
              disabled={actionLoading}
              className="px-5 py-2 rounded-lg bg-red-600 text-white text-sm font-medium hover:bg-red-700 transition disabled:opacity-50"
            >
              {actionLoading ? "Rejecting…" : "Confirm Rejection"}
            </button>
            <button
              onClick={() => { setShowRejectInput(false); setRejectionReason(""); }}
              disabled={actionLoading}
              className="px-5 py-2 rounded-lg bg-white border border-gray-200 text-gray-700 text-sm hover:bg-gray-50 transition"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* ── Status update buttons (ACCEPTED → PREPARING, PREPARING → READY) */}
      {(isAccepted || isPreparing) && (
        <div className="flex gap-3">
          {isAccepted && (
            <button
              onClick={() => handleStatusUpdate("PREPARING")}
              disabled={actionLoading}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-(--color-primary) text-white text-sm font-medium
                         hover:opacity-90 transition disabled:opacity-50"
            >
              <FiPackage />
              {actionLoading ? "Updating…" : "Mark as Preparing"}
            </button>
          )}
          {isPreparing && (
            <button
              onClick={() => handleStatusUpdate("READY_FOR_PICKUP")}
              disabled={actionLoading}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-teal-600 text-white text-sm font-medium
                         hover:bg-teal-700 transition disabled:opacity-50"
            >
              <FiCheck />
              {actionLoading ? "Updating…" : "Mark as Ready for Pickup"}
            </button>
          )}
        </div>
      )}

      {/* ── Order details grid ─────────────────────────────────────────── */}
      <div className="grid sm:grid-cols-2 gap-4">

        {/* Customer info */}
        {order.customer && (
          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3 text-(--color-primary)">
              <FiUser className="text-base" />
              <span className="font-semibold text-sm">Customer</span>
            </div>
            <p className="text-gray-800 font-medium text-sm m-0">{order.customer.name}</p>
            {order.customer.phone && (
              <p className="text-gray-500 text-sm m-0 mt-0.5">{order.customer.phone}</p>
            )}
            {order.customer.email && (
              <p className="text-gray-500 text-sm m-0 mt-0.5">{order.customer.email}</p>
            )}
          </div>
        )}

        {/* Delivery address */}
        {order.deliveryAddress && (
          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3 text-(--color-primary)">
              <FiMapPin className="text-base" />
              <span className="font-semibold text-sm">Delivery Address</span>
            </div>
            <p className="text-gray-700 text-sm m-0">
              {order.deliveryAddress.addressText}
            </p>
          </div>
        )}
      </div>

      {/* Prescription info */}
      {order.requiresPrescription && (
        <div className={`flex items-start gap-3 rounded-xl border px-4 py-3 text-sm ${
          order.prescriptionStatus === "APPROVED"
            ? "bg-green-50 border-green-200 text-green-700"
            : "bg-yellow-50 border-yellow-200 text-yellow-700"
        }`}>
          <FiAlertCircle className="flex-shrink-0 mt-0.5" />
          <div>
            <span className="font-medium">Prescription required</span>
            {order.prescriptionStatus && (
              <span className="ml-1 text-xs font-normal opacity-80">
                — {order.prescriptionStatus}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Items table */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="flex items-center gap-2 px-5 py-4 border-b border-gray-100 text-(--color-primary)">
          <FiShoppingBag className="text-base" />
          <span className="font-semibold text-sm">
            Items ({order.items.length})
          </span>
        </div>

        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-5 py-3 text-left font-medium text-gray-600">Medicine</th>
              <th className="px-5 py-3 text-right font-medium text-gray-600">Qty</th>
              <th className="px-5 py-3 text-right font-medium text-gray-600">Unit Price</th>
              <th className="px-5 py-3 text-right font-medium text-gray-600">Total</th>
            </tr>
          </thead>
          <tbody>
            {order.items.map((item, idx) => (
              <tr
                key={item.id ?? idx}
                className={`border-t border-gray-100 ${idx % 2 === 0 ? "bg-white" : "bg-gray-50"}`}
              >
                <td className="px-5 py-3 text-gray-800 font-medium">{item.medicineName}</td>
                <td className="px-5 py-3 text-right text-gray-600">{item.quantity}</td>
                <td className="px-5 py-3 text-right text-gray-600">{item.unitPrice.toFixed(2)}$</td>
                <td className="px-5 py-3 text-right text-gray-900 font-semibold">{item.totalPrice.toFixed(2)}$</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="border-t border-gray-200 bg-gray-50">
              <td colSpan={3} className="px-5 py-3 text-right font-semibold text-gray-700">
                Subtotal
              </td>
              <td className="px-5 py-3 text-right font-bold text-(--color-primary)">
                {order.subtotal.toFixed(2)}$
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Rejection note */}
      {order.status === "REJECTED" && order.rejectionReason && (
        <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm">
          <span className="font-semibold text-red-700">Rejection reason: </span>
          <span className="text-red-600">{order.rejectionReason}</span>
        </div>
      )}
    </div>
  );
}
