"use client";

import { useState } from "react";
import { Loader2, Pencil, Plus, Trash2, X } from "lucide-react";
import { Panel, PanelHead } from "@/components/ui/panel";
import { DataTable } from "@/components/ui/data-table";
import { StatusPill } from "@/components/ui/status-pill";
import { Modal } from "@/components/ui/modal";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { MoneyFromKobo } from "@/lib/utils/format";
import { ApiRequestError } from "@/lib/api/client";
import { deliveryLocationSchema, firstIssue } from "@/lib/validation/schemas";
import {
  useCreateDeliveryLocation,
  useDeliveryOffering,
  useRemoveDeliveryLocation,
  useSetDeliveryEnabled,
  useUpdateDeliveryLocation,
} from "@/features/delivery/hooks";
import type { DeliveryLocation } from "@/features/delivery/types";

const inputCls =
  "w-full rounded-[10px] border-[1.5px] border-line bg-white px-4 py-[13px] text-sm outline-none focus:border-olive";
const labelCls = "mb-2 block text-[13px] font-bold text-forest";

const EMPTY_FORM = { name: "", fee: "" };
type FormState = typeof EMPTY_FORM;

/**
 * The home-delivery panel: the master switch and the areas the farm delivers
 * to, each with its own rate.
 *
 * This is a client-requested departure from `denisco_prototype.html`, which
 * prices home delivery at a flat ₦2,500 within Abuja. The farm delivers to
 * more than one area and each carries its own rate, so the fee lives on the
 * location rather than in a constant — and this panel is where staff set it.
 */
