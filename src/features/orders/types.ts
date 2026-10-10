/** One line on an order: a snapshot of the product as it was sold. */
export interface OrderItem {
  product_id: string;
  name: string;
  slug?: string;
  image?: string;
  unit?: string;
  unit_price: number;
  quantity: number;
  line_total: number;
}

/** Fulfillment status, matching the status dropdown in the orders table. */
export type OrderStatus =
  | "pending"
  | "processing"
  | "dispatched"
  | "completed"
  | "cancelled";

/** The order's own view of payment. */
export type OrderPaymentStatus = "pending" | "paid" | "failed" | "refunded";

/** An order as the API returns it. Amounts are integers in kobo. */
export interface Order {
  id: string;
  order_number: string;
  user_id: string;
  customer: { name: string; email: string; phone: string };
  items: OrderItem[];
  subtotal: number;
  delivery_fee: number;
  total: number;
  currency: string;
  delivery_method: "delivery" | "pickup";
  address?: string;
  status: OrderStatus;
  payment_status: OrderPaymentStatus;
  payment_ref?: string;
  payment_method?: string;
  item_count: number;
  /**
   * Set when a payment was confirmed after the order's stock reservation had
   * expired and the items could not be secured again, so the farm has to
   * restock or refund. `reconciliation_reason` says which way it went.
   */
  needs_reconciliation: boolean;
  reconciliation_reason?: "stock_secured" | "refund_required";
  paid_at?: string;
  cancelled_at?: string;
  created_at: string;
  updated_at: string;
}
