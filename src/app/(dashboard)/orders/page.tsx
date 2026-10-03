"use client";

import { useState } from "react";
import Link from "next/link";
import { AdminTopbar } from "@/components/layout/admin-topbar";
import { useSidebarToggle } from "../layout";
import { Panel, PanelHead } from "@/components/ui/panel";
import { DataTable } from "@/components/ui/data-table";
import { StatusPill } from "@/components/ui/status-pill";
import { MoneyFromKobo } from "@/lib/utils/format";
import { fmtDate } from "@/lib/utils/format";
import { ORDER_STATUSES } from "@/lib/constants";
import { Eye, Search } from "lucide-react";

export default function OrdersPage() {
  const toggleSidebar = useSidebarToggle();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const columns = [
    { key: "order_number", header: "Order No." },
    { key: "customer", header: "Customer" },
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
      key: "payment_status",
      header: "Payment",
      render: (row: Record<string, unknown>) => (
        <StatusPill status={row.payment_status as string} />
      ),
    },
    {
      key: "status",
      header: "Fulfillment",
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
      <AdminTopbar title="Orders" onToggleSidebar={toggleSidebar} />

      <Panel>
        <PanelHead>
          <h3 className="m-0 text-[17px] font-semibold">All Orders (0)</h3>
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <Search
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted"
              />
              <input
                type="text"
                placeholder="Search orders..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-[220px] rounded-[10px] border-[1.5px] border-line bg-white py-[9px] pl-9 pr-3 text-sm outline-none focus:border-olive"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-[10px] border-[1.5px] border-line bg-white px-4 py-[9px] text-sm"
            >
              <option value="">All Statuses</option>
              {ORDER_STATUSES.map((s) => (
                <option key={s} value={s} className="capitalize">
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </PanelHead>

        <DataTable
          columns={columns}
          data={[]}
          emptyMessage="No orders yet. Orders will appear here when customers start purchasing."
        />
      </Panel>
    </>
  );
}