export function DeliveryPanel() {
  const { data, isPending, isError } = useDeliveryOffering();

  const setEnabled = useSetDeliveryEnabled();
  const createLocation = useCreateDeliveryLocation();
  const updateLocation = useUpdateDeliveryLocation();
  const removeLocation = useRemoveDeliveryLocation();

  const [modalOpen, setModalOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<DeliveryLocation | null>(
    null,
  );
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [formError, setFormError] = useState("");
  const [notice, setNotice] = useState("");

  const offering = data;
  const locations = offering?.locations ?? [];
  const saving = createLocation.isPending || updateLocation.isPending;

  function openAdd() {
    setEditId(null);
    setForm(EMPTY_FORM);
    setFormError("");
    setModalOpen(true);
  }

  function openEdit(location: DeliveryLocation) {
    setEditId(location.id);
    // The form works in naira; the API stores kobo.
    setForm({ name: location.name, fee: String(location.fee / 100) });
    setFormError("");
    setModalOpen(true);
  }

  function update(field: keyof FormState, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function toggleEnabled(next: boolean) {
    setNotice("");
    try {
      await setEnabled.mutateAsync(next);
      setNotice(
        next
          ? "Home delivery is on. The checkout offers it wherever an area below is active."
          : "Home delivery is off. The checkout now offers farm pickup only.",
      );
    } catch (error) {
      setNotice(
        error instanceof ApiRequestError
          ? error.message
          : "The setting could not be saved.",
      );
    }
  }

  async function saveLocation(event: React.FormEvent) {
    event.preventDefault();
    setFormError("");

    const parsed = deliveryLocationSchema.safeParse(form);
    if (!parsed.success) {
      setFormError(firstIssue(parsed.error));
      return;
    }

    // Naira in the form, kobo on the wire.
    const payload = {
      name: parsed.data.name,
      fee: Math.round(Number(parsed.data.fee) * 100),
    };

    try {
      if (editId) {
        await updateLocation.mutateAsync({ id: editId, input: payload });
      } else {
        await createLocation.mutateAsync(payload);
      }
      setModalOpen(false);
    } catch (error) {
      setFormError(
        error instanceof ApiRequestError
          ? error.message
          : "The delivery area could not be saved.",
      );
    }
  }

  async function confirmRemove() {
    if (!deleteTarget) return;

    const name = deleteTarget.name;
    try {
      await removeLocation.mutateAsync(deleteTarget.id);
      setNotice(
        `"${name}" was removed. Orders already delivered there keep their own record of it.`,
      );
    } catch (error) {
      setNotice(
        error instanceof ApiRequestError
          ? error.message
          : `"${name}" could not be removed.`,
      );
    } finally {
      setDeleteTarget(null);
      setDeleteOpen(false);
    }
  }

  const columns = [
    { key: "name", header: "Area" },
    {
      key: "fee",
      header: "Delivery Fee",
      render: (row: DeliveryLocation) => MoneyFromKobo(row.fee),
    },
    {
      key: "active",
      header: "Status",
      render: (row: DeliveryLocation) => (
        <StatusPill status={row.active ? "active" : "retired"} />
      ),
    },
    {
      key: "actions",
      header: "Actions",
      render: (row: DeliveryLocation) => (
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => openEdit(row)}
            aria-label={`Edit ${row.name}`}
            className="grid size-[32px] place-items-center rounded-[8px] border border-line text-muted transition-colors hover:bg-cream-deep hover:text-forest"
          >
            <Pencil size={14} />
          </button>
          <button
            type="button"
            onClick={() => {
              setDeleteTarget(row);
              setDeleteOpen(true);
            }}
            aria-label={`Delete ${row.name}`}
            className="grid size-[32px] place-items-center rounded-[8px] border border-line text-muted transition-colors hover:bg-badge-red-bg hover:text-danger"
          >
            <Trash2 size={14} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <>
      <Panel>
        <PanelHead>
          <h3 className="m-0 text-[17px] font-semibold">Home Delivery</h3>
          <button
            type="button"
            onClick={openAdd}
            className="inline-flex items-center gap-2 rounded-full bg-forest px-5 py-[11px] text-[13px] font-bold text-white transition-all hover:-translate-y-0.5 hover:bg-olive"
          >
            <Plus size={15} /> Add Area
          </button>
        </PanelHead>

        <p className="mb-4 text-sm text-muted">
          The farm delivers to each area below at its own rate, and the
          checkout charges the rate of the area a customer chooses. Farm
          pickup is always free. Turning home delivery off hides the option
          from the checkout without removing any area.
        </p>

        <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-[12px] border border-line bg-cream-deep px-4 py-3">
          <div>
            <p className="m-0 text-[13px] font-bold text-forest">
              Home delivery is{" "}
              {offering?.enabled ? (
                <span className="text-badge-green-text">on</span>
              ) : (
                <span className="text-danger">off</span>
              )}
            </p>
            <p className="m-0 mt-1 text-[12.5px] text-muted">
              {offering?.enabled
                ? "The checkout offers home delivery wherever an area below is active."
                : "The checkout offers farm pickup only."}
            </p>
          </div>
          <button
            type="button"
            onClick={() => toggleEnabled(!offering?.enabled)}
            disabled={setEnabled.isPending || !offering}
            className="rounded-full border border-line bg-white px-5 py-[9px] text-[13px] font-bold text-forest transition-colors hover:bg-olive hover:text-white disabled:cursor-not-allowed disabled:opacity-45"
          >
            {setEnabled.isPending
              ? "Saving…"
              : offering?.enabled
                ? "Turn Off"
                : "Turn On"}
          </button>
        </div>

        {notice && (
          <div className="mb-4 flex items-start justify-between gap-4 rounded-[10px] bg-cream-deep px-4 py-3 text-[13px] font-bold text-forest">
            <span>{notice}</span>
            <button
              type="button"
              onClick={() => setNotice("")}
              aria-label="Dismiss message"
              className="text-muted transition-colors hover:text-forest"
            >
              <X size={15} />
            </button>
          </div>
        )}

        {isPending ? (
          <div className="flex min-h-[180px] items-center justify-center">
            <Loader2
              size={26}
              className="animate-spin text-olive"
              aria-label="Loading delivery areas"
            />
          </div>
        ) : (
          <DataTable
            columns={columns}
            data={locations}
            emptyMessage={
              isError
                ? "The delivery areas could not be loaded."
                : "No delivery areas yet. Add one to offer home delivery at checkout."
            }
          />
        )}
      </Panel>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editId ? "Edit Delivery Area" : "Add Delivery Area"}
      >
        <form onSubmit={saveLocation} noValidate>
          {formError && (
            <div className="mb-4 rounded-[10px] bg-badge-red-bg px-4 py-3 text-sm font-bold text-badge-red-text">
              {formError}
            </div>
          )}

          <div className="mb-4">
            <label htmlFor="delivery-name" className={labelCls}>
              Area Name
            </label>
            <input
              id="delivery-name"
              className={inputCls}
              value={form.name}
              onChange={(event) => update("name", event.target.value)}
              placeholder="Gwarimpa"
            />
          </div>

          <div className="mb-5">
            <label htmlFor="delivery-fee" className={labelCls}>
              Delivery Fee (₦)
            </label>
            <input
              id="delivery-fee"
              className={inputCls}
              value={form.fee}
              onChange={(event) => update("fee", event.target.value)}
              placeholder="2500"
              inputMode="decimal"
            />
            <p className="mb-0 mt-1 text-[12px] text-muted">
              The flat rate for this area, in naira. Enter 0 to deliver free.
            </p>
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="rounded-full border border-line bg-white px-6 py-[11px] text-sm font-bold text-forest transition-colors hover:bg-cream-deep"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="rounded-full bg-forest px-7 py-[13px] text-sm font-bold text-white transition-all hover:-translate-y-0.5 hover:bg-olive disabled:cursor-not-allowed disabled:opacity-45"
            >
              {saving ? "Saving…" : editId ? "Save Changes" : "Add Area"}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={confirmRemove}
        title="Remove delivery area?"
        message={
          deleteTarget
            ? `"${deleteTarget.name}" will be removed from the checkout. Orders already delivered there keep their own record of it.`
            : ""
        }
        confirmLabel="Remove"
        danger
      />
    </>
  );
}
