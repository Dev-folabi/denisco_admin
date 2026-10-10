"use client";

import { useQuery } from "@tanstack/react-query";
import { getCustomer, getCustomers } from "./api";

/** Query keys for customers. */
export const customerKeys = {
  all: ["admin", "customers"] as const,
  list: (search: string) => ["admin", "customers", "list", search] as const,
  detail: (id: string) => ["admin", "customers", "detail", id] as const,
};

/** Lists customers for the management table. */
export function useCustomers(search = "") {
  return useQuery({
    queryKey: customerKeys.list(search),
    queryFn: () => getCustomers({ search: search || undefined, limit: 100 }),
  });
}

/** Loads one customer with their history. */
export function useCustomer(id: string) {
  return useQuery({
    queryKey: customerKeys.detail(id),
    queryFn: () => getCustomer(id),
    enabled: Boolean(id),
  });
}
