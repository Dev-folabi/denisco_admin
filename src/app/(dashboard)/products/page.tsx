"use client";

import { useState } from "react";
import { AdminTopbar } from "@/components/layout/admin-topbar";
import { useSidebarToggle } from "../layout";
import { Panel, PanelHead } from "@/components/ui/panel";
import { DataTable } from "@/components/ui/data-table";
import { StatusPill } from "@/components/ui/status-pill";
import { Modal } from "@/components/ui/modal";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { MoneyFromKobo } from "@/lib/utils/format";
import { PRODUCT_CATEGORIES } from "@/lib/constants";
import { Plus, Pencil, Trash2 } from "lucide-react";

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  category: string;
  unit: string;
  price: number;
  stock: number;
  images: string[];
  status: string;
}

const EMPTY_FORM = {
  name: "",
  category: "poultry",
  unit: "unit",
  price: "",
  stock: "",
  description: "",
};

export default function ProductsPage() {
  const toggleSidebar = useSidebarToggle();
  const [products] = useState<Product[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);

  function openAdd() {
    setEditId(null);
    setForm(EMPTY_FORM);
    setModalOpen(true);
  }

  function openEdit(p: Product) {
    setEditId(p.id);
    setForm({
      name: p.name,
      category: p.category,
      unit: p.unit,
      price: String(p.price / 100),
      stock: String(p.stock),
      description: p.description,
    });
    setModalOpen(true);
  }

  function openDelete(id: string) {
    setDeleteId(id);
    setDeleteOpen(true);
  }

  function update(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  const columns = [
    {
      key: "image",
      header: "Image",
      render: (row: Product) => (
        <div className="size-[48px] overflow-hidden rounded-full bg-cream-deep">
          {row.images[0] && (
            <img
              src={row.images[0]}
              alt=""
              className="size-full object-cover"
            />
          )}
        </div>
      ),
    },
    { key: "name", header: "Name" },
    {
      key: "category",
      header: "Category",
      render: (row: Product) => (
        <span className="capitalize">{row.category}</span>
      ),
    },
    {
      key: "price",
      header: "Price",
      render: (row: Product) => MoneyFromKobo(row.price),
    },
    { key: "unit", header: "Unit" },
    { key: "stock", header: "Stock" },
    {
      key: "status",
      header: "Status",
      render: (row: Product) => (
        <StatusPill
          status={row.stock > 0 ? "in_stock" : "out_of_stock"}
        />
      ),
    },
    {
      key: "actions",
      header: "Actions",
      render: (row: Product) => (
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => openEdit(row)}
            className="grid size-[32px] place-items-center rounded-[8px] border border-line text-muted transition-colors hover:bg-cream-deep hover:text-forest"
          >
            <Pencil size={14} />
          </button>
          <button
            type="button"
            onClick={() => openDelete(row.id)}
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
      <AdminTopbar title="Products" onToggleSidebar={toggleSidebar} />

      <Panel>
        <PanelHead>
          <h3 className="m-0 text-[17px] font-semibold">
            All Products ({products.length})
          </h3>
          <button
            type="button"
            onClick={openAdd}
            className="inline-flex items-center gap-2 rounded-full bg-forest px-5 py-[11px] text-[13px] font-bold text-white transition-all hover:-translate-y-0.5 hover:bg-olive"
          >
            <Plus size={15} /> Add Product
          </button>
        </PanelHead>

        <DataTable
          columns={columns}
          data={products}
          emptyMessage="No products yet. Add your first product to get started."
        />
      </Panel>

      {/* Add/Edit modal */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editId ? "Edit Product" : "Add Product"}
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setModalOpen(false);
          }}
        >
          <div className="space-y-5">
            <div>
              <label className="mb-2 block text-[13px] font-bold text-forest">
                Product Name
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => update("name", e.target.value)}
                className="w-full rounded-[10px] border-[1.5px] border-line bg-white px-4 py-[13px] text-sm outline-none focus:border-olive"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-5">
              <div>
                <label className="mb-2 block text-[13px] font-bold text-forest">
                  Category
                </label>
                <select
                  value={form.category}
                  onChange={(e) => update("category", e.target.value)}
                  className="w-full rounded-[10px] border-[1.5px] border-line bg-white px-4 py-[13px] text-sm outline-none focus:border-olive"
                >
                  {PRODUCT_CATEGORIES.map((c) => (
                    <option key={c.value} value={c.value}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-2 block text-[13px] font-bold text-forest">
                  Unit
                </label>
                <input
                  type="text"
                  value={form.unit}
                  onChange={(e) => update("unit", e.target.value)}
                  className="w-full rounded-[10px] border-[1.5px] border-line bg-white px-4 py-[13px] text-sm outline-none focus:border-olive"
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-5">
              <div>
                <label className="mb-2 block text-[13px] font-bold text-forest">
                  Price ₦
                </label>
                <input
                  type="number"
                  value={form.price}
                  onChange={(e) => update("price", e.target.value)}
                  className="w-full rounded-[10px] border-[1.5px] border-line bg-white px-4 py-[13px] text-sm outline-none focus:border-olive"
                  min="0"
                  step="0.01"
                  required
                />
              </div>
              <div>
                <label className="mb-2 block text-[13px] font-bold text-forest">
                  Stock Quantity
                </label>
                <input
                  type="number"
                  value={form.stock}
                  onChange={(e) => update("stock", e.target.value)}
                  className="w-full rounded-[10px] border-[1.5px] border-line bg-white px-4 py-[13px] text-sm outline-none focus:border-olive"
                  min="0"
                  required
                />
              </div>
            </div>
            <div>
              <label className="mb-2 block text-[13px] font-bold text-forest">
                Product Image
              </label>
              <div className="flex h-[100px] items-center justify-center rounded-[14px] border-2 border-dashed border-line bg-cream-deep text-[13px] text-muted">
                Image upload via ImageKit (max 8 MB)
              </div>
            </div>
            <div>
              <label className="mb-2 block text-[13px] font-bold text-forest">
                Description
              </label>
              <textarea
                value={form.description}
                onChange={(e) => update("description", e.target.value)}
                rows={3}
                className="w-full rounded-[10px] border-[1.5px] border-line bg-white px-4 py-[13px] text-sm outline-none focus:border-olive"
              />
            </div>
          </div>
          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="rounded-full border-2 border-forest bg-transparent px-6 py-[11px] text-sm font-bold text-forest transition-all hover:bg-forest hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-full bg-forest px-6 py-[11px] text-sm font-bold text-white transition-all hover:-translate-y-0.5 hover:bg-olive"
            >
              {editId ? "Update Product" : "Add Product"}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={() => setDeleteOpen(false)}
        title="Delete Product?"
        message="This action cannot be undone. The product will be permanently removed."
        confirmLabel="Delete Product"
        danger
      />
    </>
  );
}
