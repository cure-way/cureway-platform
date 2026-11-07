"use client";

import { ReactNode } from "react";
import { FiAlertTriangle } from "react-icons/fi";

interface ConfirmActionModalProps {
  open: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  confirmVariant?: "danger" | "primary";
  loading?: boolean;
  icon?: ReactNode;

  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmActionModal({
  open,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  confirmVariant = "danger",
  loading = false,
  icon,
  onConfirm,
  onCancel,
}: ConfirmActionModalProps) {
  if (!open) return null;

  const confirmStyles =
    confirmVariant === "danger"
      ? "bg-red-600 hover:bg-red-700 text-white"
      : "bg-(--color-primary) hover:opacity-90 text-white";

  return (
    <div
      className="z-50 fixed inset-0 flex justify-center items-center bg-black/30 w-[100vw] h-[100vh]"
      onClick={onCancel}
    >
      <div
        className="bg-white shadow-lg rounded-xl w-full max-w-[28rem]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-red-50 px-6 py-4 border-b rounded-t-xl">
          <h2 className="font-semibold text-gray-800 text-sm">{title}</h2>
        </div>

        {/* Body */}
        <div className="px-6 py-6 text-center">
          <div className="flex justify-center items-center mb-4 text-red-600 text-3xl">
            {icon ?? <FiAlertTriangle />}
          </div>

          <p className="text-gray-700 text-sm">{description}</p>
        </div>

        {/* Footer */}
        <div className="flex justify-center gap-4 px-6 py-4 border-t">
          <button
            onClick={onConfirm}
            disabled={loading}
            className={`px-5 py-2 rounded-lg text-sm font-medium ${confirmStyles}`}
          >
            {loading ? "Processing..." : confirmLabel}
          </button>

          <button
            onClick={onCancel}
            className="px-5 py-2 border rounded-lg text-gray-600 text-sm"
          >
            {cancelLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
