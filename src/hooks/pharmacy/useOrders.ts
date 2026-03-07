import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { fetchOrdersList } from "@/services/pharmacyOrders";
import { GetOrdersParams } from "@/types/pharmacyOrders";

export function useOrders(params: GetOrdersParams) {
  return useQuery({
    queryKey: ["pharmacy-orders", params],
    queryFn: () => fetchOrdersList(params),
    placeholderData: keepPreviousData,
  });
}
