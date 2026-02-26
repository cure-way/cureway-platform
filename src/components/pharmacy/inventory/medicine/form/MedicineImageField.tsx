"use client";

import Image from "next/image";

interface MedicineImageFieldProps {
  imagePreview: string;
  medicineName?: string;
  onChange: (file: File) => void;
  onRemove: () => void;
}

const PLACEHOLDER = "/placeholder-medicine.png";

export default function MedicineImageField({
  imagePreview,
  medicineName = "Medicine",
  onChange,
  onRemove,
}: MedicineImageFieldProps) {
  const isPlaceholder = imagePreview === PLACEHOLDER;

  return (
    <div className="flex justify-between items-start gap-4">
      <div className="relative">
        <Image
          src={imagePreview || PLACEHOLDER}
          alt={medicineName}
          width={200}
          height={120}
          className="border rounded w-52 h-28 object-contain"
        />

        {!isPlaceholder && (
          <button
            type="button"
            onClick={onRemove}
            className="-top-2 -right-2 absolute flex justify-center items-center bg-red-600 rounded-full w-5 h-5 text-white text-xs"
          >
            ×
          </button>
        )}
      </div>

      <label className="hover:bg-gray-50 px-3 py-1.5 border rounded-lg text-xs cursor-pointer">
        Change image
        <input
          type="file"
          accept="image/*"
          hidden
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              onChange(file);
              e.target.value = "";
            }
          }}
        />
      </label>
    </div>
  );
}
