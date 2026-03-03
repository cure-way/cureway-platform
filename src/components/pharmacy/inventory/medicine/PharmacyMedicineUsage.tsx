import { InventoryItem } from "@/types/pharmacyTypes";

export default function PharmacyMedicineUsage({
  item,
}: {
  item: InventoryItem;
}) {
  const hasInventoryNote = Boolean(item.notes?.trim());

  const hasMedicineInstructions =
    Boolean(item.medicineInstructions?.dosage) ||
    Boolean(item.medicineInstructions?.storage) ||
    Boolean(item.medicineInstructions?.warnings);

  if (!hasInventoryNote && !hasMedicineInstructions) {
    return null;
  }

  return (
    <div className="bg-white p-6 border rounded-xl border-t-3 border-t-(--color-primary) h-68 flex flex-col">
      <h3 className="mb-4 font-semibold text-gray-900 text-sm shrink-0">
        Usage & Storage Notes
      </h3>

      <div className="space-y-4 pr-2 overflow-y-auto text-gray-600 text-sm">
        {hasInventoryNote && (
          <div>
            <p className="mb-1 font-medium text-gray-800">Pharmacy Notes</p>

            <ul className="space-y-1 list-disc list-inside">
              {item
                .notes!.split(". ")
                .filter(Boolean)
                .map((note, idx) => (
                  <li key={idx}>{note.endsWith(".") ? note : `${note}.`}</li>
                ))}
            </ul>
          </div>
        )}

        {hasMedicineInstructions && (
          <div className="space-y-2">
            <p className="font-medium text-gray-800">Medicine Instructions</p>

            <ul className="space-y-1 list-disc list-inside">
              {item.medicineInstructions?.dosage && (
                <li>
                  <strong>Dosage:</strong> {item.medicineInstructions.dosage}
                </li>
              )}

              {item.medicineInstructions?.storage && (
                <li>
                  <strong>Storage:</strong> {item.medicineInstructions.storage}
                </li>
              )}

              {item.medicineInstructions?.warnings && (
                <li>
                  <strong>Warnings:</strong>{" "}
                  {item.medicineInstructions.warnings}
                </li>
              )}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
