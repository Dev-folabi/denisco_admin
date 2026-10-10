"use client";

import Link from "next/link";
import {
  CalendarCheck,
  Carrot,
  DollarSign,
  Hourglass,
  Loader2,
  Package,
  Users,
} from "lucide-react";
import { AdminTopbar } from "@/components/layout/admin-topbar";
import { useSidebarToggle } from "../layout";
import { StatCard } from "@/components/ui/stat-card";
import { Panel, PanelHead } from "@/components/ui/panel";
import { StatusPill } from "@/components/ui/status-pill";
import { SalesChart } from "@/components/charts/sales-chart";
import { MoneyFromKobo, fmtDate } from "@/lib/utils/format";
import { useAuth } from "@/lib/auth/auth-provider";
import { useOverview } from "@/features/dashboard/hooks";

export default function DashboardPage() {
  const toggleSidebar = useSidebarToggle();
  const { user } = useAuth();
  const { data, isPending, isError } = useOverview();

  // While loading, the cards show a dash rather than a misleading zero.
  const value = (amount?: number) =>
    isPending || amount === undefined ? "—" : String(amount);

  const stats = [
    {
      label: "Total Revenue",
      value: isPending ? "—" : MoneyFromKobo(data?.total_revenue ?? 0),
      icon: DollarSign,
    },
    { label: "Total Orders", value: value(data?.total_orders), icon: Package },
    { label: "Total Customers", value: value(data?.total_customers), icon: Users },
    { label: "Total Products", value: value(data?.total_products), icon: Carrot },
    { label: "Pending Orders", value: value(data?.pending_orders), icon: Hourglass },
    {
      label: "Consultation Bookings",
      value: value(data?.consultation_bookings),
      icon: CalendarCheck,
    },
  ];

  return (
    <>
      <AdminTopbar
        title="Dashboard"
        info={`Welcome back, ${user?.first_name ?? "Admin"}`}
        onToggleSidebar={toggleSidebar}
      />

      <div className="mb-[34px] grid grid-cols-3 gap-5 [@media(max-width:1024px)]:grid-cols-2 [@media(max-width:420px)]:grid-cols-1! [@media(max-width:640px)]:gap-3">
        {stats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>

      <Panel className="mb-[34px]">
        <PanelHead>
          <h3 className="m-0 text-[17px] font-semibold">Sales Overview</h3>
          <span className="text-xs text-muted">Last 7 days</span>
        </PanelHead>
        {isPending ? (
          <div className="flex h-[260px] items-center justify-center">
            <Loader2
              size={26}
              className="animate-spin text-olive"
              aria-label="Loading sales figures"
            />
          </div>
        ) : isError ? (
          <div className="flex h-[260px] items-center justify-center rounded-[14px] bg-cream-deep text-sm text-muted">
            The sales figures could not be loaded.
          </div>
        ) : (
          <SalesChart points={data?.sales ?? []} />
        )}
      </Panel>

      <div className="grid grid-cols-2 gap-5 [@media(max-width:1024px)]:grid-cols-1">
        <Panel>
          <PanelHead>
            <h3 className="m-0 text-[17px] font-semibold">Recent Orders</h3>
            <Link
              href="/orders"
              className="rounded-full bg-cream-deep px-[18px] py-[9px] text-[12.5px] font-bold text-forest transition-all hover:bg-olive hover:text-white"
            >
              View All
            </Link>
          </PanelHead>
          <div className="space-y-3">
            {isPending ? (
              <p className="py-6 text-center text-sm text-muted">Loading…</p>
            ) : data?.recent_orders.length ? (
              data.recent_orders.map((order) => (
                <Link
                  key={order.id}
                  href={`/orders/${order.id}`}
                  className="grid grid-cols-[38px_1fr_auto] items-center gap-3 rounded-[14px] border border-line bg-cream p-3 transition-colors hover:border-olive"
                >
                  <div className="grid size-[38px] place-items-center rounded-full bg-white text-olive">
                    <Package size={16} />
                  </div>
                  <div className="min-w-0">
                    <strong className="block truncate text-[13px]">
                      {order.order_number}
                    </strong>
                    <span className="text-[11.5px] text-muted">
                      {order.customer_name}
                    </span>
                  </div>
                  <div className="text-right">
                    <strong className="block text-[13px]">
                      {MoneyFromKobo(order.total)}
                    </strong>
                    <StatusPill status={order.status} />
                  </div>
                </Link>
              ))
            ) : (
              <p className="py-6 text-center text-sm text-muted">
                No orders yet.
              </p>
            )}
          </div>
        </Panel>

        <Panel>
          <PanelHead>
            <h3 className="m-0 text-[17px] font-semibold">Recent Bookings</h3>
            <Link
              href="/consultations"
              className="rounded-full bg-cream-deep px-[18px] py-[9px] text-[12.5px] font-bold text-forest transition-all hover:bg-olive hover:text-white"
            >
              View All
            </Link>
          </PanelHead>
          <div className="space-y-3">
            {isPending ? (
              <p className="py-6 text-center text-sm text-muted">Loading…</p>
            ) : data?.recent_bookings.length ? (
              data.recent_bookings.map((booking) => (
                <div
                  key={booking.id}
                  className="grid grid-cols-[38px_1fr_auto] items-center gap-3 rounded-[14px] border border-line bg-cream p-3"
                >
                  <div className="grid size-[38px] place-items-center rounded-full bg-white text-olive">
                    <CalendarCheck size={16} />
                  </div>
                  <div className="min-w-0">
                    <strong className="block truncate text-[13px]">
                      {booking.reference}
                    </strong>
                    <span className="block truncate text-[11.5px] text-muted">
                      {booking.type_name}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="block text-[11.5px] text-muted">
                      {fmtDate(booking.date)}
                    </span>
                    <StatusPill status={booking.status} />
                  </div>
                </div>
              ))
            ) : (
              <p className="py-6 text-center text-sm text-muted">
                No bookings yet.
              </p>
            )}
          </div>
        </Panel>
      </div>
    </>
  );
}
