"use client";

import { useState } from "react";
import { AdminTopbar } from "@/components/layout/admin-topbar";
import { useSidebarToggle } from "../layout";
import { Panel, PanelHead } from "@/components/ui/panel";
import { DataTable } from "@/components/ui/data-table";
import { Modal } from "@/components/ui/modal";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { MoneyFromKobo, fmtDate } from "@/lib/utils/format";
import { BOOKING_STATUSES } from "@/lib/constants";
import { Loader2, Plus, Pencil, Trash2, X } from "lucide-react";
import { StatusPill } from "@/components/ui/status-pill";
import { ApiRequestError } from "@/lib/api/client";
import {
  consultationTypeSchema,
  firstIssue,
} from "@/lib/validation/schemas";
import {
  useAddSlots,
  useAdminBookings,
  useAvailability,
  useConsultationTypes,
  useCreateType,
  useDeleteType,
  useRemoveSlots,
  useUpdateBookingStatus,
  useUpdateType,
} from "@/features/consultations/hooks";
import type {
  Booking,
  BookingStatus,
  ConsultationType,
} from "@/features/consultations/types";

const EMPTY_TYPE_FORM = {
  name: "",
  duration: "60",
  price: "",
  description: "",
};

export default function ConsultationsPage() {
  const toggleSidebar = useSidebarToggle();
  const [typeModalOpen, setTypeModalOpen] = useState(false);
  const [typeDeleteOpen, setTypeDeleteOpen] = useState(false);
  const [editTypeId, setEditTypeId] = useState<string | null>(null);
  const [typeDeleteId, setTypeDeleteId] = useState<string | null>(null);
  const [typeForm, setTypeForm] = useState(EMPTY_TYPE_FORM);
  const [formError, setFormError] = useState("");

  const { data: types = [], isPending: typesPending } = useConsultationTypes();
  const createType = useCreateType();
  const updateType = useUpdateType();
  const deleteType = useDeleteType();

  const [bookingSearch, setBookingSearch] = useState("");
  const { data: bookingData, isPending: bookingsPending } = useAdminBookings({
    search: bookingSearch || undefined,
  });
  const updateBookingStatus = useUpdateBookingStatus();
  const bookings = bookingData?.data ?? [];

  // The availability grid lives on the server; the calendar below only picks
  // which dates to send.
  const { data: availability } = useAvailability();
  const addSlots = useAddSlots();
  const removeSlots = useRemoveSlots();

  const availableDates = availability?.dates ?? [];
  const availableTimes = availability?.times ?? [];

  const [selectedMonth, setSelectedMonth] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  });
  const [selectedDates, setSelectedDates] = useState<string[]>([]);
  const [newTime, setNewTime] = useState("09:00");

  function updateTypeForm(field: string, value: string) {
    setTypeForm((prev) => ({ ...prev, [field]: value }));
  }

  function openAddType() {
    setEditTypeId(null);
    setTypeForm(EMPTY_TYPE_FORM);
    setFormError("");
    setTypeModalOpen(true);
  }

  function openEditType(t: ConsultationType) {
    setEditTypeId(t.id);
    setTypeForm({
      name: t.name,
      duration: String(t.duration_minutes),
      // The form works in naira; the API stores kobo.
      price: String(t.price / 100),
      description: t.description,
    });
    setFormError("");
    setTypeModalOpen(true);
  }

  async function saveType(e: React.FormEvent) {
    e.preventDefault();
    setFormError("");

    const parsed = consultationTypeSchema.safeParse(typeForm);
    if (!parsed.success) {
      setFormError(firstIssue(parsed.error));
      return;
    }

    const input = {
      name: parsed.data.name,
      duration_minutes: Number(parsed.data.duration),
      // The form is in naira; the API stores kobo.
      price: Math.round(Number(parsed.data.price) * 100),
      description: parsed.data.description,
    };

    try {
      if (editTypeId) {
        await updateType.mutateAsync({ id: editTypeId, input });
      } else {
        await createType.mutateAsync(input);
      }
      setTypeModalOpen(false);
    } catch (error) {
      setFormError(
        error instanceof ApiRequestError
          ? error.message
          : "The consultation type could not be saved.",
      );
    }
  }

  async function confirmDeleteType() {
    if (!typeDeleteId) return;
    try {
      await deleteType.mutateAsync(typeDeleteId);
      setTypeDeleteOpen(false);
      setTypeDeleteId(null);
    } catch (error) {
      // A type with bookings cannot be deleted; the dialog stays open so the
      // reason is visible rather than vanishing.
      setFormError(
        error instanceof ApiRequestError
          ? error.message
          : "The consultation type could not be deleted.",
      );
      setTypeDeleteOpen(false);
    }
  }

  function toggleDate(dateStr: string) {
    setSelectedDates((prev) =>
      prev.includes(dateStr)
        ? prev.filter((d) => d !== dateStr)
        : [...prev, dateStr],
    );
  }

  // The API normalises a 24-hour time input into the label the site shows, so
  // the raw value is sent as typed.
  function addTime() {
    if (!newTime) return;
    addSlots.mutate({ times: [newTime] });
    setNewTime("09:00");
  }

  function removeTime(time: string) {
    removeSlots.mutate({ times: [time] });
  }

  // Build calendar grid for selected month
  const [year, month] = selectedMonth.split("-").map(Number);
  const firstDay = new Date(year, month - 1, 1).getDay();
  const daysInMonth = new Date(year, month, 0).getDate();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const calendarCells: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) calendarCells.push(null);
  for (let d = 1; d <= daysInMonth; d++) calendarCells.push(d);

  const bookingColumns = [
    { key: "reference", header: "Ref" },
    {
      key: "client",
      header: "Client",
      render: (row: Booking) => (
        <div>
          <strong className="block text-[13px]">{row.name}</strong>
          <span className="text-[11px] text-muted">{row.email}</span>
        </div>
      ),
    },
    { key: "type_name", header: "Type" },
    {
      key: "date",
      header: "Date",
      render: (row: Booking) => fmtDate(row.date),
    },
    { key: "time", header: "Time" },
    {
      key: "fee",
      header: "Fee",
      render: (row: Booking) =>
        row.type_price > 0 ? MoneyFromKobo(row.type_price) : "Free",
    },
    {
      key: "payment_status",
      header: "Payment",
      // The consultation fee is taken through Paystack, so this is the
      // settled state of the booking's latest attempt. A paid fee also
      // confirms the booking; a failed one leaves the time held so the
      // customer can retry.
      render: (row: Booking) => <StatusPill status={row.payment_status} />,
    },
    {
      key: "current",
      header: "Current",
      render: (row: Booking) => <StatusPill status={row.status} />,
    },
    {
      key: "status",
      header: "Update",
      render: (row: Booking) => (
        <select
          value={row.status}
          disabled={updateBookingStatus.isPending}
          onChange={(event) =>
            updateBookingStatus.mutate({
              id: row.id,
              status: event.target.value as BookingStatus,
            })
          }
          className="rounded-[8px] border border-line bg-white px-2 py-1 text-[12px] font-bold capitalize disabled:opacity-45"
        >
          {BOOKING_STATUSES.map((s) => (
            <option key={s} value={s}>
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </option>
          ))}
        </select>
      ),
    },
  ];

  return (
    <>
      <AdminTopbar title="Consultations" onToggleSidebar={toggleSidebar} />

      {/* Section 1: Bookings */}
      <Panel className="mb-5">
        <PanelHead>
          <h3 className="m-0 text-[17px] font-semibold">
            Consultation Bookings ({bookingData?.meta?.total ?? bookings.length})
          </h3>
          <input
            type="search"
            value={bookingSearch}
            onChange={(event) => setBookingSearch(event.target.value)}
            placeholder="Search by reference, name or email…"
            className="rounded-full border border-line bg-white px-4 py-[9px] text-[13px] outline-none focus:border-olive"
          />
        </PanelHead>

        {bookingsPending ? (
          <div className="flex min-h-[180px] items-center justify-center">
            <Loader2
              size={26}
              className="animate-spin text-olive"
              aria-label="Loading bookings"
            />
          </div>
        ) : (
          <DataTable
            columns={bookingColumns}
            data={bookings}
            emptyMessage="No consultation bookings yet."
          />
        )}
      </Panel>

      {/* Section 2: Consultation Types */}
      <Panel className="mb-5">
        {formError && !typeModalOpen && (
          <div className="mb-4 rounded-[10px] bg-badge-red-bg px-4 py-3 text-sm font-bold text-badge-red-text">
            {formError}
          </div>
        )}
        <PanelHead>
          <h3 className="m-0 text-[17px] font-semibold">Consultation Types</h3>
          <button
            type="button"
            onClick={openAddType}
            className="inline-flex items-center gap-2 rounded-full bg-forest px-5 py-[11px] text-[13px] font-bold text-white transition-all hover:-translate-y-0.5 hover:bg-olive"
          >
            <Plus size={15} /> Add Type
          </button>
        </PanelHead>
        {typesPending ? (
          <div className="flex min-h-[140px] items-center justify-center">
            <Loader2
              size={24}
              className="animate-spin text-olive"
              aria-label="Loading consultation types"
            />
          </div>
        ) : types.length === 0 ? (
          <p className="text-sm text-muted">
            No consultation types configured. Add types to allow clients to
            book.
          </p>
        ) : (
          <div className="space-y-3">
            {types.map((t) => (
              <div
                key={t.id}
                className="flex flex-wrap items-center justify-between gap-3.5 rounded-[14px] border border-line bg-cream p-4"
              >
                <div className="min-w-0">
                  <h4 className="m-0 mb-1 text-[15px] font-semibold">{t.name}</h4>
                  {t.description && (
                    <p className="mb-1.5 text-[13px] text-muted">
                      {t.description}
                    </p>
                  )}
                  <span className="text-[12px] font-bold text-olive">
                    {t.duration} · {MoneyFromKobo(t.price)}
                    {!t.active && " · inactive"}
                  </span>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => openEditType(t)}
                    className="grid size-[32px] place-items-center rounded-[8px] border border-line text-muted transition-colors hover:bg-cream-deep hover:text-forest"
                    aria-label={`Edit ${t.name}`}
                  >
                    <Pencil size={14} />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setTypeDeleteId(t.id);
                      setTypeDeleteOpen(true);
                    }}
                    className="grid size-[32px] place-items-center rounded-[8px] border border-line text-muted transition-colors hover:bg-badge-red-bg hover:text-danger"
                    aria-label={`Delete ${t.name}`}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Panel>

      {/* Section 3: Booking Availability */}
      <div className="grid grid-cols-2 gap-5 [@media(max-width:1024px)]:grid-cols-1">
        {/* Date availability */}
        <Panel>
          <PanelHead>
            <h3 className="m-0 text-[17px] font-semibold">Date Availability</h3>
          </PanelHead>
          <input
            type="month"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="mb-4 rounded-[10px] border-[1.5px] border-line bg-white px-4 py-[9px] text-sm outline-none focus:border-olive"
          />

          {/* Calendar grid */}
          <div className="mb-4 grid grid-cols-7 gap-1">
            {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
              <div
                key={d}
                className="py-1 text-center text-[10px] font-extrabold uppercase text-muted"
              >
                {d}
              </div>
            ))}
            {calendarCells.map((day, i) => {
              if (day === null) return <div key={`e-${i}`} />;
              const dateStr = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
              const cellDate = new Date(year, month - 1, day);
              const isPast = cellDate < today;
              const isAvailable = availableDates.includes(dateStr);
              const isSelected = selectedDates.includes(dateStr);

              return (
                <button
                  key={dateStr}
                  type="button"
                  disabled={isPast}
                  onClick={() => toggleDate(dateStr)}
                  className={`rounded-[8px] py-2 text-[13px] font-bold transition-colors ${
                    isPast
                      ? "text-muted/40"
                      : isSelected
                        ? "bg-forest text-white"
                        : isAvailable
                          ? "bg-badge-green-bg text-badge-green-text"
                          : "hover:bg-cream-deep"
                  }`}
                >
                  {day}
                </button>
              );
            })}
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => {
                // Sending dates without times reuses the times already on
                // offer, which is what picking dates on the calendar means.
                addSlots.mutate(
                  { dates: selectedDates },
                  { onSuccess: () => setSelectedDates([]) },
                );
              }}
              disabled={selectedDates.length === 0 || addSlots.isPending}
              className="flex-1 rounded-full bg-forest px-4 py-[9px] text-[12px] font-bold text-white transition-all hover:bg-olive disabled:opacity-45"
            >
              Make Available
            </button>
            <button
              type="button"
              onClick={() => {
                removeSlots.mutate(
                  { dates: selectedDates },
                  { onSuccess: () => setSelectedDates([]) },
                );
              }}
              disabled={selectedDates.length === 0 || removeSlots.isPending}
              className="flex-1 rounded-full border-2 border-danger bg-transparent px-4 py-[9px] text-[12px] font-bold text-danger transition-all hover:bg-danger hover:text-white disabled:opacity-45"
            >
              Remove Selected
            </button>
          </div>

          {availableDates.length > 0 && (
            <div className="mt-4">
              <span className="mb-2 block text-[11px] font-extrabold uppercase text-muted">
                Available dates
              </span>
              <div className="flex flex-wrap gap-1.5">
                {availableDates.map((d) => (
                  <span
                    key={d}
                    className="inline-flex items-center gap-1.5 rounded-full bg-cream-deep px-3 py-[5px] text-[11px] font-bold text-forest"
                  >
                    {d}
                    <button
                      type="button"
                      onClick={() => removeSlots.mutate({ dates: [d] })}
                      aria-label={`Close ${d}`}
                      className="text-muted hover:text-danger"
                    >
                      <X size={10} />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )}
        </Panel>

        {/* Time availability */}
        <Panel>
          <PanelHead>
            <h3 className="m-0 text-[17px] font-semibold">Time Availability</h3>
          </PanelHead>

          <div className="mb-4 flex gap-2">
            <input
              type="time"
              value={newTime}
              onChange={(e) => setNewTime(e.target.value)}
              className="rounded-[10px] border-[1.5px] border-line bg-white px-4 py-[9px] text-sm outline-none focus:border-olive"
            />
            <button
              type="button"
              onClick={addTime}
              className="inline-flex items-center gap-1.5 rounded-full bg-forest px-5 py-[9px] text-[13px] font-bold text-white transition-all hover:bg-olive"
            >
              <Plus size={14} /> Add Time
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            {availableTimes.map((time) => (
              <span
                key={time}
                className="inline-flex items-center gap-2 rounded-full bg-cream-deep px-4 py-[7px] text-[13px] font-bold text-forest"
              >
                {time}
                <button
                  type="button"
                  onClick={() => removeTime(time)}
                  aria-label={`Remove ${time}`}
                  className="text-muted hover:text-danger"
                >
                  <X size={12} />
                </button>
              </span>
            ))}
          </div>

          {availableTimes.length === 0 && (
            <p className="mt-4 text-sm text-muted">
              No time slots configured. Add time slots above.
            </p>
          )}
        </Panel>
      </div>

      {/* Add/Edit type modal */}
      <Modal
        open={typeModalOpen}
        onClose={() => setTypeModalOpen(false)}
        title={editTypeId ? "Edit Consultation Type" : "Add Consultation Type"}
      >
        <form onSubmit={saveType}>
          {formError && (
            <div className="mb-4 rounded-[10px] bg-badge-red-bg px-4 py-3 text-sm font-bold text-badge-red-text">
              {formError}
            </div>
          )}
          <div className="space-y-5">
            <div>
              <label className="mb-2 block text-[13px] font-bold text-forest" htmlFor="ct-name">
                Type Name
              </label>
              <input id="ct-name"
                type="text"
                value={typeForm.name}
                onChange={(e) => updateTypeForm("name", e.target.value)}
                className="w-full rounded-[10px] border-[1.5px] border-line bg-white px-4 py-[13px] text-sm outline-none focus:border-olive"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-5">
              <div>
                <label className="mb-2 block text-[13px] font-bold text-forest" htmlFor="ct-duration">
                  Duration (minutes)
                </label>
                <input id="ct-duration"
                  type="number"
                  value={typeForm.duration}
                  onChange={(e) => updateTypeForm("duration", e.target.value)}
                  className="w-full rounded-[10px] border-[1.5px] border-line bg-white px-4 py-[13px] text-sm outline-none focus:border-olive"
                  min="15"
                  step="15"
                  required
                />
              </div>
              <div>
                <label className="mb-2 block text-[13px] font-bold text-forest" htmlFor="ct-price">
                  Price ₦
                </label>
                <input id="ct-price"
                  type="number"
                  value={typeForm.price}
                  onChange={(e) => updateTypeForm("price", e.target.value)}
                  className="w-full rounded-[10px] border-[1.5px] border-line bg-white px-4 py-[13px] text-sm outline-none focus:border-olive"
                  min="0"
                  step="0.01"
                  required
                />
              </div>
            </div>
            <div>
              <label className="mb-2 block text-[13px] font-bold text-forest" htmlFor="ct-description">
                Description
              </label>
              <textarea id="ct-description"
                value={typeForm.description}
                onChange={(e) =>
                  updateTypeForm("description", e.target.value)
                }
                rows={3}
                className="w-full rounded-[10px] border-[1.5px] border-line bg-white px-4 py-[13px] text-sm outline-none focus:border-olive"
              />
            </div>
          </div>
          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setTypeModalOpen(false)}
              className="rounded-full border-2 border-forest bg-transparent px-6 py-[11px] text-sm font-bold text-forest transition-all hover:bg-forest hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-full bg-forest px-6 py-[11px] text-sm font-bold text-white transition-all hover:-translate-y-0.5 hover:bg-olive"
            >
              {createType.isPending || updateType.isPending
                ? "Saving…"
                : editTypeId
                  ? "Update Type"
                  : "Add Type"}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={typeDeleteOpen}
        onClose={() => setTypeDeleteOpen(false)}
        onConfirm={confirmDeleteType}
        title="Delete Consultation Type?"
        message="This permanently removes the consultation type. A type that already has bookings cannot be deleted — deactivate it instead."
        confirmLabel="Delete Type"
        danger
      />
    </>
  );
}
