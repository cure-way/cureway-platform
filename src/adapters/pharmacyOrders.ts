import {
  Order,
  OrderItem,
  OrderPatient,
  OrderRow,
  PharmacyOrderDTO,
  PharmacyOrderItemDTO,
} from "@/types/pharmacyOrders";

export function mapOrderItemDTO(dto: PharmacyOrderItemDTO): OrderItem {
  return {
    id: dto.pharmacyOrderItemId,
    medicineId: dto.medicineId,
    medicineName: dto.medicineDisplayName,
  };
}

export function mapOrderDTO(dto: PharmacyOrderDTO): Order {
  const patient: OrderPatient = {
    id: dto.patient.patientId,
    name: dto.patient.patientName,
    profileImageUrl:
      typeof dto.patient.profileImageUrl === "string"
        ? dto.patient.profileImageUrl
        : null,
  };

  return {
    id: dto.pharmacyOrderId,
    externalOrderId: dto.orderId,
    status: dto.status,
    createdAt: new Date(dto.createdAt),
    totalAmount: dto.totalAmount,
    currency: dto.currency,
    requirePrescription: dto.requirePrescription,
    patient,
    items: dto.items.map(mapOrderItemDTO),
  };
}

export function mapOrderToRow(order: Order): OrderRow {
  const firstItem = order.items[0];

  const preview = {
    firstItemName: firstItem?.medicineName ?? "-",
    remainingCount: Math.max(order.items.length - 1, 0),
  };

  return {
    id: order.id,
    customerName: order.patient.name,
    preview,
    totalAmount: order.totalAmount,
    formattedDate: order.createdAt.toLocaleDateString(),
    status: order.status,
  };
}
