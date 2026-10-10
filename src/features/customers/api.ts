import { apiClient, type ApiMeta } from "@/lib/api/client";
import { ENDPOINTS } from "@/lib/api/endpoints";
import type { Customer, CustomerDetail } from "./types";

/** Lists customer accounts, filtered by a name, email or phone search. */
export async function getCustomers(
  params: { search?: string; page?: number; limit?: number } = {},
): Promise<{ data: Customer[]; meta?: ApiMeta }> {
  return apiClient.getPage<Customer[]>(ENDPOINTS.customers.list, { params });
}

/** Retrieves one customer with their orders and bookings. */
export async function getCustomer(id: string): Promise<CustomerDetail> {
  return apiClient.get<CustomerDetail>(ENDPOINTS.customers.detail(id));
}
