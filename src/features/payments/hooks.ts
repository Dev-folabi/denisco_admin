"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getPayments, refundPayment } from "./api";

/** Query keys for transactions. */
export const paymentKeys = {
  all: ["admin", "payments"] as const,
  list: (params: Record<string, unknown>) =>
    ["admin", "payments", "list", params] as const,
};

/** Lists transactions for the dashboard table. */
export function useAdminPayments(
  params: { search?: string; status?: string } = {},
) {
  return useQuery({
    queryKey: paymentKeys.list(params),
    queryFn: () => getPayments({ ...params, limit: 100 }),
  });
}

/** Refunds a payment. */
export function useRefundPayment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: refundPayment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: paymentKeys.all });
      queryClient.invalidateQueries({ queryKey: ["admin", "orders"] });
    },
  });
}
