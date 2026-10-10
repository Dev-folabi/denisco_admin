/** A product as the admin API returns it. Prices are integers in kobo. */
export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  /** Category slug. */
  category: string;
  category_id: string;
  category_name: string;
  price: number;
  currency: string;
  unit: string;
  images: string[];
  image?: string;
  media?: { url: string; file_id?: string }[];
  /** Sellable quantity: on hand minus what is reserved for unpaid orders. */
  stock: number;
  stock_badge: "in_stock" | "low_stock" | "out_of_stock";
  status: "active" | "archived";
  featured: boolean;
  /** Quantity on hand, admin view only. */
  available_qty?: number;
  /** Quantity promised to unpaid orders, admin view only. */
  reserved_qty?: number;
  created_at: string;
  updated_at: string;
}

/** The fields the product form writes. */
export interface ProductWrite {
  name?: string;
  description?: string;
  category?: string;
  price?: number;
  unit?: string;
  images?: { url: string; file_id?: string }[];
  status?: "active" | "archived";
  featured?: boolean;
  stock?: number;
}

/** Short-lived credentials for a direct ImageKit upload. */
export interface UploadSignature {
  token: string;
  expire: number;
  signature: string;
  public_key: string;
  url_endpoint: string;
  upload_url: string;
  folder: string;
}

/** What `DELETE /admin/products/{id}` did. */
export interface ProductRemoval {
  /** True when the product was deleted, false when it was archived instead. */
  deleted: boolean;
  /** Media files removed from ImageKit alongside it. */
  images_deleted: number;
}
