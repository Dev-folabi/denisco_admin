"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { AdminTopbar } from "@/components/layout/admin-topbar";
import { useSidebarToggle } from "../layout";
import { Panel, PanelHead } from "@/components/ui/panel";
import { DataTable } from "@/components/ui/data-table";
import { StatusPill } from "@/components/ui/status-pill";
import { Modal } from "@/components/ui/modal";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { MoneyFromKobo } from "@/lib/utils/format";
import { PRODUCT_CATEGORIES } from "@/lib/constants";
import { Loader2, Plus, Pencil, Trash2, X } from "lucide-react";
import { ApiRequestError } from "@/lib/api/client";
import { firstIssue, productSchema } from "@/lib/validation/schemas";
import {
  useAdminProducts,
  useCreateProduct,
  useRemoveProduct,
  useUpdateProduct,
} from "@/features/products/hooks";
import { uploadProductImage } from "@/features/products/api";
import type { Product } from "@/features/products/types";

const EMPTY_FORM = {
  name: "",
  category: "poultry",
  unit: "unit",
  price: "",
  stock: "",
  description: "",
};

type FormState = typeof EMPTY_FORM;

export default function ProductsPage() {
  const toggleSidebar = useSidebarToggle();
  const fileInput = useRef<HTMLInputElement>(null);

  const [search, setSearch] = useState("");
  const { data, isPending, isError } = useAdminProducts({
    search: search || undefined,
  });

  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();
  const removeProduct = useRemoveProduct();

  const [modalOpen, setModalOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [image, setImage] = useState<{ url: string; file_id?: string } | null>(
    null,
  );
  const [uploading, setUploading] = useState(false);
  const [formError, setFormError] = useState("");
  const [removalNotice, setRemovalNotice] = useState("");

  const products = data?.data ?? [];
  const saving = createProduct.isPending || updateProduct.isPending;

  function openAdd() {
    setEditId(null);
    setForm(EMPTY_FORM);
    setImage(null);
    setFormError("");
    setModalOpen(true);
  }

  function openEdit(product: Product) {
    setEditId(product.id);
    setForm({
      name: product.name,
      category: product.category,
      unit: product.unit,
      // The form works in naira; the API stores kobo.
      price: String(product.price / 100),
      stock: String(product.available_qty ?? product.stock),
      description: product.description,
    });
    setImage(
      product.media?.[0]
        ? { url: product.media[0].url, file_id: product.media[0].file_id }
        : product.image
          ? { url: product.image }
          : null,
    );
    setFormError("");
    setModalOpen(true);
  }

  function update(field: keyof FormState, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  /** Uploads straight to ImageKit with a signature issued by the API. */
  async function handleImage(file: File | undefined) {
    if (!file) return;

    setUploading(true);
    setFormError("");
    try {
      setImage(await uploadProductImage(file));
    } catch (error) {
      setFormError(
        error instanceof Error
          ? error.message
          : "The image could not be uploaded.",
      );
    } finally {
      setUploading(false);
    }
  }

  async function saveProduct(event: React.FormEvent) {
    event.preventDefault();
    setFormError("");

    const parsed = productSchema.safeParse(form);
    if (!parsed.success) {
      setFormError(firstIssue(parsed.error));
      return;
    }

    const payload = {
      name: parsed.data.name,
      category: parsed.data.category,
      unit: parsed.data.unit,
      // Naira in the form, kobo on the wire.
      price: Math.round(Number(parsed.data.price) * 100),
      stock: Number(parsed.data.stock),
      description: parsed.data.description,
      images: image ? [image] : [],
    };

    try {
      if (editId) {
        await updateProduct.mutateAsync({ id: editId, input: payload });
      } else {
        await createProduct.mutateAsync(payload);
      }
      setModalOpen(false);
    } catch (error) {
      setFormError(
        error instanceof ApiRequestError
          ? error.message
          : "The product could not be saved.",
      );
    }
  }

  async function confirmRemove() {
    if (!deleteTarget) return;

    const name = deleteTarget.name;
    setRemovalNotice("");

    try {
      const result = await removeProduct.mutateAsync(deleteTarget.id);

      // The API decides between deleting and archiving, so the message says
      // what actually happened rather than what was asked for.
      setRemovalNotice(
        result.deleted
          ? `"${name}" was deleted${
              result.images_deleted > 0
                ? `, along with ${result.images_deleted} image${
                    result.images_deleted === 1 ? "" : "s"
                  }`
                : ""
            }.`
          : `"${name}" has orders, so it was archived instead of deleted. It stays out of the shop and its order history still resolves.`,
      );
    } catch (error) {
      setRemovalNotice(
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
    {
      key: "image",
      header: "Image",
      render: (row: Product) => (
        <div className="relative size-[48px] overflow-hidden rounded-full bg-cream-deep">
          {row.image && (
            <Image
              src={row.image}
              alt=""
              fill
              sizes="48px"
              className="object-cover"
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
        <span>{row.category_name || row.category}</span>
      ),
    },
    {
      key: "price",
      header: "Price",
      render: (row: Product) => MoneyFromKobo(row.price),
    },
    { key: "unit", header: "Unit" },
    {
      key: "stock",
      header: "Stock",
      render: (row: Product) => (
        <span>
          {row.available_qty ?? row.stock}
          {(row.reserved_qty ?? 0) > 0 && (
            <small className="ml-1 text-muted">
              ({row.reserved_qty} reserved)
            </small>
          )}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (row: Product) =>
        row.status === "archived" ? (
          <StatusPill status="archived" />
        ) : (
          <StatusPill status={row.stock > 0 ? "in_stock" : "out_of_stock"} />
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
      <AdminTopbar title="Products" onToggleSidebar={toggleSidebar} />

      <Panel>
        <PanelHead>
          <h3 className="m-0 text-[17px] font-semibold">
            All Products ({data?.meta?.total ?? products.length})
          </h3>
          <div className="flex items-center gap-3">
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search products…"
              className="rounded-full border border-line bg-white px-4 py-[9px] text-[13px] outline-none focus:border-olive"
            />
            <button
              type="button"
              onClick={openAdd}
              className="inline-flex items-center gap-2 rounded-full bg-forest px-5 py-[11px] text-[13px] font-bold text-white transition-all hover:-translate-y-0.5 hover:bg-olive"
            >
              <Plus size={15} /> Add Product
            </button>
          </div>
        </PanelHead>

        {removalNotice && (
          <div className="mb-4 flex items-start justify-between gap-4 rounded-[10px] bg-cream-deep px-4 py-3 text-[13px] font-bold text-forest">
            <span>{removalNotice}</span>
            <button
              type="button"
              onClick={() => setRemovalNotice("")}
              aria-label="Dismiss message"
              className="text-muted transition-colors hover:text-forest"
            >
              <X size={15} />
            </button>
          </div>
        )}

        {isPending ? (
          <div className="flex min-h-[220px] items-center justify-center">
            <Loader2
              size={26}
              className="animate-spin text-olive"
              aria-label="Loading products"
            />
          </div>
        ) : (
          <DataTable
            columns={columns}
            data={products}
            emptyMessage={
              isError
                ? "The products could not be loaded."
                : "No products yet. Add your first product to get started."
            }
          />
        )}
      </Panel>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editId ? "Edit Product" : "Add Product"}
      >
        <form onSubmit={saveProduct}>
          {formError && (
            <div className="mb-4 rounded-[10px] bg-badge-red-bg px-4 py-3 text-sm font-bold text-badge-red-text">
              {formError}
            </div>
          )}

          <div className="space-y-5">
            <div>
              <label className="mb-2 block text-[13px] font-bold text-forest" htmlFor="pf-name">
                Product Name
              </label>
              <input id="pf-name"
                type="text"
                value={form.name}
                onChange={(e) => update("name", e.target.value)}
                className="w-full rounded-[10px] border-[1.5px] border-line bg-white px-4 py-[13px] text-sm outline-none focus:border-olive"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-5">
              <div>
                <label className="mb-2 block text-[13px] font-bold text-forest" htmlFor="pf-category">
                  Category
                </label>
                <select id="pf-category"
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
                <label className="mb-2 block text-[13px] font-bold text-forest" htmlFor="pf-unit">
                  Unit
                </label>
                <input id="pf-unit"
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
                <label className="mb-2 block text-[13px] font-bold text-forest" htmlFor="pf-price">
                  Price ₦
                </label>
                <input id="pf-price"
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
                <label className="mb-2 block text-[13px] font-bold text-forest" htmlFor="pf-stock">
                  Stock Quantity
                </label>
                <input id="pf-stock"
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
              <input
                ref={fileInput}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(event) => handleImage(event.target.files?.[0])}
              />
              <button
                type="button"
                onClick={() => fileInput.current?.click()}
                disabled={uploading}
                className="flex h-[100px] w-full items-center justify-center gap-3 overflow-hidden rounded-[14px] border-2 border-dashed border-line bg-cream-deep text-[13px] text-muted transition-colors hover:border-olive disabled:cursor-not-allowed"
              >
                {uploading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" /> Uploading…
                  </>
                ) : image ? (
                  <>
                    <span className="relative size-[72px] overflow-hidden rounded-[10px]">
                      <Image
                        src={image.url}
                        alt="Product preview"
                        fill
                        sizes="72px"
                        className="object-cover"
                      />
                    </span>
                    Change image
                  </>
                ) : (
                  "Choose an image (max 8 MB)"
                )}
              </button>
            </div>
            <div>
              <label className="mb-2 block text-[13px] font-bold text-forest" htmlFor="pf-description">
                Description
              </label>
              <textarea id="pf-description"
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
              disabled={saving || uploading}
              className="rounded-full bg-forest px-6 py-[11px] text-sm font-bold text-white transition-all hover:-translate-y-0.5 hover:bg-olive disabled:cursor-not-allowed disabled:opacity-45"
            >
              {saving ? "Saving…" : editId ? "Update Product" : "Add Product"}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={confirmRemove}
        title="Delete Product?"
        message={
          deleteTarget
            ? `"${deleteTarget.name}" will be deleted permanently, along with its image, if no order refers to it. If it has been ordered it is archived instead, so those orders still resolve.`
            : ""
        }
        confirmLabel="Delete Product"
        danger
      />
    </>
  );
}
