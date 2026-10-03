"use client";

import { useState } from "react";
import { AdminTopbar } from "@/components/layout/admin-topbar";
import { useSidebarToggle } from "../layout";
import { Panel, PanelHead } from "@/components/ui/panel";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";

export default function SettingsPage() {
  const toggleSidebar = useSidebarToggle();
  const [resetOpen, setResetOpen] = useState(false);

  return (
    <>
      <AdminTopbar title="Settings" onToggleSidebar={toggleSidebar} />

      <div className="space-y-5">
        <Panel>
          <PanelHead>
            <h3 className="m-0 text-[17px] font-semibold">
              Demo Data Management
            </h3>
          </PanelHead>
          <p className="mb-4 text-sm text-muted">
            Reset the demo database to its initial state. This will clear all
            orders, customers, bookings, and transactions and restore sample
            products.
          </p>
          <button
            type="button"
            onClick={() => setResetOpen(true)}
            className="rounded-full bg-danger px-6 py-[11px] text-sm font-bold text-white transition-all hover:-translate-y-0.5 hover:bg-danger/80"
          >
            Reset Demo Data
          </button>
        </Panel>

        <Panel>
          <PanelHead>
            <h3 className="m-0 text-[17px] font-semibold">
              Admin Access Info
            </h3>
          </PanelHead>
          <div className="space-y-2 text-sm">
            <p>
              <strong>Username:</strong>{" "}
              <code className="rounded bg-cream-deep px-2 py-0.5 text-[13px]">
                admin@denisco.com
              </code>
            </p>
            <p>
              <strong>Password:</strong>{" "}
              <code className="rounded bg-cream-deep px-2 py-0.5 text-[13px]">
                admin123
              </code>
            </p>
          </div>
        </Panel>
      </div>

      <ConfirmDialog
        open={resetOpen}
        onClose={() => setResetOpen(false)}
        onConfirm={() => setResetOpen(false)}
        title="Reset Demo Data?"
        message="This will permanently clear all data and restore the initial demo state. This action cannot be undone."
        confirmLabel="Reset Everything"
        danger
      />
    </>
  );
}
