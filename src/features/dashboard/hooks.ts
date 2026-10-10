"use client";

import { useQuery } from "@tanstack/react-query";
import { getOverview } from "./api";

/** Query key for the dashboard. */
export const dashboardKeys = {
  overview: ["admin", "dashboard", "overview"] as const,
};

/** Loads the dashboard overview. */
export function useOverview() {
  return useQuery({
    queryKey: dashboardKeys.overview,
    queryFn: getOverview,
    // The figures move as orders come in, so they are refreshed on return to
    // the tab rather than held for long.
    staleTime: 30 * 1000,
  });
}
