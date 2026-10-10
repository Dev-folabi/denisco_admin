"use client";

import { createContext, useContext, useState } from "react";
import { AdminSidebar } from "@/components/layout/admin-sidebar";
import { RequireAdmin } from "@/components/auth/require-admin";

const SidebarToggleContext = createContext(() => {});
export function useSidebarToggle() {
  return useContext(SidebarToggleContext);
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <RequireAdmin>
      <SidebarToggleContext.Provider value={() => setSidebarOpen(true)}>
        <div className="grid min-h-dvh lg:grid-cols-[260px_1fr]">
          <AdminSidebar
            open={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
          />
          <main className="min-w-0 px-3 py-4 sm:p-6 lg:px-9 lg:py-8">
            {children}
          </main>
        </div>
      </SidebarToggleContext.Provider>
    </RequireAdmin>
  );
}
