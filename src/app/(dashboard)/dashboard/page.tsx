"use client";

import { AdminTopbar } from "@/components/layout/admin-topbar";
import { useSidebarToggle } from "../layout";
import { StatCard } from "@/components/ui/stat-card";
import { Panel, PanelHead } from "@/components/ui/panel";
import { StatusPill } from "@/components/ui/status-pill";
import {
  DollarSign,
  Package,
  Users,
  Carrot,
  Hourglass,
  CalendarCheck,
} from "lucide-react";
import Link from "next/link";

const STATS = [
  { label: "Total Revenue", value: "₦0", icon: DollarSign },
  { label: "Total Orders", value: "0", icon: Package },
  { label: "Total Customers", value: "0", icon: Users },
  { label: "Total Products", value: "0", icon: Carrot },
  { label: "Pending Orders", value: "0", icon: Hourglass },
  { label: "Consultation Bookings", value: "0", icon: CalendarCheck },
];

export default function DashboardPage() {
  const toggleSidebar = useSidebarToggle();

  return (
    <>
      <AdminTopbar
        title="Dashboard"
        info="Welcome back, Admin"
        onToggleSidebar={toggleSidebar}
      />

      {/* Stat cards */}
      <div className="mb-[34px] grid grid-cols-3 gap-5 max-[1024px]:grid-cols-2 max-[420px]:grid-cols-1 max-sm:gap-3">
        {STATS.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>

      {/* Sales chart placeholder */}
      <Panel className="mb-[34px]">
        <PanelHead>
          <h3 className="m-0 text-[17px] font-semibold">Sales Overview</h3>
          <span className="text-xs text-muted">Last 7 days</span>
        </PanelHead>
        <div className="flex h-[260px] items-center justify-center rounded-[14px] bg-cream-deep text-sm text-muted">
          Chart will render when API data is available
        </div>
      </Panel>

      {/* Recent activity */}
      <div className="grid grid-cols-2 gap-5 max-[1024px]:grid-cols-1">
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
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="grid grid-cols-[42px_1fr_auto] items-center gap-3 rounded-[14px] border border-line p-3"
              >
                <div className="grid size-[42px] place-items-center rounded-full bg-cream-deep text-forest">
                  <Package size={16} />
                </div>
                <div className="min-w-0">
                  <strong className="block truncate text-[13px]">
                    DG-00000{i}
                  </strong>
                  <span className="text-[11px] text-muted">Customer Name</span>
                </div>
                <div className="text-right">
                  <strong className="block text-[13px]">₦0</strong>
                  <StatusPill status="pending" />
                </div>
              </div>
            ))}
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
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="grid grid-cols-[42px_1fr_auto] items-center gap-3 rounded-[14px] border border-line p-3"
              >
                <div className="grid size-[42px] place-items-center rounded-full bg-cream-deep text-forest">
                  <CalendarCheck size={16} />
                </div>
                <div className="min-w-0">
                  <strong className="block truncate text-[13px]">
                    CB-0000{i}
                  </strong>
                  <span className="text-[11px] text-muted">
                    General Consultation
                  </span>
                </div>
                <div className="text-right">
                  <StatusPill status="pending" />
                </div>
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </>
  );
}
