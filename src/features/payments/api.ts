import { apiClient, type ApiMeta } from "@/lib/api/client";
import { ENDPOINTS } from "@/lib/api/endpoints";
import type { Payment } from "./types";

/** Lists transactions for the dashboard. */
export async function getPayments(
  params: { search?: string; status?: string; customer_id?: string; limit?: number } = {},
): Promise<{ data: Payment[]; meta?: ApiMeta }> {
  return apiClient.getPage<Payment[]>(ENDPOINTS.payments.list, { params });
}

/** Refunds a successful payment. The action is audited server-side. */
export async function refundPayment(id: string): Promise<Payment> {
  return apiClient.post<Payment>(ENDPOINTS.payments.refund(id));
}
