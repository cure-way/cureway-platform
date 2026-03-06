"use client";

import { useState, useEffect } from "react";
import { FiAlertTriangle } from "react-icons/fi";

interface DeleteAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function DeleteAccountModal({
  isOpen,
  onClose,
  onConfirm,
}: DeleteAccountModalProps) {
  const [confirmText, setConfirmText] = useState("");
  const [error, setError] = useState("");

  const handleClose = () => {
    setConfirmText("");
    setError("");
    onClose();
  };

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleConfirm = () => {
    if (confirmText.trim().toUpperCase() !== "DELETE") {
      setError("Please type DELETE to confirm");
      return;
    }

    onConfirm();
    setConfirmText("");
    setError("");
  };

  const isValid = confirmText.trim().toUpperCase() === "DELETE";

  return (
    <div className="z-50 fixed inset-0 flex justify-center items-center">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={handleClose}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="delete-account-title"
        className="relative bg-white shadow-2xl mx-4 p-6 rounded-2xl w-full max-w-md"
      >
        <h2
          id="delete-account-title"
          className="mb-3 font-semibold text-[#1E293B] text-[20px]"
        >
          Delete Account
        </h2>

        <p className="mb-6 text-[#64748B] text-[14px] leading-relaxed">
          Are you sure you want to permanently delete your account? All your
          data will be removed and this action cannot be undone.
        </p>

        <input
          type="text"
          value={confirmText}
          onChange={(e) => {
            setConfirmText(e.target.value);
            setError("");
          }}
          placeholder="Type DELETE to confirm"
          className="px-4 py-3 border border-[#E2E8F0] rounded-lg focus:outline-none focus:ring-[#3B82F6] focus:ring-2 w-full text-[14px]"
        />

        {error && (
          <div className="flex items-center gap-2 mt-3">
            <FiAlertTriangle className="text-amber-500" size={18} />
            <p className="text-[13px] text-amber-500">{error}</p>
          </div>
        )}

        <div className="flex gap-3 mt-6">
          <button
            onClick={handleConfirm}
            disabled={!isValid}
            className={`flex-1 px-4 py-3 rounded-lg text-[14px] font-medium transition-colors ${
              isValid
                ? "bg-red-500 hover:bg-red-600 text-white"
                : "bg-red-100 text-red-400 cursor-not-allowed"
            }`}
          >
            Delete Account
          </button>

          <button
            onClick={handleClose}
            className="flex-1 hover:bg-[#F8FAFC] px-4 py-3 border border-[#E2E8F0] rounded-lg font-medium text-[14px]"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
