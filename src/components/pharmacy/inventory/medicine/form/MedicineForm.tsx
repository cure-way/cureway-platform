"use client";

import { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";

import MedicineImageField from "./MedicineImageField";
import MedicineBasicFields from "./MedicineBasicFields";
import MedicineUsageNotes from "./MedicineUsageNotes";
import { CreateInventoryInput } from "@/types/pharmacyTypes";

export interface MedicineFormValues {
  medicineId: string;
  stockQuantity: number;
  sellPrice: number;
  costPrice?: number;
  minStock?: number;
  batchNumber?: string;
  expiryDate?: string;
  shelfLocation?: string;
  usageNotes: { value: string }[];
}

interface MedicineFormProps {
  defaultValues?: Partial<CreateInventoryInput>;
  onSubmit: (data: CreateInventoryInput) => void;
}

export default function MedicineForm({
  defaultValues,
  onSubmit,
}: MedicineFormProps) {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>(() => {
    if (typeof defaultValues?.image === "string") {
      return defaultValues.image;
    }
    return "/placeholder-medicine.png";
  });

  const { register, handleSubmit, control, formState, reset } =
    useForm<MedicineFormValues>({
      mode: "onSubmit",
      defaultValues: {
        medicineId: "",
        stockQuantity: 1,
        sellPrice: 0,
        costPrice: undefined,
        minStock: undefined,
        batchNumber: "",
        expiryDate: "",
        shelfLocation: "",
        usageNotes: [],
      },
    });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "usageNotes",
  });

  useEffect(() => {
    if (!defaultValues) return;

    reset({
      medicineId: defaultValues.medicineId ?? "",
      stockQuantity: defaultValues.stockQuantity ?? 1,
      sellPrice: defaultValues.sellPrice ?? 0,
      costPrice: defaultValues.costPrice,
      minStock: defaultValues.minStock,
      batchNumber: defaultValues.batchNumber ?? "",
      expiryDate: defaultValues.expiryDate ?? "",
      shelfLocation: defaultValues.shelfLocation ?? "",
      usageNotes: defaultValues.notes
        ? defaultValues.notes.split("\n").map((note) => ({ value: note }))
        : [],
    });
  }, [defaultValues, reset]);

  function onFormSubmit(values: MedicineFormValues) {
    const payload: CreateInventoryInput = {
      medicineId: values.medicineId,
      stockQuantity: values.stockQuantity,
      sellPrice: values.sellPrice,
      costPrice: Number.isNaN(values.costPrice) ? undefined : values.costPrice,
      minStock: Number.isNaN(values.minStock) ? undefined : values.minStock,
      batchNumber: values.batchNumber || undefined,
      expiryDate: values.expiryDate || undefined,
      shelfLocation: values.shelfLocation || undefined,
      notes: values.usageNotes
        .map((n) => n.value.trim())
        .filter(Boolean)
        .join("\n"),
      image: imageFile,
    };

    onSubmit(payload);
  }

  return (
    <form
      id="medicine-form"
      onSubmit={handleSubmit(onFormSubmit)}
      className="space-y-4 text-sm"
    >
      <MedicineImageField
        imagePreview={imagePreview}
        medicineName={defaultValues?.medicineId ?? "Medicine"}
        onChange={(file) => {
          setImageFile(file);
          setImagePreview(URL.createObjectURL(file));
        }}
        onRemove={() => {
          setImageFile(null);
          setImagePreview("/placeholder-medicine.png");
        }}
      />

      <MedicineBasicFields
        register={register}
        control={control}
        errors={formState.errors}
      />

      <MedicineUsageNotes
        fields={fields}
        register={register}
        append={() => append({ value: "" })}
        remove={remove}
      />

      <button type="submit" hidden />
    </form>
  );
}
