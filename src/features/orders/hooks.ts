"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getOrder, getOrders, updateOrderStatus } from "./api";
import type { OrderStatus } from "./types";

/** Query keys for orders. */
export const orderKeys = {
  all: ["admin", "orders"] as const,
  list: (params: Record<string, unknown>) =>
    ["admin", "orders", "list", params] as const,
  detail: (id: string) => ["admin", "orders", "detail", id] as const,
};

/** Lists orders for the dashboard table. */
export function useAdminOrders(
  params: { search?: string; status?: string } = {},
) {
  return useQuery({
    queryKey: orderKeys.list(params),
    queryFn: () => getOrders({ ...params, limit: 100 }),
  });
}

/** Loads one order for the detail page. */
export function useAdminOrder(id: string) {
  return useQuery({
    queryKey: orderKeys.detail(id),
    queryFn: () => getOrder(id),
    enabled: Boolean(id),
  });
}

/** Updates an order's fulfillment status. */
export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: OrderStatus }) =>
      updateOrderStatus(id, status),
    onSuccess: (order) => {
      queryClient.setQueryData(orderKeys.detail(order.id), order);
      queryClient.invalidateQueries({ queryKey: orderKeys.all });
      // Cancelling returns stock to the shop.
      queryClient.invalidateQueries({ queryKey: ["admin", "products"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "inventory"] });
    },
  });
}
