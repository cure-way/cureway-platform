import { InventoryItem, UpdateInventoryInput } from "@/types/pharmacyTypes";
import MedicineForm from "./form/MedicineForm";

interface EditMedicineFormProps {
  item: InventoryItem;
  onSubmit: (data: UpdateInventoryInput) => void;
}

export default function EditMedicineForm({
  item,
  onSubmit,
}: EditMedicineFormProps) {
  return (
    <MedicineForm
      mode="edit"
      defaultValues={{
        stockQuantity: item.stock,
        sellPrice: item.sellingPrice,
        costPrice: item.purchasePrice,
        minStock: item.minStock,
        batchNumber: item.batchNumber,
        expiryDate: item.expiryDate,
        notes: item.notes ?? "",
      }}
      onSubmit={onSubmit}
    />
  );
}
