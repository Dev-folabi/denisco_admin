"use client";

import { AdminTopbar } from "@/components/layout/admin-topbar";
import { useSidebarToggle } from "../layout";
import { Panel, PanelHead } from "@/components/ui/panel";
import { DataTable } from "@/components/ui/data-table";
import { StatusPill } from "@/components/ui/status-pill";
import { MoneyFromKobo, fmtDateTime } from "@/lib/utils/format";
import { useState } from "react";
import { Loader2, Undo2 } from "lucide-react";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { useAdminPayments, useRefundPayment } from "@/features/payments/hooks";
import type { Payment } from "@/features/payments/types";

export default function TransactionsPage() {
  const toggleSidebar = useSidebarToggle();
  const [search, setSearch] = useState("");
  const [refundTarget, setRefundTarget] = useState<Payment | null>(null);

  const { data, isPending, isError } = useAdminPayments({
    search: search || undefined,
  });
  const refundPayment = useRefundPayment();

  const payments = data?.data ?? [];

  async function confirmRefund() {
    if (!refundTarget) return;
    try {
      await refundPayment.mutateAsync(refundTarget.id);
    } finally {
      setRefundTarget(null);
    }
  }

  const columns = [
    { key: "reference", header: "Reference" },
    {
      key: "customer_name",
      header: "Customer",
      render: (row: Payment) => row.customer_name ?? row.email ?? "—",
    },
    {
      key: "subject",
      header: "For",
      // A transaction settles an order or a consultation fee, so the column
      // names whichever it was rather than leaving a blank order number.
      render: (row: Payment) =>
        row.purpose === "consultation"
          ? `Consultation ${row.booking_reference ?? ""}`.trim()
          : (row.order_number ?? "—"),
    },
    {
      key: "amount",
      header: "Amount",
      render: (row: Payment) => MoneyFromKobo(row.amount),
    },
    {
      key: "method",
      header: "Method",
      render: (row: Payment) => row.method ?? "Paystack",
    },
    {
      key: "status",
      header: "Status",
      render: (row: Payment) => <StatusPill status={row.status} />,
    },
    {
      key: "created_at",
      header: "Date",
      render: (row: Payment) => fmtDateTime(row.created_at),
    },
    {
      key: "actions",
      header: "",
      // Only a successful payment can be refunded.
      render: (row: Payment) =>
        row.status === "successful" ? (
          <button
            type="button"
            onClick={() => setRefundTarget(row)}
            className="inline-flex items-center gap-1.5 rounded-full bg-cream-deep px-4 py-[7px] text-[12px] font-bold text-forest transition-all hover:bg-danger hover:text-white"
          >
            <Undo2 size={13} /> Refund
          </button>
        ) : null,
    },
  ];

  return (
    <>
      <AdminTopbar title="Transactions" onToggleSidebar={toggleSidebar} />

      <Panel>
        <PanelHead>
          <h3 className="m-0 text-[17px] font-semibold">
            Transactions ({data?.meta?.total ?? payments.length})
          </h3>
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by reference or customer…"
            className="rounded-full border border-line bg-white px-4 py-[9px] text-[13px] outline-none focus:border-olive"
          />
        </PanelHead>

        {isPending ? (
          <div className="flex min-h-[220px] items-center justify-center">
            <Loader2
              size={26}
              className="animate-spin text-olive"
              aria-label="Loading transactions"
            />
          </div>
        ) : (
          <DataTable
            columns={columns}
            data={payments}
            emptyMessage={
              isError
                ? "The transactions could not be loaded."
                : "No transactions yet. Payment records will appear here."
            }
          />
        )}
      </Panel>

      <ConfirmDialog
        open={refundTarget !== null}
        onClose={() => setRefundTarget(null)}
        onConfirm={confirmRefund}
        title="Refund this payment?"
        message={
          refundTarget
            ? `${MoneyFromKobo(refundTarget.amount)} will be refunded to the customer for order ${refundTarget.order_number}. This is recorded in the audit log.`
            : ""
        }
        confirmLabel="Refund Payment"
        danger
      />
    </>
  );
}
