"use client";

import { Menu } from "lucide-react";

interface AdminTopbarProps {
  title: string;
  info?: string;
  onToggleSidebar: () => void;
}

export function AdminTopbar({ title, info, onToggleSidebar }: AdminTopbarProps) {
  return (
    <div className="mb-7 flex flex-wrap items-center justify-between gap-[14px] max-sm:mb-[18px]">
      <div className="flex min-w-0 items-center gap-3">
        <button
          type="button"
          onClick={onToggleSidebar}
          className="inline-flex size-10 items-center justify-center rounded-[10px] border border-line bg-white text-forest lg:hidden"
          aria-label="Toggle sidebar"
        >
          <Menu size={20} />
        </button>
        <h1 className="m-0 font-heading text-[26px] font-semibold text-forest max-sm:text-[21px] max-sm:break-words">
          {title}
        </h1>
      </div>
      {info && (
        <span className="text-[13px] text-muted max-sm:hidden">{info}</span>
      )}
    </div>
  );
}
