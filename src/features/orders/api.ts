import { apiClient, type ApiMeta } from "@/lib/api/client";
import { ENDPOINTS } from "@/lib/api/endpoints";
import type { Order, OrderStatus } from "./types";

/** Lists orders for the dashboard, filtered and paginated. */
export async function getOrders(
  params: {
    search?: string;
    status?: string;
    payment_status?: string;
    customer_id?: string;
    page?: number;
    limit?: number;
  } = {},
): Promise<{ data: Order[]; meta?: ApiMeta }> {
  return apiClient.getPage<Order[]>(ENDPOINTS.orders.list, { params });
}

/** Retrieves one order. */
export async function getOrder(id: string): Promise<Order> {
  return apiClient.get<Order>(ENDPOINTS.orders.detail(id));
}

/** Moves an order through fulfillment. Cancelling releases its stock. */
export async function updateOrderStatus(
  id: string,
  status: OrderStatus,
): Promise<Order> {
  return apiClient.patch<Order>(ENDPOINTS.orders.updateStatus(id), { status });
}
