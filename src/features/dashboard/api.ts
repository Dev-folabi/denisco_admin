import { apiClient } from "@/lib/api/client";
import { ENDPOINTS } from "@/lib/api/endpoints";
import type { Overview } from "./types";

/** Loads the dashboard's stat cards, activity lists and sales chart. */
export async function getOverview(): Promise<Overview> {
  return apiClient.get<Overview>(ENDPOINTS.dashboard.overview);
}
