"use client";

import { useEffect, useRef } from "react";
import { X } from "lucide-react";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  wide?: boolean;
  children: React.ReactNode;
}

export function Modal({ open, onClose, title, wide, children }: ModalProps) {
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
      className="m-auto max-h-[85dvh] w-[92vw] max-w-[520px] overflow-y-auto rounded-[18px] border border-line bg-white p-0 shadow-[var(--shadow-lg)] backdrop:bg-black/50 backdrop:backdrop-blur-[4px] open:flex open:flex-col"
      style={wide ? { maxWidth: 720 } : undefined}
    >
      {title && (
        <div className="flex items-center justify-between border-b border-line px-7 py-5">
          <h2 className="m-0 text-lg font-semibold">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="grid size-9 place-items-center rounded-[10px] text-muted transition-colors hover:bg-cream-deep hover:text-forest"
          >
            <X size={18} />
          </button>
        </div>
      )}
      <div className="flex-1 overflow-y-auto p-7">{children}</div>
    </dialog>
  );
}
