"use client";

import { useState } from "react";
import { usePersistedState } from "@/hooks/use-persisted-state";
import { AdminTopbar } from "@/components/layout/admin-topbar";
import { useSidebarToggle } from "../layout";
import { Panel, PanelHead } from "@/components/ui/panel";
import { DataTable } from "@/components/ui/data-table";
import { Modal } from "@/components/ui/modal";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { MoneyFromKobo, fmtDate } from "@/lib/utils/format";
import { BOOKING_STATUSES } from "@/lib/constants";
import { Plus, Pencil, Trash2, X } from "lucide-react";

const EMPTY_TYPE_FORM = {
  name: "",
  duration: "60",
  price: "",
  description: "",
};

interface ConsultType {
  id: string;
  name: string;
  duration: number;
  price: number;
  description: string;
}

export default function ConsultationsPage() {
  const toggleSidebar = useSidebarToggle();
  const [typeModalOpen, setTypeModalOpen] = useState(false);
  const [typeDeleteOpen, setTypeDeleteOpen] = useState(false);
  const [editTypeId, setEditTypeId] = useState<string | null>(null);
  const [typeDeleteId, setTypeDeleteId] = useState<string | null>(null);
  const [typeForm, setTypeForm] = useState(EMPTY_TYPE_FORM);
  const [types, setTypes] = usePersistedState<ConsultType[]>(
    "denisco_admin_consult_types",
    [],
  );

  // Date availability state
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  });
  const [availableDates, setAvailableDates] = useState<string[]>([]);
  const [selectedDates, setSelectedDates] = useState<string[]>([]);

  // Time availability state
  const [newTime, setNewTime] = useState("09:00");
  const [availableTimes, setAvailableTimes] = useState<string[]>([
    "09:00 AM",
    "11:00 AM",
    "01:00 PM",
    "03:00 PM",
  ]);

  function updateTypeForm(field: string, value: string) {
    setTypeForm((prev) => ({ ...prev, [field]: value }));
  }

  function openAddType() {
    setEditTypeId(null);
    setTypeForm(EMPTY_TYPE_FORM);
    setTypeModalOpen(true);
  }

  function openEditType(t: ConsultType) {
    setEditTypeId(t.id);
    setTypeForm({
      name: t.name,
      duration: String(t.duration),
      price: String(t.price / 100),
      description: t.description,
    });
    setTypeModalOpen(true);
  }

  function saveType(e: React.FormEvent) {
    e.preventDefault();
    const duration = Number(typeForm.duration);
    const price = Math.round(Number(typeForm.price) * 100);
    const patch = {
      name: typeForm.name,
      duration,
      price,
      description: typeForm.description,
    };
    if (editTypeId) {
      setTypes((prev) =>
        prev.map((t) => (t.id === editTypeId ? { ...t, ...patch } : t)),
      );
    } else {
      setTypes((prev) => [...prev, { id: `CT-${Date.now()}`, ...patch }]);
    }
    setTypeModalOpen(false);
  }

  function toggleDate(dateStr: string) {
    setSelectedDates((prev) =>
      prev.includes(dateStr)
        ? prev.filter((d) => d !== dateStr)
        : [...prev, dateStr],
    );
  }

  function addTime() {
    if (!newTime) return;
    const [h, m] = newTime.split(":");
    const hour = parseInt(h, 10);
    const formatted = `${String(hour > 12 ? hour - 12 : hour || 12).padStart(2, "0")}:${m} ${hour >= 12 ? "PM" : "AM"}`;
    if (!availableTimes.includes(formatted)) {
      setAvailableTimes((prev) => [...prev, formatted].sort());
    }
    setNewTime("09:00");
  }

  function removeTime(time: string) {
    setAvailableTimes((prev) => prev.filter((t) => t !== time));
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
    { key: "ref", header: "Ref" },
    {
      key: "client",
      header: "Client",
      render: (row: Record<string, unknown>) => (
        <div>
          <strong className="block text-[13px]">{row.name as string}</strong>
          <span className="text-[11px] text-muted">{row.email as string}</span>
        </div>
      ),
    },
    { key: "type_name", header: "Type" },
    {
      key: "date",
      header: "Date",
      render: (row: Record<string, unknown>) =>
        fmtDate(row.date as string),
    },
    { key: "time", header: "Time" },
    {
      key: "status",
      header: "Status",
      render: (row: Record<string, unknown>) => (
        <select
          value={row.status as string}
          onChange={() => {}}
          className="rounded-[8px] border border-line bg-white px-2 py-1 text-[12px] font-bold capitalize"
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
            Consultation Bookings (0)
          </h3>
        </PanelHead>
        <DataTable
          columns={bookingColumns}
          data={[]}
          emptyMessage="No consultation bookings yet."
        />
      </Panel>

      {/* Section 2: Consultation Types */}
      <Panel className="mb-5">
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
        {types.length === 0 ? (
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
                    {t.duration} mins · {MoneyFromKobo(t.price)}
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
                setAvailableDates((prev) => [
                  ...new Set([...prev, ...selectedDates]),
                ]);
                setSelectedDates([]);
              }}
              disabled={selectedDates.length === 0}
              className="flex-1 rounded-full bg-forest px-4 py-[9px] text-[12px] font-bold text-white transition-all hover:bg-olive disabled:opacity-45"
            >
              Make Available
            </button>
            <button
              type="button"
              onClick={() => {
                setAvailableDates((prev) =>
                  prev.filter((d) => !selectedDates.includes(d)),
                );
                setSelectedDates([]);
              }}
              disabled={selectedDates.length === 0}
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
                {availableDates.sort().map((d) => (
                  <span
                    key={d}
                    className="inline-flex items-center gap-1.5 rounded-full bg-cream-deep px-3 py-[5px] text-[11px] font-bold text-forest"
                  >
                    {d}
                    <button
                      type="button"
                      onClick={() =>
                        setAvailableDates((prev) =>
                          prev.filter((x) => x !== d),
                        )
                      }
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
          <div className="space-y-5">
            <div>
              <label className="mb-2 block text-[13px] font-bold text-forest">
                Type Name
              </label>
              <input
                type="text"
                value={typeForm.name}
                onChange={(e) => updateTypeForm("name", e.target.value)}
                className="w-full rounded-[10px] border-[1.5px] border-line bg-white px-4 py-[13px] text-sm outline-none focus:border-olive"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-5">
              <div>
                <label className="mb-2 block text-[13px] font-bold text-forest">
                  Duration (minutes)
                </label>
                <input
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
                <label className="mb-2 block text-[13px] font-bold text-forest">
                  Price ₦
                </label>
                <input
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
              <label className="mb-2 block text-[13px] font-bold text-forest">
                Description
              </label>
              <textarea
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
              {editTypeId ? "Update Type" : "Add Type"}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={typeDeleteOpen}
        onClose={() => setTypeDeleteOpen(false)}
        onConfirm={() => {
          setTypes((prev) => prev.filter((t) => t.id !== typeDeleteId));
          setTypeDeleteId(null);
          setTypeDeleteOpen(false);
        }}
        title="Delete Consultation Type?"
        message="This will permanently remove this consultation type."
        confirmLabel="Delete Type"
        danger
      />
    </>
  );
}
