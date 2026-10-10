"use client";

import { useState } from "react";
import Link from "next/link";
import { AdminTopbar } from "@/components/layout/admin-topbar";
import { useSidebarToggle } from "../layout";
import { Panel, PanelHead } from "@/components/ui/panel";
import { DataTable } from "@/components/ui/data-table";
import { StatusPill } from "@/components/ui/status-pill";
import { fmtDate } from "@/lib/utils/format";
import { Eye, Loader2, Search } from "lucide-react";
import { useCustomers } from "@/features/customers/hooks";
import type { Customer } from "@/features/customers/types";

export default function CustomersPage() {
  const toggleSidebar = useSidebarToggle();
  const [search, setSearch] = useState("");

  // Searching runs on the server, so the table never has to hold every
  // account to filter one.
  const { data, isPending, isError } = useCustomers(search);
  const customers = data?.data ?? [];

  const columns = [
    { key: "full_name", header: "Name" },
    { key: "email", header: "Email" },
    { key: "phone", header: "Phone" },
    {
      key: "status",
      header: "Status",
      render: (row: Customer) => <StatusPill status={row.status} />,
    },
    {
      key: "created_at",
      header: "Joined",
      render: (row: Customer) => fmtDate(row.created_at),
    },
    {
      key: "actions",
      header: "",
      render: (row: Customer) => (
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
            Registered Customers ({data?.meta?.total ?? customers.length})
          </h3>
          <div className="relative">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted"
            />
            <input
              type="search"
              placeholder="Search customers…"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="w-[240px] rounded-[10px] border-[1.5px] border-line bg-white py-[9px] pl-9 pr-3 text-sm outline-none focus:border-olive"
            />
          </div>
        </PanelHead>

        {isPending ? (
          <div className="flex min-h-[220px] items-center justify-center">
            <Loader2
              size={26}
              className="animate-spin text-olive"
              aria-label="Loading customers"
            />
          </div>
        ) : (
          <DataTable
            columns={columns}
            data={customers}
            emptyMessage={
              isError
                ? "The customers could not be loaded."
                : "No customers registered yet."
            }
          />
        )}
      </Panel>
    </>
  );
}
