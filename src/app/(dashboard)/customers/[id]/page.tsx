"use client";

import Link from "next/link";
import { AdminTopbar } from "@/components/layout/admin-topbar";
import { useSidebarToggle } from "../../layout";
import { Panel, PanelHead } from "@/components/ui/panel";
import { DataTable } from "@/components/ui/data-table";
import { StatusPill } from "@/components/ui/status-pill";
import { MoneyFromKobo, fmtDate } from "@/lib/utils/format";
import { Eye } from "lucide-react";

export default function CustomerDetailPage() {
  const toggleSidebar = useSidebarToggle();

  const orderColumns = [
    { key: "order_number", header: "Order No." },
    {
      key: "created_at",
      header: "Date",
      render: (row: Record<string, unknown>) =>
        fmtDate(row.created_at as string),
    },
    {
      key: "total",
      header: "Total",
      render: (row: Record<string, unknown>) =>
        MoneyFromKobo(row.total as number),
    },
    {
      key: "status",
      header: "Status",
      render: (row: Record<string, unknown>) => (
        <StatusPill status={row.status as string} />
      ),
    },
    {
      key: "actions",
      header: "",
      render: (row: Record<string, unknown>) => (
        <Link
          href={`/orders/${row.id}`}
          className="inline-flex items-center gap-1.5 rounded-full bg-cream-deep px-4 py-[7px] text-[12px] font-bold text-forest transition-all hover:bg-olive hover:text-white"
        >
          <Eye size={13} /> View
        </Link>
      ),
    },
  ];

  return (
    <>
      <AdminTopbar title="Customer Detail" onToggleSidebar={toggleSidebar} />

      <nav className="mb-6 text-xs text-muted">
        <Link href="/customers" className="text-olive hover:text-forest">
          Customers
        </Link>{" "}
        / <span>Customer Name</span>
      </nav>

      <div className="mb-5 grid grid-cols-2 gap-5 [@media(max-width:760px)]:grid-cols-1">
        {/* Profile */}
        <Panel>
          <h4 className="mb-3 text-[14px] font-semibold">Profile</h4>
          <div className="space-y-2 text-sm">
            <p>
              <strong>Name:</strong> —
            </p>
            <p>
              <strong>Email:</strong> —
            </p>
            <p>
              <strong>Phone:</strong> —
            </p>
            <p>
              <strong>Joined:</strong> —
            </p>
          </div>
        </Panel>

        {/* Purchase summary */}
        <Panel>
          <h4 className="mb-3 text-[14px] font-semibold">Purchase Summary</h4>
          <div className="space-y-2 text-sm">
            <p>
              <strong>Total Orders:</strong> 0
            </p>
            <p>
              <strong>Total Spent:</strong> ₦0
            </p>
          </div>
        </Panel>
      </div>

      <Panel>
        <PanelHead>
          <h3 className="m-0 text-[17px] font-semibold">Order History</h3>
        </PanelHead>
        <DataTable
          columns={orderColumns}
          data={[]}
          emptyMessage="No orders from this customer yet."
        />
      </Panel>
    </>
  );
}
