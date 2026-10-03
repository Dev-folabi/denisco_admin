"use client";

import { AdminTopbar } from "@/components/layout/admin-topbar";
import { useSidebarToggle } from "../layout";

export default function DashboardPage() {
  const toggleSidebar = useSidebarToggle();

  return (
    <>
      <AdminTopbar
        title="Dashboard"
        info="Welcome to the management console"
        onToggleSidebar={toggleSidebar}
      />
      <p className="text-muted">
        Dashboard content will be implemented in the next phase.
      </p>
    </>
  );
}
