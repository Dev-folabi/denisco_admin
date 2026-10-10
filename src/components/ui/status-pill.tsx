type StatusVariant = "success" | "warning" | "danger" | "info" | "neutral";

const VARIANT_MAP: Record<StatusVariant, string> = {
  success: "bg-badge-green-bg text-badge-green-text",
  warning: "bg-badge-amber-bg text-badge-amber-text",
  danger: "bg-badge-red-bg text-badge-red-text",
  info: "bg-badge-blue-bg text-badge-blue-text",
  neutral: "bg-badge-grey-bg text-badge-grey-text",
};

const STATUS_VARIANTS: Record<string, StatusVariant> = {
  paid: "success",
  successful: "success",
  completed: "success",
  confirmed: "success",
  delivered: "success",
  active: "success",
  in_stock: "success",
  processing: "info",
  dispatched: "info",
  shipped: "info",
  pending: "warning",
  pending_payment: "warning",
  initialized: "warning",
  low_stock: "warning",
  failed: "danger",
  cancelled: "danger",
  out_of_stock: "danger",
  abandoned: "neutral",
  expired: "neutral",
  refunded: "neutral",
  no_show: "danger",
  // A free consultation has no fee to settle, so it reads as a plain fact
  // rather than as something outstanding.
  not_required: "neutral",
};

interface StatusPillProps {
  status: string;
  variant?: StatusVariant;
  className?: string;
}

export function StatusPill({ status, variant, className = "" }: StatusPillProps) {
  const v = variant || STATUS_VARIANTS[status] || "neutral";
  const label = status.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

  return (
    <span
      className={`inline-block rounded-full px-[13px] py-[5px] text-[11.5px] font-extrabold ${VARIANT_MAP[v]} ${className}`}
    >
      {label}
    </span>
  );
}
