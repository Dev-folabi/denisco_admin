import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string;
  icon: LucideIcon;
}

export function StatCard({ label, value, icon: Icon }: StatCardProps) {
  return (
    <div className="flex flex-col gap-2 rounded-[18px] border-l-4 border-l-olive bg-white p-6 shadow-[var(--shadow-default)] [@media(max-width:640px)]:p-4">
      <div className="mb-2 grid size-[42px] place-items-center rounded-full bg-cream-deep text-forest [@media(max-width:640px)]:size-9">
        <Icon size={18} />
      </div>
      <span className="font-heading text-[25px] font-bold text-forest [@media(max-width:640px)]:text-xl">
        {value}
      </span>
      <span className="text-xs text-muted">{label}</span>
    </div>
  );
}
