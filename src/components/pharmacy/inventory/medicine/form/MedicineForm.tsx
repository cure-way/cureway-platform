"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import MedicineImageField from "./MedicineImageField";
import MedicineBasicFields from "./MedicineBasicFields";
import {
  CreateInventoryInput,
  MedicineFormValues,
  UpdateInventoryInput,
} from "@/types/pharmacyTypes";
import EditableNotesField from "./EditableNotesField";

type MedicineFormProps =
  | {
      mode: "create";
      defaultValues?: Partial<CreateInventoryInput>;
      onSubmit: (data: CreateInventoryInput) => void;
    }
  | {
      mode: "edit";
      defaultValues?: Partial<CreateInventoryInput>;
      onSubmit: (data: UpdateInventoryInput) => void;
    };

export default function MedicineForm({
  mode,
  defaultValues,
  onSubmit,
}: MedicineFormProps) {
  const [imageFile, setImageFile] = useState<File | null>(null);

  const imagePreview = imageFile
    ? URL.createObjectURL(imageFile)
    : typeof defaultValues?.imageUrl === "string"
      ? defaultValues.imageUrl
      : "/placeholder-medicine.png";

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
        notes: [],
      },
    });

  // --------------------------------------------------------
  // Load default values (Edit Mode)
  // --------------------------------------------------------
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
      notes: defaultValues.notes
        ? defaultValues.notes
            .split(". ")
            .filter(Boolean)
            .map((note) => ({ value: note }))
        : [],
    });
  }, [defaultValues, reset]);

  // --------------------------------------------------------
  // Submit
  // --------------------------------------------------------
  function onFormSubmit(values: MedicineFormValues) {
    const concatenatedNotes = values.notes
      .map((n) => n.value.trim())
      .filter(Boolean)
      .join(". ");

    if (mode === "create") {
      const payload: CreateInventoryInput = {
        medicineId: values.medicineId,
        stockQuantity: values.stockQuantity,
        sellPrice: values.sellPrice,
        costPrice: values.costPrice,
        minStock: values.minStock,
        batchNumber: values.batchNumber || undefined,
        expiryDate: values.expiryDate || undefined,
        shelfLocation: values.shelfLocation || undefined,
        notes: concatenatedNotes || undefined,
      };

      onSubmit(payload);
    } else {
      const payload: UpdateInventoryInput = {
        stockQuantity: values.stockQuantity,
        sellPrice: values.sellPrice,
        costPrice: values.costPrice,
        minStock: values.minStock,
        batchNumber: values.batchNumber || undefined,
        expiryDate: values.expiryDate || undefined,
        shelfLocation: values.shelfLocation || undefined,
        notes: concatenatedNotes || undefined,
      };

      onSubmit(payload);
    }
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
        }}
        onRemove={() => {
          setImageFile(null);
        }}
      />

      <MedicineBasicFields
        mode={mode}
        register={register}
        control={control}
        errors={formState.errors}
      />

      <EditableNotesField control={control} register={register} />

      <button type="submit" hidden />
    </form>
  );
}
