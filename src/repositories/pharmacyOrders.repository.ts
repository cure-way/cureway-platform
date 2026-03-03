import { http } from "@/lib/api/http";
import { GetOrdersParams, OrdersListResponseDTO } from "@/types/pharmacyOrders";

export async function getOrders(
  params: GetOrdersParams,
): Promise<OrdersListResponseDTO> {
  const response = await http.get<OrdersListResponseDTO>("/pharmacy-orders", {
    params,
  });

  return response.data;
}
