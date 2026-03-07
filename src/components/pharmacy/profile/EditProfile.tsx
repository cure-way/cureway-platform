"use client";

import { PharmacyProfile } from "@/types/PharmacyProfile";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { FiX } from "react-icons/fi";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (profile: PharmacyProfile) => void;
  profile: PharmacyProfile;
}

export default function EditProfileModal({
  isOpen,
  onClose,
  onSave,
  profile,
}: Props) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PharmacyProfile>({
    defaultValues: profile,
  });

  // Sync form when profile changes
  useEffect(() => {
    reset(profile);
  }, [profile, reset]);

  // Lock background scroll
  useEffect(() => {
    if (!isOpen) return;

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const onSubmit = (data: PharmacyProfile) => {
    onSave(data);
  };

  return (
    <div className="z-50 fixed inset-0 flex justify-center items-center">
      {/* backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative bg-white shadow-2xl mx-4 rounded-2xl w-full max-w-2xl">
        {/* header */}
        <div className="flex justify-between items-center px-6 py-5 border-[#E2E8F0] border-b">
          <h2 className="font-semibold text-[#1E293B] text-[20px]">
            Edit Profile
          </h2>

          <button
            onClick={onClose}
            className="flex justify-center items-center hover:bg-[#F1F5F9] rounded-lg w-8 h-8"
          >
            <FiX size={18} className="text-[#64748B]" />
          </button>
        </div>

        {/* form */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-5 px-6 py-6 max-h-[calc(100vh-200px)] overflow-y-auto"
        >
          {/* pharmacy name */}
          <Field label="Pharmacy Name" required error={errors.name?.message}>
            <input
              {...register("name", { required: "Pharmacy name is required" })}
              className="input"
            />
          </Field>

          {/* address */}
          <Field label="Address" required error={errors.address?.message}>
            <input
              {...register("address", { required: "Address is required" })}
              className="input"
            />
          </Field>

          {/* city + country */}
          <div className="gap-4 grid grid-cols-2">
            <Field label="City" required error={errors.city?.message}>
              <input
                {...register("city", { required: "City is required" })}
                className="input"
              />
            </Field>
          </div>

          {/* phone */}
          <Field label="Phone Number" required error={errors.phone?.message}>
            <input
              {...register("phone", { required: "Phone number is required" })}
              className="input"
            />
          </Field>

          {/* email */}
          <Field label="Email Address" required error={errors.email?.message}>
            <input
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Invalid email format",
                },
              })}
              className="input"
            />
          </Field>

          {/* hours + days */}
          <div className="gap-4 grid grid-cols-2">
            <Field label="Opening Hours">
              <input {...register("openingHours")} className="input" />
            </Field>
          </div>

          {/* footer */}
          <div className="flex justify-end gap-3 pt-4 border-[#E2E8F0] border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 border border-[#E2E8F0] rounded-lg"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="bg-(--color-primary) hover:bg-(--color-primary-dark) px-6 py-2.5 rounded-lg text-white"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ---------- reusable field wrapper ---------- */

function Field({
  label,
  children,
  error,
  required,
}: {
  label: string;
  children: React.ReactNode;
  error?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="block mb-2 font-medium text-[#1E293B] text-[14px]">
        {label} {required && <span className="text-red-500">*</span>}
      </label>

      {children}

      {error && <p className="mt-1 text-[13px] text-red-500">{error}</p>}
    </div>
  );
}
