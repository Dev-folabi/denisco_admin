"use client";

import { useState } from "react";
import Link from "next/link";
import { AdminTopbar } from "@/components/layout/admin-topbar";
import { useSidebarToggle } from "../../layout";
import { Panel, PanelHead } from "@/components/ui/panel";
import { StatusPill } from "@/components/ui/status-pill";
import { ORDER_STATUSES } from "@/lib/constants";

export default function OrderDetailPage() {
  const toggleSidebar = useSidebarToggle();
  const [fulfillmentStatus, setFulfillmentStatus] = useState("pending");

  return (
    <>
      <AdminTopbar title="Order Detail" onToggleSidebar={toggleSidebar} />

      <nav className="mb-6 text-xs text-muted">
        <Link href="/orders" className="text-olive hover:text-forest">
          Orders
        </Link>{" "}
        / <span>DG-000000</span>
      </nav>

      <div className="grid grid-cols-[1fr_320px] gap-5 max-[1024px]:grid-cols-1">
        {/* Order detail */}
        <Panel>
          <PanelHead>
            <div>
              <h2 className="m-0 text-[22px] font-semibold">Order DG-000000</h2>
              <span className="text-xs text-muted">Placed on —</span>
            </div>
            <div className="flex gap-2">
              <StatusPill status="pending" />
              <StatusPill status="pending" />
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
                <tr>
                  <td
                    colSpan={4}
                    className="px-[18px] py-6 text-center text-sm text-muted"
                  >
                    Order items will load from API.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="ml-auto max-w-[300px]">
            <div className="flex justify-between border-b border-dotted border-line py-[9px] text-[14.5px]">
              <span>Subtotal</span>
              <span>₦0</span>
            </div>
            <div className="flex justify-between border-b border-dotted border-line py-[9px] text-[14.5px]">
              <span>Delivery Fee</span>
              <span>₦0</span>
            </div>
            <div className="mt-2.5 flex justify-between pt-4 text-lg font-extrabold text-forest">
              <span>Total</span>
              <span>₦0</span>
            </div>
          </div>
        </Panel>

        {/* Sidebar */}
        <div className="space-y-5">
          {/* Customer info */}
          <Panel>
            <h4 className="mb-3 text-[14px] font-semibold">Customer</h4>
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
            </div>
          </Panel>

          {/* Status update */}
          <Panel>
            <h4 className="mb-3 text-[14px] font-semibold">
              Update Fulfillment
            </h4>
            <select
              value={fulfillmentStatus}
              onChange={(e) => setFulfillmentStatus(e.target.value)}
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
              className="w-full rounded-full bg-forest px-5 py-[11px] text-[13px] font-bold text-white transition-all hover:-translate-y-0.5 hover:bg-olive"
            >
              Update Status
            </button>
          </Panel>
        </div>
      </div>
    </>
  );
}
