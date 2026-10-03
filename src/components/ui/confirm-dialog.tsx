"use client";

import { useEffect, useRef } from "react";
import { X } from "lucide-react";

interface ConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  danger?: boolean;
  loading?: boolean;
}

export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = "Yes, Continue",
  danger,
  loading,
}: ConfirmDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const el = dialogRef.current;
    if (!el) return;
    if (open && !el.open) el.showModal();
    if (!open && el.open) el.close();
  }, [open]);

  useEffect(() => {
    const el = dialogRef.current;
    if (!el) return;
    const handleClose = () => onClose();
    el.addEventListener("close", handleClose);
    return () => el.removeEventListener("close", handleClose);
  }, [onClose]);

  return (
    <dialog
      ref={dialogRef}
      className="m-auto w-[92vw] max-w-[440px] rounded-[24px] border border-line bg-white p-0 shadow-[var(--shadow-lg)] backdrop:bg-[rgba(14,34,19,0.6)] backdrop:backdrop-blur-[4px]"
    >
      <div className="flex items-center justify-between border-b border-line px-7 py-5">
        <h2 className="m-0 text-lg font-semibold">{title}</h2>
        <button
          type="button"
          onClick={onClose}
          className="grid size-9 place-items-center rounded-full text-muted transition-colors hover:bg-cream-deep hover:text-forest"
        >
          <X size={18} />
        </button>
      </div>
      <div className="p-7">
        <p className="mb-6 text-sm text-muted">{message}</p>
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border-2 border-forest bg-transparent px-6 py-[11px] text-sm font-bold text-forest transition-all hover:bg-forest hover:text-white"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className={`rounded-full px-6 py-[11px] text-sm font-bold transition-all hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-45 ${
              danger ? "bg-[#fbe7e1] text-danger hover:bg-danger hover:text-white" : "bg-forest text-white hover:bg-olive"
            }`}
          >
            {loading ? "Processing…" : confirmLabel}
          </button>
        </div>
      </div>
    </dialog>
  );
}
