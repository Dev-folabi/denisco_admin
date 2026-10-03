"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  CreditCard,
  CalendarCheck,
  Settings,
  ExternalLink,
  LogOut,
  X,
} from "lucide-react";
import { useAuth } from "@/lib/auth/auth-provider";
import { ADMIN } from "@/lib/constants";

const ICONS: Record<string, React.ElementType> = {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  CreditCard,
  CalendarCheck,
  Settings,
};

const NAV_ITEMS = [
  { label: "Dashboard", href: "/dashboard", icon: "LayoutDashboard" },
  { label: "Products", href: "/products", icon: "Package" },
  { label: "Orders", href: "/orders", icon: "ShoppingCart" },
  { label: "Customers", href: "/customers", icon: "Users" },
  { label: "Transactions", href: "/payments", icon: "CreditCard" },
  { label: "Consultations", href: "/consultations", icon: "CalendarCheck" },
];

interface AdminSidebarProps {
  open: boolean;
  onClose: () => void;
}

export function AdminSidebar({ open, onClose }: AdminSidebarProps) {
  const pathname = usePathname();
  const { logout } = useAuth();

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href + "/");

  return (
    <>
      <button
        type="button"
        className={`fixed inset-0 z-[290] border-0 bg-[rgba(14,34,19,0.55)] transition-all duration-250 lg:hidden ${
          open ? "visible opacity-100" : "invisible opacity-0"
        }`}
        onClick={onClose}
        aria-label="Close sidebar"
      />

      <aside
        className={`fixed left-0 top-0 z-[300] flex h-dvh w-[min(88vw,320px)] flex-col overflow-y-auto bg-forest-deep p-5 text-[#c7dcbe] shadow-lg transition-transform duration-250 ease-out lg:sticky lg:z-auto lg:w-[260px] lg:translate-x-0 lg:shadow-none ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="mb-6 flex items-center gap-2.5 px-1.5 lg:mb-[34px]">
          <Image
            src="https://ik.imagekit.io/a8q3rfdl1/DENISCO%20FARM%20MEDIA/Company%20logo.jpeg"
            alt="DENISCO logo"
            width={40}
            height={40}
            className="size-10 rounded-full border border-white/20 bg-white object-cover"
          />
          <div className="flex flex-col text-white">
            <strong className="font-heading text-[15px]">{ADMIN.name}</strong>
            <small className="text-[10.5px] font-bold uppercase tracking-[1.6px] text-[#a9c69d]">
              {ADMIN.subtitle}
            </small>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="ml-auto inline-grid size-9 place-items-center rounded-full border border-white/[.18] bg-white/[.08] text-white lg:hidden"
            aria-label="Close sidebar"
          >
            <X size={18} />
          </button>
        </div>

        <nav className="flex flex-1 flex-col">
          {NAV_ITEMS.map((item) => {
            const Icon = ICONS[item.icon];
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`mb-[5px] flex items-center gap-[13px] rounded-[10px] px-[15px] py-[13px] text-[13.5px] font-bold transition-colors ${
                  isActive(item.href)
                    ? "bg-white/10 text-white"
                    : "text-[#a9c69d] hover:bg-white/10 hover:text-white"
                }`}
              >
                <Icon size={18} />
                {item.label}
              </Link>
            );
          })}

          <div className="my-[18px] border-t border-white/[.14]" />

          <Link
            href="/settings"
            onClick={onClose}
            className={`mb-[5px] flex items-center gap-[13px] rounded-[10px] px-[15px] py-[13px] text-[13.5px] font-bold transition-colors ${
              isActive("/settings")
                ? "bg-white/10 text-white"
                : "text-[#a9c69d] hover:bg-white/10 hover:text-white"
            }`}
          >
            <Settings size={18} />
            Settings
          </Link>

          <a
            href={ADMIN.webUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mb-[5px] flex items-center gap-[13px] rounded-[10px] px-[15px] py-[13px] text-[13.5px] font-bold text-[#a9c69d] transition-colors hover:bg-white/10 hover:text-white"
          >
            <ExternalLink size={18} />
            Back to Website
          </a>

          <button
            type="button"
            onClick={() => {
              logout();
              onClose();
            }}
            className="mt-auto flex items-center gap-[13px] rounded-[10px] border-0 bg-transparent px-[15px] py-[13px] text-[13.5px] font-bold text-[#a9c69d] transition-colors hover:bg-white/10 hover:text-white"
          >
            <LogOut size={18} />
            Logout
          </button>
        </nav>
      </aside>
    </>
  );
}
