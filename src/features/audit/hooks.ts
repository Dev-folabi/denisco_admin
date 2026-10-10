"use client";

import { useQuery } from "@tanstack/react-query";
import { getAuditLogs } from "./api";

/** Query keys for the audit trail. */
export const auditKeys = {
  list: (page: number) => ["admin", "audit-logs", page] as const,
};

/** Lists the audit trail. */
export function useAuditLogs(page = 1, limit = 50) {
  return useQuery({
    queryKey: auditKeys.list(page),
    queryFn: () => getAuditLogs({ page, limit }),
  });
}
