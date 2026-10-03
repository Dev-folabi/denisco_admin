"use client";

import { useState } from "react";
import Link from "next/link";
import { AdminTopbar } from "@/components/layout/admin-topbar";
import { useSidebarToggle } from "../layout";
import { Panel, PanelHead } from "@/components/ui/panel";
import { DataTable } from "@/components/ui/data-table";
import { fmtDate } from "@/lib/utils/format";
import { Eye, Search } from "lucide-react";

export default function CustomersPage() {
  const toggleSidebar = useSidebarToggle();
  const [search, setSearch] = useState("");

  const columns = [
    { key: "name", header: "Name" },
    { key: "email", header: "Email" },
    { key: "phone", header: "Phone" },
    { key: "orders_count", header: "Orders" },
    {
      key: "created_at",
      header: "Joined",
      render: (row: Record<string, unknown>) =>
        fmtDate(row.created_at as string),
    },
    {
      key: "actions",
      header: "",
      render: (row: Record<string, unknown>) => (
        <Link
          href={`/customers/${row.id}`}
          className="inline-flex items-center gap-1.5 rounded-full bg-cream-deep px-4 py-[7px] text-[12px] font-bold text-forest transition-all hover:bg-olive hover:text-white"
        >
          <Eye size={13} /> View
        </Link>
      ),
    },
  ];

  return (
    <>
      <AdminTopbar title="Customers" onToggleSidebar={toggleSidebar} />

      <Panel>
        <PanelHead>
          <h3 className="m-0 text-[17px] font-semibold">
            Registered Customers (0)
          </h3>
          <div className="relative">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted"
            />
            <input
              type="text"
              placeholder="Search customers..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-[220px] rounded-[10px] border-[1.5px] border-line bg-white py-[9px] pl-9 pr-3 text-sm outline-none focus:border-olive"
            />
          </div>
        </PanelHead>

        <DataTable
          columns={columns}
          data={[]}
          emptyMessage="No customers registered yet."
        />
      </Panel>
    </>
  );
}
