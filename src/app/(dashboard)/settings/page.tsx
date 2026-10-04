"use client";

import { useState } from "react";
import { Eye, EyeOff, LogOut, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { AdminTopbar } from "@/components/layout/admin-topbar";
import { useSidebarToggle } from "../layout";
import { Panel, PanelHead } from "@/components/ui/panel";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { useAuth } from "@/lib/auth/auth-provider";
import { apiClient } from "@/lib/api/client";
import { ENDPOINTS } from "@/lib/api/endpoints";

const inputCls =
  "w-full rounded-[10px] border-[1.5px] border-line bg-white px-4 py-[13px] text-sm outline-none focus:border-olive";
const labelCls = "mb-2 block text-[13px] font-bold text-forest";
const dangerBtn =
  "rounded-full bg-danger px-6 py-[11px] text-sm font-bold text-white transition-all hover:-translate-y-0.5 hover:bg-danger/80";

interface PasswordFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  show: boolean;
  onToggle: () => void;
  autoComplete: string;
  placeholder?: string;
}

function PasswordField({
  id,
  label,
  value,
  onChange,
  show,
  onToggle,
  autoComplete,
  placeholder = "••••••••",
}: PasswordFieldProps) {
  return (
    <div>
      <label htmlFor={id} className={labelCls}>
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type={show ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          autoComplete={autoComplete}
          placeholder={placeholder}
          className={`${inputCls} pr-11`}
        />
        <button
          type="button"
          onClick={onToggle}
          aria-label={show ? `Hide ${label.toLowerCase()}` : `Show ${label.toLowerCase()}`}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted transition-colors hover:text-forest"
        >
          {show ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>
    </div>
  );
}

export default function SettingsPage() {
  const toggleSidebar = useSidebarToggle();
  const router = useRouter();
  const { user, isLoading, logout } = useAuth();

  const [resetOpen, setResetOpen] = useState(false);
  const [resetDone, setResetDone] = useState(false);
  const [logoutOpen, setLogoutOpen] = useState(false);

  const [current, setCurrent] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [fieldError, setFieldError] = useState("");
  const [formError, setFormError] = useState("");
  const [success, setSuccess] = useState("");
  const [saving, setSaving] = useState(false);

  const displayName = user
    ? `${user.first_name} ${user.last_name}`.trim() || user.email
    : null;
  const initials = user
    ? `${user.first_name?.[0] ?? ""}${user.last_name?.[0] ?? ""}`.toUpperCase()
    : "";

  async function handlePasswordSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFieldError("");
    setFormError("");
    setSuccess("");

    if (!current) {
      setFieldError("Enter your current password.");
      return;
    }
    if (newPass.length < 8) {
      setFieldError("New password must be at least 8 characters.");
      return;
    }
    if (newPass !== confirmPass) {
      setFieldError("New passwords do not match.");
      return;
    }
    if (newPass === current) {
      setFieldError(
        "New password must be different from the current password."
      );
      return;
    }

    setSaving(true);
    try {
      await apiClient.post(ENDPOINTS.auth.changePassword, {
        current_password: current,
        new_password: newPass,
      });
      setSuccess("Password updated successfully.");
      setCurrent("");
      setNewPass("");
      setConfirmPass("");
    } catch (err) {
      setFormError(
        err instanceof Error && err.message === "Failed to fetch"
          ? "Unable to connect to the server. Please try again later."
          : err instanceof Error
            ? err.message
            : "Could not update the password. Please try again."
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <AdminTopbar title="Settings" onToggleSidebar={toggleSidebar} />

      <div className="space-y-5">
        <Panel>
          <PanelHead>
            <h3 className="m-0 text-[17px] font-semibold">Admin Profile</h3>
          </PanelHead>
          <div className="flex flex-wrap items-center gap-5">
            <div className="grid size-[60px] shrink-0 place-items-center rounded-full bg-olive font-heading text-xl font-bold text-white">
              {initials || <User size={26} />}
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-3">
                <p className="m-0 font-heading text-lg font-semibold text-forest">
                  {isLoading ? "Loading…" : (displayName ?? "Not signed in")}
                </p>
                {user && (
                  <span className="rounded-full bg-badge-blue-bg px-3 py-1 text-[11.5px] font-extrabold uppercase tracking-wide text-badge-blue-text">
                    {user.role === "super_admin" ? "Super Admin" : "Admin"}
                  </span>
                )}
              </div>
              <p className="m-0 mt-1 text-sm text-muted">
                {user ? user.email : "\u2014"}
              </p>
              {!user && !isLoading && (
                <p className="m-0 mt-2 text-[13px] text-muted">
                  Profile details will appear once this admin is connected to
                  the API.
                </p>
              )}
            </div>
          </div>
        </Panel>

        <Panel>
          <PanelHead>
            <h3 className="m-0 text-[17px] font-semibold">Change Password</h3>
          </PanelHead>
          <p className="mb-4 text-sm text-muted">
            Choose a strong password of at least 8 characters. You will need
            your current password to confirm the change.
          </p>

          {formError && (
            <div className="mb-4 rounded-[10px] bg-badge-red-bg px-4 py-3 text-sm font-bold text-badge-red-text">
              {formError}
            </div>
          )}
          {success && (
            <div className="mb-4 rounded-[10px] bg-badge-green-bg px-4 py-3 text-sm font-bold text-badge-green-text">
              {success}
            </div>
          )}
          {fieldError && (
            <p className="mb-4 text-[13px] font-bold text-danger">
              {fieldError}
            </p>
          )}

          <form
            onSubmit={handlePasswordSubmit}
            noValidate
            className="max-w-[440px]"
          >
            <div className="mb-4">
              <PasswordField
                id="current-password"
                label="Current Password"
                value={current}
                onChange={setCurrent}
                show={showCurrent}
                onToggle={() => setShowCurrent((v) => !v)}
                autoComplete="current-password"
              />
            </div>
            <div className="mb-4">
              <PasswordField
                id="new-password"
                label="New Password"
                value={newPass}
                onChange={setNewPass}
                show={showNew}
                onToggle={() => setShowNew((v) => !v)}
                autoComplete="new-password"
              />
            </div>
            <div className="mb-5">
              <PasswordField
                id="confirm-password"
                label="Confirm New Password"
                value={confirmPass}
                onChange={setConfirmPass}
                show={showConfirm}
                onToggle={() => setShowConfirm((v) => !v)}
                autoComplete="new-password"
              />
            </div>
            <button
              type="submit"
              disabled={saving}
              className="rounded-full bg-forest px-7 py-[15px] text-sm font-bold text-white transition-all hover:-translate-y-0.5 hover:bg-olive disabled:cursor-not-allowed disabled:opacity-45"
            >
              {saving ? "Updating…" : "Update Password"}
            </button>
          </form>
        </Panel>

        <Panel>
          <PanelHead>
            <h3 className="m-0 text-[17px] font-semibold">Logout</h3>
          </PanelHead>
          <p className="mb-4 text-sm text-muted">
            Sign out of the admin console on this device.
          </p>
          <button type="button" onClick={() => setLogoutOpen(true)} className={dangerBtn}>
            <LogOut size={15} className="mr-2 inline-block -translate-y-px" />
            Logout
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

        <Panel>
          <PanelHead>
            <h3 className="m-0 text-[17px] font-semibold">
              Demo Data Management
            </h3>
          </PanelHead>
          <p className="mb-4 text-sm text-muted">
            Clear the demo data stored in this browser. This removes any
            products and consultation types you have added and restores the
            empty state.
          </p>
          <button
            type="button"
            onClick={() => setResetOpen(true)}
            className={dangerBtn}
          >
            Reset Demo Data
          </button>
          {resetDone && (
            <p className="mt-3 text-[13px] font-bold text-badge-green-text">
              Demo data cleared. Added products and consultation types have
              been removed.
            </p>
          )}
        </Panel>
      </div>

      <ConfirmDialog
        open={logoutOpen}
        onClose={() => setLogoutOpen(false)}
        onConfirm={() => {
          setLogoutOpen(false);
          logout().finally(() => router.push("/login"));
        }}
        title="Logout?"
        message="You will be signed out of the admin console on this device."
        confirmLabel="Logout"
        danger
      />

      <ConfirmDialog
        open={resetOpen}
        onClose={() => setResetOpen(false)}
        onConfirm={() => {
          try {
            window.localStorage.removeItem("denisco_admin_products");
            window.localStorage.removeItem("denisco_admin_consult_types");
          } catch {
            // ignore unavailable storage
          }
          setResetDone(true);
          setResetOpen(false);
        }}
        title="Reset Demo Data?"
        message="This will permanently clear all data and restore the initial demo state. This action cannot be undone."
        confirmLabel="Reset Everything"
        danger
      />
    </>
  );
}
