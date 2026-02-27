import { InventoryItem } from "@/types/pharmacyTypes";
import Image from "next/image";
import NullableText from "../../shared/NullableText";

export default function PharmacyMedicineInfo({
  item,
}: {
  item: InventoryItem;
}) {
  return (
    <div className="flex flex-col justify-between space-y-6">
      <section className="flex flex-col bg-white p-8 border rounded-xl grow">
        <h3 className="mb-8 font-semibold text-gray-900 text-sm">
          Drug Information
        </h3>
        <div className="flex sm:flex-row flex-col justify-between gap-6">
          <div className="flex flex-col gap-4 order-2 sm:order-1 text-sm">
            <Info label="Generic Name" value={item.medicineName} />
            <Info label="Brand Name" value={item.brand} />
            <Info label="Category" value={item.category} />
            <Info label="Manufacturer" value={item.manufacturer} />
            <Info
              label="Prescription"
              value={item.prescriptionRequired ? "Yes" : "No"}
            />
          </div>

          <Image
            src={item.imageUrl || "/placeholder-medicine.png"}
            alt={item.medicineName}
            className="self-center order-1 sm:order-2 max-w-75 max-h-40 object-contain"
            width={200}
            height={300}
          />
        </div>
      </section>

      <section className="bg-white p-8 border rounded-xl">
        <h3 className="mb-8 font-semibold text-gray-900 text-sm">
          Stock & Pricing
        </h3>

        <div className="gap-x-6 gap-y-4 grid grid-cols-1 sm:grid-cols-2 text-sm">
          <Info label="Current Stock" value={`${item.stock} units`} />
          <Info label="Min Stock Level" value={`${item.minStock} units`} />
          <Info label="Batch Number" value={item.batchNumber} />
          <Info label="Expiry Date" value={item.expiryDate} />
          <Info label="Purchase Price" value={`$${item.purchasePrice}`} />
          <Info label="Selling Price" value={`$${item.sellingPrice}`} />
        </div>
      </section>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-2">
      <span className="text-gray-500">{label}:</span>
      {value === null || value === undefined ? (
        <NullableText value={value} />
      ) : (
        <span className="font-medium text-gray-900">{value}</span>
      )}
    </div>
  );
}
