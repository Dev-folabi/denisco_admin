import { apiClient, type ApiMeta } from "@/lib/api/client";
import { ENDPOINTS } from "@/lib/api/endpoints";
import type { AuditEntry } from "./types";

/** Lists the administrative audit trail, newest first. */
export async function getAuditLogs(
  params: { page?: number; limit?: number } = {},
): Promise<{ data: AuditEntry[]; meta?: ApiMeta }> {
  return apiClient.getPage<AuditEntry[]>(ENDPOINTS.auditLogs.list, { params });
}
