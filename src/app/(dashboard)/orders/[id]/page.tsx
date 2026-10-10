"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { AdminTopbar } from "@/components/layout/admin-topbar";
import { useSidebarToggle } from "../../layout";
import { Panel, PanelHead } from "@/components/ui/panel";
import { StatusPill } from "@/components/ui/status-pill";
import { ORDER_STATUSES } from "@/lib/constants";
import { MoneyFromKobo, fmtDateTime } from "@/lib/utils/format";
import { ApiRequestError } from "@/lib/api/client";
import { useAdminOrder, useUpdateOrderStatus } from "@/features/orders/hooks";
import type { OrderStatus } from "@/features/orders/types";

export default function OrderDetailPage() {
  const toggleSidebar = useSidebarToggle();
  const { id } = useParams<{ id: string }>();

  const { data: order, isPending, isError } = useAdminOrder(id);
  const updateStatus = useUpdateOrderStatus();

  const [feedback, setFeedback] = useState<{ ok: boolean; text: string } | null>(
    null,
  );

  // The dropdown shows the order's own status until an administrator picks a
  // different one, and only that choice is held in state. Deriving it rather
  // than copying the order into state in an effect means the control is right
  // on its first render, and that a status changed elsewhere is reflected
  // instead of being overwritten by a stale selection.
  const [chosenStatus, setChosenStatus] = useState<OrderStatus | null>(null);
  const status: OrderStatus = chosenStatus ?? order?.status ?? "pending";
  const setStatus = setChosenStatus;

  async function applyStatus() {
    setFeedback(null);
    try {
      await updateStatus.mutateAsync({ id, status });
      setFeedback({ ok: true, text: `Status updated to ${status}.` });
    } catch (error) {
      setFeedback({
        ok: false,
        text:
          error instanceof ApiRequestError
            ? error.message
            : "The status could not be updated.",
      });
    }
  }

  if (isPending) {
    return (
      <>
        <AdminTopbar title="Order Detail" onToggleSidebar={toggleSidebar} />
        <div className="flex min-h-[40vh] items-center justify-center">
          <Loader2
            size={28}
            className="animate-spin text-olive"
            aria-label="Loading order"
          />
        </div>
      </>
    );
  }

  if (isError || !order) {
    return (
      <>
        <AdminTopbar title="Order Detail" onToggleSidebar={toggleSidebar} />
        <Panel>
          <p className="py-8 text-center text-sm text-muted">
            This order could not be found.{" "}
            <Link href="/orders" className="font-bold text-olive">
              Back to orders
            </Link>
          </p>
        </Panel>
      </>
    );
  }

  return (
    <>
      <AdminTopbar title="Order Detail" onToggleSidebar={toggleSidebar} />

      <nav className="mb-6 text-xs text-muted">
        <Link href="/orders" className="text-olive hover:text-forest">
          Orders
        </Link>{" "}
        / <span>{order.order_number}</span>
      </nav>

      <div className="grid grid-cols-[1fr_320px] gap-5 [@media(max-width:1024px)]:grid-cols-1">
        <Panel>
          <PanelHead>
            <div>
              <h2 className="m-0 text-[22px] font-semibold">
                Order {order.order_number}
              </h2>
              <span className="text-xs text-muted">
                Placed on {fmtDateTime(order.created_at)}
              </span>
            </div>
            <div className="flex gap-2">
              <StatusPill status={order.payment_status} />
              <StatusPill status={order.status} />
            </div>
          </PanelHead>

          <div className="mb-6 overflow-x-auto rounded-[18px] border border-line">
            <table className="w-full min-w-[480px] border-collapse">
              <thead>
                <tr>
                  {["Product", "Price", "Qty", "Total"].map((h) => (
                    <th
                      key={h}
                      className="bg-cream-deep px-[18px] py-3.5 text-left text-[11.5px] font-extrabold uppercase tracking-[.5px] text-forest"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {order.items.map((item) => (
                  <tr key={item.product_id} className="border-t border-line">
                    <td className="px-[18px] py-3.5 text-sm">{item.name}</td>
                    <td className="px-[18px] py-3.5 text-sm">
                      {MoneyFromKobo(item.unit_price)}
                      {item.unit && (
                        <small className="text-muted"> / {item.unit}</small>
                      )}
                    </td>
                    <td className="px-[18px] py-3.5 text-sm">{item.quantity}</td>
                    <td className="px-[18px] py-3.5 text-sm">
                      {MoneyFromKobo(item.line_total)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="ml-auto max-w-[300px]">
            <div className="flex justify-between border-b border-dotted border-line py-[9px] text-[14.5px]">
              <span>Subtotal</span>
              <span>{MoneyFromKobo(order.subtotal)}</span>
            </div>
            <div className="flex justify-between border-b border-dotted border-line py-[9px] text-[14.5px]">
              <span>Delivery Fee</span>
              <span>{MoneyFromKobo(order.delivery_fee)}</span>
            </div>
            <div className="mt-2.5 flex justify-between pt-4 text-lg font-extrabold text-forest">
              <span>Total</span>
              <span>{MoneyFromKobo(order.total)}</span>
            </div>
          </div>
        </Panel>

        <div className="space-y-5">
          <Panel>
            <h4 className="mb-3 text-[14px] font-semibold">Customer</h4>
            <div className="space-y-2 text-sm">
              <p>
                <strong>Name:</strong> {order.customer.name}
              </p>
              <p>
                <strong>Email:</strong> {order.customer.email}
              </p>
              <p>
                <strong>Phone:</strong> {order.customer.phone}
              </p>
            </div>
          </Panel>

          <Panel>
            <h4 className="mb-3 text-[14px] font-semibold">Fulfilment</h4>
            <div className="space-y-2 text-sm">
              <p>
                <strong>Method:</strong>{" "}
                {order.delivery_method === "delivery"
                  ? "Home Delivery"
                  : "Farm Pickup"}
              </p>
              {order.address && (
                <p>
                  <strong>Address:</strong> {order.address}
                </p>
              )}
              {order.payment_ref && (
                <p>
                  <strong>Payment ref:</strong> {order.payment_ref}
                </p>
              )}
            </div>
          </Panel>

          <Panel>
            <h4 className="mb-3 text-[14px] font-semibold">
              Update Fulfillment
            </h4>
            <select
              value={status}
              onChange={(event) => {
                setStatus(event.target.value as OrderStatus);
                setFeedback(null);
              }}
              className="mb-3 w-full rounded-[10px] border-[1.5px] border-line bg-white px-4 py-[11px] text-sm capitalize outline-none focus:border-olive"
            >
              {ORDER_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={applyStatus}
              disabled={updateStatus.isPending || status === order.status}
              className="w-full rounded-full bg-forest px-5 py-[11px] text-[13px] font-bold text-white transition-all hover:-translate-y-0.5 hover:bg-olive disabled:cursor-not-allowed disabled:opacity-45"
            >
              {updateStatus.isPending ? "Updating…" : "Update Status"}
            </button>
            {feedback && (
              <p
                className={`mt-2.5 text-center text-[12px] font-bold ${
                  feedback.ok ? "text-badge-green-text" : "text-badge-red-text"
                }`}
              >
                {feedback.text}
              </p>
            )}
            {/* Cancelling an order returns its reserved stock to the shop. */}
            <p className="mt-3 text-[11.5px] leading-snug text-muted">
              Orders move pending → processing → dispatched → completed, and can
              be cancelled until they are dispatched.
            </p>
          </Panel>
        </div>
      </div>
    </>
  );
}
