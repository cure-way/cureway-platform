import { MedicineFormValues } from "@/types/pharmacyTypes";
import { Control, FieldErrors, UseFormRegister } from "react-hook-form";

interface MedicineBasicFieldsProps {
  register: UseFormRegister<MedicineFormValues>;
  control: Control<MedicineFormValues>;
  errors: FieldErrors<MedicineFormValues>;
}

export default function MedicineBasicFields({
  register,
  errors,
}: MedicineBasicFieldsProps) {
  return (
    <>
      {/* Medicine ID */}
      <div>
        <label className="block mb-1 font-medium text-gray-700">
          Medicine *
        </label>

        <input
          {...register("medicineId", {
            required: "Medicine is required",
          })}
          placeholder="Enter medicine ID"
          className="px-3 py-2 border rounded-lg w-full"
        />

        <FieldError message={errors.medicineId?.message} />
      </div>

      {/* Stock Quantity */}
      <div>
        <label className="block mb-1 font-medium text-gray-700">
          Stock Quantity *
        </label>

        <input
          type="number"
          {...register("stockQuantity", {
            required: "Stock quantity is required",
            min: {
              value: 1,
              message: "Stock must be at least 1",
            },
            valueAsNumber: true,
          })}
          className="px-3 py-2 border rounded-lg w-full"
        />

        <FieldError message={errors.stockQuantity?.message} />
      </div>

      {/* Selling Price */}
      <div>
        <label className="block mb-1 font-medium text-gray-700">
          Selling Price *
        </label>

        <input
          type="number"
          step="0.01"
          {...register("sellPrice", {
            required: "Selling price is required",
            min: {
              value: 0.01,
              message: "Selling price must be greater than 0",
            },
            valueAsNumber: true,
          })}
          className="px-3 py-2 border rounded-lg w-full"
        />

        <FieldError message={errors.sellPrice?.message} />
      </div>

      {/* Cost Price */}
      <div>
        <label className="block mb-1 font-medium text-gray-700">
          Cost Price
        </label>

        <input
          type="number"
          step="0.01"
          {...register("costPrice", {
            valueAsNumber: true,
          })}
          className="px-3 py-2 border rounded-lg w-full"
        />

        <FieldError message={errors.costPrice?.message} />
      </div>

      {/* Minimum Stock */}
      <div>
        <label className="block mb-1 font-medium text-gray-700">
          Minimum Stock
        </label>

        <input
          type="number"
          {...register("minStock", {
            valueAsNumber: true,
          })}
          className="px-3 py-2 border rounded-lg w-full"
        />

        <FieldError message={errors.minStock?.message} />
      </div>

      {/* Batch Number */}
      <div>
        <label className="block mb-1 font-medium text-gray-700">
          Batch Number
        </label>

        <input
          {...register("batchNumber")}
          className="px-3 py-2 border rounded-lg w-full"
        />
      </div>

      {/* Expiry Date */}
      <div>
        <label className="block mb-1 font-medium text-gray-700">
          Expiry Date
        </label>

        <input
          type="date"
          {...register("expiryDate")}
          className="px-3 py-2 border rounded-lg w-full"
        />
      </div>

      {/* Shelf Location */}
      <div>
        <label className="block mb-1 font-medium text-gray-700">
          Shelf Location
        </label>

        <input
          {...register("shelfLocation")}
          className="px-3 py-2 border rounded-lg w-full"
        />
      </div>
    </>
  );
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;

  return <p className="mt-1 text-red-500 text-xs">{message}</p>;
}
