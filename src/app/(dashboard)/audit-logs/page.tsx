"use client";

import { AdminTopbar } from "@/components/layout/admin-topbar";
import { useSidebarToggle } from "../layout";
import { Panel, PanelHead } from "@/components/ui/panel";
import { DataTable } from "@/components/ui/data-table";
import { fmtDateTime } from "@/lib/utils/format";
import { Loader2 } from "lucide-react";
import { useAuditLogs } from "@/features/audit/hooks";
import type { AuditEntry } from "@/features/audit/types";

/** Renders an action name as readable words: "product.created" → "Product created". */
function actionLabel(action: string) {
  const words = action.replace(/[._]/g, " ");
  return words.charAt(0).toUpperCase() + words.slice(1);
}

/** Summarises an entry's metadata for the details column. */
function details(entry: AuditEntry) {
  if (!entry.metadata || Object.keys(entry.metadata).length === 0) {
    return entry.resource_id ? entry.resource_id : "—";
  }

  return Object.entries(entry.metadata)
    .map(([key, value]) => `${key}: ${formatValue(value)}`)
    .join(", ");
}

/** Renders one metadata value compactly. */
function formatValue(value: unknown): string {
  if (Array.isArray(value)) return value.join(", ");
  if (value === null || value === undefined) return "—";
  if (typeof value === "object") return JSON.stringify(value);
  return String(value);
}

export default function AuditLogsPage() {
  const toggleSidebar = useSidebarToggle();
  const { data, isPending, isError } = useAuditLogs();

  const entries = data?.data ?? [];

  const columns = [
    {
      key: "created_at",
      header: "Timestamp",
      render: (row: AuditEntry) => fmtDateTime(row.created_at),
    },
    {
      key: "actor",
      header: "Actor",
      render: (row: AuditEntry) => (
        <span>
          {row.actor_email || row.actor_id || "—"}
          {row.actor_role && (
            <>
              <br />
              <small className="text-muted">{row.actor_role}</small>
            </>
          )}
        </span>
      ),
    },
    {
      key: "action",
      header: "Action",
      render: (row: AuditEntry) => actionLabel(row.action),
    },
    { key: "resource", header: "Resource" },
    {
      key: "details",
      header: "Details",
      render: (row: AuditEntry) => (
        <span className="block max-w-[320px] truncate text-[12.5px] text-muted">
          {details(row)}
        </span>
      ),
    },
  ];

  return (
    <>
      <AdminTopbar title="Audit Logs" onToggleSidebar={toggleSidebar} />

      <Panel>
        <PanelHead>
          <h3 className="m-0 text-[17px] font-semibold">
            Recorded Actions ({data?.meta?.total ?? entries.length})
          </h3>
          <span className="text-xs text-muted">
            Administrative changes are recorded permanently
          </span>
        </PanelHead>

        {isPending ? (
          <div className="flex min-h-[220px] items-center justify-center">
            <Loader2
              size={26}
              className="animate-spin text-olive"
              aria-label="Loading audit log"
            />
          </div>
        ) : (
          <DataTable
            columns={columns}
            data={entries}
            emptyMessage={
              isError
                ? "The audit log could not be loaded."
                : "No administrative actions recorded yet."
            }
          />
        )}
      </Panel>
    </>
  );
}
