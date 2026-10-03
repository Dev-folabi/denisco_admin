"use client";

import { AdminTopbar } from "@/components/layout/admin-topbar";
import { useSidebarToggle } from "../layout";
import { Panel, PanelHead } from "@/components/ui/panel";
import { DataTable } from "@/components/ui/data-table";
import { fmtDateTime } from "@/lib/utils/format";

export default function AuditLogsPage() {
  const toggleSidebar = useSidebarToggle();

  const columns = [
    {
      key: "timestamp",
      header: "Timestamp",
      render: (row: Record<string, unknown>) =>
        fmtDateTime(row.timestamp as string),
    },
    { key: "actor", header: "Actor" },
    { key: "action", header: "Action" },
    { key: "resource", header: "Resource" },
    { key: "details", header: "Details" },
  ];

  return (
    <>
      <AdminTopbar title="Audit Logs" onToggleSidebar={toggleSidebar} />

      <Panel>
        <PanelHead>
          <h3 className="m-0 text-[17px] font-semibold">Action Log</h3>
        </PanelHead>
        <DataTable
          columns={columns}
          data={[]}
          emptyMessage="No audit log entries yet."
        />
      </Panel>
    </>
  );
}
