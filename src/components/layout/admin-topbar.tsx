"use client";

import { Menu } from "lucide-react";
import { useAuth } from "@/lib/auth/auth-provider";

interface AdminTopbarProps {
  title: string;
  /** Optional context line; defaults to the signed-in administrator. */
  info?: string;
  onToggleSidebar: () => void;
}

export function AdminTopbar({ title, info, onToggleSidebar }: AdminTopbarProps) {
  const { user } = useAuth();

  // Showing who is signed in matters on a shared console: every action here is
  // audited against this account.
  const context =
    info ?? (user ? `Signed in as ${user.full_name || user.email}` : undefined);

  return (
    <div className="mb-7 flex flex-wrap items-center justify-between gap-[14px] [@media(max-width:640px)]:mb-[18px]">
      <div className="flex min-w-0 items-center gap-3">
        <button
          type="button"
          onClick={onToggleSidebar}
          className="inline-flex size-10 items-center justify-center rounded-[10px] border border-line bg-white text-forest lg:hidden"
          aria-label="Toggle sidebar"
        >
          <Menu size={20} />
        </button>
        <h1 className="m-0 font-heading text-[26px] font-semibold text-forest [@media(max-width:640px)]:text-[21px] [@media(max-width:640px)]:break-words">
          {title}
        </h1>
      </div>
      {context && (
        <span className="text-[13px] text-muted [@media(max-width:640px)]:hidden">
          {context}
        </span>
      )}
    </div>
  );
}
