import { InventoryItem } from "@/types/pharmacyTypes";

export default function PharmacyMedicineUsage({
  item,
}: {
  item: InventoryItem;
}) {
  if (!item.usageNotes || item.usageNotes.length === 0) {
    return null;
  }
  return (
    <div className="bg-white p-6 border rounded-xl border-t-3 border-t-(--color-primary)">
      <h3 className="mb-3 font-semibold text-gray-900 text-sm">
        Usage & Storage Note
      </h3>

      <ul className="space-y-2 text-gray-600 text-sm list-disc list-inside">
        {item.usageNotes.map((note, idx) => (
          <li key={idx}>{note}</li>
        ))}
      </ul>
    </div>
  );
}
