"use client";

import { AdminTopbar } from "@/components/layout/admin-topbar";
import { useSidebarToggle } from "../layout";
import { Panel, PanelHead } from "@/components/ui/panel";
import { DataTable } from "@/components/ui/data-table";
import { StatusPill } from "@/components/ui/status-pill";
import { MoneyFromKobo, fmtDate } from "@/lib/utils/format";

export default function TransactionsPage() {
  const toggleSidebar = useSidebarToggle();

  const columns = [
    { key: "reference", header: "Reference" },
    { key: "customer_name", header: "Customer" },
    { key: "order_number", header: "Order" },
    {
      key: "amount",
      header: "Amount",
      render: (row: Record<string, unknown>) =>
        MoneyFromKobo(row.amount as number),
    },
    { key: "method", header: "Method" },
    {
      key: "status",
      header: "Status",
      render: (row: Record<string, unknown>) => (
        <StatusPill status={row.status as string} />
      ),
    },
    {
      key: "created_at",
      header: "Date",
      render: (row: Record<string, unknown>) =>
        fmtDate(row.created_at as string),
    },
  ];

  return (
    <>
      <AdminTopbar title="Transactions" onToggleSidebar={toggleSidebar} />

      <Panel>
        <PanelHead>
          <h3 className="m-0 text-[17px] font-semibold">Transactions (0)</h3>
        </PanelHead>
        <DataTable
          columns={columns}
          data={[]}
          emptyMessage="No transactions yet. Payment records will appear here."
        />
      </Panel>
    </>
  );
}
