"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { AdminTopbar } from "@/components/layout/admin-topbar";
import { useSidebarToggle } from "../../layout";
import { Panel, PanelHead } from "@/components/ui/panel";
import { DataTable } from "@/components/ui/data-table";
import { StatusPill } from "@/components/ui/status-pill";
import { MoneyFromKobo, fmtDate } from "@/lib/utils/format";
import { Eye, Loader2 } from "lucide-react";
import { useCustomer } from "@/features/customers/hooks";
import type { Order } from "@/features/orders/types";
import type { Booking } from "@/features/consultations/types";

export default function CustomerDetailPage() {
  const toggleSidebar = useSidebarToggle();
  const { id } = useParams<{ id: string }>();

  const { data, isPending, isError } = useCustomer(id);
  const customer = data?.customer;

  const orderColumns = [
    { key: "order_number", header: "Order No." },
    {
      key: "created_at",
      header: "Date",
      render: (row: Order) => fmtDate(row.created_at),
    },
    {
      key: "total",
      header: "Total",
      render: (row: Order) => MoneyFromKobo(row.total),
    },
    {
      key: "payment_status",
      header: "Payment",
      render: (row: Order) => <StatusPill status={row.payment_status} />,
    },
    {
      key: "status",
      header: "Fulfillment",
      render: (row: Order) => <StatusPill status={row.status} />,
    },
    {
      key: "actions",
      header: "",
      render: (row: Order) => (
        <Link
          href={`/orders/${row.id}`}
          className="inline-flex items-center gap-1.5 rounded-full bg-cream-deep px-4 py-[7px] text-[12px] font-bold text-forest transition-all hover:bg-olive hover:text-white"
        >
          <Eye size={13} /> View
        </Link>
      ),
    },
  ];

  const bookingColumns = [
    { key: "reference", header: "Reference" },
    { key: "type_name", header: "Consultation" },
    {
      key: "date",
      header: "Date",
      render: (row: Booking) => fmtDate(row.date),
    },
    { key: "time", header: "Time" },
    {
      key: "status",
      header: "Status",
      render: (row: Booking) => <StatusPill status={row.status} />,
    },
  ];

  if (isPending) {
    return (
      <>
        <AdminTopbar title="Customer Detail" onToggleSidebar={toggleSidebar} />
        <div className="flex min-h-[40vh] items-center justify-center">
          <Loader2
            size={28}
            className="animate-spin text-olive"
            aria-label="Loading customer"
          />
        </div>
      </>
    );
  }

  if (isError || !customer) {
    return (
      <>
        <AdminTopbar title="Customer Detail" onToggleSidebar={toggleSidebar} />
        <Panel>
          <p className="py-8 text-center text-sm text-muted">
            This customer could not be found.{" "}
            <Link href="/customers" className="font-bold text-olive">
              Back to customers
            </Link>
          </p>
        </Panel>
      </>
    );
  }

  return (
    <>
      <AdminTopbar title="Customer Detail" onToggleSidebar={toggleSidebar} />

      <nav className="mb-6 text-xs text-muted">
        <Link href="/customers" className="text-olive hover:text-forest">
          Customers
        </Link>{" "}
        / <span>{customer.full_name}</span>
      </nav>

      <div className="mb-5 grid grid-cols-2 gap-5 [@media(max-width:1024px)]:grid-cols-1">
        <Panel>
          <h4 className="mb-3 text-[14px] font-semibold">Profile</h4>
          <div className="space-y-2 text-sm">
            <p>
              <strong>Name:</strong> {customer.full_name}
            </p>
            <p>
              <strong>Email:</strong> {customer.email}
            </p>
            <p>
              <strong>Phone:</strong> {customer.phone}
            </p>
            <p>
              <strong>Status:</strong> <StatusPill status={customer.status} />
            </p>
            <p>
              <strong>Joined:</strong> {fmtDate(customer.created_at)}
            </p>
          </div>
        </Panel>

        <Panel>
          <h4 className="mb-3 text-[14px] font-semibold">Purchase Summary</h4>
          <div className="space-y-2 text-sm">
            <p>
              <strong>Total Orders:</strong> {data.total_orders}
            </p>
            <p>
              {/* Only paid orders count as money received. */}
              <strong>Total Spent:</strong> {MoneyFromKobo(data.total_spent)}
            </p>
            <p>
              <strong>Consultations:</strong> {data.bookings.length}
            </p>
          </div>
        </Panel>
      </div>

      <Panel className="mb-5">
        <PanelHead>
          <h3 className="m-0 text-[17px] font-semibold">
            Order History ({data.orders.length})
          </h3>
        </PanelHead>
        <DataTable
          columns={orderColumns}
          data={data.orders}
          emptyMessage="This customer has not placed any orders."
        />
      </Panel>

      <Panel>
        <PanelHead>
          <h3 className="m-0 text-[17px] font-semibold">
            Consultations ({data.bookings.length})
          </h3>
        </PanelHead>
        <DataTable
          columns={bookingColumns}
          data={data.bookings}
          emptyMessage="This customer has not booked a consultation."
        />
      </Panel>
    </>
  );
}
